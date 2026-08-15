import { Router, Response } from 'express'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js'
import { validate } from '../middleware/validation.js'
import { TableService } from '../services/table.service.js'
import { z } from 'zod'

const router = Router()

router.get('/', async (_req, res: Response) => {
  const tables = await TableService.getAll()
  res.json({ success: true, data: tables })
})

router.get('/active', authenticate, requireAdmin, async (_req: AuthRequest, res: Response) => {
  const tables = await TableService.getActive()
  res.json({ success: true, data: tables })
})

const createTableSchema = z.object({
  body: z.object({
    number: z.number().int().positive().max(999),
    capacity: z.number().int().min(1).max(50),
    zone: z.enum(['interior', 'exterior', 'privado']),
  }),
})

router.post(
  '/',
  authenticate,
  requireAdmin,
  validate(createTableSchema),
  async (req: AuthRequest, res: Response) => {
    const table = await TableService.create(req.body)
    res.status(201).json({ success: true, data: table })
  },
)

const updateTableSchema = z.object({
  params: z.object({ id: z.string().cuid('Invalid table ID') }),
  body: z.object({
    number: z.number().int().positive().max(999).optional(),
    capacity: z.number().int().min(1).max(50).optional(),
    zone: z.enum(['interior', 'exterior', 'privado']).optional(),
  }),
})

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validate(updateTableSchema),
  async (req: AuthRequest, res: Response) => {
    const table = await TableService.update(req.params.id, req.body)
    res.json({ success: true, data: table })
  },
)

const deleteTableSchema = z.object({
  params: z.object({ id: z.string().cuid('Invalid table ID') }),
})

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  validate(deleteTableSchema),
  async (req: AuthRequest, res: Response) => {
    await TableService.delete(req.params.id)
    res.status(204).send()
  },
)

router.get('/:number', async (req: AuthRequest, res: Response) => {
  const table = await TableService.getByNumber(parseInt(req.params.number))
  res.json({ success: true, data: table })
})

export default router
