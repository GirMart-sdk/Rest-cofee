import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shift, ShiftPeriod, SHIFT_PERIOD_LABELS } from '../../types'
import { api } from '../../services/api'
import { FiLock, FiUnlock, FiClock, FiUser, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminShifts() {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [activeShifts, setActiveShifts] = useState<Shift[]>([])
  const [loading, setLoading] = useState(true)
  const [showOpenModal, setShowOpenModal] = useState(false)
  const [closingShift, setClosingShift] = useState<Shift | null>(null)

  const [cashierName, setCashierName] = useState('')
  const [shiftPeriod, setShiftPeriod] = useState<ShiftPeriod>('manana')
  const [openingCash, setOpeningCash] = useState('')
  const [openNotes, setOpenNotes] = useState('')

  const [closingCash, setClosingCash] = useState('')
  const [closeNotes, setCloseNotes] = useState('')

  const fetchShifts = async () => {
    try {
      setLoading(true)
      const [shiftsRes, currentRes] = await Promise.all([
        api.get('/shifts'),
        api.get('/shifts/current'),
      ])
      setShifts(shiftsRes.data.data)
      setActiveShifts(Array.isArray(currentRes.data.data) ? currentRes.data.data : currentRes.data.data ? [currentRes.data.data] : [])
    } catch {
      toast.error('Error al cargar turnos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchShifts() }, [])

  const openShift = async () => {
    if (!cashierName || !openingCash) {
      toast.error('Nombre y efectivo inicial son requeridos')
      return
    }
    try {
      await api.post('/shifts/open', {
        cashierName,
        shiftPeriod,
        openingCash: parseFloat(openingCash),
        notes: openNotes || undefined,
      })
      toast.success(`Turno abierto para ${cashierName}`)
      setShowOpenModal(false)
      setCashierName('')
      setOpeningCash('')
      setOpenNotes('')
      fetchShifts()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error al abrir turno')
    }
  }

  const closeShift = async () => {
    if (!closingShift || !closingCash) return
    try {
      await api.patch(`/shifts/${closingShift.id}/close`, {
        closingCash: parseFloat(closingCash),
        notes: closeNotes || undefined,
      })
      toast.success(`Turno de ${closingShift.cashierName} cerrado`)
      setClosingShift(null)
      setClosingCash('')
      setCloseNotes('')
      fetchShifts()
    } catch {
      toast.error('Error al cerrar turno')
    }
  }

  return (
    <>
      <div className="container-main">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-display">Turnos</h1>
          <button onClick={() => setShowOpenModal(true)} className="btn-primary text-sm px-4 py-2 flex items-center gap-1">
            <FiUnlock size={16} /> Abrir Turno
          </button>
        </div>

        {activeShifts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-display mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Turnos Activos ({activeShifts.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeShifts.map(shift => {
                const period = SHIFT_PERIOD_LABELS[shift.shiftPeriod]
                return (
                  <motion.div key={shift.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white">
                          <FiUser size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-green-800">{shift.cashierName}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${period.color}`}>{period.label}</span>
                        </div>
                      </div>
                      <button onClick={() => setClosingShift(shift)} className="px-3 py-1.5 bg-accent text-white rounded-lg text-xs font-semibold hover:bg-accent-dark flex items-center gap-1">
                        <FiLock size={12} /> Cerrar
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-white rounded-lg p-2 text-center">
                        <div className="text-lg font-bold">${shift.totalSales.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Ventas</div>
                      </div>
                      <div className="bg-white rounded-lg p-2 text-center">
                        <div className="text-lg font-bold">{shift.totalOrders}</div>
                        <div className="text-xs text-gray-500">Pedidos</div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Efectivo: ${shift.cashReceived.toLocaleString()}</span>
                      <span>Digital: ${shift.digitalTotal.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <FiClock size={10} /> {new Date(shift.openedAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {activeShifts.length === 0 && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-center">
            <p className="text-yellow-700 font-semibold">No hay turnos abiertos</p>
            <p className="text-yellow-600 text-sm">Abre un turno para comenzar a registrar ventas</p>
          </div>
        )}

        <h2 className="text-lg font-display mb-3">Historial de Turnos</h2>
        {loading ? (
          <div className="text-center py-12 text-gray-400">Cargando...</div>
        ) : (
          <div className="space-y-2">
            {shifts.filter(s => s.status === 'closed').map(shift => {
              const period = SHIFT_PERIOD_LABELS[shift.shiftPeriod]
              return (
                <div key={shift.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-400 flex items-center justify-center text-white">
                      <FiLock size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{shift.cashierName}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${period.color}`}>{period.label}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(shift.openedAt).toLocaleDateString('es-CO')} •
                        {new Date(shift.openedAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                        {shift.closedAt && ` - ${new Date(shift.closedAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">${shift.totalSales.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{shift.totalOrders} pedidos</p>
                  </div>
                </div>
              )
            })}
            {shifts.filter(s => s.status === 'closed').length === 0 && (
              <div className="text-center py-12 text-gray-400">No hay turnos cerrados</div>
            )}
          </div>
        )}
      </div>

      {showOpenModal && (
        <div className="modal-overlay">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="modal-content">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display">Abrir Turno</h2>
              <button onClick={() => setShowOpenModal(false)} className="text-gray-400 hover:text-gray-600"><FiX size={24} /></button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Nombre del cajero/encargado *</label>
                <input type="text" value={cashierName} onChange={e => setCashierName(e.target.value)} className="input-field" placeholder="Ej: María López" />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Turno *</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(SHIFT_PERIOD_LABELS) as [ShiftPeriod, typeof SHIFT_PERIOD_LABELS[ShiftPeriod]][]).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setShiftPeriod(key)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        shiftPeriod === key ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-bold text-sm">{val.label}</div>
                      <div className="text-xs text-gray-500">{val.hours}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Efectivo en caja inicial *</label>
                <input type="number" value={openingCash} onChange={e => setOpeningCash(e.target.value)} className="input-field text-xl font-bold text-center" placeholder="0" min="0" />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Notas (opcional)</label>
                <textarea value={openNotes} onChange={e => setOpenNotes(e.target.value)} className="input-field h-16 resize-none text-sm" placeholder="Observaciones del turno..." />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowOpenModal(false)} className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold">Cancelar</button>
              <button onClick={openShift} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark">Abrir Turno</button>
            </div>
          </motion.div>
        </div>
      )}

      {closingShift && (
        <div className="modal-overlay">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="modal-content">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-display">Cerrar Turno</h2>
              <button onClick={() => setClosingShift(null)} className="text-gray-400 hover:text-gray-600"><FiX size={24} /></button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <FiUser size={16} className="text-gray-500" />
                <span className="font-bold">{closingShift.cashierName}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${SHIFT_PERIOD_LABELS[closingShift.shiftPeriod].color}`}>
                  {SHIFT_PERIOD_LABELS[closingShift.shiftPeriod].label}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Efectivo inicial:</span><span className="font-bold">${closingShift.openingCash.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Ventas totales:</span><span className="font-bold">${closingShift.totalSales.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Efectivo recibido:</span><span className="font-bold">${closingShift.cashReceived.toLocaleString()}</span></div>
                <div className="border-t pt-2 flex justify-between"><span className="text-gray-600 font-semibold">Esperado en caja:</span><span className="font-bold text-primary">${(closingShift.openingCash + closingShift.cashReceived).toLocaleString()}</span></div>
              </div>
            </div>

            <div className="space-y-4 mb-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Conteo de efectivo en caja *</label>
                <input type="number" value={closingCash} onChange={e => setClosingCash(e.target.value)} className="input-field text-xl font-bold text-center" placeholder="0" min="0" />
              </div>
              {parseFloat(closingCash) > 0 && (
                <div className={`text-center p-3 rounded-lg ${parseFloat(closingCash) >= (closingShift.openingCash + closingShift.cashReceived) ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  <p className="text-sm font-semibold">
                    Diferencia: {parseFloat(closingCash) >= (closingShift.openingCash + closingShift.cashReceived) ? '+' : ''}${(parseFloat(closingCash) - (closingShift.openingCash + closingShift.cashReceived)).toFixed(2)}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Notas de cierre (opcional)</label>
                <textarea value={closeNotes} onChange={e => setCloseNotes(e.target.value)} className="input-field h-16 resize-none text-sm" placeholder="Observaciones del cierre..." />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setClosingShift(null)} className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold">Cancelar</button>
              <button onClick={closeShift} className="flex-1 py-3 bg-accent text-white rounded-xl font-bold hover:bg-accent-dark">Cerrar Turno</button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
