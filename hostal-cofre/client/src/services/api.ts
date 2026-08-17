import axios from 'axios'

let accessToken: string | null = null

export function getAccessToken(): string | null {
  return accessToken
}

export function setAccessToken(token: string | null): void {
  accessToken = token
}

export function clearTokens(): void {
  accessToken = null
}

export async function refreshTokens(): Promise<boolean> {
  try {
    const res = await axios.post('/api/auth/refresh')
    const { accessToken: nextAccessToken } = res.data.data
    if (nextAccessToken) {
      accessToken = nextAccessToken
      return true
    }
    return false
  } catch {
    accessToken = null
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
        const newToken = getAccessToken()
        processQueue(null, newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
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
