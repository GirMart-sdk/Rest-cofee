import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MenuItem } from '../../types'
import { api } from '../../services/api'
import { FiPlus, FiMinus, FiTrash2, FiShoppingBag, FiClock } from 'react-icons/fi'
import toast from 'react-hot-toast'

interface POSCartItem {
  menuItem: MenuItem
  quantity: number
}

const CATEGORIES = [
  { key: 'all', label: 'Todos' },
  { key: 'ensalada', label: 'Ensaladas' },
  { key: 'pasta', label: 'Pastas' },
  { key: 'pizza', label: 'Pizzas' },
  { key: 'postre', label: 'Postres' },
  { key: 'bebida', label: 'Bebidas' },
]

export default function AdminPOS() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [cart, setCart] = useState<POSCartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'nequi' | 'daviplata' | 'wompi'>('cash')
  const [cashReceived, setCashReceived] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [showReceipt, setShowReceipt] = useState<any>(null)

  useEffect(() => {
    api.get('/menu')
      .then(res => setMenuItems(res.data.data.filter((i: MenuItem) => i.available)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeCategory === 'all' ? menuItems : menuItems.filter(m => m.category === activeCategory)
  const subtotal = cart.reduce((sum, ci) => sum + ci.menuItem.price * ci.quantity, 0)
  const itemCount = cart.reduce((sum, ci) => sum + ci.quantity, 0)

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(ci => ci.menuItem.id === item.id)
      if (existing) return prev.map(ci => ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci)
      return [...prev, { menuItem: item, quantity: 1 }]
    })
  }

  const updateQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) { setCart(prev => prev.filter(ci => ci.menuItem.id !== itemId)); return }
    setCart(prev => prev.map(ci => ci.menuItem.id === itemId ? { ...ci, quantity: qty } : ci))
  }

  const clearCart = () => setCart([])

  const handlePayment = async () => {
    if (cart.length === 0) return
    setSubmitting(true)
    try {
      const res = await api.post('/orders', {
        customerName: customerName || 'Cliente POS',
        customerPhone: 'N/A',
        items: cart.map(ci => ({ menuItemId: ci.menuItem.id, quantity: ci.quantity })),
        paymentMethod,
        orderType: 'tienda',
      })

      setShowReceipt({
        ...res.data.data,
        cart: [...cart],
        cashReceived: paymentMethod === 'cash' ? parseFloat(cashReceived) || 0 : undefined,
        change: paymentMethod === 'cash' ? Math.max(0, (parseFloat(cashReceived) || 0) - subtotal) : undefined,
      })

      setCart([])
      setShowPayment(false)
      setCustomerName('')
      setCashReceived('')
      toast.success('Venta registrada')
    } catch {
      toast.error('Error al registrar venta')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container-main text-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-400">Cargando POS...</p>
      </div>
    )
  }

  return (
    <>
    <div className="container-main">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-display">Punto de Venta</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiClock size={14} /> {new Date().toLocaleString('es-CO')}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-2 mb-4">
              {CATEGORIES.map(c => (
                <button
                  key={c.key}
                  onClick={() => setActiveCategory(c.key)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeCategory === c.key ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
              {filtered.map(item => (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="pos-item bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all text-center active:scale-95"
                >
                  <img src={item.image} alt={item.name} className="w-full h-20 object-cover rounded-lg mb-2" />
                  <p className="font-semibold text-xs line-clamp-1">{item.name}</p>
                  <p className="text-primary font-bold text-sm">${item.price}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-4 sticky top-28">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg flex items-center gap-2">
                  <FiShoppingBag /> Venta Actual
                </h2>
                {cart.length > 0 && (
                  <button onClick={clearCart} className="text-red-500 text-xs font-semibold">Limpiar</button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <FiShoppingBag className="mx-auto text-3xl mb-2" />
                  <p className="text-sm">Agrega items del menú</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                    {cart.map(ci => (
                      <div key={ci.menuItem.id} className="flex items-center gap-2 py-2 border-b last:border-0">
                        <div className="flex-1">
                          <p className="font-semibold text-sm line-clamp-1">{ci.menuItem.name}</p>
                          <p className="text-xs text-gray-500">${ci.menuItem.price}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateQuantity(ci.menuItem.id, ci.quantity - 1)} className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center">
                            <FiMinus size={10} />
                          </button>
                          <span className="w-6 text-center text-sm font-bold">{ci.quantity}</span>
                          <button onClick={() => updateQuantity(ci.menuItem.id, ci.quantity + 1)} className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center">
                            <FiPlus size={10} />
                          </button>
                        </div>
                        <p className="font-bold text-sm w-16 text-right">${(ci.menuItem.price * ci.quantity).toFixed(0)}</p>
                        <button onClick={() => updateQuantity(ci.menuItem.id, 0)} className="text-gray-400 hover:text-red-500">
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 space-y-1">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Items: {itemCount}</span>
                      <span>Subtotal</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-primary">${subtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button onClick={() => setShowPayment(true)} className="w-full mt-4 py-3 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-dark transition-colors">
                    Cobrar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showPayment && (
        <div className="modal-overlay">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="modal-content">
            <h2 className="text-2xl font-display mb-6 text-center">Cobrar</h2>

            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Nombre del cliente (opcional)</label>
              <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="input-field" placeholder="Cliente" />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6">
              {[
                { key: 'cash', label: 'Efectivo', icon: '💵' },
                { key: 'nequi', label: 'Nequi', icon: '📱' },
                { key: 'daviplata', label: 'DaviPlata', icon: '📲' },
                { key: 'wompi', label: 'Tarjeta/PSE', icon: '💳' },
              ].map(m => (
                <button
                  key={m.key}
                  onClick={() => setPaymentMethod(m.key as any)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    paymentMethod === m.key ? 'border-primary bg-primary/5' : 'border-gray-200'
                  }`}
                >
                  <span className="text-xl">{m.icon}</span>
                  <div className="font-semibold text-sm mt-1">{m.label}</div>
                </button>
              ))}
            </div>

            {paymentMethod === 'cash' && (
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Efectivo recibido</label>
                <input
                  type="number"
                  value={cashReceived}
                  onChange={e => setCashReceived(e.target.value)}
                  className="input-field text-2xl font-bold text-center"
                  placeholder="0"
                />
                {parseFloat(cashReceived) > 0 && (
                  <div className="text-center mt-2">
                    <span className="text-sm text-gray-500">Cambio: </span>
                    <span className="text-lg font-bold text-primary">
                      ${Math.max(0, parseFloat(cashReceived) - subtotal).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-primary">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowPayment(false)} className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold">Cancelar</button>
              <button onClick={handlePayment} disabled={submitting} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark disabled:opacity-50">
                {submitting ? 'Procesando...' : 'Confirmar Cobro'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showReceipt && (
        <div className="modal-overlay">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="modal-content max-w-sm receipt-container" id="receipt">
            <div className="receipt p-6 text-center">
              <h2 className="font-display text-xl font-bold mb-1">Hostal Cofre</h2>
              <p className="text-xs text-gray-500 mb-4">NIT: XXX-XXXX-X</p>
              <div className="border-t border-b border-dashed border-gray-300 py-2 mb-4">
                <p className="text-xs text-gray-500">Recibo #{showReceipt.receiptNumber}</p>
                <p className="text-xs text-gray-500">{new Date(showReceipt.createdAt).toLocaleString('es-CO')}</p>
              </div>
              <div className="text-left space-y-1 mb-4">
                {showReceipt.cart?.map((ci: POSCartItem, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{ci.quantity}x {ci.menuItem.name}</span>
                    <span>${(ci.menuItem.price * ci.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-gray-300 pt-2 mb-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>TOTAL</span>
                  <span>${showReceipt.total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Pago: {showReceipt.paymentMethod.toUpperCase()}</p>
                {showReceipt.cashReceived !== undefined && (
                  <>
                    <p className="text-xs text-gray-500">Recibido: ${showReceipt.cashReceived.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Cambio: ${showReceipt.change.toFixed(2)}</p>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-400">¡Gracias por su compra!</p>
            </div>
            <div className="flex gap-2 p-4">
              <button onClick={() => setShowReceipt(null)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-semibold">Cerrar</button>
              <button onClick={() => { window.print(); setShowReceipt(null) }} className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-semibold">Imprimir</button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
