"""Adapters that present radar data in the shapes the OP frontend expects.

`radar_jobs` holds SAM notices keyed by the buying agency, so an agency is the
"company" an opportunity belongs to and `radar_vendors` (past award winners)
ride along as suggested vendors.

Fields OP asks for that the radar has no source for — confidence score, company
size, contacts — are left absent rather than invented.
"""

from __future__ import annotations

import re
from collections import Counter, defaultdict
from datetime import date, datetime, timedelta, timezone
from typing import Any
from urllib.parse import quote

from app.api.routes import API_PREFIX
from app.providers.sources.sources import SOURCES, enabled_sources
from app.radar.heat import NAICS_CATEGORIES, match_vendors_to_tenders
from app.repositories import radar_repository

# Which collector produced a row must never reach the client, not even as a
# neutral label, so only an opaque bucket is serialised. It exists purely so
# the client can filter hiring leads apart from government notices.
# Employer names (the board tokens) are the actual leads and are not hidden.
_SOURCE_JOB_BOARD = "job_board"
_SOURCE_GOV_PORTAL = "gov_portal"
_SOURCE_UNKNOWN = "radar"

_PUBLIC_SOURCES: dict[str, str] = {
    "greenhouse": _SOURCE_JOB_BOARD,
    "lever": _SOURCE_JOB_BOARD,
    "ashby": _SOURCE_JOB_BOARD,
    "jobs_api": _SOURCE_JOB_BOARD,
    "sam_gov": _SOURCE_GOV_PORTAL,
    "usaspending": _SOURCE_GOV_PORTAL,
    "sec_edgar": _SOURCE_GOV_PORTAL,
}


def _provider_of(row: dict[str, Any]) -> str:
    """Internal collector key. Never serialise this to the client."""
    return str(row.get("provider") or "").strip().lower()


def _source_of(provider: str) -> str:
    return _PUBLIC_SOURCES.get(provider, _SOURCE_UNKNOWN)


COUNTRY_US = "US"
COUNTRY_IN = "IN"
COUNTRY_OTHER = "OTHER"

# Job boards publish location as free text ("Poland", "Remote - US",
# "Bengaluru, India"), so the country has to be read back out of the string.
_INDIA_CITIES = frozenset(
    """ahmedabad bengaluru bangalore chandigarh chennai coimbatore delhi gurgaon
    gurugram hyderabad indore jaipur kochi kolkata mumbai mysore mysuru nagpur
    noida pune surat thiruvananthapuram trivandrum vadodara visakhapatnam""".split()
)
_US_WORDS = frozenset({"usa", "us", "america"})
_US_STATE_CODES = frozenset(
    """al ak az ar ca co ct dc de fl ga hi ia id il in ks ky la ma md me mi mn mo
    ms mt nc nd ne nh nj nm nv ny oh ok or pa pr ri sc sd tn tx ut va vt wa wi wv
    wy""".split()
)


def _country_of(location: Any, provider: str) -> str:
    """Best-effort country for an opportunity, one of US / IN / OTHER."""
    # SAM is US federal procurement, so the place of performance is domestic
    # even when the stored string is a bare city name.
    if provider == "sam_gov":
        return COUNTRY_US

    text = str(location or "").strip().lower()
    if not text:
        return COUNTRY_OTHER
    if "united states" in text or "u.s." in text:
        return COUNTRY_US

    # Whole words only, so "Indianapolis" is never mistaken for "India".
    words = [w for w in re.split(r"[^a-z]+", text) if w]
    if not words:
        return COUNTRY_OTHER
    if "india" in words or _INDIA_CITIES.intersection(words):
        return COUNTRY_IN
    if _US_WORDS.intersection(words):
        return COUNTRY_US
    # A trailing two-letter code is the "City, ST" convention. Anywhere else it
    # is more likely an ordinary word than a state, and "IN" would collide with
    # India, which is why only the last position counts.
    if words[-1] in _US_STATE_CODES:
        return COUNTRY_US
    return COUNTRY_OTHER

