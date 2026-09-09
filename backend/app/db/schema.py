"""Single place for database and table names.

Rename via .env (MYSQL_DATABASE, TABLE_USERS, TABLE_PAYMENTS). Do not hardcode
these strings in SQL elsewhere.
"""

from __future__ import annotations

from app.core.config import settings


DATABASE = settings.MYSQL_DATABASE


class Tables:
    users = settings.TABLE_USERS
    payments = settings.TABLE_PAYMENTS
    password_tokens = settings.TABLE_PASSWORD_TOKENS
    radar_runs = settings.TABLE_RADAR_RUNS
    radar_jobs = settings.TABLE_RADAR_JOBS
    radar_vendors = settings.TABLE_RADAR_VENDORS
