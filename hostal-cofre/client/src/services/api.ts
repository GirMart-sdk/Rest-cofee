import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('hostal-cofee-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

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
