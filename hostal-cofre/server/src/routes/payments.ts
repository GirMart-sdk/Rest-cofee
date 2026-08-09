import { Router, Response } from 'express'
import crypto from 'node:crypto'
import { config, wompiBaseUrls } from '../config/index.js'
import { authenticate, AuthRequest } from '../middleware/auth.js'
import { validate } from '../middleware/validation.js'
import { OrderService } from '../services/order.service.js'
import prisma from '../db.js'
import { z } from 'zod'
import { logger } from '../utils/logger.js'
import { metrics } from '../utils/metrics.js'

const router = Router()

const createTransactionSchema = z.object({
  body: z.object({
    amount_in_cents: z.number().int().positive(),
    currency: z.string().trim().optional(),
    customer_email: z.string().trim().email(),
    reference: z.string().trim().min(1),
    payment_method: z
      .object({
        type: z.enum(['CARD', 'BANCOLOMBIA_TRANSFER', 'PSE', 'NEQUI']),
        ...({} as Record<string, unknown>),
      })
      .optional(),
  }),
})

type FetchResponse = Awaited<ReturnType<typeof fetch>>

async function wompiFetch(path: string, init?: RequestInit): Promise<FetchResponse> {
  const response = await fetch(`${config.wompi.baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.wompi.privateKey}`,
      ...(init?.headers || {}),
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    metrics.inc('paymentsFailed')
    logger.warn('wompi request failed', {
      path,
      status: response.status,
      mode: config.wompi.mode,
      error: body,
    })
    throw Object.assign(new Error(`Wompi error ${response.status}`), {
      statusCode: response.status >= 500 ? 502 : 400,
      details: body,
    })
  }

  return response
}

router.post(
  '/create-transaction',
  authenticate,
  validate(createTransactionSchema),
  async (req: AuthRequest, res: Response) => {
    const { amount_in_cents, currency, customer_email, reference, payment_method } = req.body

    metrics.inc('paymentsInitiated')
    const response = await wompiFetch('/transactions', {
      method: 'POST',
      body: JSON.stringify({
        amount_in_cents,
        currency: currency || 'COP',
        reference,
        customer_email,
        ...(payment_method ? { payment_method } : {}),
      }),
    })

    const data = await response.json()
    logger.info('wompi transaction created', {
      reference,
      status: data?.data?.status,
      mode: config.wompi.mode,
    })
    res.json({ success: true, data })
  },
)

const getTransactionSchema = z.object({
  params: z.object({ id: z.string().trim().min(1, 'Transaction ID is required') }),
})

router.get(
  '/transactions/:id',
  authenticate,
  validate(getTransactionSchema),
  async (req: AuthRequest, res: Response) => {
    const response = await wompiFetch(`/transactions/${req.params.id}`)
    const data = await response.json()
    res.json({ success: true, data })
  },
)

router.get('/status', authenticate, async (_req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    data: {
      mode: config.wompi.mode,
      baseUrl: config.wompi.baseUrl,
      publicKeyConfigured: Boolean(config.wompi.publicKey),
      privateKeyConfigured: Boolean(config.wompi.privateKey),
      eventsSecretConfigured: Boolean(config.wompi.eventsSecret),
      availableUrls: wompiBaseUrls,
    },
  })
})

function getValueByPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

function verifyWebhookSignature(body: Record<string, unknown>, headerChecksum: string): boolean {
  const secret = config.wompi.eventsSecret
  if (!secret) return false

  const signature = body.signature
  if (!signature || typeof signature !== 'object') return false

  const properties = (signature as Record<string, unknown>).properties
  const timestamp = (signature as Record<string, unknown>).timestamp
  if (!Array.isArray(properties)) return false

  const data = (body.data ?? {}) as Record<string, unknown>
  const values = properties
    .map((prop) => (typeof prop === 'string' ? getValueByPath(data, prop) : undefined))
    .map((value) => (value == null ? '' : String(value)))

  const payload = values.join('') + String(timestamp ?? '') + secret
  const digest = crypto.createHash('sha256').update(payload).digest('hex')

  const bodyChecksum = String((signature as Record<string, unknown>).checksum ?? '')
  const expected = (bodyChecksum || headerChecksum || '').toLowerCase()
  return expected.length > 0 && digest === expected
}

router.post('/webhook', async (req: AuthRequest, res: Response) => {
  if (!config.wompi.eventsSecret) {
    logger.warn('wompi webhook ignored: WOMPI_EVENTS_SECRET not configured')
    return res.status(503).json({ success: false, error: 'Webhook not configured' })
  }

  const headerChecksum =
    typeof req.headers['x-event-checksum'] === 'string' ? req.headers['x-event-checksum'] : ''

  const body = (req.body ?? {}) as Record<string, unknown>
  if (!verifyWebhookSignature(body, headerChecksum)) {
    metrics.inc('paymentsWebhookRejected')
    logger.warn('wompi webhook signature verification failed', {
      event: body.event,
      checksum: headerChecksum,
    })
    return res.status(401).json({ success: false, error: 'Invalid signature' })
  }

  const event = String(body.event ?? '')
  const data = (body.data ?? {}) as Record<string, unknown>
  const transaction = (data.transaction ?? {}) as Record<string, unknown>
  const transactionId = String(transaction.id ?? '')
  const reference = String(transaction.reference ?? '')
  const status = String(transaction.status ?? '').toUpperCase()
  const paymentStatus: 'paid' | 'failed' = status === 'APPROVED' ? 'paid' : 'failed'

  if (event === 'transaction.updated') {
    if (transactionId || reference) {
      try {
        const order = await prisma.order.findFirst({
          where: {
            OR: [
              { paymentId: transactionId },
              { paymentId: reference },
              { receiptNumber: reference },
            ],
          },
        })
        if (order) {
          await OrderService.updatePayment(order.id, paymentStatus, transactionId)
          metrics.inc('paymentsWebhookProcessed')
          logger.info('wompi webhook processed', {
            transactionId,
            status,
            paymentStatus,
            orderId: order.id,
            receiptNumber: order.receiptNumber,
          })
        } else {
          logger.warn('wompi webhook: order not found for transaction', {
            transactionId,
            reference,
          })
        }
      } catch (error) {
        logger.error('wompi webhook processing error', {
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }
  }

  res.json({ success: true })
})

export default router
