import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MenuItem } from '../../types'
import { api } from '../../services/api'
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiRefreshCw } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminMenu() {
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'pasta' as MenuItem['category'], image: '' })

  const fetchMenu = async () => {
    try {
      setLoading(true)
      const res = await api.get('/menu')
      setMenu(res.data.data)
    } catch {
      toast.error('Error al cargar menú')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMenu() }, [])

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('Nombre y precio requeridos'); return }
    try {
      if (editingId) {
        const res = await api.put(`/menu/${editingId}`, { ...form, price: parseFloat(form.price) })
        setMenu(prev => prev.map(m => m.id === editingId ? res.data.data : m))
        toast.success('Platillo actualizado')
      } else {
        const res = await api.post('/menu', { ...form, price: parseFloat(form.price) })
        setMenu(prev => [res.data.data, ...prev])
        toast.success('Platillo agregado')
      }
      setShowForm(false)
      setEditingId(null)
      setForm({ name: '', description: '', price: '', category: 'pasta', image: '' })
    } catch {
      toast.error('Error al guardar')
    }
  }

  const handleEdit = (item: MenuItem) => {
    setForm({ name: item.name, description: item.description, price: item.price.toString(), category: item.category, image: item.image })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este platillo?')) return
    try {
      await api.delete(`/menu/${id}`)
      setMenu(prev => prev.filter(m => m.id !== id))
      toast.success('Platillo eliminado')
    } catch {
      toast.error('Error al eliminar')
    }
  }

  const toggleAvailability = async (item: MenuItem) => {
    try {
      const res = await api.put(`/menu/${item.id}`, { available: !item.available })
      setMenu(prev => prev.map(m => m.id === item.id ? res.data.data : m))
      toast.success(item.available ? 'Marcado como agotado' : 'Marcado como disponible')
    } catch {
      toast.error('Error al actualizar')
    }
  }

  return (
    <section className="section-padding pt-28 bg-gray-50 min-h-screen">
      <div className="container-main">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display">Gestionar Menú</h1>
          <div className="flex gap-2">
            <button onClick={fetchMenu} className="btn-outline flex items-center gap-2"><FiRefreshCw /> Actualizar</button>
            <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', description: '', price: '', category: 'pasta', image: '' }) }} className="btn-primary flex items-center gap-2">
              <FiPlus /> Nuevo Platillo
            </button>
          </div>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-md mb-8">
            <h3 className="font-display text-xl mb-4">{editingId ? 'Editar Platillo' : 'Nuevo Platillo'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Nombre *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" />
              <input type="number" placeholder="Precio *" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="input-field" />
              <input type="text" placeholder="Descripción" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field" />
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as MenuItem['category'] })} className="input-field">
                <option value="ensalada">Ensalada</option>
                <option value="pasta">Pasta</option>
                <option value="pizza">Pizza</option>
                <option value="postre">Postre</option>
                <option value="bebida">Bebida</option>
              </select>
              <input type="text" placeholder="URL de imagen" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="input-field md:col-span-2" />
            </div>
            <div className="flex gap-4 mt-4">
              <button onClick={handleSave} className="btn-primary flex items-center gap-2"><FiCheck /> Guardar</button>
              <button onClick={() => { setShowForm(false); setEditingId(null) }} className="btn-outline flex items-center gap-2"><FiX /> Cancelar</button>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <FiRefreshCw className="animate-spin mx-auto text-4xl mb-4" />
            <p>Cargando menú...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menu.map(item => (
              <motion.div key={item.id} layout className="card">
                <div className="relative">
                  <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
                  <span className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-bold ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.available ? 'Disponible' : 'Agotado'}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                  <p className="text-primary font-bold text-xl mb-3">${item.price}</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-semibold"><FiEdit2 /> Editar</button>
                    <button onClick={() => toggleAvailability(item)} className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-semibold ${item.available ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                      {item.available ? 'Agotar' : 'Disponer'}
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="py-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><FiTrash2 size={14} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && menu.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-xl">No hay platillos en el menú</p>
            <p className="mt-2">Agrega el primer platillo con el botón "Nuevo Platillo"</p>
          </div>
        )}
      </div>
    </section>
  )
}
