import { Router, Response } from 'express'
import { config, wompiBaseUrls } from '../config/index.js'
import { authenticate, AuthRequest } from '../middleware/auth.js'
import { validate } from '../middleware/validation.js'
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
      availableUrls: wompiBaseUrls,
    },
  })
})

export default router
