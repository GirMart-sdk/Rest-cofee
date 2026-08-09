import { Router, Response } from 'express'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js'
import { auditMiddleware } from '../services/audit.service.js'
import prisma from '../db.js'
import { validate } from '../middleware/validation.js'
import { z } from 'zod'

const router = Router()

router.get('/', async (_req, res: Response) => {
  const items = await prisma.menuItem.findMany({ orderBy: { createdAt: 'desc' } })
  res.json({ success: true, data: items })
})

const imageSchema = z
  .string()
  .trim()
  .max(500)
  .refine(
    (v) => v === '' || v.startsWith('/') || /^https?:\/\//i.test(v),
    'Image must be a valid URL or a path',
  )
  .optional()
  .nullable()

const menuItemSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(200),
    description: z.string().max(1000).optional(),
    price: z.number().positive('Price must be a positive number'),
    category: z.enum(['ensalada', 'pasta', 'pizza', 'postre', 'bebida']),
    image: imageSchema,
  }),
})

router.post(
  '/',
  authenticate,
  requireAdmin,
  auditMiddleware('menu.create', 'menu', {
    getDetails: (req) => ({ name: req.body.name, category: req.body.category }),
  }),
  validate(menuItemSchema),
  async (req: AuthRequest, res: Response) => {
    const { name, description, price, category, image } = req.body
    const item = await prisma.menuItem.create({
      data: { name, description, price, category, image },
    })
    res.status(201).json({ success: true, data: item })
  },
)

const updateMenuItemSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().max(1000).optional(),
    price: z.number().positive().optional(),
    category: z.enum(['ensalada', 'pasta', 'pizza', 'postre', 'bebida']).optional(),
    image: imageSchema,
    available: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().cuid('Invalid ID format'),
  }),
})

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  auditMiddleware('menu.update', 'menu', {
    getResourceId: (req) => req.params.id,
    getDetails: (req) => ({
      name: req.body.name,
      price: req.body.price,
      available: req.body.available,
    }),
  }),
  validate(updateMenuItemSchema),
  async (req: AuthRequest, res: Response) => {
    const { name, description, price, category, image, available } = req.body
    const item = await prisma.menuItem.update({
      where: { id: req.params.id },
      data: { name, description, price, category, image, available },
    })
    res.json({ success: true, data: item })
  },
)

const deleteMenuItemSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid ID format'),
  }),
})

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  auditMiddleware('menu.delete', 'menu', { getResourceId: (req) => req.params.id }),
  validate(deleteMenuItemSchema),
  async (req: AuthRequest, res: Response) => {
    await prisma.menuItem.delete({ where: { id: req.params.id } })
    res.status(204).send()
  },
)

export default router
