import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Reservation } from '../../types'
import { api } from '../../services/api'
import { FiRefreshCw } from 'react-icons/fi'
import toast from 'react-hot-toast'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
}

export default function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const res = await api.get('/reservations')
      setReservations(res.data.data)
    } catch {
      toast.error('Error al cargar reservas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReservations() }, [])

  const filtered = filter === 'all' ? reservations : reservations.filter(r => r.status === filter)

  const updateStatus = async (id: string, status: Reservation['status']) => {
    try {
      await api.patch(`/reservations/${id}/status`, { status })
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r))
      toast.success(`Reserva ${STATUS_LABELS[status || 'pending'].toLowerCase()}`)
    } catch {
      toast.error('Error al actualizar')
    }
  }

  return (
    <div className="container-main">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display">Gestionar Reservas</h1>
          <button onClick={fetchReservations} className="btn-outline flex items-center gap-2"><FiRefreshCw /> Actualizar</button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {['all', 'pending', 'confirmed', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === f ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
              {f === 'all' ? 'Todas' : STATUS_LABELS[f]} ({f === 'all' ? reservations.length : reservations.filter(r => r.status === f).length})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <FiRefreshCw className="animate-spin mx-auto text-4xl mb-4" />
            <p>Cargando reservas...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600">Cliente</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600">Fecha/Hora</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600">Personas</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600">Mesa</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600">Estado</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map(res => (
                    <motion.tr key={res.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold">{res.name}</div>
                        <div className="text-sm text-gray-500">{res.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>{res.date}</div>
                        <div className="text-sm text-gray-500">{res.time}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold">{res.guests}</td>
                      <td className="px-6 py-4">{res.tableId ? `Mesa ${res.tableId}` : '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[res.status || 'pending']}`}>
                          {STATUS_LABELS[res.status || 'pending']}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {res.status === 'pending' && res.id && (
                            <button onClick={() => updateStatus(res.id!, 'confirmed')} className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600">Confirmar</button>
                          )}
                          {res.status !== 'cancelled' && res.id && (
                            <button onClick={() => updateStatus(res.id!, 'cancelled')} className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200">Cancelar</button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-xl">No hay reservas {filter !== 'all' ? `con estado "${STATUS_LABELS[filter]}"` : ''}</p>
          </div>
        )}
    </div>
  )
}
