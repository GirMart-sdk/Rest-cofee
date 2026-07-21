import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { User } from '../types'
import { api } from '../services/api'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isAdmin: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const TOKEN_KEY = 'hostal-cofee-token'
const REFRESH_KEY = 'hostal-cofee-refresh'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const storeTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem(TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_KEY, refreshToken)
  }

  const clearTokens = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
  }

  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem(REFRESH_KEY)
    if (!refreshToken) return false
    try {
      const res = await api.post('/auth/refresh', { refreshToken })
      const { accessToken, refreshToken: newRefresh } = res.data.data
      storeTokens(accessToken, newRefresh)
      return true
    } catch {
      clearTokens()
      return false
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }
    api.get('/auth/me')
      .then(res => setUser(res.data.data))
      .catch(async () => {
        const refreshed = await refreshAccessToken()
        if (refreshed) {
          try {
            const res = await api.get('/auth/me')
            setUser(res.data.data)
          } catch {
            clearTokens()
          }
        } else {
          clearTokens()
        }
      })
      .finally(() => setLoading(false))
  }, [refreshAccessToken])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/login', { email, password })
      const { accessToken, refreshToken, user: userData } = res.data.data
      storeTokens(accessToken, refreshToken)
      setUser(userData)
      return true
    } catch {
      return false
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/register', { name, email, password })
      const { accessToken, refreshToken, user: userData } = res.data.data
      storeTokens(accessToken, refreshToken)
      setUser(userData)
      return true
    } catch {
      return false
    }
  }

  const logout = () => {
    const refreshToken = localStorage.getItem(REFRESH_KEY)
    if (refreshToken) {
      api.post('/auth/logout', { refreshToken }).catch(() => {})
    }
    clearTokens()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin: user?.role === 'admin', loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
