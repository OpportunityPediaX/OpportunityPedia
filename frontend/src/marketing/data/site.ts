/**
 * Single source of truth for navigation, external product links and copy that
 * repeats across pages.
 */
export const site = {
  name: 'OpportunityPedia',
  tagline: 'We make opportunity easier to see.',
  description:
    'OpportunityPedia builds intelligence products that transform fragmented market signals into clear opportunities for action.',
  footerDescription:
    'Building intelligence products for discovering and acting on opportunity.',
  copyrightYear: 2026,
  /**
   * Entry point into the OpportunityX application. The `/products/opportunityx`
   * marketing page is still linked separately from the Products menu — this is
   * the "go and use it" destination, not the "read about it" one.
   */
  opportunityXAppUrl: '/app/overview',
} as const;

export type NavItem = { label: string; to: string };

export const primaryNav: NavItem[] = [
  { label: 'Products', to: '/products' },
  { label: 'Company', to: '/company' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact', to: '/contact' },
];

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Company',
    items: [
      { label: 'About', to: '/company' },
      { label: 'Careers', to: '/careers' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    heading: 'Products',
    items: [{ label: 'OpportunityX', to: '/products/opportunityx' }],
  },
  {
    heading: 'Legal',
    items: [
      { label: 'Privacy', to: '/privacy' },
      { label: 'Terms', to: '/terms' },
    ],
  },
];
