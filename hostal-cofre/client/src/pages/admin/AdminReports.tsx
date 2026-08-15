import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DailyReport, SHIFT_PERIOD_LABELS } from '../../types'
import { api } from '../../services/api'
import {
  FiCalendar,
  FiDollarSign,
  FiShoppingBag,
  FiTruck,
  FiHome,
  FiGrid,
  FiBarChart2,
} from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminReports() {
  const [report, setReport] = useState<DailyReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const fetchReport = async (date?: string) => {
    try {
      setLoading(true)
      const res = await api.get('/reports/daily', { params: { date: date || selectedDate } })
      setReport(res.data.data)
    } catch {
      toast.error('Error al cargar reporte')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [selectedDate])

  return (
    <div className="container-main">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display">Reportes Diarios</h1>
        <div className="flex items-center gap-2">
          <FiCalendar className="text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Cargando reporte...</div>
      ) : report ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-5 shadow-md"
            >
              <div className="bg-purple-500 w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3">
                <FiDollarSign size={18} />
              </div>
              <div className="text-2xl font-bold">
                ${report.summary.totalSales.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Ventas Totales</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-5 shadow-md"
            >
              <div className="bg-blue-500 w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3">
                <FiShoppingBag size={18} />
              </div>
              <div className="text-2xl font-bold">{report.summary.totalOrders}</div>
              <div className="text-sm text-gray-500">Pedidos Totales</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-5 shadow-md"
            >
              <div className="bg-green-500 w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3">
                <FiBarChart2 size={18} />
              </div>
              <div className="text-2xl font-bold">
                ${report.summary.averageTicket.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Ticket Promedio</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-5 shadow-md"
            >
              <div className="bg-orange-500 w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3">
                <FiDollarSign size={18} />
              </div>
              <div className="text-2xl font-bold">${report.summary.cashSales.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Efectivo</div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-display text-lg mb-4">Ventas por Tipo de Pedido</h3>
              <div className="space-y-3">
                {[
                  {
                    label: 'Domicilio',
                    count: report.summary.deliveryOrders,
                    icon: FiTruck,
                    color: 'bg-orange-500',
                  },
                  {
                    label: 'Tienda/POS',
                    count: report.summary.posOrders,
                    icon: FiGrid,
                    color: 'bg-blue-500',
                  },
                  {
                    label: 'Mesa',
                    count: report.summary.dineInOrders,
                    icon: FiHome,
                    color: 'bg-green-500',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className={`${item.color} w-8 h-8 rounded-lg flex items-center justify-center text-white`}
                    >
                      <item.icon size={14} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.label}</span>
                        <span className="font-bold">{item.count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                        <div
                          className={`${item.color} h-2 rounded-full`}
                          style={{
                            width: `${report.summary.totalOrders > 0 ? (item.count / report.summary.totalOrders) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-display text-lg mb-4">Métodos de Pago</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Efectivo</span>
                  <span className="font-bold">${report.summary.cashSales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Digital</span>
                  <span className="font-bold">${report.summary.digitalSales.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {report.topItems.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
              <h3 className="font-display text-lg mb-4">Top 10 Platos Más Vendidos</h3>
              <div className="space-y-2">
                {report.topItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0">
                    <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <span className="font-semibold text-sm">{item.name}</span>
                      <span className="text-gray-500 text-sm ml-2">({item.count} uds)</span>
                    </div>
                    <span className="font-bold text-sm">${item.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.hourlySales.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-display text-lg mb-4">Ventas por Hora</h3>
              <div className="flex items-end gap-1 h-40">
                {report.hourlySales.map((h, i) => {
                  const maxSale = Math.max(...report.hourlySales.map((x) => x.sales))
                  const height = maxSale > 0 ? (h.sales / maxSale) * 100 : 0
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="text-xs text-gray-500 mb-1">
                        ${(h.sales / 1000).toFixed(0)}k
                      </div>
                      <div
                        className="w-full bg-primary rounded-t"
                        style={{ height: `${height}%`, minHeight: h.sales > 0 ? '4px' : '0' }}
                      />
                      <div className="text-xs text-gray-500 mt-1">{h.hour}h</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {report.shifts.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-md mt-8">
              <h3 className="font-display text-lg mb-4">Turnos del Día</h3>
              <div className="space-y-3">
                {report.shifts.map((s, i) => {
                  const period = s.shiftPeriod ? SHIFT_PERIOD_LABELS[s.shiftPeriod] : null
                  return (
                    <div key={i} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{s.cashier}</span>
                          {period && (
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${period.color}`}
                            >
                              {period.label}
                            </span>
                          )}
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${s.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                          >
                            {s.status === 'open' ? 'Abierto' : 'Cerrado'}
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs">
                          {new Date(s.openedAt).toLocaleTimeString('es-CO', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {s.closedAt &&
                            ` - ${new Date(s.closedAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="bg-white rounded-lg p-2">
                          <div className="text-sm font-bold">${s.totalSales.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">Ventas</div>
                        </div>
                        <div className="bg-white rounded-lg p-2">
                          <div className="text-sm font-bold">{s.totalOrders}</div>
                          <div className="text-xs text-gray-500">Pedidos</div>
                        </div>
                        <div className="bg-white rounded-lg p-2">
                          <div className="text-sm font-bold text-green-600">
                            ${s.cashReceived.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Efectivo</div>
                        </div>
                        <div className="bg-white rounded-lg p-2">
                          <div className="text-sm font-bold text-blue-600">
                            ${s.digitalTotal.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Digital</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="text-xl">No hay datos para esta fecha</p>
        </div>
      )}
    </div>
  )
}
