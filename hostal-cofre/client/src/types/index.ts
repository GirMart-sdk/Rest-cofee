export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'client'
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: 'ensalada' | 'pasta' | 'pizza' | 'postre' | 'bebida'
  image?: string
  available: boolean
}

export interface CartItem {
  menuItem: MenuItem
  quantity: number
}

export interface OrderItem {
  id: string
  quantity: number
  price: number
  menuItem: MenuItem
}

export interface Reservation {
  id?: string
  name: string
  phone: string
  email: string
  date: string
  time: string
  guests: number
  tableId?: string
  notes?: string
  status?: 'pending' | 'confirmed' | 'cancelled'
}

export interface Table {
  id: string
  number: number
  capacity: number
  zone: 'interior' | 'exterior' | 'privado'
  isOccupied?: boolean
  activeOrderCount?: number
  totalPending?: number
  orders?: Order[]
}

export type OrderType = 'domicilio' | 'tienda' | 'mesa'
export type DeliveryZoneType = 'centro' | 'periurbano' | 'lejano'

export const DELIVERY_ZONE_LABELS: Record<DeliveryZoneType, string> = {
  centro: 'Centro',
  periurbano: 'Periurbano',
  lejano: 'Lejano',
}
export type OrderStatusType =
  'pending' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'

export interface DeliveryZoneConfig {
  name: string
  label: string
  fee: number
  estimatedMinutes: number
}

export interface Order {
  id: string
  items: OrderItem[]
  total: number
  status: OrderStatusType
  paymentMethod: 'wompi' | 'cash' | 'nequi' | 'daviplata'
  paymentStatus: 'pending' | 'paid' | 'failed'
  customerName: string
  customerPhone: string
  customerEmail: string
  createdAt: string
  orderType: OrderType
  tableId?: string
  table?: Table
  address?: string
  deliveryZone?: DeliveryZoneType
  deliveryFee: number
  deliveryNotes?: string
  receiptNumber?: string
  shiftId?: string
  paymentId?: string
}

export type ShiftPeriod = 'manana' | 'medio_dia' | 'tarde' | 'noche'

export const SHIFT_PERIOD_LABELS: Record<
  ShiftPeriod,
  { label: string; hours: string; color: string }
> = {
  manana: { label: 'Mañana', hours: '6:00 - 12:00', color: 'bg-yellow-100 text-yellow-700' },
  medio_dia: { label: 'Medio Día', hours: '12:00 - 16:00', color: 'bg-orange-100 text-orange-700' },
  tarde: { label: 'Tarde', hours: '16:00 - 20:00', color: 'bg-blue-100 text-blue-700' },
  noche: { label: 'Noche', hours: '20:00 - 00:00', color: 'bg-purple-100 text-purple-700' },
}

export interface Shift {
  id: string
  userId: string
  user?: { id: string; name: string }
  cashierName: string
  shiftPeriod: ShiftPeriod
  openingCash: number
  closingCash?: number
  totalSales: number
  totalOrders: number
  cashReceived: number
  digitalTotal: number
  salesByType?: Record<string, number>
  ordersByType?: Record<string, number>
  notes?: string
  status: 'open' | 'closed'
  openedAt: string
  closedAt?: string
  orders?: Order[]
}

export interface DailyReport {
  date: string
  summary: {
    totalSales: number
    totalOrders: number
    cashSales: number
    digitalSales: number
    deliveryOrders: number
    dineInOrders: number
    posOrders: number
    averageTicket: number
  }
  topItems: Array<{ name: string; count: number; revenue: number }>
  hourlySales: Array<{ hour: number; sales: number }>
  shifts: Array<{
    id: string
    cashier: string
    shiftPeriod: ShiftPeriod
    openingCash: number
    closingCash?: number
    totalSales: number
    totalOrders: number
    cashReceived: number
    digitalTotal: number
    status: string
    openedAt: string
    closedAt?: string
  }>
}

export interface WeeklyReport {
  totalSales: number
  totalOrders: number
  dailyBreakdown: Array<{ date: string; sales: number; count: number }>
}

export interface AuditLog {
  id: string
  userId: string
  userEmail: string
  action: string
  resource: string
  resourceId?: string | null
  details?: Record<string, unknown> | null
  ip?: string | null
  createdAt: string
}

export interface SystemMetrics {
  startedAt: string
  uptimeSeconds: number
  totalRequests: number
  requestsByMethod: Record<string, number>
  requestsByRoute: Record<string, number>
  statusCodes: Record<string, number>
  totalErrors: number
  authLogins: number
  authFailedLogins: number
  ordersCreated: number
  ordersCancelled: number
  paymentsInitiated: number
  paymentsFailed: number
  paymentsWebhookRejected: number
  paymentsWebhookProcessed: number
  paymentsAmountMismatch: number
  whatsappSent: number
  whatsappFailed: number
  whatsappSkipped: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}
