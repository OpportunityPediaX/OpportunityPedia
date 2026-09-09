import type { ReactNode } from 'react'

import { CURRENT_USER } from '@/app/config/currentUser'

import { CurrentUserContext, type CurrentUserContextValue } from './currentUserContext'

/**
 * Single place the app learns who is signed in. Swap the constant for the
 * authenticated session response and every consumer keeps working.
 *
 * There is no team roster endpoint yet, so the workspace is the signed-in user
 * alone and reassignment stays off until one exists.
 */
export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const value: CurrentUserContextValue = {
    user: CURRENT_USER,
    team: [CURRENT_USER],
    can: { reassign: false, unassign: true, manageSources: false },
  }

  return <CurrentUserContext value={value}>{children}</CurrentUserContext>
}
