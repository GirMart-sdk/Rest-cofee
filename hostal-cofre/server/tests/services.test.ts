import { describe, it, expect, vi } from 'vitest'

vi.mock('../src/db.js', () => ({
  default: {
    menuItem: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

import prisma from '../src/db.js'
import { MenuService } from '../src/services/menu.service.js'
import { DeliveryService } from '../src/services/delivery.service.js'

const prismaMock = prisma as unknown as {
  menuItem: {
    findMany: ReturnType<typeof vi.fn>
    findUnique: ReturnType<typeof vi.fn>
    create: ReturnType<typeof vi.fn>
    update: ReturnType<typeof vi.fn>
    delete: ReturnType<typeof vi.fn>
  }
}

describe('MenuService', () => {
  const item = {
    id: 'm1',
    name: 'Pizza',
    description: 'x',
    price: 10,
    category: 'pizza',
    available: true,
    image: null,
  }

  it('should return all menu items', async () => {
    prismaMock.menuItem.findMany.mockResolvedValue([item])
    const items = await MenuService.getAll()
    expect(items).toHaveLength(1)
  })

  it('should get an item by id', async () => {
    prismaMock.menuItem.findUnique.mockResolvedValue(item)
    await expect(MenuService.getById('m1')).resolves.toEqual(item)
  })

  it('should throw 404 when item does not exist', async () => {
    prismaMock.menuItem.findUnique.mockResolvedValue(null)
    await expect(MenuService.getById('m1')).rejects.toThrow('Menu item not found')
  })

  it('should create an item', async () => {
    prismaMock.menuItem.create.mockResolvedValue(item)
    await MenuService.create({ name: 'Pizza', description: 'x', price: 10, category: 'pizza' })
    expect(prismaMock.menuItem.create).toHaveBeenCalled()
  })

  it('should update an item', async () => {
    prismaMock.menuItem.findUnique.mockResolvedValue(item)
    prismaMock.menuItem.update.mockResolvedValue({ ...item, price: 15 })
    const updated = await MenuService.update('m1', { price: 15 })
    expect(updated.price).toBe(15)
  })

  it('should throw 404 when updating a missing item', async () => {
    prismaMock.menuItem.findUnique.mockResolvedValue(null)
    await expect(MenuService.update('m1', { price: 15 })).rejects.toThrow('Menu item not found')
  })

  it('should delete an item', async () => {
    prismaMock.menuItem.findUnique.mockResolvedValue(item)
    prismaMock.menuItem.delete.mockResolvedValue(item)
    await MenuService.delete('m1')
    expect(prismaMock.menuItem.delete).toHaveBeenCalledWith({ where: { id: 'm1' } })
  })
})

describe('DeliveryService', () => {
  it('should return all delivery zones', () => {
    const zones = DeliveryService.getZones()
    expect(zones).toHaveLength(3)
    expect(zones[0]).toHaveProperty('fee')
    expect(zones[0]).toHaveProperty('estimatedMinutes')
  })

  it('should return fee for a known zone', () => {
    expect(DeliveryService.getZoneFee('centro')).toBe(3000)
    expect(DeliveryService.getZoneFee('lejano')).toBe(8000)
  })

  it('should return 0 fee for an unknown zone', () => {
    expect(DeliveryService.getZoneFee('unknown')).toBe(0)
  })

  it('should return config for a known zone and null otherwise', () => {
    expect(DeliveryService.getZoneConfig('periurbano')).not.toBeNull()
    expect(DeliveryService.getZoneConfig('unknown')).toBeNull()
  })

  it('should calculate total with delivery fee', () => {
    const result = DeliveryService.calculateTotal(100, 'centro')
    expect(result).toEqual({ fee: 3000, total: 3100 })
  })

  it('should calculate total without delivery fee', () => {
    const result = DeliveryService.calculateTotal(100)
    expect(result).toEqual({ fee: 0, total: 100 })
  })
})
