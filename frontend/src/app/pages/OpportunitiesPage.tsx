import { useQuery } from '@tanstack/react-query'
import { Radar } from 'lucide-react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

import { EmptyState } from '@/app/components/feedback/States'
import { PageHeader } from '@/app/components/layout/PageHeader'
import { Panel } from '@/app/components/layout/Panel'
import { Pagination } from '@/app/components/tables/Pagination'
import { OpportunityFilterBar } from '@/app/features/opportunities/OpportunityFilterBar'
import { OpportunityTable } from '@/app/features/opportunities/OpportunityTable'
import { useOpportunityQueryState } from '@/app/features/opportunities/useOpportunityQueryState'
import { useOpportunityMutations } from '@/app/hooks/useOpportunityMutations'
import { useCurrentUser } from '@/app/providers/currentUserContext'
import { getOpportunities } from '@/app/services/opportunities'
import { queryKeys } from '@/app/services/queryKeys'
import { isFilterEmpty } from '@/app/utils/opportunity'

export function OpportunitiesPage() {
  const navigate = useNavigate()
  const { id: openId } = useParams()
  const { user } = useCurrentUser()
  const { assign } = useOpportunityMutations()

  const { filters, sort, page, pageSize, apply, setSort, setPage, setPageSize, clearAll } =
    useOpportunityQueryState()

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.opportunities(filters, sort, page, pageSize),
    queryFn: () => getOpportunities({ filters, sort, page, pageSize }),
  })

  const rows = data?.items ?? []

  const openOpportunity = (id: string) => {
    navigate({ pathname: `/app/opportunities/${id}`, search: window.location.search })
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Opportunities"
        subtitle="Prioritize, assign and engage with high-intent business opportunities."
      />

      <Panel flush>
        <OpportunityFilterBar
          filters={filters}
          // The URL carries an opaque company token, so the readable name is
          // taken from the rows it matched.
          companyName={rows.find((row) => row.companyId === filters.companyId)?.companyName}
          onChange={(next) => apply(next)}
        />

        <OpportunityTable
          rows={rows}
          currentUserId={user.id}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => void refetch()}
          sort={sort}
          onSortChange={setSort}
          activeRowKey={openId ?? null}
          onRowClick={(opportunity) => openOpportunity(opportunity.id)}
          onAssign={(opportunity) => assign.mutate(opportunity.id)}
          onSendOutreach={(opportunity) => openOpportunity(opportunity.id)}
          emptyState={
            isFilterEmpty(filters) ? (
              <EmptyState
                icon={<Radar />}
                title="No opportunities yet"
                description="New high-intent opportunities will appear here as they are discovered."
              />
            ) : (
              <EmptyState
                icon={<Radar />}
                title="No opportunities match these filters."
                description="Try clearing a filter to see more opportunities."
                action={{ label: 'Clear filters', onClick: clearAll }}
              />
            )
          }
        />

        {!isLoading && !isError && rows.length > 0 && (
          <Pagination
            page={page}
            pageSize={pageSize}
            total={data?.total ?? 0}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            itemLabel="opportunities"
          />
        )}
      </Panel>

      <Outlet />
    </div>
  )
}
