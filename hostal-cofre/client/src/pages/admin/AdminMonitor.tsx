import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../services/api'
import { SystemMetrics } from '../../types'
import { FiActivity, FiServer, FiDatabase, FiWifi, FiAlertTriangle } from 'react-icons/fi'

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export default function AdminMonitor() {
  const [health, setHealth] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [lastCheck, setLastCheck] = useState<Date>(new Date())
  const [loading, setLoading] = useState(true)

  const fetchMonitoring = async () => {
    try {
      const [healthRes, metricsRes] = await Promise.all([api.get('/health'), api.get('/metrics')])
      setHealth(healthRes.data?.status ?? null)
      setMetrics(metricsRes.data?.data ?? null)
      setLastCheck(new Date())
    } catch {
      setHealth('error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMonitoring()
    const interval = setInterval(fetchMonitoring, 15000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="container-main flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="container-main">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display">Monitoreo del Servidor</h1>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FiActivity className="w-3 h-3" />
          Última verificación: {lastCheck.toLocaleTimeString('es-CO')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${health === 'ok' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
            >
              <FiServer size={20} />
            </div>
            <div>
              <h3 className="font-display text-lg">Servidor</h3>
              <span
                className={`text-sm font-medium ${health === 'ok' ? 'text-green-600' : 'text-red-600'}`}
              >
                {health === 'ok' ? 'Activo' : 'Error'}
              </span>
            </div>
          </div>
          {metrics && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Uptime</span>
                <span className="font-medium">{formatUptime(metrics.uptimeSeconds)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Requests</span>
                <span className="font-medium">{metrics.totalRequests.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Errores</span>
                <span className={`font-medium ${metrics.totalErrors > 0 ? 'text-red-600' : ''}`}>
                  {metrics.totalErrors}
                </span>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600">
              <FiDatabase size={20} />
            </div>
            <div>
              <h3 className="font-display text-lg">Autenticación</h3>
              <span className="text-sm text-gray-500">Logins y seguridad</span>
            </div>
          </div>
          {metrics && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Logins exitosos</span>
                <span className="font-medium text-green-600">{metrics.authLogins}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Logins fallidos</span>
                <span
                  className={`font-medium ${metrics.authFailedLogins > 0 ? 'text-red-600' : ''}`}
                >
                  {metrics.authFailedLogins}
                </span>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-100 text-purple-600">
              <FiWifi size={20} />
            </div>
            <div>
              <h3 className="font-display text-lg">Pedidos</h3>
              <span className="text-sm text-gray-500">Crear y cancelar</span>
            </div>
          </div>
          {metrics && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Creados</span>
                <span className="font-medium">{metrics.ordersCreated}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cancelados</span>
                <span
                  className={`font-medium ${metrics.ordersCancelled > 0 ? 'text-orange-600' : ''}`}
                >
                  {metrics.ordersCancelled}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {metrics && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="font-display text-xl mb-4">Métricas Detalladas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500 mb-1">Pagos</p>
              <p className="font-medium">{metrics.paymentsInitiated} iniciados</p>
              <p className="text-red-600">{metrics.paymentsFailed} fallidos</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500 mb-1">Webhooks</p>
              <p className="font-medium">{metrics.paymentsWebhookProcessed} procesados</p>
              <p className="text-orange-600">{metrics.paymentsWebhookRejected} rechazados</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500 mb-1">WhatsApp</p>
              <p className="font-medium">{metrics.whatsappSent} enviados</p>
              <p className="text-red-600">{metrics.whatsappFailed} fallidos</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500 mb-1">Códigos HTTP</p>
              {Object.entries(metrics.statusCodes)
                .slice(0, 4)
                .map(([code, count]) => (
                  <div key={code} className="flex justify-between">
                    <span className={parseInt(code) >= 400 ? 'text-red-600' : ''}>{code}</span>
                    <span>{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {!metrics && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <FiAlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
          <h3 className="font-display text-lg text-yellow-800 mb-2">Métricas no disponibles</h3>
          <p className="text-yellow-600 text-sm">
            Inicia sesión como administrador para ver las métricas del servidor.
          </p>
        </div>
      )}
    </div>
  )
}
