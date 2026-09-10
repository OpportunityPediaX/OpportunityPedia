import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

import { useAuthStore } from '@/app/store/useAuthStore'

/** Sends unsigned visitors to `/login`, preserving the intended destination. */
export function RequireUserAuth({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  if (!user?.token) {
    const next = `${location.pathname}${location.search}`
    return <Navigate to="/login" replace state={{ from: next }} />
  }

  return children
}
