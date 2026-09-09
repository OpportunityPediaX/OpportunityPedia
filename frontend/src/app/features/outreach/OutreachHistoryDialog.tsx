import { useQuery } from '@tanstack/react-query'

import { UserAvatar } from '@/app/components/common/Avatar'
import { Button } from '@/app/components/common/Button'
import { Dialog } from '@/app/components/common/Dialog'
import { EmptyState, ListSkeleton } from '@/app/components/feedback/States'
import { channelLabel, outreachStatusMeta } from '@/app/constants/opportunity'
import { getOutreachForOpportunity } from '@/app/services/outreach'
import { queryKeys } from '@/app/services/queryKeys'
import type { Opportunity } from '@/app/types'
import { formatDateTimeFull } from '@/app/utils/date'

interface OutreachHistoryDialogProps {
  opportunity: Opportunity
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Shows what has already been sent. Messages composed before the backend exists
 * live only in the session store, so earlier outreach is summarised from the
 * opportunity record itself.
 */
export function OutreachHistoryDialog({
  opportunity,
  open,
  onOpenChange,
}: OutreachHistoryDialogProps) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.opportunityOutreach(opportunity.id),
    queryFn: () => getOutreachForOpportunity(opportunity.id),
    enabled: open,
  })

  const hasStoredMessages = (data?.length ?? 0) > 0

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Outreach history"
      description={`${opportunity.companyName} · ${opportunity.title}`}
      footer={
        <Button variant="secondary" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      {isLoading ? (
        <ListSkeleton rows={2} />
      ) : hasStoredMessages ? (
        <ul className="space-y-4">
          {data?.map((message) => (
            <li key={message.id} className="rounded-lg border border-line">
              <div className="flex items-center gap-2.5 border-b border-line bg-surface-muted px-3.5 py-2.5">
                <UserAvatar name={message.senderName} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-ink">{message.senderName}</p>
                  <p className="nums truncate text-[12px] text-ink-muted">
                    {channelLabel(message.channel)} · {formatDateTimeFull(message.sentAt)}
                  </p>
                </div>
                <span className="shrink-0 text-[12px] text-ink-muted">To {message.recipientEmail}</span>
              </div>
              <div className="px-3.5 py-3">
                <p className="text-[13px] font-medium text-ink">{message.subject}</p>
                <p className="mt-2 text-[13px] leading-relaxed whitespace-pre-line text-ink-secondary">
                  {message.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : opportunity.lastContactedAt ? (
        <div className="rounded-lg border border-line">
          <div className="flex items-center gap-2.5 border-b border-line bg-surface-muted px-3.5 py-2.5">
            <UserAvatar name={opportunity.lastContactedByName ?? ''} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-ink">
                {opportunity.lastContactedByName}
              </p>
              <p className="nums truncate text-[12px] text-ink-muted">
                {channelLabel(opportunity.lastContactChannel ?? 'email')} ·{' '}
                {formatDateTimeFull(opportunity.lastContactedAt)}
              </p>
            </div>
            <span className="shrink-0 text-[12px] text-ink-muted">
              {outreachStatusMeta(opportunity.outreachStatus).label}
            </span>
          </div>
          <p className="px-3.5 py-3 text-[13px] leading-relaxed text-ink-secondary">
            The message body is held by the outreach service and will appear here once the backend
            is connected.
          </p>
        </div>
      ) : (
        <EmptyState
          compact
          title="No outreach yet"
          description="Nobody on the team has contacted this opportunity."
        />
      )}
    </Dialog>
  )
}
