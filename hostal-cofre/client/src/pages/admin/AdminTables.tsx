import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Table } from '../../types'
import { api } from '../../services/api'
import { QRCodeSVG } from 'qrcode.react'
import { FiGrid, FiUsers, FiX, FiCopy, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'

type FormData = {
  number: string
  capacity: string
  zone: 'interior' | 'exterior' | 'privado'
}

const EMPTY_FORM: FormData = { number: '', capacity: '', zone: 'interior' }

export default function AdminTables() {
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingTable, setEditingTable] = useState<Table | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  const fetchTables = async () => {
    try {
      setLoading(true)
      const res = await api.get('/tables/active')
      setTables(res.data.data)
    } catch {
      toast.error('Error al cargar mesas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTables() }, [])

  const copyLink = (tableNumber: number) => {
    const url = `${window.location.origin}/mesa?t=${tableNumber}`
    navigator.clipboard.writeText(url)
    toast.success('Enlace copiado')
  }

  const openCreateForm = () => {
    setEditingTable(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  const openEditForm = (table: Table) => {
    setEditingTable(table)
    setForm({ number: String(table.number), capacity: String(table.capacity), zone: table.zone })
    setShowForm(true)
  }

  const handleSubmit = async () => {
    if (!form.number || !form.capacity) {
      toast.error('Número y capacidad son requeridos')
      return
    }

    setSubmitting(true)
    try {
      if (editingTable) {
        await api.put(`/tables/${editingTable.id}`, {
          number: parseInt(form.number),
          capacity: parseInt(form.capacity),
          zone: form.zone,
        })
        toast.success('Mesa actualizada')
      } else {
        await api.post('/tables', {
          number: parseInt(form.number),
          capacity: parseInt(form.capacity),
          zone: form.zone,
        })
        toast.success('Mesa creada')
      }
      setShowForm(false)
      setEditingTable(null)
      setForm(EMPTY_FORM)
      fetchTables()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error al guardar mesa')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (table: Table) => {
    if (!confirm(`¿Eliminar Mesa #${table.number}?`)) return
    try {
      await api.delete(`/tables/${table.id}`)
      toast.success('Mesa eliminada')
      setSelectedTable(null)
      fetchTables()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'No se puede eliminar esta mesa')
    }
  }

  return (
    <div className="container-main">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-display">Gestión de Mesas</h1>
        <div className="flex gap-2">
          <button onClick={fetchTables} className="btn-outline text-sm px-3 py-2">Actualizar</button>
          <button onClick={openCreateForm} className="btn-primary text-sm px-3 py-2 flex items-center gap-1">
            <FiPlus size={16} /> Agregar Mesa
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Cargando mesas...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map(table => (
            <motion.div
              key={table.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
                className={`bg-white rounded-2xl p-5 shadow-md border-2 transition-all cursor-pointer group ${
                table.isOccupied ? 'border-orange-300 bg-orange-50' : 'border-primary/20 hover:border-primary/50'
              }`}
              onClick={() => setSelectedTable(table)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${table.isOccupied ? 'bg-orange-500' : 'bg-primary'}`}>
                  <FiGrid size={22} />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); openEditForm(table) }} className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200">
                    <FiEdit2 size={12} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(table) }} className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200">
                    <FiTrash2 size={12} />
                  </button>
                </div>
              </div>
              <h3 className="font-display text-xl mb-1">Mesa #{table.number}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1"><FiUsers size={12} /> {table.capacity} personas</p>
              <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                table.zone === 'interior' ? 'bg-blue-100 text-blue-700' :
                table.zone === 'exterior' ? 'bg-green-100 text-green-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {table.zone}
              </span>
              {table.isOccupied && table.totalPending !== undefined && (
                <p className="text-sm font-bold text-orange-600 mt-2">${table.totalPending.toLocaleString()} pendiente</p>
              )}
            </motion.div>
          ))}

          <button
            onClick={openCreateForm}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-5 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all min-h-[180px]"
          >
            <FiPlus size={32} className="mb-2" />
            <span className="font-semibold">Agregar Mesa</span>
          </button>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="modal-content">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display">{editingTable ? 'Editar Mesa' : 'Nueva Mesa'}</h2>
              <button onClick={() => { setShowForm(false); setEditingTable(null) }} className="text-gray-400 hover:text-gray-600"><FiX size={24} /></button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Número de mesa *</label>
                <input
                  type="number"
                  value={form.number}
                  onChange={e => setForm({ ...form, number: e.target.value })}
                  className="input-field"
                  placeholder="Ej: 8"
                  min="1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Capacidad (personas) *</label>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={e => setForm({ ...form, capacity: e.target.value })}
                  className="input-field"
                  placeholder="Ej: 4"
                  min="1"
                  max="50"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Zona</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'interior' as const, label: 'Interior', color: 'bg-blue-100 text-blue-700 border-blue-300' },
                    { key: 'exterior' as const, label: 'Exterior', color: 'bg-green-100 text-green-700 border-green-300' },
                    { key: 'privado' as const, label: 'Privado', color: 'bg-purple-100 text-purple-700 border-purple-300' },
                  ].map(z => (
                    <button
                      key={z.key}
                      onClick={() => setForm({ ...form, zone: z.key })}
                      className={`py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                        form.zone === z.key ? z.color + ' shadow-sm' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {z.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setShowForm(false); setEditingTable(null) }} className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold">Cancelar</button>
              <button onClick={handleSubmit} disabled={submitting} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark disabled:opacity-50">
                {submitting ? 'Guardando...' : editingTable ? 'Actualizar' : 'Crear Mesa'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {selectedTable && (
        <div className="modal-overlay">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="modal-content">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display">Mesa #{selectedTable.number}</h2>
              <button onClick={() => setSelectedTable(null)} className="text-gray-400 hover:text-gray-600"><FiX size={24} /></button>
            </div>

            <div className="text-center mb-6">
              <div className="bg-white p-4 rounded-xl border-2 border-gray-100 inline-block mb-4">
                <QRCodeSVG
                  value={`${window.location.origin}/mesa?t=${selectedTable.number}`}
                  size={180}
                  level="M"
                  includeMargin={true}
                />
              </div>
              <p className="text-sm text-gray-500 mb-3">Escanea este QR para ordenar desde la mesa</p>
              <button
                onClick={() => copyLink(selectedTable.number)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold hover:bg-primary/20"
              >
                <FiCopy size={14} /> Copiar enlace
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Capacidad:</span>
                <span className="font-bold">{selectedTable.capacity} personas</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Zona:</span>
                <span className="font-bold capitalize">{selectedTable.zone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Estado:</span>
                <span className={`font-bold ${selectedTable.isOccupied ? 'text-orange-600' : 'text-green-600'}`}>
                  {selectedTable.isOccupied ? 'Ocupada' : 'Libre'}
                </span>
              </div>
            </div>

            {selectedTable.orders && selectedTable.orders.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Pedidos Activos:</h3>
                {selectedTable.orders.map(order => (
                  <div key={order.id} className="bg-orange-50 rounded-lg p-3 mb-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">#{order.id.slice(0, 8)}</span>
                      <span className="font-bold text-primary">${order.total}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {order.items.map((i: any) => `${i.quantity}x ${i.menuItem?.name || 'Item'}`).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button onClick={() => { setSelectedTable(null); openEditForm(selectedTable) }} className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 flex items-center justify-center gap-1">
                <FiEdit2 size={14} /> Editar
              </button>
              <button onClick={() => setSelectedTable(null)} className="flex-1 py-3 bg-gray-100 rounded-xl font-semibold">Cerrar</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
