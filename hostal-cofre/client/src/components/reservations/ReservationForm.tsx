import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Table } from '../../types'
import { api, whatsappService } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { FiCalendar, FiClock, FiUsers, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'

const TIMES = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00']

export default function ReservationForm() {
  const { user } = useAuth()
  const [tables, setTables] = useState<Table[]>([])
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    date: '',
    time: '',
    guests: 2,
    notes: '',
  })
  const [selectedTable, setSelectedTable] = useState<string>('')
  const [step, setStep] = useState<'form' | 'table' | 'confirm'>('form')

  useEffect(() => {
    api.get('/reservations/tables')
      .then(res => setTables(res.data.data))
      .catch(() => {})
  }, [])

  const filteredTables = tables.filter(t => t.capacity >= form.guests)

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.date || !form.time || !selectedTable) {
      toast.error('Completa todos los campos obligatorios')
      return
    }

    try {
      await api.post('/reservations', {
        name: form.name,
        phone: form.phone,
        email: form.email,
        date: form.date,
        time: form.time,
        guests: form.guests,
        tableId: selectedTable,
        notes: form.notes,
      })

      const table = tables.find(t => t.id === selectedTable)
      const msg = `Nombre: ${form.name}\nTel: ${form.phone}\nFecha: ${form.date}\nHora: ${form.time}\nPersonas: ${form.guests}\nMesa: #${table?.number} (${table?.zone})\nNotas: ${form.notes || 'Ninguna'}`
      whatsappService.sendReservation('573001234567', msg)

      toast.success('¡Reserva creada y enviada por WhatsApp!')
      setStep('form')
      setForm({ name: '', phone: '', email: '', date: '', time: '', guests: 2, notes: '' })
      setSelectedTable('')
    } catch {
      toast.error('Error al crear reserva')
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {step === 'form' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre *</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Tu nombre" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono *</label>
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="Tu teléfono" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="Tu email" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha *</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input-field" min={new Date().toISOString().split('T')[0]} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hora *</label>
              <select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="input-field">
                <option value="">Seleccionar hora</option>
                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Personas *</label>
              <div className="flex items-center gap-4">
                <button onClick={() => setForm({ ...form, guests: Math.max(1, form.guests - 1) })} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold hover:bg-gray-200">-</button>
                <span className="text-2xl font-bold w-8 text-center">{form.guests}</span>
                <button onClick={() => setForm({ ...form, guests: Math.min(10, form.guests + 1) })} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold hover:bg-gray-200">+</button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notas especiales</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="input-field h-24 resize-none" placeholder="Alergias, celebraciones, preferencias..." />
          </div>
          <button onClick={() => { if (form.name && form.phone && form.date && form.time) setStep('table'); else toast.error('Completa nombre, teléfono, fecha y hora') }} className="btn-primary w-full text-lg">
            Seleccionar Mesa
          </button>
        </motion.div>
      )}

      {step === 'table' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 className="text-2xl font-display mb-6">Elige tu Mesa</h3>
          <p className="text-gray-500 mb-6">Mesa para {form.guests} personas • {form.date} a las {form.time}</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {filteredTables.map(table => (
              <button
                key={table.id}
                onClick={() => setSelectedTable(table.id)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  selectedTable === table.id
                    ? 'border-primary bg-primary/5 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                <div className="text-3xl mb-2">🪑</div>
                <div className="font-bold">Mesa {table.number}</div>
                <div className="text-sm text-gray-500">{table.capacity} personas</div>
                <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                  table.zone === 'interior' ? 'bg-blue-100 text-blue-700' :
                  table.zone === 'exterior' ? 'bg-green-100 text-green-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {table.zone}
                </span>
              </button>
            ))}
          </div>

          {filteredTables.length === 0 && (
            <p className="text-center text-gray-500 py-8">No hay mesas disponibles para {form.guests} personas en este horario</p>
          )}

          <div className="flex gap-4">
            <button onClick={() => setStep('form')} className="btn-outline flex-1">Volver</button>
            <button onClick={() => { if (selectedTable) setStep('confirm'); else toast.error('Selecciona una mesa') }} className="btn-primary flex-1">
              Confirmar Reserva
            </button>
          </div>
        </motion.div>
      )}

      {step === 'confirm' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="text-primary" size={40} />
          </div>
          <h3 className="text-3xl font-display mb-4">Resumen de tu Reserva</h3>
          <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-3 mb-8 max-w-md mx-auto">
            <p><strong>Nombre:</strong> {form.name}</p>
            <p><strong>Fecha:</strong> {form.date}</p>
            <p><strong>Hora:</strong> {form.time}</p>
            <p><strong>Personas:</strong> {form.guests}</p>
            <p><strong>Mesa:</strong> #{tables.find(t => t.id === selectedTable)?.number}</p>
            {form.notes && <p><strong>Notas:</strong> {form.notes}</p>}
          </div>
          <p className="text-gray-500 mb-6">Se enviará tu reserva por WhatsApp para confirmación</p>
          <div className="flex gap-4 max-w-md mx-auto">
            <button onClick={() => setStep('table')} className="btn-outline flex-1">Volver</button>
            <button onClick={handleSubmit} className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Enviar por WhatsApp
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
