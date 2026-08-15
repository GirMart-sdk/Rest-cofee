import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../../services/api'
import {
  FiGrid,
  FiClipboard,
  FiCalendar,
  FiDollarSign,
  FiShoppingCart,
  FiUsers,
  FiBarChart2,
} from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, reservations: 0, revenue: 0, todaySales: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [reportRes, resRes] = await Promise.all([
          api.get('/reports/daily'),
          api.get('/reservations'),
        ])
        const report = reportRes.data.data
        const reservations = resRes.data.data
        setStats({
          orders: report.summary.totalOrders,
          reservations: reservations.filter((r: any) => r.status !== 'cancelled').length,
          revenue: report.summary.totalSales,
          todaySales: report.summary.totalSales,
        })
      } catch {
        toast.error('Error al cargar estadísticas') /* stats remain default */
      }
    }
    fetchStats()
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
  ]

  return (
    <div className="container-main">
      <h1 className="text-3xl font-display mb-8">Panel de Administración</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 shadow-md"
        >
          <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3">
            <FiDollarSign size={18} />
          </div>
          <div className="text-2xl font-bold">${stats.todaySales.toLocaleString()}</div>
          <div className="text-gray-500 text-sm">Ventas Hoy</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-md"
        >
          <div className="bg-blue-500 w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3">
            <FiClipboard size={18} />
          </div>
          <div className="text-2xl font-bold">{stats.orders}</div>
          <div className="text-gray-500 text-sm">Pedidos Totales</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5 shadow-md"
        >
          <div className="bg-green-500 w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3">
            <FiCalendar size={18} />
          </div>
          <div className="text-2xl font-bold">{stats.reservations}</div>
          <div className="text-gray-500 text-sm">Reservas</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 shadow-md"
        >
          <div className="bg-purple-500 w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3">
            <FiDollarSign size={18} />
          </div>
          <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
          <div className="text-gray-500 text-sm">Ingresos Totales</div>
        </motion.div>
      </div>

      <h2 className="text-xl font-display mb-6">Accesos Rápidos</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {shortcuts.map((s, i) => (
          <Link key={i} to={s.to}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="card p-5 hover:shadow-xl transition-shadow"
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
    </div>
  )
}
