import { opportunityTypeLabel } from '@/app/constants/opportunity'
import type { Opportunity, User } from '@/app/types'
import { firstNameOf } from '@/app/utils/format'

/** `Regarding {title} — {sender company}` */
export function buildSubject(opportunity: Opportunity, sender: User): string {
  return `Regarding ${opportunity.title} — ${sender.company}`
}

/**
 * Professional default body. Deliberately claims nothing about capabilities
 * that was not supplied by the workspace, and is fully editable before send.
 */
export function buildBody(opportunity: Opportunity, sender: User): string {
  const contactName = opportunity.contact?.name
  const greeting = contactName ? firstNameOf(contactName) : 'team'
  const typeLabel = opportunityTypeLabel(opportunity.type).toLowerCase()

  const signature = [sender.name, sender.jobTitle, sender.company, sender.phone ?? sender.email]
    .filter(Boolean)
    .join('\n')

  return [
    `Hi ${greeting},`,
    '',
    `I came across your ${typeLabel} regarding ${opportunity.title} at ${opportunity.companyName} and wanted to reach out.`,
    '',
    'Based on the requirements outlined, I believe our team may be able to support you with the initiative.',
    '',
    'I’d be happy to share relevant capabilities, experience, and examples of how we could help. If it makes sense, would you be open to a brief conversation?',
    '',
    'Best regards,',
    '',
    signature,
  ].join('\n')
}