# radar signal_type -> OP OpportunityType
_TYPE_BY_SIGNAL = {
    "GOVERNMENT_STAFFING": "rfp",
    "GOVERNMENT_TENDER": "rfp",
    "PROCUREMENT": "procurement",
    "CONTRACT_AWARD": "procurement",
    "JOB_OPENING": "hiring",
    "FUNDING": "funding",
    "EXPANSION": "expansion",
    "ACQUISITION": "partnership",
}

_VISIBLE_TEMPERATURES = ("very_hot", "hot")


def _iso(value: Any) -> str | None:
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.astimezone(timezone.utc).isoformat(timespec="seconds")
    text = str(value).strip()
    return text or None


def _temperature(heat: Any) -> str:
    return "very_hot" if str(heat or "").upper() == "VERY_HOT" else "hot"


def _notice_type(department: Any) -> str | None:
    """`department` is stored as "SAM / <notice type> / NAICS <code>"."""
    parts = [p.strip() for p in str(department or "").split("/") if p.strip()]
    return parts[1] if len(parts) > 1 else None


def _parse_dt(value: Any) -> datetime | None:
    text = _iso(value)
    if not text:
        return None
    cleaned = text.replace("Z", "+00:00")
    try:
        parsed = datetime.fromisoformat(cleaned)
    except ValueError:
        try:
            parsed = datetime.combine(date.fromisoformat(cleaned[:10]), datetime.min.time())
        except ValueError:
            return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed


def _days_until(value: Any) -> int | None:
    parsed = _parse_dt(value)
    if not parsed:
        return None
    return (parsed.date() - datetime.now(timezone.utc).date()).days


def _within_days(value: Any, days: int) -> bool:
    parsed = _parse_dt(value)
    if not parsed:
        return False
    return parsed >= datetime.now(timezone.utc) - timedelta(days=days)


def map_opportunity(row: dict[str, Any]) -> dict[str, Any]:
    naics = row.get("naics")
    category = row.get("category")
    agency = row.get("board_name") or row.get("agency_name") or "Unknown agency"
    signal_type = str(row.get("signal_type") or "").upper()
    provider = _provider_of(row)
    source_id = _source_of(provider)

    # A job board stores the hiring team in `department`; SAM packs the notice
    # type into that same column, so the two read differently.
    is_job = signal_type == "JOB_OPENING"
    team = str(row.get("department") or "").strip() if is_job else ""
    notice_type = ("Job opening" if is_job else _notice_type(row.get("department"))) or "Notice"

    signals = [notice_type]
    if team:
        signals.append(team)
    if naics:
        signals.append(f"NAICS {naics}")
    if category:
        signals.append(category)

    detail = f"NAICS {naics}" if naics else "no NAICS code"
    # No sentence names where a row came from, not even in general terms. Free
    # text is the easiest place for a source to slip back in unnoticed.
    if is_job:
        summary = f"Open role at {agency}" + (f" in {team}." if team else ".")
        rationale = f"{agency} is hiring" + (f" in {team}." if team else ".")
    else:
        summary = f"{notice_type} published by {agency} under {detail}."
        rationale = (
            f"{agency} has an open {notice_type.lower()} classified {detail}"
            + (f" ({category})" if category else "")
            + ". Currently an active notice."
        )

    opportunity_id = str(row.get("id") or row.get("external_job_id") or "")
    return {
        "id": opportunity_id,
        "title": row.get("title") or "Untitled notice",
        "companyId": row.get("board_token") or "unknown-agency",
        "companyName": agency,
        "type": _TYPE_BY_SIGNAL.get(signal_type, "other"),
        "temperature": _temperature(row.get("heat")),
        "summary": summary,
        "rationale": rationale,
        "signals": signals,
        "industry": category or ("Hiring" if is_job else "Employment Services"),
        "location": row.get("location") or "United States",
        "country": _country_of(row.get("location"), provider),
        "detectedAt": _iso(row.get("posted_at")) or _iso(row.get("created_at")),
        # `updated_at` holds SAM's effective deadline. A job posting has no
        # response date, so leaving it would fill Upcoming Deadlines with edit
        # timestamps that nothing is actually due on.
        "deadline": None if is_job else _iso(row.get("updated_at")),
        "sourceId": source_id,
        # The real posting URL names the board in its domain, so it is served
        # through a redirect the client cannot read the destination of.
        "sourceUrl": (
            f"{API_PREFIX}/opportunities/{quote(opportunity_id)}/open"
            if row.get("url") and opportunity_id
            else None
        ),
        "sourceSignal": " · ".join(signals),
        "naics": naics,
        "solicitationNumber": row.get("requisition_id"),
        # No CRM tables yet — every notice is unowned and uncontacted.
        "assignedToId": None,
        "assignedToName": None,
        "assignedAt": None,
        "outreachStatus": "not_contacted",
        "lastContactedAt": None,
        "lastContactedById": None,
        "lastContactedByName": None,
        "lastContactChannel": None,
        "followUpDueAt": None,
        "saved": False,
        "createdAt": _iso(row.get("created_at")) or _iso(row.get("posted_at")),
        "updatedAt": _iso(row.get("created_at")) or _iso(row.get("posted_at")),
    }


