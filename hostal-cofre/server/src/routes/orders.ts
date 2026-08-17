import { Router, Response, NextFunction } from 'express'
import { authenticate, requireAdmin, AuthRequest, optionalAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validation.js'
import { OrderService } from '../services/order.service.js'
import { DeliveryService } from '../services/delivery.service.js'
import { whatsappService } from '../services/whatsapp.service.js'
import { config } from '../config/index.js'
import { eventBus } from '../utils/events.js'
import { makeLimiter } from '../utils/rateLimit.js'
import { auditMiddleware } from '../services/audit.service.js'
import { z } from 'zod'

const router = Router()

// Los pedidos anónimos (mesa) están limitados para frenar abuso; los autenticados no.
const anonymousOrderLimiter = makeLimiter(20)
function limitAnonymous(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user) return next()
  return anonymousOrderLimiter(req, res, next)
}

function buildOrderSummary(order: {
  receiptNumber: string | null
  customerName: string
  customerPhone: string
  orderType: string
  total: number
  items: Array<{ quantity: number; menuItem: { name: string } }>
}): string {
  const items = order.items.map((item) => `• ${item.quantity}x ${item.menuItem.name}`).join('\n')
  const typeLabel: Record<string, string> = {
    domicilio: 'Domicilio',
    tienda: 'Tienda',
    mesa: 'Mesa',
  }
  return [
    '🍽️ *Nuevo Pedido - Hostal Cofee*',
    `No. ${order.receiptNumber || 'N/A'}`,
    `Cliente: ${order.customerName}`,
    `Tel: ${order.customerPhone}`,
    `Tipo: ${typeLabel[order.orderType] || order.orderType}`,
    '',
    items,
    '',
    `💰 Total: $${order.total.toLocaleString('es-CO')}`,
  ].join('\n')
}

function notifyNewOrder(order: Parameters<typeof buildOrderSummary>[0]) {
  void whatsappService.notify({ to: config.whatsapp.phone, text: buildOrderSummary(order) })
}

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { orderType, status, page, limit } = req.query
  const result = await OrderService.getAll(
    req.user!.id,
    req.user!.role,
    {
      orderType: orderType as string,
      status: status as string,
    },
    {
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
    },
    req.user!.email,
  )
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

const tableNumberParamsSchema = z.object({
  params: z.object({
    tableNumber: z.coerce.number().int().min(1).max(999, 'Invalid table number'),
  }),
})

router.get(
  '/table/:tableNumber',
  validate(tableNumberParamsSchema),
  async (req: AuthRequest, res: Response) => {
    const orders = await OrderService.getActiveOrdersByTable(Number(req.params.tableNumber))
    res.json({ success: true, data: orders })
  },
)

router.get('/zones', (_req, res: Response) => {
  const zones = DeliveryService.getZones()
  res.json({ success: true, data: zones })
})

router.get('/events', async (req: AuthRequest, res: Response) => {
  // EventSource no soporta headers custom; aceptar token via query param.
  const token = (req.query.token as string) || req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required' })
  }

  let payload: { id: string; email: string; role: string; ver?: number }
  try {
    const jwt = await import('jsonwebtoken')
    payload = jwt.default.verify(token, config.jwtSecret, {
      algorithms: ['HS256'],
    }) as typeof payload
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid token' })
  }

  if (payload.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required' })
  }

  if (!eventBus.addClient(res)) {
    return res.status(503).json({ success: false, error: 'Too many real-time connections' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')
  res.flushHeaders()

  res.write('event: hello\ndata: {"action":"connected"}\n\n')

  const heartbeat = setInterval(() => {
    res.write(': ping\n\n')
  }, 30000)

  req.on('close', () => {
    clearInterval(heartbeat)
    eventBus.removeClient(res)
  })
})

const orderItemSchema = z.object({
  menuItemId: z.string().cuid(),
  quantity: z.number().int().positive().max(100),
})

const createOrderSchema = z.object({
  body: z
    .object({
      customerName: z.string().trim().min(1).max(100),
      customerPhone: z.string().trim().min(1).max(20),
      customerEmail: z.string().trim().email().max(255).optional(),
      paymentMethod: z.enum(['cash', 'wompi', 'nequi', 'daviplata']),
      items: z.array(orderItemSchema).min(1).max(50),
      orderType: z.enum(['domicilio', 'tienda', 'mesa']).optional(),
      tableId: z.string().cuid().optional(),
      address: z.string().trim().min(1).max(500).optional(),
      deliveryZone: z.enum(['centro', 'periurbano', 'lejano']).optional(),
      deliveryNotes: z.string().trim().max(500).optional(),
      shiftId: z.string().cuid().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.orderType === 'domicilio') {
        if (!data.address) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['address'],
            message: 'Address is required for delivery orders',
          })
        }
        if (!data.deliveryZone) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['deliveryZone'],
            message: 'Delivery zone is required for delivery orders',
          })
        }
      }
    }),
})

