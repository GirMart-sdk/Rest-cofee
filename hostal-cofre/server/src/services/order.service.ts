import prisma from '../db.js'

export class OrderService {
  static async getAll(userId?: string, role?: string) {
    const where = role === 'admin' ? {} : { userId }
    return prisma.order.findMany({
      where,
      include: { items: { include: { menuItem: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }

  static async getById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { menuItem: true } } },
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
  }) {
    const menuItemIds = data.items.map(item => item.menuItemId)
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
    })

    const foundIds = new Set(menuItems.map(item => item.id))
    if (foundIds.size !== menuItemIds.length) {
      const notFoundIds = menuItemIds.filter(id => !foundIds.has(id))
      throw Object.assign(new Error('Menu items not found'), {
        statusCode: 400,
        details: { notFound: notFoundIds },
      })
    }

    const priceMap = new Map(menuItems.map(item => [item.id, item.price]))
    let total = 0
    const orderItems = data.items.map(item => {
      const price = priceMap.get(item.menuItemId)!
      total += price * item.quantity
      return { menuItemId: item.menuItemId, quantity: item.quantity, price }
    })

    return prisma.order.create({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        total: parseFloat(total.toFixed(2)),
        paymentMethod: data.paymentMethod as any,
        userId: data.userId,
        items: { create: orderItems },
      },
      include: { items: true },
    })
  }

  static async updateStatus(id: string, status: string) {
    await this.getById(id)
    return prisma.order.update({ where: { id }, data: { status: status as any } })
  }

  static async updatePayment(id: string, paymentStatus: string, paymentId?: string) {
    await this.getById(id)
    return prisma.order.update({
      where: { id },
      data: { paymentStatus: paymentStatus as any, paymentId },
    })
  }
}
