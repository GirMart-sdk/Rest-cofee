import prisma from '../db.js'
import { DeliveryService } from './delivery.service.js'
import { metrics } from '../utils/metrics.js'

function generateReceiptNumber(): string {
  const date = new Date()
  const prefix = date.toISOString().slice(2, 10).replace(/-/g, '')
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')
  return `HC-${prefix}-${random}`
}

export class OrderService {
  static async getAll(
    userId?: string,
    role?: string,
    filters?: { orderType?: string; status?: string },
  ) {
    const where: any = role === 'admin' ? {} : { userId }
    if (filters?.orderType) where.orderType = filters.orderType
    if (filters?.status) where.status = filters.status
    return prisma.order.findMany({
      where,
      include: { items: { include: { menuItem: true } }, table: true, shift: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  static async getById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { menuItem: true } }, table: true, shift: true },
    })
    if (!order) throw Object.assign(new Error('Order not found'), { statusCode: 404 })
    return order
  }

  static async create(data: {
    customerName: string
    customerPhone: string
    customerEmail?: string
    paymentMethod: string
    userId?: string
    items: Array<{ menuItemId: string; quantity: number }>
    orderType?: string
    tableId?: string
    address?: string
    deliveryZone?: string
    deliveryNotes?: string
    shiftId?: string
  }) {
    const menuItemIds = data.items.map((item) => item.menuItemId)
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
    })

    const foundIds = new Set(menuItems.map((item) => item.id))
    if (foundIds.size !== menuItemIds.length) {
      const notFoundIds = menuItemIds.filter((id) => !foundIds.has(id))
      throw Object.assign(new Error('Menu items not found'), {
        statusCode: 400,
        details: { notFound: notFoundIds },
      })
    }

    const priceMap = new Map(menuItems.map((item) => [item.id, item.price]))
    let subtotal = 0
    const orderItems = data.items.map((item) => {
      const price = priceMap.get(item.menuItemId)!
      subtotal += price * item.quantity
      return { menuItemId: item.menuItemId, quantity: item.quantity, price }
    })

    const deliveryFee = data.deliveryZone ? DeliveryService.getZoneFee(data.deliveryZone) : 0
    const total = parseFloat((subtotal + deliveryFee).toFixed(2))

    let shiftId = data.shiftId || null
    if (!shiftId) {
      const openShift = await prisma.shift.findFirst({
        where: { status: 'open' },
        orderBy: { openedAt: 'desc' },
      })
      if (openShift) shiftId = openShift.id
    }

    const order = await prisma.order.create({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        total,
        paymentMethod: data.paymentMethod as any,
        userId: data.userId,
        orderType: (data.orderType as any) || 'tienda',
        tableId: data.tableId || null,
        address: data.address || null,
        deliveryZone: (data.deliveryZone as any) || null,
        deliveryFee,
        deliveryNotes: data.deliveryNotes || null,
        receiptNumber: generateReceiptNumber(),
        shiftId,
        items: { create: orderItems },
      },
      include: { items: { include: { menuItem: true } }, table: true },
    })

    if (shiftId) {
      await prisma.shift.update({
        where: { id: shiftId },
        data: {
          totalSales: { increment: total },
          totalOrders: { increment: 1 },
          cashReceived: data.paymentMethod === 'cash' ? { increment: total } : undefined,
          digitalTotal: data.paymentMethod !== 'cash' ? { increment: total } : undefined,
        },
      })
    }

    metrics.inc('ordersCreated')
    return order
  }

  static async createFromTable(data: {
    customerName: string
    customerPhone?: string
    customerEmail?: string
    paymentMethod: string
    userId?: string
    items: Array<{ menuItemId: string; quantity: number }>
    tableNumber: number
    shiftId?: string
  }) {
    const table = await prisma.table.findUnique({ where: { number: data.tableNumber } })
    if (!table) throw Object.assign(new Error('Table not found'), { statusCode: 404 })

    return this.create({
      ...data,
      customerName: data.customerName,
      customerPhone: data.customerPhone || 'N/A',
      orderType: 'mesa',
      tableId: table.id,
      shiftId: data.shiftId,
    })
  }

  static async getActiveOrdersByTable(tableNumber: number) {
    const table = await prisma.table.findUnique({ where: { number: tableNumber } })
    if (!table) throw Object.assign(new Error('Table not found'), { statusCode: 404 })

    return prisma.order.findMany({
      where: {
        tableId: table.id,
        status: { in: ['pending', 'preparing', 'ready'] },
      },
      include: { items: { include: { menuItem: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }

  static async updateStatus(id: string, status: string) {
    await this.getById(id)
    const updated = await prisma.order.update({ where: { id }, data: { status: status as any } })
    if (status === 'cancelled') metrics.inc('ordersCancelled')
    return updated
  }

  static async updatePayment(id: string, paymentStatus: string, paymentId?: string) {
    await this.getById(id)
    return prisma.order.update({
      where: { id },
      data: { paymentStatus: paymentStatus as any, paymentId },
    })
  }

  static async getDailySales(date?: string) {
    const targetDate = date ? new Date(date) : new Date()
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0))
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999))

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startOfDay, lte: endOfDay },
        status: { not: 'cancelled' },
      },
      include: { items: { include: { menuItem: true } } },
    })

    const totalSales = orders.reduce((sum, o) => sum + o.total, 0)
    const totalOrders = orders.length
    const cashSales = orders
      .filter((o) => o.paymentMethod === 'cash')
      .reduce((sum, o) => sum + o.total, 0)
    const digitalSales = orders
      .filter((o) => o.paymentMethod !== 'cash')
      .reduce((sum, o) => sum + o.total, 0)
    const deliveryOrders = orders.filter((o) => o.orderType === 'domicilio').length
    const dineInOrders = orders.filter((o) => o.orderType === 'mesa').length
    const posOrders = orders.filter((o) => o.orderType === 'tienda').length

    const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {}
    for (const order of orders) {
      for (const item of order.items) {
        const key = item.menuItemId
        if (!itemCounts[key]) {
          itemCounts[key] = { name: item.menuItem?.name || 'N/A', count: 0, revenue: 0 }
        }
        itemCounts[key].count += item.quantity
        itemCounts[key].revenue += item.price * item.quantity
      }
    }
    const topItems = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      date: startOfDay.toISOString().split('T')[0],
      totalSales: parseFloat(totalSales.toFixed(2)),
      totalOrders,
      cashSales: parseFloat(cashSales.toFixed(2)),
      digitalSales: parseFloat(digitalSales.toFixed(2)),
      deliveryOrders,
      dineInOrders,
      posOrders,
      averageTicket: totalOrders > 0 ? parseFloat((totalSales / totalOrders).toFixed(2)) : 0,
      topItems,
    }
  }
}
