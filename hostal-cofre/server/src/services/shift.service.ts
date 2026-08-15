import prisma from '../db.js'

export class ShiftService {
  static async getAll() {
    return prisma.shift.findMany({
      include: { user: { select: { id: true, name: true } }, orders: true },
      orderBy: { openedAt: 'desc' },
    })
  }

  static async getCurrent() {
    const shifts = await prisma.shift.findMany({
      where: { status: 'open' },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { openedAt: 'desc' },
    })

    const shiftsLive = await Promise.all(
      shifts.map(async (shift) => {
        const orders = await prisma.order.findMany({
          where: { shiftId: shift.id, status: { not: 'cancelled' } },
        })
        const totalSales = orders.reduce((sum, o) => sum + o.total, 0)
        const totalOrders = orders.length
        const cashReceived = orders
          .filter((o) => o.paymentMethod === 'cash')
          .reduce((sum, o) => sum + o.total, 0)
        const digitalTotal = orders
          .filter((o) => o.paymentMethod !== 'cash')
          .reduce((sum, o) => sum + o.total, 0)
        return { ...shift, totalSales, totalOrders, cashReceived, digitalTotal }
      }),
    )

    return shiftsLive
  }

  static async getById(id: string) {
    const shift = await prisma.shift.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true } }, orders: { include: { items: true } } },
    })
    if (!shift) throw Object.assign(new Error('Shift not found'), { statusCode: 404 })
    return shift
  }

  static async open(data: {
    userId: string
    cashierName: string
    shiftPeriod: string
    openingCash: number
    notes?: string
  }) {
    return prisma.shift.create({
      data: {
        userId: data.userId,
        cashierName: data.cashierName,
        shiftPeriod: data.shiftPeriod as any,
        openingCash: data.openingCash,
        notes: data.notes,
        status: 'open',
      },
      include: { user: { select: { id: true, name: true } } },
    })
  }

  static async close(id: string, closingCash: number, notes?: string) {
    const shift = await this.getById(id)
    if (shift.status === 'closed') {
      throw Object.assign(new Error('Shift is already closed'), { statusCode: 400 })
    }

    const orders = await prisma.order.findMany({
      where: { shiftId: id, status: { not: 'cancelled' } },
    })

    const totalSales = orders.reduce((sum, o) => sum + o.total, 0)
    const cashReceived = orders
      .filter((o) => o.paymentMethod === 'cash')
      .reduce((sum, o) => sum + o.total, 0)
    const digitalTotal = orders
      .filter((o) => o.paymentMethod !== 'cash')
      .reduce((sum, o) => sum + o.total, 0)

    return prisma.shift.update({
      where: { id },
      data: {
        status: 'closed',
        closingCash,
        totalSales: parseFloat(totalSales.toFixed(2)),
        totalOrders: orders.length,
        cashReceived: parseFloat(cashReceived.toFixed(2)),
        digitalTotal: parseFloat(digitalTotal.toFixed(2)),
        closedAt: new Date(),
        ...(notes && { notes }),
      },
      include: { user: { select: { id: true, name: true } } },
    })
  }

  static async getShiftSummary(id: string) {
    const shift = await this.getById(id)
    const orders = await prisma.order.findMany({
      where: { shiftId: id, status: { not: 'cancelled' } },
      include: { items: { include: { menuItem: true } } },
    })

    const paymentMethods: Record<string, number> = {}
    const orderTypes: Record<string, number> = {}
    for (const order of orders) {
      paymentMethods[order.paymentMethod] = (paymentMethods[order.paymentMethod] || 0) + order.total
      orderTypes[order.orderType] = (orderTypes[order.orderType] || 0) + 1
    }

    return {
      ...shift,
      orders,
      breakdown: { paymentMethods, orderTypes },
    }
  }

  static async getByPeriod(date?: string) {
    const targetDate = date ? new Date(date + 'T00:00:00.000Z') : new Date()
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0))
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999))

    return prisma.shift.findMany({
      where: {
        openedAt: { gte: startOfDay, lte: endOfDay },
      },
      include: { user: { select: { id: true, name: true } }, orders: true },
      orderBy: { openedAt: 'asc' },
    })
  }
}
