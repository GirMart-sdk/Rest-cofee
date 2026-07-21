import axios from 'axios'

const TOKEN_KEY = 'hostal-cofee-token'
const REFRESH_KEY = 'hostal-cofee-refresh'

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: unknown) => void }> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem(REFRESH_KEY)
      if (!refreshToken) return Promise.reject(error)

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const res = await axios.post('/api/auth/refresh', { refreshToken })
        const { accessToken, refreshToken: newRefresh } = res.data.data
        localStorage.setItem(TOKEN_KEY, accessToken)
        localStorage.setItem(REFRESH_KEY, newRefresh)
        processQueue(null, accessToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(REFRESH_KEY)
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export const whatsappService = {
  sendOrder: (phone: string, orderSummary: string) => {
    const message = encodeURIComponent(
      `🍽️ *Nuevo Pedido - Hostal Cofee*\n\n${orderSummary}\n\n¡Gracias por tu pedido!`
    )
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  },
  sendReservation: (phone: string, reservation: string) => {
    const message = encodeURIComponent(
      `📅 *Nueva Reserva - Hostal Cofee*\n\n${reservation}`
    )
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  },
}
