import type { Opportunity, OpportunityFilters, Paginated, SortState } from '@/app/types'
import { type OpportunitySortKey } from '@/app/utils/opportunity'

import { api } from './api'

export interface OpportunityQuery {
  filters?: OpportunityFilters
  sort?: SortState<OpportunitySortKey>
  page?: number
  pageSize?: number
}

/** Maps UI query state onto the query string the REST API is expected to take. */
function toQueryParams(query: OpportunityQuery): Record<string, unknown> {
  const { filters = {}, sort, page = 1, pageSize = 25 } = query
  return {
    q: filters.search || undefined,
    temperature: filters.temperature,
    type: filters.type,
    industry: filters.industry,
    country: filters.country,
    company_id: filters.companyId,
    detected_within_days: filters.detectedWithinDays,
    deadline_within_days: filters.deadlineWithinDays,
    source: filters.source,
    sort_by: sort?.key,
    sort_dir: sort?.direction,
    page,
    page_size: pageSize,
  }
}

export async function getOpportunities(
  query: OpportunityQuery,
): Promise<Paginated<Opportunity>> {
  const { data } = await api.get<Paginated<Opportunity>>('/opportunities', {
    params: toQueryParams(query),
  })
  return data
}

/** Unpaginated read used by the dashboard widgets. */
export async function getAllOpportunities(): Promise<Opportunity[]> {
  const { data } = await api.get<Paginated<Opportunity>>('/opportunities', {
    params: { page_size: 500 },
  })
  return data.items
}

export async function getOpportunityById(id: string): Promise<Opportunity> {
  const { data } = await api.get<Opportunity>(`/opportunities/${id}`)
  return data
}

/** Records a manual note against an opportunity; used by the detail panel. */
export async function addOpportunityNote(opportunityId: string, note: string): Promise<void> {
  await api.post(`/opportunities/${opportunityId}/notes`, { note })
}
