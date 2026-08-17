import { config } from '../config/index.js'

export interface DeliveryZoneConfig {
  name: string
  label: string
  fee: number
  estimatedMinutes: number
}

function parseDeliveryZones(): Record<string, DeliveryZoneConfig> {
  const raw = process.env.DELIVERY_ZONES
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as DeliveryZoneConfig[]
      const zones: Record<string, DeliveryZoneConfig> = {}
      for (const z of parsed) {
        zones[z.name] = z
      }
      return zones
    } catch {
      // fall through to defaults
    }
  }
  return {
    centro: {
      name: 'centro',
      label: config.restaurant.name
        ? `${config.restaurant.name} - Centro (0-2 km)`
        : 'Centro (0-2 km)',
      fee: 3000,
      estimatedMinutes: 20,
    },
    periurbano: {
      name: 'periurbano',
      label: config.restaurant.name
        ? `${config.restaurant.name} - Periurbano (2-5 km)`
        : 'Periurbano (2-5 km)',
      fee: 5000,
      estimatedMinutes: 35,
    },
    lejano: {
      name: 'lejano',
      label: config.restaurant.name
        ? `${config.restaurant.name} - Lejano (5-10 km)`
        : 'Lejano (5-10 km)',
      fee: 8000,
      estimatedMinutes: 50,
    },
  }
}

export const DELIVERY_ZONES: Record<string, DeliveryZoneConfig> = parseDeliveryZones()

export class DeliveryService {
  static getZones(): DeliveryZoneConfig[] {
    return Object.values(DELIVERY_ZONES)
  }

  static getZoneFee(zone: string): number {
    return DELIVERY_ZONES[zone]?.fee ?? 0
  }
}
