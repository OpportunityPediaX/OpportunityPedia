import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import type {
  OpportunityFilters,
  OpportunityTemperature,
  OpportunityType,
  SortState,
} from '@/app/types'
import type { OpportunitySortKey } from '@/app/utils/opportunity'

const DEFAULT_SORT: SortState<OpportunitySortKey> = { key: 'detectedAt', direction: 'desc' }

function readList<T extends string>(value: string | null): T[] | undefined {
  if (!value) return undefined
  const items = value.split(',').filter(Boolean) as T[]
  return items.length ? items : undefined
}

function writeList(value?: string[]): string | undefined {
  return value?.length ? value.join(',') : undefined
}

/**
 * Filters, sorting and pagination live in the URL so a filtered list can be
 * shared, bookmarked and linked to from the dashboard.
 */
export function useOpportunityQueryState() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo<OpportunityFilters>(() => {
    const detected = searchParams.get('detected')
    const deadline = searchParams.get('deadline')
    return {
      search: searchParams.get('q') ?? undefined,
      temperature: readList<OpportunityTemperature>(searchParams.get('temperature')),
      type: readList<OpportunityType>(searchParams.get('type')),
      industry: readList(searchParams.get('industry')),
      country: readList(searchParams.get('country')),
      companyId: searchParams.get('company') ?? undefined,
      detectedWithinDays: detected ? Number(detected) : undefined,
      deadlineWithinDays: deadline ? Number(deadline) : undefined,
    }
  }, [searchParams])

  const sort = useMemo<SortState<OpportunitySortKey>>(() => {
    const key = searchParams.get('sort') as OpportunitySortKey | null
    const direction = searchParams.get('dir')
    if (!key) return DEFAULT_SORT
    return { key, direction: direction === 'asc' ? 'asc' : 'desc' }
  }, [searchParams])

  const page = Number(searchParams.get('page') ?? '1')
  const pageSize = Number(searchParams.get('pageSize') ?? '25')

  const apply = useCallback(
    (next: OpportunityFilters, options: { resetPage?: boolean } = {}) => {
      setSearchParams(
        (current) => {
          const params = new URLSearchParams(current)
          const set = (key: string, value?: string) => {
            if (value === undefined || value === '') params.delete(key)
            else params.set(key, value)
          }

          set('q', next.search)
          set('temperature', writeList(next.temperature))
          set('type', writeList(next.type))
          set('industry', writeList(next.industry))
          set('country', writeList(next.country))
          set('company', next.companyId)
          set('detected', next.detectedWithinDays ? String(next.detectedWithinDays) : undefined)
          set('deadline', next.deadlineWithinDays ? String(next.deadlineWithinDays) : undefined)

          if (options.resetPage !== false) params.delete('page')

          return params
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const setSort = useCallback(
    (nextSort: SortState<OpportunitySortKey>) => {
      setSearchParams(
        (current) => {
          const params = new URLSearchParams(current)
          params.set('sort', nextSort.key)
          params.set('dir', nextSort.direction)
          params.delete('page')
          return params
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const setPage = useCallback(
    (nextPage: number) => {
      setSearchParams(
        (current) => {
          const params = new URLSearchParams(current)
          if (nextPage <= 1) params.delete('page')
          else params.set('page', String(nextPage))
          return params
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const setPageSize = useCallback(
    (nextSize: number) => {
      setSearchParams(
        (current) => {
          const params = new URLSearchParams(current)
          params.set('pageSize', String(nextSize))
          params.delete('page')
          return params
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const clearAll = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }, [setSearchParams])

  return { filters, sort, page, pageSize, apply, setSort, setPage, setPageSize, clearAll }
}
