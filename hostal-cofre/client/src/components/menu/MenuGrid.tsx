import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MenuItem } from '../../types'
import { api } from '../../services/api'
import { useCart } from '../../context/CartContext'
import { EmptyState } from '../ui'
import { FiPlus, FiCheck } from 'react-icons/fi'

const CATEGORIES = [
  { key: 'all', label: 'Todos' },
  { key: 'ensalada', label: 'Ensaladas' },
  { key: 'pasta', label: 'Pastas' },
  { key: 'pizza', label: 'Pizzas' },
  { key: 'postre', label: 'Postres' },
  { key: 'bebida', label: 'Bebidas' },
]

export default function MenuGrid() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())
  const { addItem } = useCart()

  useEffect(() => {
    api
      .get('/menu')
      .then((res) => setMenuItems(res.data.data.filter((i: MenuItem) => i.available)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered =
    activeCategory === 'all' ? menuItems : menuItems.filter((m) => m.category === activeCategory)

  const handleAdd = (item: MenuItem) => {
    addItem(item)
    setAddedIds((prev) => new Set(prev).add(item.id))
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev)
        next.delete(item.id)
        return next
      })
    }, 1500)
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-400">Cargando menú...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setActiveCategory(c.key)}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
              activeCategory === c.key
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="card group"
          >
            <div className="relative overflow-hidden h-52">
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute top-3 left-3 bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                {item.category}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-display text-xl text-gray-900 mb-2">{item.name}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">${item.price}</span>
                <button
                  onClick={() => handleAdd(item)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                    addedIds.has(item.id)
                      ? 'bg-primary text-white'
                      : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  {addedIds.has(item.id) ? (
                    <>
                      <FiCheck /> Añadido
                    </>
                  ) : (
                    <>
                      <FiPlus /> Añadir
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <EmptyState title="No hay platillos disponibles en esta categoría" />
      )}
    </div>
  )
}
