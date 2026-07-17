import { Router, Response } from 'express'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js'
import prisma from '../db.js'
import { validate } from '../middleware/validation.js'
import { z } from 'zod'

const router = Router()

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const where = req.user!.role === 'admin' ? {} : { userId: req.user!.id }
  const reservations = await prisma.reservation.findMany({ where, include: { table: true }, orderBy: { date: 'asc' } })
  res.json({ success: true, data: reservations })
})

router.get('/tables', async (_req, res: Response) => {
  const tables = await prisma.table.findMany({ orderBy: { number: 'asc' } })
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

router.post('/', validate(reservationSchema), async (req, res: Response) => {
  const { name, phone, email, date, time, guests, tableId, notes } = req.body
  const reservation = await prisma.reservation.create({
    data: { name, phone, email, date: new Date(date), time, guests, tableId, notes },
    include: { table: true },
  })
  res.status(201).json({ success: true, data: reservation })
})

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  }),
  params: z.object({
    id: z.string().cuid('Invalid reservation ID'),
  }),
})

router.patch('/:id/status', authenticate, requireAdmin, validate(updateStatusSchema), async (req: AuthRequest, res: Response) => {
  const { status } = req.body
  const reservation = await prisma.reservation.update({ where: { id: req.params.id }, data: { status } })
  res.json({ success: true, data: reservation })
})

export default router
