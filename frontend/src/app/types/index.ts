/**
 * Domain models for Opportunity Pedia.
 *
 * These mirror the shapes the FastAPI backend is expected to return. Adapters
 * live in `src/services/*` so a field rename on the server only requires a
 * change there, never inside a page or component.
 */

/** ISO-8601 timestamp string, e.g. `2026-09-06T04:48:00Z`. */
export type IsoDateTime = string

export type OpportunityTemperature = 'very_hot' | 'hot' | 'warm' | 'watch' | 'cold'

export type OpportunityType =
  | 'rfp'
  | 'leadership'
  | 'hiring'
  | 'expansion'
  | 'procurement'
  | 'partnership'
  | 'technology_investment'
  | 'funding'
  | 'vendor_requirement'
  | 'other'

export type OutreachStatus =
  | 'not_contacted'
  | 'contacted'
  | 'replied'
  | 'follow_up_required'
  | 'completed'

export type CompanySize = 'smb' | 'mid_market' | 'enterprise' | 'strategic'

export type OutreachChannel = 'email' | 'call' | 'linkedin' | 'meeting'

export type ActivityType =
  | 'discovered'
  | 'assigned'
  | 'unassigned'
  | 'reassigned'
  | 'contacted'
  | 'replied'
  | 'follow_up'
  | 'completed'
  | 'temperature_changed'
  | 'note'

export interface User {
  id: string
  name: string
  initials: string
  email: string
  jobTitle: string
  company: string
  phone?: string
  /** Tailwind-independent avatar tint key, resolved by `getAvatarTone`. */
  avatarTone?: 'navy' | 'teal' | 'plum' | 'sand' | 'slate'
}

export interface Vendor {
  id: string
  name: string
  website?: string
  domain?: string
  industry: string
  location: string
  headquarters: string
  employeeCount?: number
  companySize: CompanySize
  /** Whether the company is already an approved vendor of record. */
  vendorStatus: 'approved_vendor' | 'prospective' | 'former_vendor' | 'not_a_vendor'
  existingRelationship?: string
  description?: string
  foundedYear?: number
  lastActivityAt?: IsoDateTime
}

export interface OpportunityContact {
  name?: string
  jobTitle?: string
  email?: string
  linkedinUrl?: string
  phone?: string
}

export interface OpportunitySource {
  id: string
  name: string
  url?: string
  publishedAt?: IsoDateTime
  /** Verbatim signal text captured at ingestion time. */
  signalDescription: string
}

export interface OpportunityActivity {
  id: string
  opportunityId: string
  type: ActivityType
  /** Null for system-generated events such as discovery. */
  actorId: string | null
  actorName: string
  /** Short human-readable description rendered in timelines. */
  message: string
  detail?: string
  createdAt: IsoDateTime
  channel?: OutreachChannel
}

export interface Outreach {
  id: string
  opportunityId: string
  senderId: string
  senderName: string
  senderEmail: string
  recipientEmail: string
  subject: string
  body: string
  channel: OutreachChannel
  status: 'sent' | 'draft' | 'failed'
  sentAt: IsoDateTime
}

export interface Assignment {
  opportunityId: string
  userId: string
  userName: string
  assignedAt: IsoDateTime
}

export interface Opportunity {
  id: string
  title: string
  companyId: string
  companyName: string
  type: OpportunityType
  temperature: OpportunityTemperature
  /** 0–100. */
  confidenceScore: number
  summary: string
  /** Factual justification shown in the "Why this opportunity" block. */
  rationale: string
  /** Short factual tags, e.g. "Active RFP". Never speculative. */
  signals: string[]
  industry: string
  location: string
  /** Country bucket inferred from `location`: US, IN, or OTHER. */
  country: string
  companySize: CompanySize
  estimatedValue?: number
  detectedAt: IsoDateTime
  deadline?: IsoDateTime
  /** Internal bucket used for filtering only; never shown to the user. */
  sourceId: string
  sourceUrl?: string
  sourceSignal: string
  contact?: OpportunityContact
  assignedToId?: string | null
  assignedToName?: string | null
  assignedAt?: IsoDateTime | null
  outreachStatus: OutreachStatus
  lastContactedAt?: IsoDateTime | null
  lastContactedById?: string | null
  lastContactedByName?: string | null
  lastContactChannel?: OutreachChannel | null
  followUpDueAt?: IsoDateTime | null
  createdAt: IsoDateTime
  updatedAt: IsoDateTime
}

/**
 * Extra fields present only when the backend has collapsed an employer's open
 * roles into a single row. `kind` is the discriminator: notice rows are
 * ordinary opportunities, company rows describe hiring activity in aggregate
 * and have no deadline of their own.
 */
export interface CompanySignal {
  kind: 'company'
  /** Open roles at this employer across the current scope. */
  signalCount: number
  /** Roles posted in the last fortnight. */
  newRoles: number
  /** Roles posted in the fortnight before that, the growth baseline. */
  priorRoles: number
  /** Fractional change between the two windows; null without any postings. */
  growth: number | null
  surge: boolean
  badges: string[]
}

export type AttentionRow = Opportunity &
  Partial<CompanySignal> & { kind?: 'notice' | 'company' }

export interface AppNotification {
  id: string
  type: 'very_hot' | 'assignment' | 'deadline' | 'team' | 'system'
  title: string
  description: string
  createdAt: IsoDateTime
  read: boolean
  opportunityId?: string
}

export interface OpportunityFilters {
  search?: string
  temperature?: OpportunityTemperature[]
  type?: OpportunityType[]
  industry?: string[]
  /** Country buckets to keep; empty or omitted means everywhere. */
  country?: string[]
  /** Scopes the list to a single employer or agency. */
  companyId?: string
  /** Rolling window in days for `detectedAt`. */
  detectedWithinDays?: number
  /** Rolling window in days for `deadline`. */
  deadlineWithinDays?: number
  source?: string[]
}

export type SortDirection = 'asc' | 'desc'

export interface SortState<TKey extends string = string> {
  key: TKey
  direction: SortDirection
}

/** Conventional list envelope returned by the backend. */
export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface DashboardMetrics {
  totalVendors: number
  totalOpportunities: number
  opportunitiesAddedThisWeek: number
  veryHot: number
  veryHotNeedingAttention: number
  hot: number
  hotUnassigned: number
  assignedToMe: number
  assignedToMeNotContacted: number
  contactedThisWeek: number
  contactedByMeThisWeek: number
}

export interface TemperatureBreakdown {
  temperature: OpportunityTemperature
  count: number
}

export interface PipelineSummary {
  assigned: number
  needsOutreach: number
  contacted: number
  followUp: number
}

export interface TeamOwnershipRow {
  user: User
  assigned: number
  needsOutreach: number
  contactedToday: number
  followUps: number
}

export interface SendOutreachPayload {
  opportunityId: string
  from: string
  to: string
  subject: string
  body: string
  channel: OutreachChannel
}

export interface AssignmentPayload {
  opportunityId: string
  userId: string
}
