import type { Temperature } from '@/marketing/components/common/SignalBadge';

/* ---------------------------------------------------------------- *
 * THE PROBLEM
 * ---------------------------------------------------------------- */
export const problemFacets = [
  {
    title: 'Too many sources',
    body: 'Important information exists across disconnected systems.',
  },
  {
    title: 'Too much noise',
    body: 'Not every signal represents an actual opportunity.',
  },
  {
    title: 'Too little context',
    body: 'Raw information rarely tells teams what matters now.',
  },
  {
    title: 'Timing matters',
    body: 'Discovering an opportunity late can make it irrelevant.',
  },
] as const;

/* ---------------------------------------------------------------- *
 * OUR APPROACH
 * ---------------------------------------------------------------- */
export const approachPillars = [
  {
    index: '01',
    title: 'Discover',
    body: 'Bring relevant information from multiple approved sources into one structured environment.',
  },
  {
    index: '02',
    title: 'Understand',
    body: 'Transform individual signals into context that helps teams determine relevance and urgency.',
  },
  {
    index: '03',
    title: 'Act',
    body: 'Build products that connect intelligence directly to workflows.',
  },
] as const;

/* ---------------------------------------------------------------- *
 * TRANSFORMATION — a single worked example, labelled illustrative.
 * ---------------------------------------------------------------- */
export const transformationStages = [
  {
    index: '01',
    stage: 'Source',
    headline: 'Company career page',
    detail: 'A publicly accessible page is read as one of many approved inputs.',
  },
  {
    index: '02',
    stage: 'Signal',
    headline: '120 new engineering roles',
    detail: 'The raw observation is extracted and structured into a typed signal.',
  },
  {
    index: '03',
    stage: 'Intelligence',
    headline: 'Large technical expansion underway',
    detail: 'The signal is placed in context alongside related activity.',
  },
  {
    index: '04',
    stage: 'Opportunity',
    headline: 'Potential vendor or staffing need',
    detail: 'Context becomes a classified opportunity a team can evaluate.',
  },
  {
    index: '05',
    stage: 'Action',
    headline: 'Assign → Research → Outreach',
    detail: 'The opportunity carries into an owned, tracked workflow.',
  },
] as const;

/* ---------------------------------------------------------------- *
 * SIGNAL CATEGORIES — index/table style, not a rainbow of pills.
 * ---------------------------------------------------------------- */
export const signalCategories = [
  { index: '01', name: 'RFP', meaning: 'Explicit buying intent' },
  { index: '02', name: 'Leadership', meaning: 'Organizational change' },
  { index: '03', name: 'Hiring', meaning: 'Growth and capability signals' },
  { index: '04', name: 'Expansion', meaning: 'New geographic or operational activity' },
  { index: '05', name: 'Procurement', meaning: 'Formal purchasing activity' },
  { index: '06', name: 'Funding', meaning: 'New capacity to invest' },
  { index: '07', name: 'Partnership', meaning: 'Shifting commercial relationships' },
  { index: '08', name: 'Technology Investment', meaning: 'Change in technical direction' },
  { index: '09', name: 'Vendor Requirement', meaning: 'A stated need for a supplier' },
] as const;

/* ---------------------------------------------------------------- *
 * OPPORTUNITYX BENEFITS
 * ---------------------------------------------------------------- */
export const productBenefits = [
  {
    index: '01',
    title: 'Find earlier',
    body: 'Discover signals across relevant sources before manual research catches them.',
  },
  {
    index: '02',
    title: 'Prioritize faster',
    body: 'Separate high-intent opportunities from general market noise.',
  },
  {
    index: '03',
    title: 'Coordinate clearly',
    body: 'See ownership and activity before someone duplicates outreach.',
  },
  {
    index: '04',
    title: 'Act immediately',
    body: 'Move from discovery to outreach without losing context.',
  },
] as const;

/* ---------------------------------------------------------------- *
 * PRODUCT WORKFLOW
 * ---------------------------------------------------------------- */
export const workflowStages = [
  {
    index: '01',
    title: 'Discover',
    body: 'Relevant signals arrive in one place instead of a dozen browser tabs.',
  },
  {
    index: '02',
    title: 'Prioritize',
    body: 'Opportunities are classified so the urgent ones surface first.',
  },
  {
    index: '03',
    title: 'Assign',
    body: 'An owner is attached before work starts, so effort is not duplicated.',
  },
  {
    index: '04',
    title: 'Outreach',
    body: 'Contact happens with the originating context still attached.',
  },
  {
    index: '05',
    title: 'Track',
    body: 'Status and activity stay visible to the whole team.',
  },
  {
    index: '06',
    title: 'Follow up',
    body: 'Open opportunities resurface instead of going quiet.',
  },
] as const;

/* ---------------------------------------------------------------- *
 * AUDIENCES
 * ---------------------------------------------------------------- */