def _map_suggested_vendor(vendor: dict[str, Any]) -> dict[str, Any]:
    return {
        "vendorName": vendor.get("vendor_name"),
        "vendorUei": vendor.get("vendor_uei"),
        "cageCode": vendor.get("cage_code"),
        "registrationStatus": vendor.get("registration_status"),
        "agencyName": vendor.get("agency_name"),
        "awardTitle": vendor.get("award_title"),
        "awardUrl": vendor.get("award_url"),
        "naics": vendor.get("naics"),
        "category": vendor.get("category"),
        "matchScore": vendor.get("match_score"),
    }


def _load(user_id: int) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    """Rows from disabled sources stay in the table until the next run clears
    it, so read them out here — OP should only ever show live sources."""
    live = {str(s.get("collector")) for s in enabled_sources()}
    jobs = [
        row
        for row in radar_repository.list_jobs_for_user(user_id, limit=5000)
        if str(row.get("provider")) in live
    ]
    vendors = [
        row
        for row in radar_repository.list_vendors_for_user(user_id, limit=5000)
        if str(row.get("provider")) in live
    ]
    return jobs, vendors


def _opportunities(user_id: int) -> list[dict[str, Any]]:
    jobs, _ = _load(user_id)
    mapped = [map_opportunity(row) for row in jobs]
    return [o for o in mapped if o["temperature"] in _VISIBLE_TEMPERATURES]


# ---------------------------------------------------------------- filtering


def _list_of(params: Any, name: str) -> list[str]:
    """Accept both `key=a&key=b` and axios' `key[]=a&key[]=b`."""
    values: list[str] = []
    for key in (name, f"{name}[]"):
        values.extend(params.getlist(key))
    out: list[str] = []
    for value in values:
        for part in str(value).split(","):
            item = part.strip()
            if item and item not in out:
                out.append(item)
    return out


def _one_of(params: Any, name: str) -> str | None:
    value = params.get(name)
    if value is None:
        value = params.get(f"{name}[]")
    text = str(value).strip() if value is not None else ""
    return text or None


def _int_of(params: Any, name: str, default: int | None = None) -> int | None:
    raw = _one_of(params, name)
    if raw is None:
        return default
    try:
        return int(float(raw))
    except (TypeError, ValueError):
        return default


_SORTABLE = {
    "title",
    "companyName",
    "type",
    "temperature",
    "location",
    "detectedAt",
    "deadline",
    "assignedToName",
    "outreachStatus",
    "lastContactedAt",
}

_TEMPERATURE_ORDER = {"very_hot": 0, "hot": 1}


def _matches_search(item: dict[str, Any], term: str) -> bool:
    needle = term.strip().lower()
    if not needle:
        return True
    haystack = " ".join(
        str(item.get(key) or "")
        for key in ("title", "companyName", "industry", "location", "summary")
    )
    return needle in haystack.lower()


