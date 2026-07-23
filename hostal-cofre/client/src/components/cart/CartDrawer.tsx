import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { api, whatsappService } from '../../services/api'
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiMessageCircle, FiTruck, FiHome, FiGrid } from 'react-icons/fi'
import toast from 'react-hot-toast'
import DeliveryForm from './DeliveryForm'

type CheckoutStep = 'cart' | 'type' | 'delivery' | 'details' | 'payment'

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, total, clearCart, itemCount, orderType, setOrderType, deliveryZone, deliveryFee, grandTotal } = useCart()
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
      }))

      await api.post('/orders', {
        customerName,
        customerPhone,
        ...(customerEmail ? { customerEmail } : {}),
        items: orderItems,
        paymentMethod,
        orderType,
        deliveryZone: orderType === 'domicilio' ? deliveryZone : undefined,
      })

      if (orderType !== 'mesa') {
        const orderLines = items.map(i => `${i.quantity}x ${i.menuItem.name} - $${(i.menuItem.price * i.quantity).toFixed(0)}`)
        const typeLabel = orderType === 'domicilio' ? 'Domicilio' : 'Tienda'
        const summary = orderLines.join('\n') + `\n\nTipo: ${typeLabel}` + (orderType === 'domicilio' ? `\nEnvío: $${deliveryFee}` : '') + `\n\n*Total: $${(orderType === 'domicilio' ? grandTotal : total).toFixed(2)}*\nMétodo de pago: ${paymentMethod.toUpperCase()}\nCliente: ${customerName}\nTel: ${customerPhone}`
        const whatsappPhone = import.meta.env.VITE_WHATSAPP_PHONE || '573001234567'
        whatsappService.sendOrder(whatsappPhone, summary)
      }

      toast.success(orderType === 'mesa' ? 'Pedido registrado en mesa' : 'Pedido registrado y enviado por WhatsApp')
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
              <span>Subtotal</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          <button onClick={() => setStep('type')} className="btn-primary w-full text-lg">
            Continuar al Checkout
          </button>
        </motion.div>
      )}

      {step === 'type' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-3xl font-display mb-8">¿Cómo quieres tu pedido?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { key: 'domicilio' as const, label: 'Domicilio', icon: FiTruck, desc: 'Te lo llevamos a tu dirección', color: 'bg-orange-500' },
              { key: 'tienda' as const, label: 'Recoger en tienda', icon: FiHome, desc: 'Pasas a buscar tu pedido', color: 'bg-blue-500' },
              { key: 'mesa' as const, label: 'Para la mesa', icon: FiGrid, desc: 'Comer en el restaurante', color: 'bg-green-500' },
            ].map(type => (
              <button
                key={type.key}
                onClick={() => setOrderType(type.key)}
                className={`p-6 rounded-xl border-2 text-center transition-all ${
                  orderType === type.key
                    ? 'border-primary bg-primary/5 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                <div className={`${type.color} w-14 h-14 rounded-xl flex items-center justify-center text-white mx-auto mb-3`}>
                  <type.icon size={24} />
                </div>
                <div className="font-bold text-lg">{type.label}</div>
                <div className="text-sm text-gray-500 mt-1">{type.desc}</div>
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            <button onClick={() => setStep('cart')} className="btn-outline flex-1">Volver</button>
            <button onClick={() => setStep(orderType === 'domicilio' ? 'delivery' : 'details')} className="btn-primary flex-1">Siguiente</button>
          </div>
        </motion.div>
      )}

      {step === 'delivery' && (
        <DeliveryForm
          onBack={() => setStep('type')}
          onNext={() => setStep('details')}
        />
      )}

      {step === 'details' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-3xl font-display mb-8">
            {orderType === 'mesa' ? 'Datos Rápidos' : 'Datos del Pedido'}
          </h2>
          {orderType === 'mesa' && (
            <p className="text-gray-500 text-sm mb-4 -mt-6">Solo nombre y teléfono para agilizar tu pedido en mesa</p>
          )}
          <div className="space-y-4 mb-8">
            <input type="text" placeholder="Nombre completo *" value={customerName} onChange={e => setCustomerName(e.target.value)} className="input-field" />
            <input type="tel" placeholder="Teléfono *" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="input-field" />
            {orderType !== 'mesa' && (
              <input type="email" placeholder="Email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className="input-field" />
            )}
          </div>
          <div className="flex gap-4">
            <button onClick={() => setStep(orderType === 'domicilio' ? 'delivery' : 'type')} className="btn-outline flex-1">Volver</button>
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

          <div className="bg-gray-50 rounded-2xl p-6 mb-8 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            {orderType === 'domicilio' && deliveryFee > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Envío ({deliveryZone})</span>
                <span>${deliveryFee.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between text-xl font-bold">
              <span>Total a pagar</span>
              <span className="text-primary">${(orderType === 'domicilio' ? grandTotal : total).toFixed(2)}</span>
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
