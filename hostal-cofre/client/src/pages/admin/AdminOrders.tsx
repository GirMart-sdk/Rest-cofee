import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Order } from '../../types'
import { api } from '../../services/api'
import { FiRefreshCw } from 'react-icons/fi'
import toast from 'react-hot-toast'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  preparing: 'bg-blue-100 text-blue-700',
  ready: 'bg-green-100 text-green-700',
  delivered: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  preparing: 'Preparando',
  ready: 'Listo',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await api.get('/orders')
      setOrders(res.data.data)
    } catch {
      toast.error('Error al cargar pedidos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  const updateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus })
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
      toast.success(`Estado cambiado a ${STATUS_LABELS[newStatus]}`)
    } catch {
      toast.error('Error al actualizar estado')
    }
  }

  return (
    <section className="section-padding pt-28 bg-gray-50 min-h-screen">
      <div className="container-main">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display">Gestionar Pedidos</h1>
          <button onClick={fetchOrders} className="btn-outline flex items-center gap-2"><FiRefreshCw /> Actualizar</button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {['all', 'pending', 'preparing', 'ready', 'delivered'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === f ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
              {f === 'all' ? 'Todos' : STATUS_LABELS[f]} {f !== 'all' && `(${orders.filter(o => o.status === f).length})`}
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
            {filtered.map(order => (
              <motion.div key={order.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-display text-xl">{order.id.slice(0, 8)}...</h3>
                    <p className="text-gray-500 text-sm">{order.customerName} • {order.customerPhone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.status]}`}>{STATUS_LABELS[order.status]}</span>
                    <span className="text-xl font-bold text-primary">${order.total}</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-4">
                  {order.items.map((ci, i) => (
                    <div key={i} className="flex justify-between text-sm py-1">
                      <span>{ci.quantity}x {ci.menuItem?.name || 'Platillo'}</span>
                      <span>${ci.menuItem?.price * ci.quantity || 0}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {order.status === 'pending' && (
                    <button onClick={() => updateStatus(order.id, 'preparing')} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600">Iniciar Preparación</button>
                  )}
                  {order.status === 'preparing' && (
                    <button onClick={() => updateStatus(order.id, 'ready')} className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600">Marcar Listo</button>
                  )}
                  {order.status === 'ready' && (
                    <button onClick={() => updateStatus(order.id, 'delivered')} className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-semibold hover:bg-gray-600">Marcar Entregado</button>
                  )}
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <button onClick={() => updateStatus(order.id, 'cancelled')} className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-200">Cancelar</button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-xl">No hay pedidos {filter !== 'all' ? `con estado "${STATUS_LABELS[filter]}"` : ''}</p>
          </div>
        )}
      </div>
    </section>
  )
}
