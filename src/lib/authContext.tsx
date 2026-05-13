import { createContext, useContext } from 'react'
import type { User } from '@supabase/supabase-js'

export interface AuthCtx {
  user: User | null
  openAuth: () => void
  openMyPage: () => void
}

export const AuthContext = createContext<AuthCtx>({
  user: null,
  openAuth: () => {},
  openMyPage: () => {},
})

export const useAuth = () => useContext(AuthContext)
