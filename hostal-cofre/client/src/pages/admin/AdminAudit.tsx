import { useState, useEffect } from 'react'
import { AuditLog } from '../../types'
import { api } from '../../services/api'
import { EmptyState } from '../../components/ui'
import { FiRefreshCw } from 'react-icons/fi'
import toast from 'react-hot-toast'

const RESOURCE_LABELS: Record<string, string> = {
  auth: 'Autenticación',
  menu: 'Menú',
  order: 'Pedidos',
  table: 'Mesas',
  reservation: 'Reservas',
  user: 'Usuarios',
  shift: 'Turnos',
}

export default function AdminAudit() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [resource, setResource] = useState('all')
  const [refreshing, setRefreshing] = useState(false)

  const fetchLogs = async (targetResource?: string) => {
    try {
      setLoading(true)
      const params =
        targetResource && targetResource !== 'all' ? { resource: targetResource } : { limit: 100 }
      const res = await api.get('/audit', { params })
      setLogs(res.data.data)
    } catch {
      toast.error('Error al cargar el registro de auditoría')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    void fetchLogs()
  }, [])

  const resources = Array.from(new Set(logs.map((l) => l.resource)))

  const refresh = () => {
    setRefreshing(true)
    void fetchLogs(resource)
  }

  return (
    <div className="container-main">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-3xl font-display">Registro de Auditoría</h1>
          <p className="text-gray-500 text-sm mt-1">
            Acciones sensibles realizadas por administradores
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={resource}
            onChange={(e) => {
              setResource(e.target.value)
              void fetchLogs(e.target.value)
            }}
            className="input-field !w-auto"
          >
            <option value="all">Todos los recursos</option>
            {resources.map((r) => (
              <option key={r} value={r}>
                {RESOURCE_LABELS[r] || r}
              </option>
            ))}
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
        <div className="text-center py-20 text-gray-400">Cargando registro...</div>
      ) : logs.length === 0 ? (
        <EmptyState title="Sin registros" message="Aún no hay actividad registrada en el sistema" />
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="px-5 py-3 font-semibold">Fecha</th>
                <th className="px-5 py-3 font-semibold">Usuario</th>
                <th className="px-5 py-3 font-semibold">Acción</th>
                <th className="px-5 py-3 font-semibold">Recurso</th>
                <th className="px-5 py-3 font-semibold">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3 whitespace-nowrap text-gray-500">
                    {new Date(log.createdAt).toLocaleString('es-CO')}
                  </td>
                  <td className="px-5 py-3 font-semibold">{log.userEmail}</td>
                  <td className="px-5 py-3">
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {RESOURCE_LABELS[log.resource] || log.resource}
                    {log.resourceId ? (
                      <span className="text-gray-400 text-xs ml-1">
                        #{log.resourceId.slice(0, 8)}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{log.ip || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
