import prisma from '../db.js'

export class ReservationService {
  static async getAll(userId?: string, role?: string) {
    const where = role === 'admin' ? {} : { userId }
    return prisma.reservation.findMany({
      where,
      include: { table: true },
      orderBy: { date: 'asc' },
    })
  }

  static async getById(id: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: { table: true },
    })
    if (!reservation) throw Object.assign(new Error('Reservation not found'), { statusCode: 404 })
    return reservation
  }

  static async getTables() {
    return prisma.table.findMany({ orderBy: { number: 'asc' } })
  }

  static async create(data: {
    name: string
    phone: string
    email?: string
    date: string
    time: string
    guests: number
    tableId?: string
    notes?: string
    userId?: string
  }) {
    return prisma.reservation.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        date: new Date(data.date),
        time: data.time,
        guests: data.guests,
        tableId: data.tableId,
        notes: data.notes,
        userId: data.userId,
      },
      include: { table: true },
    })
  }

  static async updateStatus(id: string, status: string) {
    await this.getById(id)
    return prisma.reservation.update({ where: { id }, data: { status: status as any } })
  }
}