def filter_opportunities(items: list[dict[str, Any]], params: Any) -> list[dict[str, Any]]:
    search = _one_of(params, "q")
    temperatures = _list_of(params, "temperature")
    types = _list_of(params, "type")
    industries = _list_of(params, "industry")
    locations = _list_of(params, "location")
    countries = _list_of(params, "country")
    sources = _list_of(params, "source")
    company_id = _one_of(params, "company_id")
    detected_within = _int_of(params, "detected_within_days")
    deadline_within = _int_of(params, "deadline_within_days")

    out: list[dict[str, Any]] = []
    for item in items:
        if search and not _matches_search(item, search):
            continue
        if temperatures and item["temperature"] not in temperatures:
            continue
        if types and item["type"] not in types:
            continue
        if industries and item["industry"] not in industries:
            continue
        if locations and item["location"] not in locations:
            continue
        if countries and item["country"] not in countries:
            continue
        if sources and item["sourceId"] not in sources:
            continue
        if company_id and item["companyId"] != company_id:
            continue
        if detected_within and not _within_days(item.get("detectedAt"), detected_within):
            continue
        if deadline_within:
            days = _days_until(item.get("deadline"))
            if days is None or days < 0 or days > deadline_within:
                continue
        out.append(item)
    return out


def _sort_key(item: dict[str, Any], key: str) -> Any:
    if key == "temperature":
        return _TEMPERATURE_ORDER.get(item["temperature"], 9)
    if key in {"detectedAt", "deadline", "lastContactedAt"}:
        parsed = _parse_dt(item.get(key))
        return parsed.timestamp() if parsed else float("-inf")
    return str(item.get(key) or "").lower()


def _by_priority(item: dict[str, Any]) -> tuple[int, float]:
    parsed = _parse_dt(item.get("detectedAt"))
    return (
        _TEMPERATURE_ORDER.get(item["temperature"], 9),
        -(parsed.timestamp() if parsed else 0.0),
    )


def sort_opportunities(items: list[dict[str, Any]], params: Any) -> list[dict[str, Any]]:
    key = _one_of(params, "sort_by")
    if not key or key not in _SORTABLE:
        return sorted(items, key=_by_priority)
    reverse = (_one_of(params, "sort_dir") or "asc").lower() == "desc"
    return sorted(items, key=lambda item: _sort_key(item, key), reverse=reverse)


def _paginate(items: list[dict[str, Any]], params: Any) -> dict[str, Any]:
    page = max(1, _int_of(params, "page", 1) or 1)
    page_size = min(max(1, _int_of(params, "page_size", 25) or 25), 500)
    start = (page - 1) * page_size
    return {
        "items": items[start : start + page_size],
        "total": len(items),
        "page": page,
        "pageSize": page_size,
    }


# ------------------------------------------------------------- opportunities


def list_opportunities(*, user_id: int, params: Any) -> dict[str, Any]:
    items = filter_opportunities(_opportunities(user_id), params)
    return _paginate(sort_opportunities(items, params), params)


def source_url_for(*, user_id: int, opportunity_id: str) -> str | None:
    """The real upstream posting URL, for the redirect endpoint only.

    Kept out of every serialised payload: the domain alone identifies the
    collector, which is exactly what must not reach the client.
    """
    jobs, _ = _load(user_id)
    wanted = str(opportunity_id)
    for row in jobs:
        row_id = str(row.get("id") or row.get("external_job_id") or "")
        if row_id == wanted:
            return str(row.get("url") or "") or None
    return None


def get_opportunity(*, user_id: int, opportunity_id: str) -> dict[str, Any] | None:
    jobs, vendors = _load(user_id)
    mapped = [map_opportunity(row) for row in jobs]
    found = next((item for item in mapped if item["id"] == str(opportunity_id)), None)
    if not found:
        return None
    matched = match_vendors_to_tenders(
        [
            {
                **found,
                "agency_name": found["companyName"],
                "naics": found.get("naics"),
                "category": found["industry"],
            }
        ],
        vendors,
    )
    suggested = matched[0].get("suggested_vendors") if matched else []
    return {**found, "suggestedVendors": [_map_suggested_vendor(v) for v in suggested or []]}


