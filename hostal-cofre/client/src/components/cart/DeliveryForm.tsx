import { motion } from 'framer-motion'
import { DeliveryZoneType } from '../../types'
import { useCart } from '../../context/CartContext'
import { Button, Input } from '../ui'
import { formatCOP } from '../../utils/format'
import { FiMapPin, FiClock, FiAlertCircle } from 'react-icons/fi'

export default function DeliveryForm({
  address,
  deliveryNotes,
  onAddressChange,
  onDeliveryNotesChange,
  onNext,
  onBack,
}: {
  address: string
  deliveryNotes: string
  onAddressChange: (value: string) => void
  onDeliveryNotesChange: (value: string) => void
  onNext: () => void
  onBack: () => void
}) {
  const { zones, zonesError, reloadZones, deliveryZone, setDeliveryZone } = useCart()

  const handleContinue = () => {
    if (!deliveryZone || !address.trim()) return
    onNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-display mb-4 flex items-center gap-2">
          <FiMapPin className="text-primary" /> Dirección de entrega
        </h3>
        <Input
          type="text"
          placeholder="Calle, número, barrio, referencias..."
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
        />
        <textarea
          placeholder="Indicaciones adicionales (optional): apartamento, punto de referencia, etc."
          value={deliveryNotes}
          onChange={(e) => onDeliveryNotesChange(e.target.value)}
          className="input-field h-20 resize-none mt-3"
        />
      </div>

      <div>
        <h3 className="text-xl font-display mb-4">Zona de entrega</h3>
        {zonesError ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <FiAlertCircle className="mx-auto text-red-400 text-3xl mb-3" />
            <p className="text-red-700 font-semibold mb-1">
              No se pudieron cargar las zonas de entrega
            </p>
            <p className="text-red-500 text-sm mb-4">Verifica tu conexión e inténtalo de nuevo</p>
            <Button variant="outline" onClick={reloadZones}>
              Reintentar
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {zones.map((zone) => (
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
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      deliveryZone === zone.name
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
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
                  <div className="font-bold text-primary">{formatCOP(zone.fee)}</div>
                  <div className="text-xs text-gray-400">envío</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Volver
        </Button>
        <Button
          className="flex-1"
          onClick={handleContinue}
          disabled={zonesError || !deliveryZone || !address.trim()}
        >
          Continuar
        </Button>
      </div>
    </motion.div>
  )
}
