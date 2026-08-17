import { ReservationStatus } from '@prisma/client'
import prisma from '../db.js'

// Ventana de ocupación estimada por reserva (en horas).
const OCCUPANCY_WINDOW_MIN = 2 * 60

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd
}

export class ReservationService {
  static async getAll(
    userId?: string,
    role?: string,
    pagination?: { page?: number; limit?: number },
  ) {
    const where = role === 'admin' ? {} : { userId }
    const page = Math.max(1, pagination?.page ?? 1)
    const limit = Math.min(100, Math.max(1, pagination?.limit ?? 100))
    const [items, total] = await Promise.all([
      prisma.reservation.findMany({
        where,
        include: { table: true },
        orderBy: { date: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.reservation.count({ where }),
    ])
    return { items, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) }
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
    if (data.tableId) {
      await this.assertTableAvailable(data.tableId, data.date, data.time)
    }
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

  static async assertTableAvailable(tableId: string, date: string, time: string) {
    const targetStart = toMinutes(time)
    const targetEnd = targetStart + OCCUPANCY_WINDOW_MIN

    const existing = await prisma.reservation.findMany({
      where: {
        tableId,
        date: new Date(date),
        status: { not: 'cancelled' },
      },
    })

    for (const reservation of existing) {
      const otherStart = toMinutes(reservation.time)
      const otherEnd = otherStart + OCCUPANCY_WINDOW_MIN
      if (overlaps(targetStart, targetEnd, otherStart, otherEnd)) {
        throw Object.assign(new Error('Table is already reserved at that time'), {
          statusCode: 409,
        })
      }
    }
  }

  static async updateStatus(id: string, status: string) {
    await this.getById(id)
    return prisma.reservation.update({
      where: { id },
      data: { status: status as ReservationStatus },
    })
  }
}