# ------------------------------------------------------------------ vendors


def _agency_rollup(user_id: int) -> list[dict[str, Any]]:
    """Each buying agency becomes an OP vendor row with its tender roll-up."""
    items = _opportunities(user_id)
    industries: dict[str, Counter] = defaultdict(Counter)
    locations: dict[str, Counter] = defaultdict(Counter)
    for item in items:
        industries[item["companyId"]][item["industry"]] += 1
        locations[item["companyId"]][item["location"]] += 1

    by_token: dict[str, dict[str, Any]] = {}
    for item in items:
        token = item["companyId"]
        row = by_token.get(token)
        if not row:
            # An agency buys across states and categories; show its most common.
            location = locations[token].most_common(1)[0][0]
            row = {
                "id": token,
                "name": item["companyName"],
                "industry": industries[token].most_common(1)[0][0],
                "location": location,
                "headquarters": location,
                "vendorStatus": "prospective",
                "description": (
                    "Employer publishing open roles on a public job board."
                    if item["type"] == "hiring"
                    else "Federal buying agency publishing notices on a "
                    "government procurement portal."
                ),
                "activeOpportunities": 0,
                "veryHot": 0,
                "hot": 0,
                "assignedOpportunities": 0,
                "teamContacts": 0,
                "highestTemperature": None,
                "lastActivityAt": None,
            }
            by_token[token] = row
        row["activeOpportunities"] += 1
        if item["temperature"] == "very_hot":
            row["veryHot"] += 1
        else:
            row["hot"] += 1
        if row["highestTemperature"] is None or _TEMPERATURE_ORDER.get(
            item["temperature"], 9
        ) < _TEMPERATURE_ORDER.get(row["highestTemperature"], 9):
            row["highestTemperature"] = item["temperature"]
        detected = item.get("detectedAt")
        if detected and (row["lastActivityAt"] is None or detected > row["lastActivityAt"]):
            row["lastActivityAt"] = detected
    return sorted(by_token.values(), key=lambda r: (-r["activeOpportunities"], r["name"].lower()))


def list_vendors(*, user_id: int, params: Any) -> dict[str, Any]:
    rows = _agency_rollup(user_id)
    search = _one_of(params, "q") or _one_of(params, "search")
    industries = _list_of(params, "industry")
    if search:
        needle = search.lower()
        rows = [r for r in rows if needle in f"{r['name']} {r['industry']} {r['location']}".lower()]
    if industries:
        rows = [r for r in rows if r["industry"] in industries]
    if (_one_of(params, "has_active_opportunities") or "").lower() in {"1", "true", "yes"}:
        rows = [r for r in rows if r["activeOpportunities"] > 0]
    return _paginate(rows, params)


def get_vendor(*, user_id: int, vendor_id: str) -> dict[str, Any] | None:
    return next((r for r in _agency_rollup(user_id) if r["id"] == str(vendor_id)), None)


# ---------------------------------------------------------------- dashboard


def _by_types(items: list[dict[str, Any]], types: list[str] | None) -> list[dict[str, Any]]:
    if not types:
        return items
    return [i for i in items if i["type"] in types]


def _detected_within(
    items: list[dict[str, Any]], days: int | None
) -> list[dict[str, Any]]:
    if not days or days <= 0:
        return items
    return [i for i in items if _within_days(i.get("detectedAt"), days)]


def _by_countries(
    items: list[dict[str, Any]], countries: list[str] | None
) -> list[dict[str, Any]]:
    if not countries:
        return items
    wanted = {str(c).strip().upper() for c in countries}
    return [i for i in items if i["country"] in wanted]


def scope_from_params(params: Any) -> dict[str, Any]:
    """The category, country and date-range scope every Overview widget shares."""
    return {
        "types": _list_of(params, "type"),
        "detected_within_days": _int_of(params, "detected_within_days"),
        "countries": _list_of(params, "country"),
    }


