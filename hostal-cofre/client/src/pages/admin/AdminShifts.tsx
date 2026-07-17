import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shift, ShiftPeriod, SHIFT_PERIOD_LABELS, Order } from '../../types'
import { api } from '../../services/api'
import { formatCOP } from '../../utils/format'
import { FiLock, FiUnlock, FiClock, FiUser, FiX, FiBarChart2 } from 'react-icons/fi'
import { Button, Input } from '../../components/ui'
import toast from 'react-hot-toast'

interface ShiftSummary extends Shift {
  orders: Order[]
  breakdown: {
    paymentMethods: Record<string, number>
    orderTypes: Record<string, number>
  }
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: 'Efectivo',
  nequi: 'Nequi',
  daviplata: 'Daviplata',
  wompi: 'Wompi',
}

const ORDER_TYPE_LABELS: Record<string, string> = {
  domicilio: 'Domicilio',
  tienda: 'Tienda/POS',
  mesa: 'Mesa',
}

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

  const [summaryData, setSummaryData] = useState<ShiftSummary | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(false)

  const viewSummary = async (shiftId: string) => {
    setSummaryLoading(true)
    try {
      const res = await api.get(`/shifts/${shiftId}/summary`)
      setSummaryData(res.data.data)
    } catch {
      toast.error('Error al cargar el resumen del turno')
    } finally {
      setSummaryLoading(false)
    }
  }

  const fetchShifts = async () => {
    try {
      setLoading(true)
      const [shiftsRes, currentRes] = await Promise.all([
        api.get('/shifts'),
        api.get('/shifts/current'),
      ])
      setShifts(shiftsRes.data.data)
      setActiveShifts(
        Array.isArray(currentRes.data.data)
          ? currentRes.data.data
          : currentRes.data.data
            ? [currentRes.data.data]
            : [],
      )
    } catch {
      toast.error('Error al cargar turnos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShifts()
  }, [])

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
          <Button size="sm" onClick={() => setShowOpenModal(true)}>
            <FiUnlock size={16} /> Abrir Turno
          </Button>
        </div>

        {activeShifts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-display mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Turnos Activos ({activeShifts.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeShifts.map((shift) => {
                const period = SHIFT_PERIOD_LABELS[shift.shiftPeriod]
                return (
                  <motion.div
                    key={shift.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white">
                          <FiUser size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-green-800">{shift.cashierName}</p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${period.color}`}
                          >
                            {period.label}
                          </span>
                        </div>
                      </div>
                      <Button variant="danger" size="sm" onClick={() => setClosingShift(shift)}>
                        <FiLock size={12} /> Cerrar
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-white rounded-lg p-2 text-center">
                        <div className="text-lg font-bold">{formatCOP(shift.totalSales)}</div>
                        <div className="text-xs text-gray-500">Ventas</div>
                      </div>
                      <div className="bg-white rounded-lg p-2 text-center">
                        <div className="text-lg font-bold">{shift.totalOrders}</div>
                        <div className="text-xs text-gray-500">Pedidos</div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-2 mb-2">
                      <div className="text-xs font-semibold text-gray-600 mb-1">
                        Ventas por canal
                      </div>
                      {(['domicilio', 'tienda', 'mesa'] as const).map((type) => (
                        <div key={type} className="flex justify-between text-xs py-0.5">
                          <span className="text-gray-500">{ORDER_TYPE_LABELS[type]}</span>
                          <span className="font-semibold">
                            {formatCOP(shift.salesByType?.[type] || 0)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Efectivo: {formatCOP(shift.cashReceived)}</span>
                      <span>Digital: {formatCOP(shift.digitalTotal)}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <FiClock size={10} />{' '}
                      {new Date(shift.openedAt).toLocaleTimeString('es-CO', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
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
            <p className="text-yellow-600 text-sm">
              Abre un turno para comenzar a registrar ventas
            </p>
          </div>
        )}

        <h2 className="text-lg font-display mb-3">Historial de Turnos</h2>
        {loading ? (
          <div className="text-center py-12 text-gray-400">Cargando...</div>
        ) : (
          <div className="space-y-2">
            {shifts
              .filter((s) => s.status === 'closed')
              .map((shift) => {
                const period = SHIFT_PERIOD_LABELS[shift.shiftPeriod]
                return (
                  <div
                    key={shift.id}
                    className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-400 flex items-center justify-center text-white">
                        <FiLock size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">{shift.cashierName}</p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${period.color}`}
                          >
                            {period.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(shift.openedAt).toLocaleDateString('es-CO')} •
                          {new Date(shift.openedAt).toLocaleTimeString('es-CO', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {shift.closedAt &&
                            ` - ${new Date(shift.closedAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{formatCOP(shift.totalSales)}</p>
                      <p className="text-xs text-gray-500">{shift.totalOrders} pedidos</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="mt-1 !py-1"
                        onClick={() => void viewSummary(shift.id)}
                      >
                        <FiBarChart2 size={12} /> Resumen
                      </Button>
                    </div>
                  </div>
                )
              })}
            {shifts.filter((s) => s.status === 'closed').length === 0 && (
              <div className="text-center py-12 text-gray-400">No hay turnos cerrados</div>
            )}
          </div>
        )}
      </div>

      {showOpenModal && (
        <div className="modal-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-content"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display">Abrir Turno</h2>
              <button
                onClick={() => setShowOpenModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <Input
                label="Nombre del cajero/encargado *"
                type="text"
                value={cashierName}
                onChange={(e) => setCashierName(e.target.value)}
                placeholder="Ej: María López"
              />

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Turno *</label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    Object.entries(SHIFT_PERIOD_LABELS) as [
                      ShiftPeriod,
                      (typeof SHIFT_PERIOD_LABELS)[ShiftPeriod],
                    ][]
                  ).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setShiftPeriod(key)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        shiftPeriod === key
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-bold text-sm">{val.label}</div>
                      <div className="text-xs text-gray-500">{val.hours}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Efectivo en caja inicial *"
                type="number"
                value={openingCash}
                onChange={(e) => setOpeningCash(e.target.value)}
                placeholder="0"
                min="0"
                className="text-xl font-bold text-center"
              />

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Notas (opcional)
                </label>
                <textarea
                  value={openNotes}
                  onChange={(e) => setOpenNotes(e.target.value)}
                  className="input-field h-16 resize-none text-sm"
                  placeholder="Observaciones del turno..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setShowOpenModal(false)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={openShift}>
                Abrir Turno
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {closingShift && (
        <div className="modal-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-content"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-display">Cerrar Turno</h2>
              <button
                onClick={() => setClosingShift(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <FiUser size={16} className="text-gray-500" />
                <span className="font-bold">{closingShift.cashierName}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${SHIFT_PERIOD_LABELS[closingShift.shiftPeriod].color}`}
                >
                  {SHIFT_PERIOD_LABELS[closingShift.shiftPeriod].label}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Efectivo inicial:</span>
                  <span className="font-bold">{formatCOP(closingShift.openingCash)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ventas totales:</span>
                  <span className="font-bold">{formatCOP(closingShift.totalSales)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Efectivo recibido:</span>
                  <span className="font-bold">{formatCOP(closingShift.cashReceived)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="text-gray-600 font-semibold">Esperado en caja:</span>
                  <span className="font-bold text-primary">
                    {formatCOP(closingShift.openingCash + closingShift.cashReceived)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-4">
              <Input
                label="Conteo de efectivo en caja *"
                type="number"
                value={closingCash}
                onChange={(e) => setClosingCash(e.target.value)}
                placeholder="0"
                min="0"
                className="text-xl font-bold text-center"
              />
              {parseFloat(closingCash) > 0 && (
                <div
                  className={`text-center p-3 rounded-lg ${parseFloat(closingCash) >= closingShift.openingCash + closingShift.cashReceived ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                >
                  <p className="text-sm font-semibold">
                    Diferencia:{' '}
                    {parseFloat(closingCash) >= closingShift.openingCash + closingShift.cashReceived
                      ? '+'
                      : ''}
                    {formatCOP(
                      parseFloat(closingCash) -
                        (closingShift.openingCash + closingShift.cashReceived),
                    )}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Notas de cierre (opcional)
                </label>
                <textarea
                  value={closeNotes}
                  onChange={(e) => setCloseNotes(e.target.value)}
                  className="input-field h-16 resize-none text-sm"
                  placeholder="Observaciones del cierre..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setClosingShift(null)}>
                Cancelar
              </Button>
              <Button variant="danger" className="flex-1" onClick={closeShift}>
                Cerrar Turno
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {summaryData && (
        <div className="modal-overlay" onClick={() => setSummaryData(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-content max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display">Resumen del Turno</h2>
              <button
                onClick={() => setSummaryData(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <FiUser size={16} className="text-gray-500" />
                <span className="font-bold">{summaryData.cashierName}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${SHIFT_PERIOD_LABELS[summaryData.shiftPeriod].color}`}
                >
                  {SHIFT_PERIOD_LABELS[summaryData.shiftPeriod].label}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Ventas totales:</span>
                <span className="font-bold">{formatCOP(summaryData.totalSales)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pedidos:</span>
                <span className="font-bold">{summaryData.totalOrders}</span>
              </div>
            </div>

            {summaryLoading ? (
              <div className="text-center py-8 text-gray-400">Cargando detalle...</div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Ventas por método de pago
                  </h3>
                  <div className="space-y-1.5">
                    {Object.entries(summaryData.breakdown.paymentMethods).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between text-sm bg-gray-50 rounded-lg px-3 py-2"
                      >
                        <span className="text-gray-600">{PAYMENT_METHOD_LABELS[key] || key}</span>
                        <span className="font-bold">{formatCOP(value)}</span>
                      </div>
                    ))}
                    {Object.keys(summaryData.breakdown.paymentMethods).length === 0 && (
                      <p className="text-gray-400 text-sm text-center py-2">
                        Sin pagos registrados
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Pedidos por tipo</h3>
                  <div className="space-y-1.5">
                    {Object.entries(summaryData.breakdown.orderTypes).map(([key, count]) => (
                      <div
                        key={key}
                        className="flex justify-between text-sm bg-gray-50 rounded-lg px-3 py-2"
                      >
                        <span className="text-gray-600">{ORDER_TYPE_LABELS[key] || key}</span>
                        <span className="font-bold">{count}</span>
                      </div>
                    ))}
                    {Object.keys(summaryData.breakdown.orderTypes).length === 0 && (
                      <p className="text-gray-400 text-sm text-center py-2">
                        Sin pedidos registrados
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5">
              <Button variant="ghost" className="w-full" onClick={() => setSummaryData(null)}>
                Cerrar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