router.post(
  '/',
  optionalAuth,
  limitAnonymous,
  validate(createOrderSchema),
  async (req: AuthRequest, res: Response) => {
    const {
      customerName,
      customerPhone,
      customerEmail,
      items,
      paymentMethod,
      orderType,
      tableId,
      address,
      deliveryZone,
      deliveryNotes,
      shiftId,
    } = req.body
    const order = await OrderService.create({
      customerName,
      customerPhone,
      customerEmail,
      paymentMethod,
      userId: req.user?.id,
      items,
      orderType,
      tableId,
      address,
      deliveryZone,
      deliveryNotes,
      shiftId,
    })
    notifyNewOrder(order)
    eventBus.broadcast('order.created', order)
    res.status(201).json({ success: true, data: order })
  },
)

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

router.post(
  '/table',
  optionalAuth,
  limitAnonymous,
  validate(createTableOrderSchema),
  async (req: AuthRequest, res: Response) => {
    const {
      customerName,
      customerPhone,
      customerEmail,
      items,
      paymentMethod,
      tableNumber,
      shiftId,
    } = req.body
    const order = await OrderService.createFromTable({
      customerName,
      customerPhone,
      customerEmail,
      paymentMethod,
      userId: req.user?.id,
      items,
      tableNumber,
      shiftId,
    })
    notifyNewOrder(order)
    eventBus.broadcast('order.created', order)
    res.status(201).json({ success: true, data: order })
  },
)

const updateStatusSchema = z.object({
  params: z.object({ id: z.string().cuid('Invalid order ID') }),
  body: z.object({
    status: z.enum(['pending', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled']),
  }),
})

router.patch(
  '/:id/status',
  authenticate,
  requireAdmin,
  auditMiddleware('order.status', 'order', {
    getResourceId: (req) => req.params.id,
    getDetails: (req) => ({ status: req.body.status }),
  }),
  validate(updateStatusSchema),
  async (req: AuthRequest, res: Response) => {
    const order = await OrderService.updateStatus(req.params.id, req.body.status)
    eventBus.broadcast('order.updated', order)
    res.json({ success: true, data: order })
  },
)

const updatePaymentSchema = z.object({
  params: z.object({ id: z.string().cuid('Invalid order ID') }),
  body: z.object({
    paymentStatus: z.enum(['pending', 'paid', 'failed']),
    paymentId: z.string().max(255).optional(),
  }),
})

router.patch(
  '/:id/payment',
  authenticate,
  requireAdmin,
  auditMiddleware('order.payment', 'order', {
    getResourceId: (req) => req.params.id,
    getDetails: (req) => ({ paymentStatus: req.body.paymentStatus }),
  }),
  validate(updatePaymentSchema),
  async (req: AuthRequest, res: Response) => {
    const order = await OrderService.updatePayment(
      req.params.id,
      req.body.paymentStatus,
      req.body.paymentId,
    )
    eventBus.broadcast('order.updated', order)
    res.json({ success: true, data: order })
  },
)

export default router
