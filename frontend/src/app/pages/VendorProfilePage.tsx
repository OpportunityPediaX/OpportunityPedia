import { Building2, ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { EmptyState } from '@/app/components/feedback/States'
import { PageHeader } from '@/app/components/layout/PageHeader'
import { Panel } from '@/app/components/layout/Panel'

/**
 * Placeholder until company profiles are designed. Kept as a route so existing
 * links resolve to an explanation rather than a dead end.
 */
export function VendorProfilePage() {
  return (
    <div className="space-y-4">
      <Link
        to="/app/vendors"
        className="inline-flex items-center gap-1 text-[13px] text-ink-muted underline-offset-2 hover:text-ink hover:underline"
      >
        <ChevronLeft className="size-3.5" aria-hidden />
        Back to vendors
      </Link>

      <PageHeader title="Company profile" subtitle="This page is being built." />

      <Panel>
        <EmptyState
          icon={<Building2 />}
          title="Coming soon"
          description="Company profiles will appear here once they are ready. Until then, use the Opportunities page to see everything from this company."
        />
      </Panel>
    </div>
  )
}
