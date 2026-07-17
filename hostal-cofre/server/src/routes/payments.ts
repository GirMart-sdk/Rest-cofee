import { Router, Response } from 'express'
import { config } from '../config/index.js'
import { authenticate, AuthRequest } from '../middleware/auth.js'
import { validate } from '../middleware/validation.js'
import { z } from 'zod'

const router = Router()

const createTransactionSchema = z.object({
  body: z.object({
    amount_in_cents: z.number().int().positive(),
    currency: z.string().trim().optional(),
    customer_email: z.string().trim().email(),
    reference: z.string().trim().min(1),
  }),
})

router.post('/create-transaction', authenticate, validate(createTransactionSchema), async (req: AuthRequest, res: Response) => {
  const { amount_in_cents, currency, customer_email, reference } = req.body

  const response = await fetch(`${config.wompi.baseUrl}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.wompi.privateKey}`,
    },
    body: JSON.stringify({
      amount_in_cents,
      currency: currency || 'COP',
      reference,
      customer_email,
    }),
  })

  const data = await response.json()
  res.json({ success: true, data })
})

const getTransactionSchema = z.object({
  params: z.object({ id: z.string().trim().min(1, 'Transaction ID is required') }),
})

router.get('/transactions/:id', authenticate, validate(getTransactionSchema), async (req: AuthRequest, res: Response) => {
  const response = await fetch(`${config.wompi.baseUrl}/transactions/${req.params.id}`, { headers: { Authorization: `Bearer ${config.wompi.privateKey}` } })
  const data = await response.json()
  res.json({ success: true, data })
})

export default router
