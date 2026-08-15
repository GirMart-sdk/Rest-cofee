import { useState, useCallback } from 'react'
import { api } from '../services/api'
import toast from 'react-hot-toast'

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (fn: () => Promise<T>, successMsg?: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fn()
      setData(result)
      if (successMsg) toast.success(successMsg)
      return result
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'An error occurred'
      setError(msg)
      toast.error(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, execute, setData }
}

export function useMenu() {
  const { data: items, loading, execute } = useApi<any[]>()

  const fetchMenu = useCallback(() => {
    return execute(() => api.get('/menu').then((res) => res.data.data))
  }, [execute])

  const createItem = useCallback(
    (item: any) => {
      return execute(() => api.post('/menu', item).then((res) => res.data.data), 'Item created')
    },
    [execute],
  )

  const updateItem = useCallback(
    (id: string, item: any) => {
      return execute(
        () => api.put(`/menu/${id}`, item).then((res) => res.data.data),
        'Item updated',
      )
    },
    [execute],
  )

  const deleteItem = useCallback(
    (id: string) => {
      return execute(() => api.delete(`/menu/${id}`).then((res) => res.data.data), 'Item deleted')
    },
    [execute],
  )

  return { items, loading, fetchMenu, createItem, updateItem, deleteItem }
}

export function useOrders() {
  const { data: orders, loading, execute } = useApi<any[]>()

  const fetchOrders = useCallback(() => {
    return execute(() => api.get('/orders').then((res) => res.data.data))
  }, [execute])

  const createOrder = useCallback(
    (order: any) => {
      return execute(() => api.post('/orders', order).then((res) => res.data.data), 'Order placed')
    },
    [execute],
  )

  const updateStatus = useCallback(
    (id: string, status: string) => {
      return execute(
        () => api.patch(`/orders/${id}/status`, { status }).then((res) => res.data.data),
        'Status updated',
      )
    },
    [execute],
  )

  const updatePayment = useCallback(
    (id: string, paymentStatus: string) => {
      return execute(
        () => api.patch(`/orders/${id}/payment`, { paymentStatus }).then((res) => res.data.data),
        'Payment updated',
      )
    },
    [execute],
  )

  return { orders, loading, fetchOrders, createOrder, updateStatus, updatePayment }
}

export function useReservations() {
  const { data: reservations, loading, execute } = useApi<any[]>()

  const fetchReservations = useCallback(() => {
    return execute(() => api.get('/reservations').then((res) => res.data.data))
  }, [execute])

  const createReservation = useCallback(
    (reservation: any) => {
      return execute(
        () => api.post('/reservations', reservation).then((res) => res.data.data),
        'Reservation created',
      )
    },
    [execute],
  )

  const updateStatus = useCallback(
    (id: string, status: string) => {
      return execute(
        () => api.patch(`/reservations/${id}/status`, { status }).then((res) => res.data.data),
        'Status updated',
      )
    },
    [execute],
  )

  return { reservations, loading, fetchReservations, createReservation, updateStatus }
}
