import { Suspense, lazy, type ReactNode } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'

import {
  MyAssignmentsPage,
  NotFoundPage as AppNotFoundPage,
  OpportunitiesPage,
  OpportunityRouteDrawer,
  OverviewPage,
  SettingsPage,
  TeamActivityPage,
  VendorProfilePage,
  VendorsPage,
} from '@/app/pages/lazy'
import { SiteLayout } from '@/marketing/components/layout/SiteLayout'
import { HomePage } from '@/marketing/pages/Home/HomePage'
import {
  CareersPage,
  CompanyPage,
  ContactPage,
  NotFoundPage as MarketingNotFoundPage,
  OpportunityXPage,
  PrivacyPage,
  ProductsPage,
  TermsPage,
} from '@/marketing/pages/lazy'

import { RouteFallback } from './RouteFallback'

/**
 * One router for both halves of the product: the public site at `/` and the
 * OpportunityX application at `/app/*`. The homepage ships in the initial
 * chunk; everything else — the whole application included — is split, so
 * visitors to the marketing site never download the product.
 */

const AppProviders = lazy(() => import('@/app/AppProviders'))

/** Route elements are split, so each one needs a boundary to suspend against. */
const split = (node: ReactNode) => <Suspense fallback={<RouteFallback />}>{node}</Suspense>

export const router = createBrowserRouter([
  {
    path: '/app',
    element: split(<AppProviders />),
    children: [
      { index: true, element: <Navigate to="/app/overview" replace /> },
      { path: 'overview', element: <OverviewPage /> },
      {
        path: 'opportunities',
        element: <OpportunitiesPage />,
        // Nested so the detail panel opens over the list it came from while
        // still being reachable through a direct link.
        children: [{ path: ':id', element: <OpportunityRouteDrawer /> }],
      },
      { path: 'vendors', element: <VendorsPage /> },
      { path: 'vendors/:id', element: <VendorProfilePage /> },
      { path: 'my-assignments', element: <MyAssignmentsPage /> },
      { path: 'activity', element: <TeamActivityPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <AppNotFoundPage /> },
    ],
  },
  {
    element: <SiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: split(<ProductsPage />) },
      { path: 'products/opportunityx', element: split(<OpportunityXPage />) },
      { path: 'company', element: split(<CompanyPage />) },
      { path: 'careers', element: split(<CareersPage />) },
      { path: 'contact', element: split(<ContactPage />) },
      { path: 'privacy', element: split(<PrivacyPage />) },
      { path: 'terms', element: split(<TermsPage />) },
      { path: 'about', element: <Navigate to="/company" replace /> },
      { path: '*', element: split(<MarketingNotFoundPage />) },
    ],
  },
])