export const audiences = [
  {
    role: 'Business Development',
    challenge: 'Hours disappear into researching disconnected resources.',
    help: 'Identify meaningful opportunities before spending a morning on manual research.',
  },
  {
    role: 'Sales',
    challenge: 'Outbound lists rarely say why now is the right moment.',
    help: 'Approach accounts when a signal indicates an active reason to talk.',
  },
  {
    role: 'Growth',
    challenge: 'Market movement is noticed after competitors act on it.',
    help: 'Watch expansion, hiring and funding activity as it is published.',
  },
  {
    role: 'Procurement',
    challenge: 'Vendor and supplier requirements are scattered across portals.',
    help: 'Track requirements and vendor activity in one structured view.',
  },
  {
    role: 'Account Management',
    challenge: 'Change inside existing accounts is easy to miss.',
    help: 'See leadership and investment changes across the accounts you own.',
  },
  {
    role: 'Research',
    challenge: 'Findings live in documents that go stale immediately.',
    help: 'Work from structured signals that retain their source context.',
  },
  {
    role: 'Leadership',
    challenge: 'Pipeline activity is hard to see without asking for a report.',
    help: 'Understand what the team is pursuing and what has stalled.',
  },
  {
    role: 'Vendor Management',
    challenge: 'The vendor ecosystem shifts faster than records are updated.',
    help: 'Follow partnership and vendor requirement signals continuously.',
  },
] as const;

/* ---------------------------------------------------------------- *
 * PHILOSOPHY
 * ---------------------------------------------------------------- */
export const principles = [
  {
    index: '01',
    title: 'Signal over noise',
    body: 'Focus on information that changes decisions.',
  },
  {
    index: '02',
    title: 'Context over volume',
    body: 'A smaller amount of useful intelligence is more valuable than endless records.',
  },
  {
    index: '03',
    title: 'Action over dashboards',
    body: 'Information should lead naturally to the next action.',
  },
  {
    index: '04',
    title: 'Coordination over duplication',
    body: 'Teams should know what has already been done.',
  },
  {
    index: '05',
    title: 'Trust over automation',
    body: 'Automation should never obscure where information came from.',
  },
] as const;

/* ---------------------------------------------------------------- *
 * DATA RESPONSIBILITY — principles only. No certification claims.
 * ---------------------------------------------------------------- */
export const responsibilityPrinciples = [
  {
    index: '01',
    title: 'Source visibility',
    body: 'Where practical, intelligence should retain context about its source.',
  },
  {
    index: '02',
    title: 'Approved sources',
    body: 'Products should rely on appropriately accessible and approved information sources.',
  },
  {
    index: '03',
    title: 'Human control',
    body: 'Users decide what actions to take.',
  },
  {
    index: '04',
    title: 'Security',
    body: 'Sensitive account and organizational data should be treated responsibly.',
  },
] as const;

/* ---------------------------------------------------------------- *
 * CREDIBILITY — the operational problem, in place of fake proof.
 * ---------------------------------------------------------------- */
export const operationalFrictions = [
  'Multiple sources',
  'Manual research',
  'Duplicate outreach',
  'Missed timing',
  'Unclear ownership',
] as const;

/* ---------------------------------------------------------------- *
 * PRODUCT-STAGE MOCK DATA — illustrative UI content only.
 * ---------------------------------------------------------------- */
export type MockOpportunity = {
  id: string;
  organization: string;
  title: string;
  category: string;
  temperature: Temperature;
  owner: string | null;
  updated: string;
};

export const mockOpportunities: MockOpportunity[] = [
  {
    id: '0247',
    organization: 'Northbridge Health System',
    title: 'Enterprise Cloud Modernization RFP',
    category: 'RFP',
    temperature: 'very-hot',
    owner: null,
    updated: '14:32',
  },
  {
    id: '0246',
    organization: 'Halden Logistics Group',
    title: 'New CTO appointed',
    category: 'Leadership',
    temperature: 'very-hot',
    owner: 'A. Rao',
    updated: '13:58',
  },
  {
    id: '0244',
    organization: 'Meridian Utilities',
    title: '120 new engineering roles posted',
    category: 'Hiring',
    temperature: 'hot',
    owner: 'S. Iyer',
    updated: '11:20',
  },
  {
    id: '0241',
    organization: 'Coastline Retail Partners',
    title: 'Regional distribution centre announced',
    category: 'Expansion',
    temperature: 'hot',
    owner: null,
    updated: '09:42',
  },
  {
    id: '0238',
    organization: 'Arcline Manufacturing',
    title: 'Managed services vendor requirement',
    category: 'Vendor Requirement',
    temperature: 'warm',
    owner: 'D. Mehta',
    updated: 'Yesterday',
  },
  {
    id: '0233',
    organization: 'Vantage Financial',
    title: 'Data platform investment referenced',
    category: 'Technology Investment',
    temperature: 'watch',
    owner: null,
    updated: 'Yesterday',
  },
];

export const temperatureDefinitions: {
  temperature: Temperature;
  summary: string;
  examples: string[];
}[] = [
  {
    temperature: 'very-hot',
    summary: 'An explicit, time-bound requirement is on the table.',
    examples: [
      'Active RFP',
      'Open leadership requirement',
      'Immediate procurement',
      'Explicit vendor opportunity',
    ],
  },
  {
    temperature: 'hot',
    summary: 'Strong indicators of near-term commercial activity.',
    examples: ['Sustained hiring in a relevant function', 'Announced expansion', 'New funding'],
  },
  {
    temperature: 'warm',
    summary: 'Relevant movement without a stated requirement yet.',
    examples: ['Partnership activity', 'Stated technology direction', 'Organizational change'],
  },
  {
    temperature: 'watch',
    summary: 'Worth monitoring; not yet actionable.',
    examples: ['Early market chatter', 'Single unconfirmed reference'],
  },
];
