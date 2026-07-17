import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../../services/api'
import { FiGrid, FiClipboard, FiCalendar, FiDollarSign } from 'react-icons/fi'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, reservations: 0, revenue: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, resRes] = await Promise.all([
          api.get('/orders'),
          api.get('/reservations'),
        ])
        const orders = ordersRes.data.data
        const reservations = resRes.data.data
        const revenue = orders.reduce((sum: number, o: any) => sum + o.total, 0)
        setStats({
          orders: orders.filter((o: any) => o.status !== 'cancelled').length,
          reservations: reservations.filter((r: any) => r.status !== 'cancelled').length,
          revenue,
        })
      } catch {}
    }
    fetchStats()
  }, [])

  const shortcuts = [
    { to: '/admin/menu', label: 'Gestionar Menú', desc: 'Agregar, editar o eliminar platillos', icon: FiGrid, color: 'bg-primary' },
    { to: '/admin/pedidos', label: 'Ver Pedidos', desc: 'Administrar pedidos en tiempo real', icon: FiClipboard, color: 'bg-blue-500' },
    { to: '/admin/reservas', label: 'Reservas', desc: 'Ver y confirmar reservaciones', icon: FiCalendar, color: 'bg-green-500' },
  ]

  return (
    <section className="section-padding pt-28 bg-gray-50 min-h-screen">
      <div className="container-main">
        <h1 className="text-3xl font-display mb-8">Panel de Administración</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-md flex items-center gap-4">
            <div className="bg-blue-500 w-14 h-14 rounded-xl flex items-center justify-center text-white"><FiClipboard size={24} /></div>
            <div>
              <div className="text-3xl font-bold">{stats.orders}</div>
              <div className="text-gray-500 text-sm">Pedidos Totales</div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 shadow-md flex items-center gap-4">
            <div className="bg-green-500 w-14 h-14 rounded-xl flex items-center justify-center text-white"><FiCalendar size={24} /></div>
            <div>
              <div className="text-3xl font-bold">{stats.reservations}</div>
              <div className="text-gray-500 text-sm">Reservas</div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 shadow-md flex items-center gap-4">
            <div className="bg-purple-500 w-14 h-14 rounded-xl flex items-center justify-center text-white"><FiDollarSign size={24} /></div>
            <div>
              <div className="text-3xl font-bold">${stats.revenue.toLocaleString()}</div>
              <div className="text-gray-500 text-sm">Ingresos</div>
            </div>
          </motion.div>
        </div>

        <h2 className="text-xl font-display mb-6">Accesos Rápidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shortcuts.map((s, i) => (
            <Link key={i} to={s.to}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="card p-6 hover:shadow-xl">
                <div className={`${s.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4`}><s.icon size={22} /></div>
                <h3 className="font-display text-xl mb-2">{s.label}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
