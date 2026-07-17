import { Router, Response } from 'express'
import { authenticate, requireAdmin, AuthRequest, optionalAuth } from '../middleware/auth.js'
import prisma from '../db.js'
import { validate } from '../middleware/validation.js'
import { z } from 'zod'

const router = Router()

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const where = req.user!.role === 'admin' ? {} : { userId: req.user!.id }
  const orders = await prisma.order.findMany({ where, include: { items: { include: { menuItem: true } } }, orderBy: { createdAt: 'desc' } })
  res.json({ success: true, data: orders })
})

const orderItemSchema = z.object({
  menuItemId: z.string().cuid(),
  quantity: z.number().int().positive().max(100),
})

const createOrderSchema = z.object({
  body: z.object({
    customerName: z.string().trim().min(1).max(100),
    customerPhone: z.string().trim().min(1).max(20),
    customerEmail: z.string().trim().email().max(255).optional(),
    paymentMethod: z.enum(['cash', 'card']),
    items: z.array(orderItemSchema).min(1).max(50),
  }),
})

router.post('/', optionalAuth, validate(createOrderSchema), async (req: AuthRequest, res: Response) => {
  const { customerName, customerPhone, customerEmail, items, paymentMethod } = req.body

  const menuItemIds = items.map((item: { menuItemId: string }) => item.menuItemId)
  const menuItemsFromDb = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds } },
  })

  const foundIds = new Set(menuItemsFromDb.map(item => item.id))
  if (foundIds.size !== menuItemIds.length) { // Check if all requested menu items were found
    const notFoundIds = menuItemIds.filter((id: string) => !foundIds.has(id))
    return res.status(400).json({
      success: false,
      error: 'One or more menu items not found.',
      details: { notFound: notFoundIds },
    })
  }

  const priceMap = new Map(menuItemsFromDb.map(item => [item.id, item.price]))

  let total = 0
  const orderItems = items.map((item: { menuItemId: string, quantity: number }) => {
    const price = priceMap.get(item.menuItemId)!
    total += price * item.quantity
    return { menuItemId: item.menuItemId, quantity: item.quantity, price }
  })

  const order = await prisma.order.create({
    data: {
      customerName, customerPhone, customerEmail,
      total: parseFloat(total.toFixed(2)),
      paymentMethod,
      userId: req.user?.id,
      items: { create: orderItems },
    },
    include: { items: true },
  })

  res.status(201).json({ success: true, data: order })
})

const updateStatusSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid order ID'),
  }),
  body: z.object({
    status: z.enum(['pending', 'preparing', 'ready', 'delivered', 'cancelled']),
  }),
})

router.patch('/:id/status', authenticate, requireAdmin, validate(updateStatusSchema), async (req: AuthRequest, res: Response) => {
  const { status } = req.body
  const order = await prisma.order.update({ where: { id: req.params.id }, data: { status } })
  res.json({ success: true, data: order })
})

const updatePaymentSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid order ID'),
  }),
  body: z.object({
    paymentStatus: z.enum(['pending', 'paid', 'failed']),
    paymentId: z.string().max(255).optional(),
  }),
})

router.patch('/:id/payment', authenticate, requireAdmin, validate(updatePaymentSchema), async (req: AuthRequest, res: Response) => {
  const { paymentStatus, paymentId } = req.body
  const order = await prisma.order.update({ where: { id: req.params.id }, data: { paymentStatus, paymentId } })
  res.json({ success: true, data: order })
})

export default router
