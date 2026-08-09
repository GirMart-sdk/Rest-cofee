import { Router, Response } from 'express'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js'
import { validate } from '../middleware/validation.js'
import { auditMiddleware } from '../services/audit.service.js'
import { ShiftService } from '../services/shift.service.js'
import { z } from 'zod'

const router = Router()

router.get('/', authenticate, requireAdmin, async (_req: AuthRequest, res: Response) => {
  const shifts = await ShiftService.getAll()
  res.json({ success: true, data: shifts })
})

router.get('/current', authenticate, requireAdmin, async (_req: AuthRequest, res: Response) => {
  const shifts = await ShiftService.getCurrent()
  res.json({ success: true, data: shifts })
})

router.get('/by-period', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { date } = req.query
  const shifts = await ShiftService.getByPeriod(date as string)
  res.json({ success: true, data: shifts })
})

router.get('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  const shift = await ShiftService.getById(req.params.id)
  res.json({ success: true, data: shift })
})

router.get('/:id/summary', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  const summary = await ShiftService.getShiftSummary(req.params.id)
  res.json({ success: true, data: summary })
})

const openShiftSchema = z.object({
  body: z.object({
    cashierName: z.string().trim().min(1, 'Nombre del cajero es requerido').max(100),
    shiftPeriod: z.enum(['manana', 'medio_dia', 'tarde', 'noche']),
    openingCash: z.number().min(0, 'Efectivo inicial debe ser positivo'),
    notes: z.string().max(500).optional(),
  }),
})

router.post(
  '/open',
  authenticate,
  requireAdmin,
  auditMiddleware('shift.open', 'shift'),
  validate(openShiftSchema),
  async (req: AuthRequest, res: Response) => {
    const { cashierName, shiftPeriod, openingCash, notes } = req.body
    const shift = await ShiftService.open({
      userId: req.user!.id,
      cashierName,
      shiftPeriod,
      openingCash,
      notes,
    })
    res.status(201).json({ success: true, data: shift })
  },
)

const closeShiftSchema = z.object({
  params: z.object({ id: z.string().cuid('Invalid shift ID') }),
  body: z.object({
    closingCash: z.number().min(0, 'Efectivo final debe ser positivo'),
    notes: z.string().max(500).optional(),
  }),
})

router.patch(
  '/:id/close',
  authenticate,
  requireAdmin,
  auditMiddleware('shift.close', 'shift', { getResourceId: (req) => req.params.id }),
  validate(closeShiftSchema),
  async (req: AuthRequest, res: Response) => {
    const shift = await ShiftService.close(req.params.id, req.body.closingCash, req.body.notes)
    res.json({ success: true, data: shift })
  },
)

export default router
