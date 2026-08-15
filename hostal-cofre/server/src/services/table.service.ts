import prisma from '../db.js'

export class TableService {
  static async getAll() {
    return prisma.table.findMany({
      orderBy: { number: 'asc' },
      include: {
        orders: {
          where: { status: { in: ['pending', 'preparing', 'ready'] } },
          include: { items: { include: { menuItem: true } } },
        },
        reservations: {
          where: { status: { in: ['pending', 'confirmed'] } },
        },
      },
    })
  }

  static async getActive() {
    const tables = await prisma.table.findMany({
      orderBy: { number: 'asc' },
      include: {
        orders: {
          where: { status: { in: ['pending', 'preparing', 'ready'] } },
          include: { items: { include: { menuItem: true } } },
        },
      },
    })

    return tables.map((table) => ({
      ...table,
      isOccupied: table.orders.length > 0,
      activeOrderCount: table.orders.length,
      totalPending: table.orders.reduce((sum, o) => sum + o.total, 0),
    }))
  }

  static async getByNumber(number: number) {
    const table = await prisma.table.findUnique({
      where: { number },
      include: {
        orders: {
          where: { status: { in: ['pending', 'preparing', 'ready'] } },
          include: { items: { include: { menuItem: true } } },
        },
      },
    })
    if (!table) throw Object.assign(new Error('Table not found'), { statusCode: 404 })
    return table
  }

  static async create(data: { number: number; capacity: number; zone: string }) {
    const existing = await prisma.table.findUnique({ where: { number: data.number } })
    if (existing) throw Object.assign(new Error('Table number already exists'), { statusCode: 400 })

    return prisma.table.create({
      data: {
        number: data.number,
        capacity: data.capacity,
        zone: data.zone as any,
      },
    })
  }

  static async update(
    id: string,
    data: Partial<{ number: number; capacity: number; zone: string }>,
  ) {
    const table = await prisma.table.findUnique({ where: { id } })
    if (!table) throw Object.assign(new Error('Table not found'), { statusCode: 404 })

    if (data.number && data.number !== table.number) {
      const existing = await prisma.table.findUnique({ where: { number: data.number } })
      if (existing)
        throw Object.assign(new Error('Table number already exists'), { statusCode: 400 })
    }

    return prisma.table.update({
      where: { id },
      data: {
        ...(data.number !== undefined && { number: data.number }),
        ...(data.capacity !== undefined && { capacity: data.capacity }),
        ...(data.zone !== undefined && { zone: data.zone as any }),
      },
    })
  }

  static async delete(id: string) {
    const table = await prisma.table.findUnique({
      where: { id },
      include: {
        orders: { where: { status: { in: ['pending', 'preparing', 'ready'] } } },
        reservations: { where: { status: { in: ['pending', 'confirmed'] } } },
      },
    })
    if (!table) throw Object.assign(new Error('Table not found'), { statusCode: 404 })
    if (table.orders.length > 0)
      throw Object.assign(new Error('Cannot delete table with active orders'), { statusCode: 400 })
    if (table.reservations.length > 0)
      throw Object.assign(new Error('Cannot delete table with active reservations'), {
        statusCode: 400,
      })

    return prisma.table.delete({ where: { id } })
  }
}
