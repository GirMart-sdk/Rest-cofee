import axios from 'axios'

const TOKEN_KEY = 'hostal-cofee-token'

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export async function refreshTokens(): Promise<boolean> {
  try {
    const res = await axios.post('/api/auth/refresh')
    const { accessToken } = res.data.data
    if (accessToken) {
      localStorage.setItem(TOKEN_KEY, accessToken)
      return true
    }
    return false
  } catch {
    clearTokens()
    return false
  }
}

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: unknown) => void }> =
  []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

const isAuthEndpoint = (url?: string) => !!url && url.includes('/auth/')

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url)
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const ok = await refreshTokens()
        if (!ok) {
          processQueue(new Error('Refresh failed'), null)
          window.location.href = '/login'
          return Promise.reject(error)
        }
        const accessToken = getAccessToken()
        processQueue(null, accessToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  },
)

export const whatsappService = {
  sendOrder: (phone: string, orderSummary: string) => {
    const message = encodeURIComponent(
      `🍽️ *Nuevo Pedido - Hostal Cofee*\n\n${orderSummary}\n\n¡Gracias por tu pedido!`,
    )
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  },
  sendReservation: (phone: string, reservation: string) => {
    const message = encodeURIComponent(`📅 *Nueva Reserva - Hostal Cofee*\n\n${reservation}`)
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  },
}
