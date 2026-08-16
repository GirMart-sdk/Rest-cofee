import { Router, Response } from 'express'
import { authenticate, requireAdmin, AuthRequest, optionalAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validation.js'
import { auditMiddleware } from '../services/audit.service.js'
import { ReservationService } from '../services/reservation.service.js'
import { whatsappService } from '../services/whatsapp.service.js'
import { config } from '../config/index.js'
import { z } from 'zod'

const router = Router()

function buildReservationSummary(reservation: {
  name: string
  phone: string
  date: Date
  time: string
  guests: number
  notes?: string | null
  table?: { number: number } | null
}): string {
  const tableText = reservation.table ? `Mesa: ${reservation.table.number}` : 'Mesa: Por asignar'
  return [
    '📅 *Nueva Reserva - Hostal Cofee*',
    `Nombre: ${reservation.name}`,
    `Tel: ${reservation.phone}`,
    `Fecha: ${reservation.date.toLocaleDateString('es-CO')}`,
    `Hora: ${reservation.time}`,
    `Personas: ${reservation.guests}`,
    tableText,
    reservation.notes ? `Notas: ${reservation.notes}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

function notifyReservation(reservation: Parameters<typeof buildReservationSummary>[0]) {
  void whatsappService.notify({
    to: config.whatsapp.phone,
    text: buildReservationSummary(reservation),
  })
}

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { page, limit } = req.query
  const result = await ReservationService.getAll(req.user!.id, req.user!.role, {
    page: page ? parseInt(page as string, 10) : undefined,
    limit: limit ? parseInt(limit as string, 10) : undefined,
  })
  res.json({
    success: true,
    data: result.items,
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
  })
})

router.get('/tables', async (_req, res: Response) => {
  const tables = await ReservationService.getTables()
  res.json({ success: true, data: tables })
})

const reservationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required').max(100),
    phone: z.string().trim().min(1, 'Phone is required').max(20),
    email: z.string().trim().email().max(255).optional(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' }),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
    guests: z.number().int().min(1, 'At least 1 guest').max(50, 'Maximum 50 guests'),
    tableId: z.string().cuid().optional(),
    notes: z.string().max(500, 'Notes max 500 characters').optional(),
  }),
})

router.post('/', optionalAuth, validate(reservationSchema), async (req, res: Response) => {
  const { name, phone, email, date, time, guests, tableId, notes } = req.body
  const reservation = await ReservationService.create({
    name,
    phone,
    email,
    date,
    time,
    guests,
    tableId,
    notes,
    userId: (req as AuthRequest).user?.id,
  })
  notifyReservation(reservation)
  res.status(201).json({ success: true, data: reservation })
})

const updateStatusSchema = z.object({
  body: z.object({ status: z.enum(['pending', 'confirmed', 'cancelled']) }),
  params: z.object({ id: z.string().cuid('Invalid reservation ID') }),
})

router.patch(
  '/:id/status',
  authenticate,
  requireAdmin,
  auditMiddleware('reservation.status', 'reservation', {
    getResourceId: (req) => req.params.id,
    getDetails: (req) => ({ status: req.body.status }),
  }),
  validate(updateStatusSchema),
  async (req: AuthRequest, res: Response) => {
    const reservation = await ReservationService.updateStatus(req.params.id, req.body.status)
    res.json({ success: true, data: reservation })
  },
)

export default router
