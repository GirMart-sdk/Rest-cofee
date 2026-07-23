import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DeliveryZoneConfig, DeliveryZoneType } from '../../types'
import { api } from '../../services/api'
import { useCart } from '../../context/CartContext'
import { FiMapPin, FiClock } from 'react-icons/fi'

export default function DeliveryForm({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { deliveryZone, setDeliveryZone } = useCart()
  const [zones, setZones] = useState<DeliveryZoneConfig[]>([])
  const [address, setAddress] = useState('')
  const [deliveryNotes, setDeliveryNotes] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/zones')
      .then(res => setZones(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleContinue = () => {
    if (!deliveryZone || !address.trim()) return
    onNext()
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-400">Cargando zonas de entrega...</p>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div>
        <h3 className="text-xl font-display mb-4 flex items-center gap-2">
          <FiMapPin className="text-primary" /> Dirección de entrega
        </h3>
        <input
          type="text"
          placeholder="Calle, número, barrio, referencias..."
          value={address}
          onChange={e => setAddress(e.target.value)}
          className="input-field"
        />
        <textarea
          placeholder="Indicaciones adicionales (optional): apartamento, punto de referencia, etc."
          value={deliveryNotes}
          onChange={e => setDeliveryNotes(e.target.value)}
          className="input-field h-20 resize-none mt-3"
        />
      </div>

      <div>
        <h3 className="text-xl font-display mb-4">Zona de entrega</h3>
        <div className="grid grid-cols-1 gap-3">
          {zones.map(zone => (
            <button
              key={zone.name}
              onClick={() => setDeliveryZone(zone.name as DeliveryZoneType)}
              className={`p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                deliveryZone === zone.name
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  deliveryZone === zone.name ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  <FiMapPin size={18} />
                </div>
                <div>
                  <div className="font-bold">{zone.label}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <FiClock size={12} /> ~{zone.estimatedMinutes} min
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-primary">${zone.fee.toLocaleString()}</div>
                <div className="text-xs text-gray-400">envío</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button onClick={onBack} className="btn-outline flex-1">Volver</button>
        <button
          onClick={handleContinue}
          disabled={!deliveryZone || !address.trim()}
          className="btn-primary flex-1 disabled:opacity-50"
        >
          Continuar
        </button>
      </div>
    </motion.div>
  )
}
