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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const storeToken = (accessToken: string) => {
    localStorage.setItem(TOKEN_KEY, accessToken)
  }

  const clearToken = () => {
    localStorage.removeItem(TOKEN_KEY)
  }

  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      const res = await api.post('/auth/refresh')
      const { accessToken } = res.data.data
      if (accessToken) {
        storeToken(accessToken)
        return true
      }
      return false
    } catch {
      clearToken()
      return false
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }
    api
      .get('/auth/me')
      .then((res) => setUser(res.data.data))
      .catch(async () => {
        const refreshed = await refreshAccessToken()
        if (refreshed) {
          try {
            const res = await api.get('/auth/me')
            setUser(res.data.data)
          } catch {
            clearToken()
          }
        } else {
          clearToken()
        }
      })
      .finally(() => setLoading(false))
  }, [refreshAccessToken])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/login', { email, password })
      const { accessToken, user: userData } = res.data.data
      if (!accessToken) return false
      storeToken(accessToken)
      setUser(userData)
      return true
    } catch {
      return false
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/register', { name, email, password })
      const { accessToken, user: userData } = res.data.data
      if (!accessToken) return false
      storeToken(accessToken)
      setUser(userData)
      return true
    } catch {
      return false
    }
  }

  const logout = () => {
    api.post('/auth/logout').catch(() => {})
    clearToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAdmin: user?.role === 'admin', loading }}
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