def _scoped(
    user_id: int,
    types: list[str] | None = None,
    detected_within_days: int | None = None,
    countries: list[str] | None = None,
) -> list[dict[str, Any]]:
    items = _by_countries(_by_types(_opportunities(user_id), types), countries)
    return _detected_within(items, detected_within_days)


def dashboard_metrics(
    *,
    user_id: int,
    types: list[str] | None = None,
    detected_within_days: int | None = None,
    countries: list[str] | None = None,
) -> dict[str, Any]:
    # Filtered once by type and country so the weekly caption below can reuse
    # the list without a second trip to the database.
    typed = _by_countries(_by_types(_opportunities(user_id), types), countries)
    items = _detected_within(typed, detected_within_days)
    very_hot = [i for i in items if i["temperature"] == "very_hot"]
    hot = [i for i in items if i["temperature"] == "hot"]
    return {
        "totalVendors": len(_agency_rollup(user_id)),
        "totalOpportunities": len(items),
        # Deliberately ignores the range so "this week" keeps meaning a week
        # even when the user narrows the window to 24 hours.
        "opportunitiesAddedThisWeek": sum(
            1 for i in typed if _within_days(i.get("detectedAt"), 7)
        ),
        "veryHot": len(very_hot),
        # Nothing is owned or contacted until the CRM tables exist.
        "veryHotNeedingAttention": len(very_hot),
        "hot": len(hot),
        "hotUnassigned": len(hot),
        "assignedToMe": 0,
        "assignedToMeNotContacted": 0,
        "contactedThisWeek": 0,
        "contactedByMeThisWeek": 0,
    }


def pipeline_summary(*, user_id: int) -> dict[str, Any]:
    return {"assigned": 0, "needsOutreach": 0, "contacted": 0, "followUp": 0}


_SURGE_WINDOW_DAYS = 14
# Carried over from the older radar project, which settled on a quarter's
# growth as the point where hiring reads as a surge rather than normal churn.
_SURGE_GROWTH_THRESHOLD = 0.25
# Under this, a "surge" is one or two roles, which is noise rather than signal.
_SURGE_MIN_RECENT = 5


def _posted_between(item: dict[str, Any], now: datetime, lo: int, hi: int) -> bool:
    """True when the role was posted between `lo` and `hi` days ago."""
    parsed = _parse_dt(item.get("detectedAt"))
    if not parsed:
        return False
    return now - timedelta(days=hi) <= parsed < now - timedelta(days=lo)


