import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { api, whatsappService } from '../../services/api'
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiMessageCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'

type CheckoutStep = 'cart' | 'details' | 'payment'

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, total, clearCart, itemCount } = useCart()
  const { user } = useAuth()
  const [step, setStep] = useState<CheckoutStep>('cart')
  const [customerName, setCustomerName] = useState(user?.name || '')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState(user?.email || '')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'wompi' | 'nequi' | 'daviplata'>('cash')
  const [submitting, setSubmitting] = useState(false)

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <FiShoppingBag className="mx-auto text-6xl text-gray-300 mb-6" />
        <h2 className="text-2xl font-display text-gray-600 mb-4">Tu carrito está vacío</h2>
        <p className="text-gray-400 mb-8">Explora nuestro menú y añade tus platillos favoritos</p>
        <a href="/menu" className="btn-primary">Ver Menú</a>
      </div>
    )
  }

  const handleOrder = async () => {
    if (!customerName || !customerPhone) {
      toast.error('Nombre y teléfono son requeridos')
      return
    }

    setSubmitting(true)
    try {
      const orderItems = items.map(i => ({
        menuItemId: i.menuItem.id,
        quantity: i.quantity,
        price: i.menuItem.price,
      }))

      await api.post('/orders', {
        customerName,
        customerPhone,
        customerEmail,
        items: orderItems,
        paymentMethod,
      })

      const orderLines = items.map(i => `${i.quantity}x ${i.menuItem.name} - $${(i.menuItem.price * i.quantity).toFixed(0)}`)
      const summary = orderLines.join('\n') + `\n\n*Total: $${total.toFixed(2)}*\nMétodo de pago: ${paymentMethod.toUpperCase()}\nCliente: ${customerName}\nTel: ${customerPhone}`
      whatsappService.sendOrder('573001234567', summary)

      toast.success('Pedido registrado y enviado por WhatsApp')
      clearCart()
      setStep('cart')
    } catch {
      toast.error('Error al registrar pedido')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {step === 'cart' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-display">Tu Carrito ({itemCount})</h2>
            <button onClick={clearCart} className="text-red-500 hover:text-red-700 text-sm font-semibold">Vaciar</button>
          </div>

          <div className="space-y-4 mb-8">
            <AnimatePresence>
              {items.map(ci => (
                <motion.div
                  key={ci.menuItem.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-md"
                >
                  <img src={ci.menuItem.image} alt={ci.menuItem.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-display text-lg">{ci.menuItem.name}</h3>
                    <p className="text-primary font-bold">${ci.menuItem.price} c/u</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(ci.menuItem.id, ci.quantity - 1)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                      <FiMinus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold">{ci.quantity}</span>
                    <button onClick={() => updateQuantity(ci.menuItem.id, ci.quantity + 1)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <p className="font-bold text-lg w-20 text-right">${(ci.menuItem.price * ci.quantity).toFixed(0)}</p>
                  <button onClick={() => removeItem(ci.menuItem.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <FiTrash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          <button onClick={() => setStep('details')} className="btn-primary w-full text-lg">
            Continuar al Checkout
          </button>
        </motion.div>
      )}

      {step === 'details' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-3xl font-display mb-8">Datos del Pedido</h2>
          <div className="space-y-4 mb-8">
            <input type="text" placeholder="Nombre completo *" value={customerName} onChange={e => setCustomerName(e.target.value)} className="input-field" />
            <input type="tel" placeholder="Teléfono *" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="input-field" />
            <input type="email" placeholder="Email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className="input-field" />
          </div>
          <div className="flex gap-4">
            <button onClick={() => setStep('cart')} className="btn-outline flex-1">Volver</button>
            <button
              onClick={() => { if (customerName && customerPhone) setStep('payment'); else toast.error('Nombre y teléfono son requeridos') }}
              className="btn-primary flex-1"
            >
              Siguiente
            </button>
          </div>
        </motion.div>
      )}

      {step === 'payment' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-3xl font-display mb-8">Método de Pago</h2>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { key: 'cash', label: 'Efectivo', icon: '💵', desc: 'Paga al recoger' },
              { key: 'wompi', label: 'Wompi', icon: '💳', desc: 'Tarjeta / PSE' },
              { key: 'nequi', label: 'Nequi', icon: '📱', desc: 'Transferencia' },
              { key: 'daviplata', label: 'DaviPlata', icon: '📲', desc: 'Transferencia' },
            ].map(m => (
              <button
                key={m.key}
                onClick={() => setPaymentMethod(m.key as any)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  paymentMethod === m.key ? 'border-primary bg-primary/5 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{m.icon}</span>
                <div className="font-bold mt-2">{m.label}</div>
                <div className="text-sm text-gray-500">{m.desc}</div>
              </button>
            ))}
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="flex justify-between text-xl font-bold">
              <span>Total a pagar</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={() => setStep('details')} className="btn-outline flex-1">Volver</button>
            <button
              onClick={handleOrder}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Registrando...' : <><FiMessageCircle size={20} /> Enviar Pedido</>}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
