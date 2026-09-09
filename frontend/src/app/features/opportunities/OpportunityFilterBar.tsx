import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'

import {
  FilterChip,
  MultiSelectFilter,
  SingleSelectFilter,
  type FilterOption,
} from '@/app/components/filters/FilterMenu'
import { TextInput } from '@/app/components/forms/Field'
import {
  ALL_TEMPERATURES,
  COUNTRY_FILTER_LABEL,
  COUNTRY_FILTERS,
  DETECTED_RANGE_LABEL,
  DETECTED_RANGES,
  INDUSTRIES,
  OPPORTUNITY_TYPES,
  opportunityTypeLabel,
  temperatureMeta,
  type CountryFilter,
  type DetectedRange,
} from '@/app/constants/opportunity'
import { useDebouncedValue } from '@/app/hooks/useDebouncedValue'
import type {
  OpportunityFilters,
  OpportunityTemperature,
  OpportunityType,
} from '@/app/types'
import { countActiveFilters } from '@/app/utils/opportunity'

interface OpportunityFilterBarProps {
  filters: OpportunityFilters
  /** Display name for `filters.companyId`, which is an opaque token. */
  companyName?: string
  onChange: (filters: OpportunityFilters) => void
}

const TEMPERATURE_OPTIONS: FilterOption<OpportunityTemperature>[] = ALL_TEMPERATURES.map(
  (value) => ({
    value,
    label: temperatureMeta(value).label,
    description: temperatureMeta(value).description,
    dotClassName: temperatureMeta(value).dot,
  }),
)

const TYPE_OPTIONS: FilterOption<OpportunityType>[] = OPPORTUNITY_TYPES.map((value) => ({
  value,
  label: opportunityTypeLabel(value),
}))

const DETECTED_OPTIONS: FilterOption<string>[] = DETECTED_RANGES.map((value) => ({
  value,
  label: DETECTED_RANGE_LABEL[value],
}))

const COUNTRY_OPTIONS: FilterOption<string>[] = COUNTRY_FILTERS.map((value) => ({
  value,
  label: COUNTRY_FILTER_LABEL[value],
}))

const DEADLINE_OPTIONS: FilterOption<string>[] = [
  { value: 'any', label: 'Any deadline' },
  { value: '7', label: 'Within 7 days' },
  { value: '14', label: 'Within 14 days' },
  { value: '30', label: 'Within 30 days' },
]

const INDUSTRY_OPTIONS: FilterOption<string>[] = INDUSTRIES.map((value) => ({
  value,
  label: value,
}))

export function OpportunityFilterBar({
  filters,
  companyName,
  onChange,
}: OpportunityFilterBarProps) {
  const [term, setTerm] = useState(filters.search ?? '')
  const debouncedTerm = useDebouncedValue(term, 250)

  useEffect(() => {
    setTerm(filters.search ?? '')
    // Only resync when the URL-driven value actually changes.
  }, [filters.search])

  useEffect(() => {
    if ((filters.search ?? '') !== debouncedTerm) {
      onChange({ ...filters, search: debouncedTerm || undefined })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTerm])

  const update = (patch: Partial<OpportunityFilters>) => onChange({ ...filters, ...patch })
  const activeCount = countActiveFilters(filters)

  const chips: Array<{ key: string; label: string; onRemove: () => void }> = []
  filters.temperature?.forEach((value) =>
    chips.push({
      key: `temp-${value}`,
      label: `Temperature: ${temperatureMeta(value).label}`,
      onRemove: () =>
        update({ temperature: filters.temperature?.filter((item) => item !== value) }),
    }),
  )
  filters.type?.forEach((value) =>
    chips.push({
      key: `type-${value}`,
      label: `Type: ${opportunityTypeLabel(value)}`,
      onRemove: () => update({ type: filters.type?.filter((item) => item !== value) }),
    }),
  )
  filters.industry?.forEach((value) =>
    chips.push({
      key: `ind-${value}`,
      label: `Industry: ${value}`,
      onRemove: () => update({ industry: filters.industry?.filter((item) => item !== value) }),
    }),
  )
  if (filters.companyId) {
    chips.push({
      key: 'company',
      label: `Company: ${companyName ?? filters.companyId}`,
      onRemove: () => update({ companyId: undefined }),
    })
  }
  filters.country?.forEach((value) =>
    chips.push({
      key: `country-${value}`,
      // Falls back to the raw code for anything typed straight into the URL.
      label: `Location: ${COUNTRY_FILTER_LABEL[value as CountryFilter] ?? value}`,
      onRemove: () => update({ country: filters.country?.filter((item) => item !== value) }),
    }),
  )
  if (filters.detectedWithinDays) {
    // Falls back to a raw day count for windows typed straight into the URL.
    const preset = DETECTED_RANGE_LABEL[String(filters.detectedWithinDays) as DetectedRange]
    chips.push({
      key: 'detected',
      label: `Detected: ${preset ?? `last ${filters.detectedWithinDays} days`}`,
      onRemove: () => update({ detectedWithinDays: undefined }),
    })
  }
  if (filters.deadlineWithinDays) {
    chips.push({
      key: 'deadline',
      label: `Deadline within ${filters.deadlineWithinDays} days`,
      onRemove: () => update({ deadlineWithinDays: undefined }),
    })
  }
  return (
    <div className="border-b border-line">
      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        <div className="min-w-[200px] flex-1 sm:max-w-xs">
          <TextInput
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search opportunities"
            aria-label="Search opportunities"
            iconLeft={<Search />}
            className="h-8"
          />
        </div>

        <MultiSelectFilter
          label="Temperature"
          options={TEMPERATURE_OPTIONS}
          selected={filters.temperature ?? []}
          onChange={(next) => update({ temperature: next.length ? next : undefined })}
        />
        <MultiSelectFilter
          label="Type"
          options={TYPE_OPTIONS}
          selected={filters.type ?? []}
          onChange={(next) => update({ type: next.length ? next : undefined })}
        />
        <MultiSelectFilter
          label="Industry"
          options={INDUSTRY_OPTIONS}
          selected={filters.industry ?? []}
          onChange={(next) => update({ industry: next.length ? next : undefined })}
          searchable
        />
        <SingleSelectFilter
          label="Location"
          options={COUNTRY_OPTIONS}
          value={filters.country?.[0]}
          anyValue="any"
          onChange={(next) => update({ country: next ? [next] : undefined })}
        />
        <SingleSelectFilter
          label="Detected"
          options={DETECTED_OPTIONS}
          value={filters.detectedWithinDays ? String(filters.detectedWithinDays) : undefined}
          anyValue="any"
          onChange={(next) => update({ detectedWithinDays: next ? Number(next) : undefined })}
        />
        <SingleSelectFilter
          label="Deadline"
          options={DEADLINE_OPTIONS}
          value={filters.deadlineWithinDays ? String(filters.deadlineWithinDays) : undefined}
          anyValue="any"
          onChange={(next) => update({ deadlineWithinDays: next ? Number(next) : undefined })}
        />
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-line px-4 py-2">
          <span className="text-[12px] text-ink-muted">
            {activeCount} active {activeCount === 1 ? 'filter' : 'filters'}
          </span>
          {chips.map((chip) => (
            <FilterChip key={chip.key} onRemove={chip.onRemove}>
              {chip.label}
            </FilterChip>
          ))}
          <button
            type="button"
            onClick={() => onChange({ search: filters.search })}
            className="ml-1 text-[12px] font-medium text-signal-700 underline-offset-2 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
