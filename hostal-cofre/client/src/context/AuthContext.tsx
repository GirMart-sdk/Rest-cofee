import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('hostal-cofee-token')
    if (token) {
      api.get('/auth/me')
        .then(res => setUser(res.data.data))
        .catch(() => localStorage.removeItem('hostal-cofee-token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('hostal-cofee-token', res.data.data.token)
      setUser(res.data.data.user)
      return true
    } catch {
      return false
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/register', { name, email, password })
      localStorage.setItem('hostal-cofee-token', res.data.data.token)
      setUser(res.data.data.user)
      return true
    } catch {
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('hostal-cofee-token')
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
