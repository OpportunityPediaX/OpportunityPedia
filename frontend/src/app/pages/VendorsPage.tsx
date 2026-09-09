import { Building2 } from 'lucide-react'

import { EmptyState } from '@/app/components/feedback/States'
import { PageHeader } from '@/app/components/layout/PageHeader'
import { Panel } from '@/app/components/layout/Panel'

/**
 * Placeholder until company profiles are designed.
 *
 * The company roll-up is derived from the same rows the Opportunities page
 * already shows, so nothing is lost by not listing it here twice. Every
 * company link in the app now points at Opportunities scoped to that employer.
 */
export function VendorsPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Vendors"
        subtitle="Company profiles are being built. Opportunities are available now."
      />

      <Panel>
        <EmptyState
          icon={<Building2 />}
          title="Coming soon"
          description="Company profiles will appear here once they are ready. In the meantime, every opportunity is listed on the Opportunities page."
        />
      </Panel>
    </div>
  )
}
