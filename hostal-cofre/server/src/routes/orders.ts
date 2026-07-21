import { Router, Response } from 'express'
import { authenticate, requireAdmin, AuthRequest, optionalAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validation.js'
import { OrderService } from '../services/order.service.js'
import { z } from 'zod'

const router = Router()

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const orders = await OrderService.getAll(req.user!.id, req.user!.role)
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
    paymentMethod: z.enum(['cash', 'wompi', 'nequi', 'daviplata']),
    items: z.array(orderItemSchema).min(1).max(50),
  }),
})

router.post('/', optionalAuth, validate(createOrderSchema), async (req: AuthRequest, res: Response) => {
  const { customerName, customerPhone, customerEmail, items, paymentMethod } = req.body
  const order = await OrderService.create({
    customerName, customerPhone, customerEmail, paymentMethod,
    userId: req.user?.id, items,
  })
  res.status(201).json({ success: true, data: order })
})

const updateStatusSchema = z.object({
  params: z.object({ id: z.string().cuid('Invalid order ID') }),
  body: z.object({ status: z.enum(['pending', 'preparing', 'ready', 'delivered', 'cancelled']) }),
})

router.patch('/:id/status', authenticate, requireAdmin, validate(updateStatusSchema), async (req: AuthRequest, res: Response) => {
  const order = await OrderService.updateStatus(req.params.id, req.body.status)
  res.json({ success: true, data: order })
})

const updatePaymentSchema = z.object({
  params: z.object({ id: z.string().cuid('Invalid order ID') }),
  body: z.object({
    paymentStatus: z.enum(['pending', 'paid', 'failed']),
    paymentId: z.string().max(255).optional(),
  }),
})

router.patch('/:id/payment', authenticate, requireAdmin, validate(updatePaymentSchema), async (req: AuthRequest, res: Response) => {
  const order = await OrderService.updatePayment(req.params.id, req.body.paymentStatus, req.body.paymentId)
  res.json({ success: true, data: order })
})

export default router
