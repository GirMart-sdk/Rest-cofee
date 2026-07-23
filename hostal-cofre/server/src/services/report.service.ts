import prisma from '../db.js'

function getDayRange(dateStr?: string) {
  const now = dateStr ? new Date(dateStr + 'T12:00:00') : new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
  return { start, end }
}

export class ReportService {
  static async getDailyReport(date?: string) {
    const { start, end } = getDayRange(date)

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: start, lte: end },
        status: { not: 'cancelled' },
      },
      include: { items: { include: { menuItem: true } } },
    })

    const totalSales = orders.reduce((sum, o) => sum + o.total, 0)
    const totalOrders = orders.length
    const cashSales = orders.filter(o => o.paymentMethod === 'cash').reduce((sum, o) => sum + o.total, 0)
    const digitalSales = orders.filter(o => o.paymentMethod !== 'cash').reduce((sum, o) => sum + o.total, 0)
    const deliveryOrders = orders.filter(o => o.orderType === 'domicilio').length
    const dineInOrders = orders.filter(o => o.orderType === 'mesa').length
    const posOrders = orders.filter(o => o.orderType === 'tienda').length

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

    const hourlySales: Record<number, number> = {}
    for (const order of orders) {
      const hour = new Date(order.createdAt).getHours()
      hourlySales[hour] = (hourlySales[hour] || 0) + order.total
    }

    const shifts = await prisma.shift.findMany({
      where: {
        openedAt: { gte: start, lte: end },
      },
    })

    const shiftsLive = await Promise.all(shifts.map(async (s) => {
      const shiftOrders = orders.filter(o => o.shiftId === s.id)
      const totalSales = shiftOrders.reduce((sum, o) => sum + o.total, 0)
      const totalOrders = shiftOrders.length
      const cashReceived = shiftOrders.filter(o => o.paymentMethod === 'cash').reduce((sum, o) => sum + o.total, 0)
      const digitalTotal = shiftOrders.filter(o => o.paymentMethod !== 'cash').reduce((sum, o) => sum + o.total, 0)
      return {
        id: s.id,
        cashier: s.cashierName,
        shiftPeriod: s.shiftPeriod,
        openingCash: s.openingCash,
        closingCash: s.closingCash,
        totalSales: s.status === 'closed' ? s.totalSales : totalSales,
        totalOrders: s.status === 'closed' ? s.totalOrders : totalOrders,
        cashReceived: s.status === 'closed' ? s.cashReceived : cashReceived,
        digitalTotal: s.status === 'closed' ? s.digitalTotal : digitalTotal,
        status: s.status,
        openedAt: s.openedAt,
        closedAt: s.closedAt,
      }
    }))

    return {
      date: start.toISOString().split('T')[0],
      summary: {
        totalSales: parseFloat(totalSales.toFixed(2)),
        totalOrders,
        cashSales: parseFloat(cashSales.toFixed(2)),
        digitalSales: parseFloat(digitalSales.toFixed(2)),
        deliveryOrders,
        dineInOrders,
        posOrders,
        averageTicket: totalOrders > 0 ? parseFloat((totalSales / totalOrders).toFixed(2)) : 0,
      },
      topItems,
      hourlySales: Object.entries(hourlySales).map(([hour, sales]) => ({
        hour: parseInt(hour),
        sales: parseFloat((sales as number).toFixed(2)),
      })).sort((a, b) => a.hour - b.hour),
      shifts: shiftsLive,
    }
  }

  static async getWeeklySummary() {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: weekAgo, lte: now },
        status: { not: 'cancelled' },
      },
    })

    const dailyData: Record<string, { sales: number; count: number }> = {}
    for (const order of orders) {
      const day = new Date(order.createdAt).toISOString().split('T')[0]
      if (!dailyData[day]) dailyData[day] = { sales: 0, count: 0 }
      dailyData[day].sales += order.total
      dailyData[day].count += 1
    }

    return {
      totalSales: orders.reduce((sum, o) => sum + o.total, 0),
      totalOrders: orders.length,
      dailyBreakdown: Object.entries(dailyData).map(([date, data]) => ({
        date,
        sales: parseFloat((data.sales as number).toFixed(2)),
        count: data.count as number,
      })).sort((a, b) => a.date.localeCompare(b.date)),
    }
  }
}
