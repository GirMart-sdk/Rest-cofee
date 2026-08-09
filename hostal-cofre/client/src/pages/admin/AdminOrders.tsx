import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Order } from '../../types'
import { api } from '../../services/api'
import { subscribeOrders, SseEvent } from '../../services/events'
import { FiRefreshCw, FiTruck, FiHome, FiGrid } from 'react-icons/fi'
import toast from 'react-hot-toast'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  preparing: 'bg-blue-100 text-blue-700',
  ready: 'bg-green-100 text-green-700',
  out_for_delivery: 'bg-orange-100 text-orange-700',
  delivered: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  preparing: 'Preparando',
  ready: 'Listo',
  out_for_delivery: 'En camino',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

const ORDER_TYPE_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  domicilio: { label: 'Domicilio', icon: FiTruck, color: 'bg-orange-100 text-orange-700' },
  tienda: { label: 'Tienda/POS', icon: FiHome, color: 'bg-blue-100 text-blue-700' },
  mesa: { label: 'Mesa', icon: FiGrid, color: 'bg-green-100 text-green-700' },
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get('/orders')
      setOrders(res.data.data)
    } catch {
      toast.error('Error al cargar pedidos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchOrders()
    const unsubscribe = subscribeOrders((event: SseEvent) => {
      setConnected(true)
      if (event.action === 'order.created') {
        const order = event.data as Order
        setOrders((prev) => [order, ...prev])
        toast.success(`Nuevo pedido ${order.receiptNumber || ''}`.trim())
      } else if (event.action === 'order.updated') {
        const updated = event.data as Order
        setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
      }
    })
    return unsubscribe
  }, [fetchOrders])

  const filtered = orders.filter((o) => {
    if (filter !== 'all' && o.status !== filter) return false
    if (typeFilter !== 'all' && o.orderType !== typeFilter) return false
    return true
  })

  const updateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus })
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
      toast.success(`Estado cambiado a ${STATUS_LABELS[newStatus]}`)
    } catch {
      toast.error('Error al actualizar estado')
    }
  }

  const getNextStatus = (current: string): Order['status'] | null => {
    const flow: Record<string, Order['status']> = {
      pending: 'preparing',
      preparing: 'ready',
      ready: 'delivered',
    }
    return flow[current] || null
  }

  return (
    <div className="container-main">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display">Gestionar Pedidos</h1>
        <div className="flex items-center gap-3">
          <span
            className={`flex items-center gap-1.5 text-xs font-semibold ${connected ? 'text-green-600' : 'text-gray-400'}`}
          >
            <span
              className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500' : 'bg-gray-300'}`}
            />
            {connected ? 'Tiempo real' : 'Reconectando...'}
          </span>
          <button onClick={fetchOrders} className="btn-outline flex items-center gap-2">
            <FiRefreshCw /> Actualizar
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-600 mb-2">Tipo de pedido:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { key: 'all', label: 'Todos' },
            { key: 'domicilio', label: 'Domicilio' },
            { key: 'tienda', label: 'Tienda/POS' },
            { key: 'mesa', label: 'Mesa' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setTypeFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${typeFilter === f.key ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {['all', 'pending', 'preparing', 'ready', 'out_for_delivery', 'delivered'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === f ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            {f === 'all' ? 'Todos' : STATUS_LABELS[f]}{' '}
            {f !== 'all' && `(${orders.filter((o) => o.status === f).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">
          <FiRefreshCw className="animate-spin mx-auto text-4xl mb-4" />
          <p>Cargando pedidos...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const typeConfig = ORDER_TYPE_CONFIG[order.orderType] || ORDER_TYPE_CONFIG.tienda
            const TypeIcon = typeConfig.icon
            const next = getNextStatus(order.status)

            return (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-6 shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display text-lg">
                        #{order.receiptNumber || order.id.slice(0, 8)}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${typeConfig.color}`}
                      >
                        <TypeIcon size={10} /> {typeConfig.label}
                        {order.table?.number && ` #${order.table.number}`}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">
                      {order.customerName} • {order.customerPhone}
                    </p>
                    {order.address && (
                      <p className="text-gray-400 text-xs mt-1">
                        📍 {order.address} ({order.deliveryZone})
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.status]}`}
                    >
                      {STATUS_LABELS[order.status]}
                    </span>
                    <span className="text-xl font-bold text-primary">
                      ${order.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-4">
                  {order.items.map((ci, i) => (
                    <div key={i} className="flex justify-between text-sm py-1">
                      <span>
                        {ci.quantity}x {ci.menuItem?.name || 'Platillo'}
                      </span>
                      <span>${(ci.menuItem?.price || 0) * ci.quantity}</span>
                    </div>
                  ))}
                  {order.deliveryFee > 0 && (
                    <div className="flex justify-between text-sm py-1 text-orange-600">
                      <span>Envío</span>
                      <span>${order.deliveryFee}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {next && order.status !== 'cancelled' && (
                    <button
                      onClick={() => updateStatus(order.id, next)}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90"
                    >
                      {next === 'preparing' && 'Iniciar Preparación'}
                      {next === 'ready' && 'Marcar Listo'}
                      {next === 'delivered' && 'Marcar Entregado'}
                    </button>
                  )}
                  {order.status === 'pending' && order.orderType === 'domicilio' && (
                    <button
                      onClick={() => updateStatus(order.id, 'out_for_delivery')}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600"
                    >
                      Salir a Entregar
                    </button>
                  )}
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <button
                      onClick={() => updateStatus(order.id, 'cancelled')}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-200"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-xl">
            No hay pedidos {filter !== 'all' ? `con estado "${STATUS_LABELS[filter]}"` : ''}
          </p>
        </div>
      )}
    </div>
  )
}
