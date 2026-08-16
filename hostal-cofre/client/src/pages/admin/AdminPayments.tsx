import { useState, useEffect } from 'react'
import { Order } from '../../types'
import { api } from '../../services/api'
import { Badge, EmptyState } from '../../components/ui'
import { getErrorMessage } from '../../utils/errors'
import { formatCOP } from '../../utils/format'
import { FiRefreshCw, FiWifi, FiExternalLink, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'

const PAYMENT_STATUS_LABELS: Record<
  string,
  { label: string; variant: 'success' | 'warning' | 'danger' | 'info' }
> = {
  pending: { label: 'Pendiente', variant: 'warning' },
  paid: { label: 'Pagado', variant: 'success' },
  failed: { label: 'Fallido', variant: 'danger' },
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Order[]>([])
  const [config, setConfig] = useState<{ mode: string; publicKeyConfigured: boolean } | null>(null)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [txDetail, setTxDetail] = useState<Record<string, unknown> | null>(null)

  const fetchPayments = async (targetFilter?: string) => {
    try {
      setLoading(true)
      const status = targetFilter && targetFilter !== 'all' ? targetFilter : undefined
      const res = await api.get('/payments', { params: status ? { status } : { limit: 100 } })
      setPayments(res.data.data)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Error al cargar pagos'))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    void fetchPayments()
    api
      .get('/payments/status')
      .then((res) => setConfig(res.data.data))
      .catch(() => {})
  }, [])

  const refresh = () => {
    setRefreshing(true)
    void fetchPayments(filter)
  }

  const viewTransaction = async (transactionId: string) => {
    try {
      const res = await api.get(`/payments/transactions/${transactionId}`)
      setTxDetail(res.data.data)
    } catch (err) {
      toast.error(getErrorMessage(err, 'No se pudo consultar la transacción'))
    }
  }

  return (
    <div className="container-main">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-3xl font-display">Pagos Wompi</h1>
          <p className="text-gray-500 text-sm mt-1">
            Transacciones en línea de pedidos registrados
          </p>
        </div>
        <div className="flex items-center gap-3">
          {config && (
            <span className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-gray-100 text-gray-600 font-semibold">
              <FiWifi size={14} />
              {config.mode === 'prod' ? 'Producción' : 'Pruebas'}
              {config.publicKeyConfigured ? (
                <span className="text-green-600">· configurado</span>
              ) : (
                <span className="text-red-500">· sin credenciales</span>
              )}
            </span>
          )}
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value)
              void fetchPayments(e.target.value)
            }}
            className="input-field !w-auto"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="paid">Pagados</option>
            <option value="failed">Fallidos</option>
          </select>
          <button
            onClick={refresh}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90"
          >
            <FiRefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            Actualizar
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Cargando pagos...</div>
      ) : payments.length === 0 ? (
        <EmptyState title="Sin pagos Wompi" message="No hay transacciones en línea registradas" />
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="px-5 py-3 font-semibold">Fecha</th>
                <th className="px-5 py-3 font-semibold">Recibo</th>
                <th className="px-5 py-3 font-semibold">Cliente</th>
                <th className="px-5 py-3 font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Pago</th>
                <th className="px-5 py-3 font-semibold">Transacción</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((order) => {
                const payment =
                  PAYMENT_STATUS_LABELS[order.paymentStatus] || PAYMENT_STATUS_LABELS.pending
                return (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3 whitespace-nowrap text-gray-500">
                      {new Date(order.createdAt).toLocaleString('es-CO')}
                    </td>
                    <td className="px-5 py-3 font-semibold">
                      {order.receiptNumber || order.id.slice(0, 8)}
                    </td>
                    <td className="px-5 py-3">{order.customerName}</td>
                    <td className="px-5 py-3 font-bold text-primary">{formatCOP(order.total)}</td>
                    <td className="px-5 py-3">
                      <Badge variant={payment.variant}>{payment.label}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      {order.paymentId ? (
                        <button
                          onClick={() => void viewTransaction(order.paymentId!)}
                          className="flex items-center gap-1 text-primary text-xs font-semibold hover:underline"
                        >
                          <FiExternalLink size={12} />
                          Ver transacción
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">Sin ID</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {txDetail && (
        <div className="modal-overlay" onClick={() => setTxDetail(null)}>
          <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display">Detalle de Transacción</h2>
              <button
                onClick={() => setTxDetail(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={18} />
              </button>
            </div>
            <pre className="bg-gray-50 rounded-xl p-4 text-xs overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(txDetail, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
