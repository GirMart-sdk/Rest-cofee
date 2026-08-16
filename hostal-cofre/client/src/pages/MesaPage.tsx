import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MenuItem, CartItem, Table } from '../types'
import { api, whatsappService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useCartState } from '../hooks/useCartState'
import { Button, Card, EmptyState } from '../components/ui'
import { getErrorMessage } from '../utils/errors'
import { formatCOP } from '../utils/format'
import { FiPlus, FiMinus, FiTrash2, FiCheck, FiGrid } from 'react-icons/fi'
import toast from 'react-hot-toast'

interface MesaCartContextType {
  items: CartItem[]
  addItem: (item: MenuItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  total: number
  itemCount: number
  clearCart: () => void
}

const MesaCartContext = createContext<MesaCartContextType | null>(null)

function MesaCartProvider({ children }: { children: ReactNode }) {
  const cart = useCartState()
  const { addItem: addCartItem } = cart
  const addItem = useCallback(
    (item: MenuItem) => {
      addCartItem(item)
      toast.success(`${item.name} añadido`)
    },
    [addCartItem],
  )

  return (
    <MesaCartContext.Provider value={{ ...cart, addItem }}>{children}</MesaCartContext.Provider>
  )
}

function useMesaCart() {
  const ctx = useContext(MesaCartContext)
  if (!ctx) throw new Error('useMesaCart must be used within MesaCartProvider')
  return ctx
}

const CATEGORIES = [
  { key: 'all', label: 'Todos' },
  { key: 'ensalada', label: 'Ensaladas' },
  { key: 'pasta', label: 'Pastas' },
  { key: 'pizza', label: 'Pizzas' },
  { key: 'postre', label: 'Postres' },
  { key: 'bebida', label: 'Bebidas' },
]

function MesaMenuGrid() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useMesaCart()

  useEffect(() => {
    api
      .get('/menu')
      .then((res) => setMenuItems(res.data.data.filter((i: MenuItem) => i.available)))
      .catch(() => toast.error('Error al cargar el menú'))
      .finally(() => setLoading(false))
  }, [])

