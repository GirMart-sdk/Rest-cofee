import { Router, Response } from 'express'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js'
import prisma from '../db.js'
import { validate } from '../middleware/validation.js'
import { z } from 'zod'

const router = Router()

router.get('/', async (_req, res: Response) => {
  const items = await prisma.menuItem.findMany({ orderBy: { createdAt: 'desc' } })
  res.json({ success: true, data: items })
})

const menuItemSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(200),
    description: z.string().max(1000).optional(),
    price: z.number().positive('Price must be a positive number'),
    category: z.enum(['ensalada', 'pasta', 'pizza', 'postre', 'bebida']),
    image: z.string().url('Image must be a valid URL').max(500).optional(),
  }),
})

router.post('/', authenticate, requireAdmin, validate(menuItemSchema), async (req: AuthRequest, res: Response) => {
  const { name, description, price, category, image } = req.body
  const item = await prisma.menuItem.create({ data: { name, description, price, category, image } })
  res.status(201).json({ success: true, data: item })
})

const updateMenuItemSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().max(1000).optional(),
    price: z.number().positive().optional(),
    category: z.enum(['ensalada', 'pasta', 'pizza', 'postre', 'bebida']).optional(),
    image: z.string().url().max(500).optional(),
    available: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().cuid('Invalid ID format'),
  }),
})

router.put('/:id', authenticate, requireAdmin, validate(updateMenuItemSchema), async (req: AuthRequest, res: Response) => {
  const { name, description, price, category, image, available } = req.body
  const item = await prisma.menuItem.update({
    where: { id: req.params.id },
    data: { name, description, price, category, image, available },
  })
  res.json({ success: true, data: item })
})

const deleteMenuItemSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid ID format'),
  }),
})

router.delete('/:id', authenticate, requireAdmin, validate(deleteMenuItemSchema), async (req: AuthRequest, res: Response) => {
  await prisma.menuItem.delete({ where: { id: req.params.id } })
  res.status(204).send()
})

export default router
