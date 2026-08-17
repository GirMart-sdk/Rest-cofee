import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { User } from '../types'
import { api, setAccessToken, clearTokens, refreshTokens } from '../services/api'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  verifyTwoFactor: (code: string) => Promise<boolean>
  cancelTwoFactor: () => void
  twoFactorPending: string | null
  authError: string | null
  clearAuthError: () => void
  logout: () => void
  isAdmin: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

function extractError(err: unknown): string {
  const e = err as { response?: { data?: { error?: string } } }
  return e?.response?.data?.error || 'Ocurrió un error inesperado'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [twoFactorPending, setTwoFactorPending] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)

  const restoreSession = useCallback(async (): Promise<boolean> => {
    const refreshed = await refreshTokens()
    if (!refreshed) {
      clearTokens()
      return false
    }
    try {
      const res = await api.get('/auth/me')
      setUser(res.data.data)
      return true
    } catch {
      clearTokens()
      return false
    }
  }, [])

  useEffect(() => {
    let mounted = true
    void restoreSession().finally(() => {
      if (mounted) setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [restoreSession])

  const applySession = (res: { data: { data: { accessToken?: string; user?: User } } }) => {
    const { accessToken, user: userData } = res.data.data
    if (!accessToken) return false
    setAccessToken(accessToken)
    setUser(userData || null)
    return true
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/login', { email, password })
      if (res.data.requiresTwoFactor) {
        setTwoFactorPending(res.data.data?.pendingToken || null)
        return false
      }
      return applySession(res)
    } catch (err) {
      setAuthError(extractError(err))
      return false
    }
  }

  const verifyTwoFactor = async (code: string): Promise<boolean> => {
    if (!twoFactorPending) return false
    try {
      const res = await api.post('/auth/2fa/verify', { pendingToken: twoFactorPending, code })
      setTwoFactorPending(null)
      return applySession(res)
    } catch (err) {
      setAuthError(extractError(err))
      return false
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/register', { name, email, password })
      return applySession(res)
    } catch (err) {
      setAuthError(extractError(err))
      return false
    }
  }

  const clearAuthError = () => setAuthError(null)

  const cancelTwoFactor = () => {
    setTwoFactorPending(null)
    setAuthError(null)
  }

  const logout = () => {
    api.post('/auth/logout').catch(() => {})
    clearTokens()
    setUser(null)
    setTwoFactorPending(null)
    setAuthError(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        verifyTwoFactor,
        cancelTwoFactor,
        twoFactorPending,
        authError,
        clearAuthError,
        logout,
        isAdmin: user?.role === 'admin',
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
