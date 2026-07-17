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
  image: string
  available: boolean
}

export interface CartItem {
  menuItem: MenuItem
  quantity: number
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
  available?: boolean
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  paymentMethod: 'wompi' | 'cash' | 'nequi' | 'daviplata'
  paymentStatus: 'pending' | 'paid' | 'failed'
  customerName: string
  customerPhone: string
  customerEmail: string
  createdAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
