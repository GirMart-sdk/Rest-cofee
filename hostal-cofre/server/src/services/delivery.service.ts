export interface DeliveryZoneConfig {
  name: string
  label: string
  fee: number
  estimatedMinutes: number
}

export const DELIVERY_ZONES: Record<string, DeliveryZoneConfig> = {
  centro: {
    name: 'centro',
    label: 'Centro (0-2 km)',
    fee: 3000,
    estimatedMinutes: 20,
  },
  periurbano: {
    name: 'periurbano',
    label: 'Periurbano (2-5 km)',
    fee: 5000,
    estimatedMinutes: 35,
  },
  lejano: {
    name: 'lejano',
    label: 'Lejano (5-10 km)',
    fee: 8000,
    estimatedMinutes: 50,
  },
}

export class DeliveryService {
  static getZones(): DeliveryZoneConfig[] {
    return Object.values(DELIVERY_ZONES)
  }

  static getZoneFee(zone: string): number {
    return DELIVERY_ZONES[zone]?.fee ?? 0
  }

  static getZoneConfig(zone: string): DeliveryZoneConfig | null {
    return DELIVERY_ZONES[zone] ?? null
  }

  static calculateTotal(subtotal: number, zone?: string): { fee: number; total: number } {
    const fee = zone ? this.getZoneFee(zone) : 0
    return {
      fee,
      total: parseFloat((subtotal + fee).toFixed(2)),
    }
  }
}
