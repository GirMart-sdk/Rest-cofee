import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SystemMetrics } from '../../types'
import { api, getAccessToken } from '../../services/api'
import { formatCOP } from '../../utils/format'
import {
  FiGrid,
  FiClipboard,
  FiCalendar,
  FiDollarSign,
  FiShoppingCart,
  FiUsers,
  FiBarChart2,
  FiActivity,
  FiRadio,
} from 'react-icons/fi'
import toast from 'react-hot-toast'

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    orders: 0,
    reservations: 0,
    todaySales: 0,
    weekSales: 0,
  })
  const [health, setHealth] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [liveIndicator, setLiveIndicator] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [reportRes, weeklyRes, resRes] = await Promise.all([
          api.get('/reports/daily'),
          api.get('/reports/weekly'),
          api.get('/reservations'),
        ])
        const report = reportRes.data.data
        const weekly = weeklyRes.data.data
        const reservations = resRes.data.data
        setStats({
          orders: report.summary.totalOrders,
          reservations: reservations.filter((r: any) => r.status !== 'cancelled').length,
          todaySales: report.summary.totalSales,
          weekSales: weekly.totalSales || 0,
        })
      } catch {
        toast.error('Error al cargar estadísticas')
      }
    }
    fetchStats()
  }, [])

  useEffect(() => {
    const fetchSystem = async () => {
      try {
        const [healthRes, metricsRes] = await Promise.all([api.get('/health'), api.get('/metrics')])
        setHealth(healthRes.data?.status ?? null)
        setMetrics(metricsRes.data?.data ?? null)
      } catch {
        /* sin datos de sistema: se oculta la sección */
      }
    }
    fetchSystem()
  }, [])

  useEffect(() => {
    const token = getAccessToken()
    if (!token) return

    const eventSource = new EventSource(`/api/orders/events?token=${token}`)

    eventSource.addEventListener('order.created', () => {
      setLiveIndicator(true)
      setStats((prev) => ({ ...prev, orders: prev.orders + 1 }))
      toast.success('Nuevo pedido recibido')
      setTimeout(() => setLiveIndicator(false), 2000)
    })

    eventSource.addEventListener('order.updated', () => {
      setLiveIndicator(true)
      setTimeout(() => setLiveIndicator(false), 2000)
    })

    eventSource.onerror = () => {
      eventSource.close()
    }

    return () => eventSource.close()
  }, [])

  const shortcuts = [
    {
      to: '/admin/pos',
      label: 'Punto de Venta',
      desc: 'Registrar ventas rápidas',
      icon: FiShoppingCart,
      color: 'bg-primary',
    },
    {
      to: '/admin/pedidos',
      label: 'Pedidos',
      desc: 'Administrar pedidos en tiempo real',
      icon: FiClipboard,
      color: 'bg-blue-500',
    },
    {
      to: '/admin/mesas',
      label: 'Mesas',
      desc: 'Gestionar mesas y códigos QR',
      icon: FiGrid,
      color: 'bg-green-500',
    },
    {
      to: '/admin/menu',
      label: 'Menú',
      desc: 'Agregar, editar o eliminar platillos',
      icon: FiGrid,
      color: 'bg-orange-500',
    },
    {
      to: '/admin/turnos',
      label: 'Turnos',
      desc: 'Abrir/cerrar caja y control de efectivo',
      icon: FiUsers,
      color: 'bg-purple-500',
    },
    {
      to: '/admin/reportes',
      label: 'Reportes',
      desc: 'Ventas diarias y estadísticas',
      icon: FiBarChart2,
      color: 'bg-pink-500',
    },
    {
      to: '/admin/reservas',
      label: 'Reservas',
      desc: 'Ver y confirmar reservaciones',
      icon: FiCalendar,
      color: 'bg-teal-500',
    },
    {
      to: '/admin/monitoreo',
      label: 'Monitoreo',
      desc: 'Health y métricas del servidor',
      icon: FiActivity,
      color: 'bg-red-500',
    },
  ]

  return (
    <div className="container-main">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-display">Panel de Administración</h1>
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <FiRadio
            className={`w-3 h-3 ${liveIndicator ? 'text-green-500 animate-pulse' : 'text-gray-400'}`}
          />
          <span className={liveIndicator ? 'text-green-600' : 'text-gray-400'}>LIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          {
            label: 'Ventas Hoy',
            value: formatCOP(stats.todaySales),
            icon: FiDollarSign,
            color: 'text-green-600',
          },
          {
            label: 'Pedidos',
            value: stats.orders.toString(),
            icon: FiShoppingCart,
            color: 'text-blue-600',
          },
          {
            label: 'Reservas',
            value: stats.reservations.toString(),
            icon: FiCalendar,
            color: 'text-purple-600',
          },
          {
            label: 'Ventas Semana',
            value: formatCOP(stats.weekSales),
            icon: FiBarChart2,
            color: 'text-pink-600',
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-sm">{card.label}</span>
              <card.icon size={18} className={card.color} />
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="text-xl font-display mb-6">Accesos Rápidos</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {shortcuts.map((s, i) => (
          <Link key={i} to={s.to}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="card p-5 hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div
                className={`${s.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3`}
              >
                <s.icon size={20} />
              </div>
              <h3 className="font-display text-lg mb-1">{s.label}</h3>
              <p className="text-gray-500 text-xs">{s.desc}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      {metrics && (
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-display mb-4">Estado del Servidor</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Estado:</span>
              <span
                className={`ml-2 font-medium ${health === 'ok' ? 'text-green-600' : 'text-red-600'}`}
              >
                {health === 'ok' ? 'Activo' : 'Error'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Uptime:</span>
              <span className="ml-2 font-medium">{formatUptime(metrics.uptimeSeconds)}</span>
            </div>
            <div>
              <span className="text-gray-500">Requests:</span>
              <span className="ml-2 font-medium">{metrics.totalRequests.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-500">Errores:</span>
              <span
                className={`ml-2 font-medium ${metrics.totalErrors > 0 ? 'text-red-600' : 'text-green-600'}`}
              >
                {metrics.totalErrors}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
