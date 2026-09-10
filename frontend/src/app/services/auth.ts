import { api } from '@/app/services/api'
import type { AuthProfile } from '@/app/store/useAuthStore'

export interface AuthLoginResult {
  token: string
  user: AuthProfile
}

export interface AdminUserRow {
  id: number | string
  name: string
  email: string
  phone?: string | null
  company?: string | null
  status: string
  created_at?: string | null
}

/** Customer sign-in — `POST /auth/login`. */
export async function loginCustomer(email: string, password: string): Promise<AuthLoginResult> {
  const { data } = await api.post<AuthLoginResult>('/auth/login', { email, password })
  return data
}

/** Platform admin sign-in — `POST /admin/login`. Not linked from marketing. */
export async function loginAdmin(email: string, password: string): Promise<AuthLoginResult> {
  const { data } = await api.post<AuthLoginResult>('/admin/login', { email, password })
  return data
}

/** `GET /admin/me` — validates the admin token. */
export async function getAdminMe(token: string): Promise<AuthProfile> {
  const { data } = await api.get<AuthProfile>('/admin/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data
}

/** `GET /admin/users` — customers visible to the platform admin. */
export async function listAdminUsers(token: string): Promise<AdminUserRow[]> {
  const { data } = await api.get<{ users: AdminUserRow[] }>('/admin/users', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data.users ?? []
}