  const filtered =
    activeCategory === 'all' ? menuItems : menuItems.filter((m) => m.category === activeCategory)

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
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setActiveCategory(c.key)}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
              activeCategory === c.key
                ? 'bg-primary text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((item) => (
          <motion.div
            key={item.id}
            layout
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <img src={item.image} alt={item.name} className="w-full h-28 object-cover" />
            <div className="p-3">
              <h3 className="font-semibold text-sm mb-1 line-clamp-1">{item.name}</h3>
              <p className="text-primary font-bold text-sm">{formatCOP(item.price)}</p>
              <button
                onClick={() => addItem(item)}
                className="mt-2 w-full py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-semibold hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-1"
              >
                <FiPlus size={12} /> Agregar
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function MesaCart() {
  const { items, removeItem, updateQuantity, total, itemCount, clearCart } = useMesaCart()
  const [submitting, setSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const tableNumber = parseInt(searchParams.get('t') || '0')

  if (items.length === 0) {
    return <EmptyState title="Agrega platos del menú para ordenar" />
  }

  const handleOrder = async () => {
    setSubmitting(true)
    try {
      await api.post('/orders/table', {
        customerName: user?.name || `Mesa ${tableNumber}`,
        items: items.map((i) => ({ menuItemId: i.menuItem.id, quantity: i.quantity })),
        paymentMethod: 'cash',
        tableNumber,
      })

      const summary = items
        .map(
          (i) => `${i.quantity}x ${i.menuItem.name} - ${formatCOP(i.menuItem.price * i.quantity)}`,
        )
        .join('\n')
      const whatsappPhone = import.meta.env.VITE_WHATSAPP_PHONE || '573001234567'
      whatsappService.sendOrder(
        whatsappPhone,
        `Mesa #${tableNumber}\n\n${summary}\n\n*Total: ${formatCOP(total)}*`,
      )

      toast.success('Pedido enviado a la cocina')
      clearCart()
      setShowConfirm(false)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Error al enviar pedido'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg">Tu Pedido</h3>
        <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-bold">
          {itemCount}
        </span>
      </div>

      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
        {items.map((ci) => (
          <div key={ci.menuItem.id} className="flex items-center gap-3">
            <div className="flex-1">
              <p className="font-semibold text-sm">{ci.menuItem.name}</p>
              <p className="text-primary text-xs font-bold">{formatCOP(ci.menuItem.price)} c/u</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateQuantity(ci.menuItem.id, ci.quantity - 1)}
                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <FiMinus size={10} />
              </button>
              <span className="w-6 text-center text-sm font-bold">{ci.quantity}</span>
              <button
                onClick={() => updateQuantity(ci.menuItem.id, ci.quantity + 1)}
                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <FiPlus size={10} />
              </button>
            </div>
            <p className="font-bold text-sm w-16 text-right">
              {formatCOP(ci.menuItem.price * ci.quantity)}
            </p>
            <button
              onClick={() => removeItem(ci.menuItem.id)}
              className="text-gray-400 hover:text-red-500"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="border-t pt-3 mb-4">
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-primary">{formatCOP(total)}</span>
        </div>
      </div>

      {!showConfirm ? (
        <Button variant="success" size="lg" className="w-full" onClick={() => setShowConfirm(true)}>
          Enviar Pedido a Cocina
        </Button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 rounded-lg p-4"
        >
          <p className="text-sm text-green-700 mb-3 text-center">
            ¿Confirmar pedido para Mesa #{tableNumber}?
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" className="flex-1" onClick={() => setShowConfirm(false)}>
              Cancelar
            </Button>
            <Button
              variant="success"
              className="flex-1"
              onClick={handleOrder}
              disabled={submitting}
            >
              {submitting ? (
                'Enviando...'
              ) : (
                <>
                  <FiCheck size={14} /> Confirmar
                </>
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </Card>
  )
}

function MesaHeader({
  tableNumber,
  capacity,
  activeOrders,
}: {
  tableNumber: number
  capacity?: number
  activeOrders: number
}) {
  return (
    <div className="bg-primary text-white rounded-xl p-4 mb-6 flex items-center gap-3">
      <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center">
        <FiGrid size={24} />
      </div>
      <div className="flex-1">
        <h2 className="font-display text-xl">Mesa #{tableNumber}</h2>
        <p className="text-white/80 text-sm">Agrega platos y envía tu pedido</p>
      </div>
      {capacity ? (
        <span className="bg-white/20 text-xs px-2 py-1 rounded-full font-semibold">
          Capacidad: {capacity} pers.
        </span>
      ) : null}
      {activeOrders > 0 ? (
        <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold">
          {activeOrders} pedido{activeOrders > 1 ? 's' : ''} activo{activeOrders > 1 ? 's' : ''} en
          esta mesa
        </span>
      ) : null}
    </div>
  )
}

export default function MesaPage() {
  const [searchParams] = useSearchParams()
  const tableNumber = parseInt(searchParams.get('t') || '0')
  const [tableInfo, setTableInfo] = useState<Table | null | undefined>(undefined)
  const [activeOrders, setActiveOrders] = useState(0)

  useEffect(() => {
    if (!tableNumber || tableNumber < 1) return
    let mounted = true
    setTableInfo(undefined)
    setActiveOrders(0)
    api
      .get(`/tables/${tableNumber}`)
      .then((res) => {
        if (mounted) setTableInfo(res.data.data)
      })
      .catch(() => {
        if (mounted) setTableInfo(null)
      })
    api
      .get(`/orders/table/${tableNumber}`)
      .then((res) => {
        if (mounted && Array.isArray(res.data.data)) setActiveOrders(res.data.data.length)
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [tableNumber])

  if (!tableNumber || tableNumber < 1) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-display text-gray-600 mb-4">Mesa no válida</h1>
          <p className="text-gray-400">Escanea el QR de tu mesa para comenzar</p>
        </div>
      </div>
    )
  }

  if (tableInfo === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-display text-gray-600 mb-4">Mesa no encontrada</h1>
          <p className="text-gray-400">
            Esta mesa no está registrada. Escanea el código QR de una mesa válida
          </p>
        </div>
      </div>
    )
  }

  return (
    <MesaCartProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <MesaHeader
            tableNumber={tableNumber}
            capacity={tableInfo?.capacity}
            activeOrders={activeOrders}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MesaMenuGrid />
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <MesaCart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MesaCartProvider>
  )
}
