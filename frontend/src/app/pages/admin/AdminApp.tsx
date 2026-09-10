import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { RequireAdminAuth } from '@/app/components/auth/RequireAdminAuth'
import { Button } from '@/app/components/common/Button'
import { listAdminUsers } from '@/app/services/auth'
import { useAuthStore } from '@/app/store/useAuthStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 },
  },
})

function AdminShell() {
  const navigate = useNavigate()
  const admin = useAuthStore((s) => s.admin)
  const clearAdminSession = useAuthStore((s) => s.clearAdminSession)

  function signOut() {
    clearAdminSession()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-dvh bg-paper">
      <header className="border-b border-mist bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="label-meta text-forest">OpportunityX · Admin</p>
            <p className="mt-0.5 text-sm text-graphite">{admin?.profile.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/users"
              className="rounded-md px-3 py-2 text-sm font-medium text-ink hover:bg-paper-warm"
            >
              Users
            </Link>
            <Button type="button" variant="secondary" size="sm" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}

export function AdminUsersPage() {
  const token = useAuthStore((s) => s.admin?.token)

  const users = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => listAdminUsers(token!),
    enabled: Boolean(token),
  })

  return (
    <div>
      <h1 className="text-[1.5rem] font-semibold tracking-[-0.025em] text-ink">Signed-up users</h1>
      <p className="mt-2 max-w-2xl text-[0.9375rem] text-graphite">
        People with OpportunityPedia accounts. Details load from the admin API.
      </p>

      {users.isLoading ? (
        <p className="mt-10 text-sm text-graphite">Loading users…</p>
      ) : users.isError ? (
        <div className="mt-10 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          Could not load users. Check that the admin API is running, then refresh.
          <div className="mt-3">
            <Button type="button" variant="secondary" size="sm" onClick={() => users.refetch()}>
              Try again
            </Button>
          </div>
        </div>
      ) : !users.data?.length ? (
        <p className="mt-10 rounded-md border border-mist bg-white px-4 py-8 text-center text-sm text-graphite">
          No users yet.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-md border border-mist bg-white">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-mist bg-paper">
                <th className="px-4 py-3 font-medium text-ink-secondary">Name</th>
                <th className="px-4 py-3 font-medium text-ink-secondary">Email</th>
                <th className="px-4 py-3 font-medium text-ink-secondary">Company</th>
                <th className="px-4 py-3 font-medium text-ink-secondary">Status</th>
                <th className="px-4 py-3 font-medium text-ink-secondary">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist">
              {users.data.map((row) => (
                <tr key={String(row.id)} className="align-top">
                  <td className="px-4 py-3 font-medium text-ink">{row.name}</td>
                  <td className="px-4 py-3 text-graphite">{row.email}</td>
                  <td className="px-4 py-3 text-graphite">{row.company || '—'}</td>
                  <td className="px-4 py-3 text-graphite">{row.status}</td>
                  <td className="px-4 py-3 text-graphite">
                    {row.created_at ? new Date(row.created_at).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/** Lazy entry for `/admin/*` (except login). */
export default function AdminApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <RequireAdminAuth>
        <AdminShell />
      </RequireAdminAuth>
    </QueryClientProvider>
  )
}

export function AdminIndexRedirect() {
  return <Navigate to="/admin/users" replace />
}
