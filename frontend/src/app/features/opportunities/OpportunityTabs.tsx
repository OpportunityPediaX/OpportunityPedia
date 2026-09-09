import { useQuery } from '@tanstack/react-query'
import { Link2, Mail, Phone } from 'lucide-react'

import { ActivityTimeline } from '@/app/components/activity/ActivityTimeline'
import { Badge } from '@/app/components/badges/Badge'
import { ListSkeleton } from '@/app/components/feedback/States'
import { DetailGrid, FieldLabel, FieldValue } from '@/app/components/layout/Panel'
import { getOpportunityActivity } from '@/app/services/activity'
import { queryKeys } from '@/app/services/queryKeys'
import type { Opportunity } from '@/app/types'
import { formatDateTimeFull } from '@/app/utils/date'
import { displayUrl, formatCurrency } from '@/app/utils/format'
import { deriveSignals } from '@/app/utils/opportunity'

export function OverviewTab({ opportunity }: { opportunity: Opportunity }) {
  const signals = deriveSignals(opportunity)

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-[13px] font-semibold text-ink">Summary</h3>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-secondary">
          {opportunity.summary}
        </p>
      </section>

      <section className="rounded-lg border border-line bg-surface-muted p-4">
        <h3 className="text-[13px] font-semibold text-ink">Why this opportunity</h3>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-secondary">
          {opportunity.rationale}
        </p>
        {signals.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {signals.map((signal) => (
              <li key={signal}>
                <Badge className="border-line-strong bg-surface text-ink-secondary">{signal}</Badge>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Type, temperature, confidence and deadline already sit in the
          drawer header — this grid only carries what the header cannot. */}
      <DetailGrid>
        <div>
          <FieldLabel>Estimated value</FieldLabel>
          <FieldValue className="nums">{formatCurrency(opportunity.estimatedValue)}</FieldValue>
        </div>
        <div>
          <FieldLabel>Industry</FieldLabel>
          <FieldValue>{opportunity.industry}</FieldValue>
        </div>
        <div>
          <FieldLabel>Location</FieldLabel>
          <FieldValue>{opportunity.location}</FieldValue>
        </div>
        <div>
          <FieldLabel>Detected</FieldLabel>
          <FieldValue className="nums">{formatDateTimeFull(opportunity.detectedAt)}</FieldValue>
        </div>
      </DetailGrid>
    </div>
  )
}

export function ContactTab({ opportunity }: { opportunity: Opportunity }) {
  const contact = opportunity.contact

  if (!contact || (!contact.name && !contact.email)) {
    return (
      <div className="rounded-lg border border-dashed border-line-strong px-4 py-8 text-center">
        <p className="text-[13.5px] font-medium text-ink">Contact information unavailable</p>
        <p className="mt-1 text-[13px] text-ink-muted">
          No verified contact was published with this signal. Outreach stays disabled until one is
          confirmed.
        </p>
      </div>
    )
  }

  return (
    <DetailGrid>
      <div>
        <FieldLabel>Contact person</FieldLabel>
        <FieldValue>
          {contact.name ?? <span className="text-ink-muted">Not identified</span>}
        </FieldValue>
      </div>
      <div>
        <FieldLabel>Job title</FieldLabel>
        <FieldValue>
          {contact.jobTitle ?? <span className="text-ink-muted">Not identified</span>}
        </FieldValue>
      </div>
      <div>
        <FieldLabel>Email</FieldLabel>
        <FieldValue>
          {contact.email ? (
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-1.5 text-signal-700 underline-offset-2 hover:underline"
            >
              <Mail className="size-3.5" aria-hidden />
              {contact.email}
            </a>
          ) : (
            <span className="text-ink-muted">No verified email available</span>
          )}
        </FieldValue>
      </div>
      <div>
        <FieldLabel>Phone</FieldLabel>
        <FieldValue>
          {contact.phone ? (
            <span className="inline-flex items-center gap-1.5">
              <Phone className="size-3.5 text-ink-muted" aria-hidden />
              {contact.phone}
            </span>
          ) : (
            <span className="text-ink-muted">Not available</span>
          )}
        </FieldValue>
      </div>
      <div className="sm:col-span-2">
        <FieldLabel>LinkedIn</FieldLabel>
        <FieldValue>
          {contact.linkedinUrl ? (
            <a
              href={contact.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-signal-700 underline-offset-2 hover:underline"
            >
              <Link2 className="size-3.5" aria-hidden />
              {displayUrl(contact.linkedinUrl)}
            </a>
          ) : (
            <span className="text-ink-muted">Not available</span>
          )}
        </FieldValue>
      </div>
    </DetailGrid>
  )
}

export function ActivityTab({ opportunityId }: { opportunityId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.opportunityActivity(opportunityId),
    queryFn: () => getOpportunityActivity(opportunityId),
  })

  if (isLoading) return <ListSkeleton rows={4} />

  return <ActivityTimeline entries={data ?? []} />
}
