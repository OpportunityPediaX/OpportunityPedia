import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { TooltipProvider } from '@/app/components/common/Tooltip'
import { Toaster } from '@/app/components/feedback/Toaster'
import { AppShell } from '@/app/components/layout/AppShell'
import { CurrentUserProvider } from '@/app/providers/CurrentUserProvider'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

/**
 * Everything the product needs and the marketing pages do not. Loaded only
 * when a `/app/*` route is entered, so the public site never pays for the
 * query client, the toast store or the Radix tooltip layer.
 */
export default function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrentUserProvider>
        <TooltipProvider delayDuration={250} skipDelayDuration={300}>
          <AppShell />
          <Toaster />
        </TooltipProvider>
      </CurrentUserProvider>
    </QueryClientProvider>
  )
}