def _company_signals(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Collapses job-board roles into one row per employer.

    Two hundred open roles at one company is a single lead, not two hundred of
    them, so the dashboard ranks the employer instead of the postings.

    Growth compares the last fortnight against the one before it, read from
    each role's own posting date. A board only lists roles that are still open,
    so the older window undercounts and growth reads a little high — good
    enough to rank on, not a precise figure.
    """
    now = datetime.now(timezone.utc)
    groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for item in items:
        groups[str(item.get("companyId") or "unknown")].append(item)

    rows: list[dict[str, Any]] = []
    for token, group in groups.items():
        recent = sum(1 for i in group if _posted_between(i, now, 0, _SURGE_WINDOW_DAYS))
        prior = sum(
            1
            for i in group
            if _posted_between(i, now, _SURGE_WINDOW_DAYS, _SURGE_WINDOW_DAYS * 2)
        )
        # No prior baseline means everything is new, which counts as growth
        # rather than as an unknown.
        growth = (recent - prior) / prior if prior else (1.0 if recent else None)
        surge = recent >= _SURGE_MIN_RECENT and growth is not None and (
            growth >= _SURGE_GROWTH_THRESHOLD
        )

        first = group[0]
        name = first.get("companyName") or token
        detected = max((_iso(i.get("detectedAt")) or "" for i in group), default="") or None
        countries = Counter(i.get("country") for i in group if i.get("country"))
        locations = Counter(i.get("location") for i in group if i.get("location"))
        badges = ["Hiring surge"] if surge else []

        rows.append(
            {
                **{k: None for k in ("deadline", "assignedToId", "assignedToName", "assignedAt")},
                "kind": "company",
                "id": f"company:{token}",
                "title": name,
                "companyId": token,
                "companyName": name,
                "type": "hiring",
                "temperature": "very_hot" if surge else "hot",
                "summary": f"{recent} of {len(group)} open roles posted in the last "
                f"{_SURGE_WINDOW_DAYS} days.",
                "rationale": f"{name} has {len(group)} open roles"
                + (f", {recent} of them in the last {_SURGE_WINDOW_DAYS} days" if recent else "")
                + ".",
                "signals": badges or [f"{len(group)} open roles"],
                "industry": "Hiring",
                "location": (locations.most_common(1)[0][0] if locations else "—"),
                "country": (countries.most_common(1)[0][0] if countries else COUNTRY_OTHER),
                "detectedAt": detected,
                "sourceId": first.get("sourceId"),
                "sourceUrl": None,
                "outreachStatus": "not_contacted",
                "lastContactedAt": None,
                # Company-only fields the notice rows do not carry.
                "signalCount": len(group),
                "newRoles": recent,
                "priorRoles": prior,
                "growth": round(growth, 2) if growth is not None else None,
                "surge": surge,
                "badges": badges,
            }
        )
    return rows


def needs_attention(
    *,
    user_id: int,
    limit: int = 6,
    types: list[str] | None = None,
    detected_within_days: int | None = None,
    countries: list[str] | None = None,
) -> dict[str, Any]:
    """Closing tenders first, then employers ranked by hiring signal.

    Notices and companies are deliberately mixed: a tender closing tomorrow is
    more urgent than any hiring trend, but a surging employer outranks a tender
    that is months away.
    """
    items = _scoped(user_id, types, detected_within_days, countries)
    notices = [i for i in items if i["type"] != "hiring"]
    companies = _company_signals([i for i in items if i["type"] == "hiring"])

    closing = [
        i
        for i in notices
        if (_days_until(i.get("deadline")) is not None and _days_until(i["deadline"]) >= 0)
    ]
    closing.sort(key=lambda i: _days_until(i["deadline"]) or 0)

    surging = sorted(
        (c for c in companies if c["surge"]),
        key=lambda c: (-c["newRoles"], -c["signalCount"]),
    )
    steady = sorted((c for c in companies if not c["surge"]), key=lambda c: -c["signalCount"])
    undated = sorted((i for i in notices if i not in closing), key=_by_priority)

    ordered = closing + surging + undated + steady
    return {
        "items": [
            row if row.get("kind") else {**row, "kind": "notice"}
            for row in ordered[: max(1, limit)]
        ]
    }


def upcoming_deadlines(
    *,
    user_id: int,
    limit: int = 6,
    types: list[str] | None = None,
    detected_within_days: int | None = None,
    countries: list[str] | None = None,
) -> dict[str, Any]:
    items = [
        i
        for i in _scoped(user_id, types, detected_within_days, countries)
        if _days_until(i.get("deadline")) is not None and (_days_until(i["deadline"]) or 0) >= 0
    ]
    items.sort(key=lambda i: _days_until(i["deadline"]) or 0)
    return {"items": items[: max(1, limit)]}


# -------------------------------------------------------- CRM-shaped stubs


def team_activity(*, user_id: int, limit: int = 20) -> dict[str, Any]:
    """Assignment and outreach history needs its own tables; empty until then."""
    return {"items": []}


def my_assignments(*, user_id: int) -> dict[str, Any]:
    return {"items": []}


def team_ownership(*, user_id: int) -> dict[str, Any]:
    return {"items": []}


def notifications(*, user_id: int) -> dict[str, Any]:
    return {"items": []}


def saved_views(*, user_id: int) -> dict[str, Any]:
    return {"items": []}


def saved_opportunities(*, user_id: int) -> dict[str, Any]:
    return {"items": []}


def opportunity_activity(*, user_id: int, opportunity_id: str) -> dict[str, Any]:
    return {"items": []}


def outreach_for_opportunity(*, user_id: int, opportunity_id: str) -> dict[str, Any]:
    return {"items": []}
