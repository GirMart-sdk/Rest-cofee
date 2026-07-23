import { Router, Response } from 'express'
import { authenticate, requireAdmin, AuthRequest, optionalAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validation.js'
import { OrderService } from '../services/order.service.js'
import { DeliveryService } from '../services/delivery.service.js'
import { z } from 'zod'

const router = Router()

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { orderType, status } = req.query
  const orders = await OrderService.getAll(req.user!.id, req.user!.role, {
    orderType: orderType as string,
    status: status as string,
  })
  res.json({ success: true, data: orders })
})

router.get('/daily-sales', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { date } = req.query
  const report = await OrderService.getDailySales(date as string)
  res.json({ success: true, data: report })
})

router.get('/table/:tableNumber', async (req: AuthRequest, res: Response) => {
  const tableNumber = parseInt(req.params.tableNumber)
  const orders = await OrderService.getActiveOrdersByTable(tableNumber)
  res.json({ success: true, data: orders })
})

router.get('/zones', (_req, res: Response) => {
  const zones = DeliveryService.getZones()
  res.json({ success: true, data: zones })
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
    orderType: z.enum(['domicilio', 'tienda', 'mesa']).optional(),
    tableId: z.string().cuid().optional(),
    address: z.string().trim().max(500).optional(),
    deliveryZone: z.enum(['centro', 'periurbano', 'lejano']).optional(),
    deliveryNotes: z.string().trim().max(500).optional(),
    shiftId: z.string().cuid().optional(),
  }),
})

router.post('/', optionalAuth, validate(createOrderSchema), async (req: AuthRequest, res: Response) => {
  const { customerName, customerPhone, customerEmail, items, paymentMethod, orderType, tableId, address, deliveryZone, deliveryNotes, shiftId } = req.body
  const order = await OrderService.create({
    customerName, customerPhone, customerEmail, paymentMethod,
    userId: req.user?.id, items, orderType, tableId, address, deliveryZone, deliveryNotes, shiftId,
  })
  res.status(201).json({ success: true, data: order })
})

const createTableOrderSchema = z.object({
  body: z.object({
    customerName: z.string().trim().min(1).max(100).default('Cliente Mesa'),
    customerPhone: z.string().trim().max(20).optional(),
    customerEmail: z.string().trim().email().max(255).optional(),
    paymentMethod: z.enum(['cash', 'wompi', 'nequi', 'daviplata']),
    items: z.array(orderItemSchema).min(1).max(50),
    tableNumber: z.number().int().positive(),
    shiftId: z.string().cuid().optional(),
  }),
})

router.post('/table', optionalAuth, validate(createTableOrderSchema), async (req: AuthRequest, res: Response) => {
  const { customerName, customerPhone, customerEmail, items, paymentMethod, tableNumber, shiftId } = req.body
  const order = await OrderService.createFromTable({
    customerName, customerPhone, customerEmail, paymentMethod,
    userId: req.user?.id, items, tableNumber, shiftId,
  })
  res.status(201).json({ success: true, data: order })
})

const updateStatusSchema = z.object({
  params: z.object({ id: z.string().cuid('Invalid order ID') }),
  body: z.object({ status: z.enum(['pending', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled']) }),
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
