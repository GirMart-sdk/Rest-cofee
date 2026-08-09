import { describe, it, expect, vi, beforeAll, afterAll, afterEach, beforeEach } from 'vitest'
import request from 'supertest'
import crypto from 'node:crypto'
import {
  createTestApp,
  createUser,
  createOrder,
  generateToken,
  cleanupData,
  prisma,
} from './helpers.js'
import { errorHandler } from '../src/middleware/errors.js'
import { config } from '../src/config/index.js'

let app: ReturnType<typeof createTestApp>

const fetchMock = vi.fn()

beforeAll(async () => {
  await prisma.$connect()
  app = createTestApp()
  const { default: paymentRoutes } = await import('../src/routes/payments.js')
  app.use('/api/payments', paymentRoutes)
  app.use(errorHandler)
})

beforeEach(() => {
  fetchMock.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ id: 'txn-mock-123', status: 'APPROVED' }),
  })
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(async () => {
  vi.unstubAllGlobals()
  await prisma.refreshToken.deleteMany()
  await prisma.loginAttempt.deleteMany()
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await cleanupData()
  await prisma.$disconnect()
})

describe('POST /api/payments/create-transaction', () => {
  it('should create a transaction via Wompi for authenticated user', async () => {
    const { user } = await createUser('client')
    const token = generateToken(user)
    const res = await request(app)
      .post('/api/payments/create-transaction')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount_in_cents: 2500000,
        currency: 'COP',
        customer_email: 'buyer@mail.com',
        reference: 'HC-12345',
      })
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.id).toBe('txn-mock-123')
    expect(fetchMock).toHaveBeenCalledWith(
      `${config.wompi.baseUrl}/transactions`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: `Bearer ${config.wompi.privateKey}`,
        }),
      }),
    )
  })

  it('should default currency to COP', async () => {
    const { user } = await createUser('client')
    const token = generateToken(user)
    await request(app)
      .post('/api/payments/create-transaction')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount_in_cents: 1000,
        customer_email: 'buyer@mail.com',
        reference: 'HC-1',
      })
    const sent = fetchMock.mock.calls[0][1]
    expect(JSON.parse(sent.body).currency).toBe('COP')
  })

  it('should reject without auth', async () => {
    const res = await request(app).post('/api/payments/create-transaction').send({
      amount_in_cents: 1000,
      customer_email: 'buyer@mail.com',
      reference: 'HC-2',
    })
    expect(res.status).toBe(401)
  })

  it('should reject invalid payload', async () => {
    const { user } = await createUser('client')
    const token = generateToken(user)
    const res = await request(app)
      .post('/api/payments/create-transaction')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount_in_cents: -10, customer_email: 'not-an-email', reference: '' })
    expect(res.status).toBe(400)
  })
})

describe('GET /api/payments/transactions/:id', () => {
  it('should fetch a transaction by id', async () => {
    const { user } = await createUser('client')
    const token = generateToken(user)
    const res = await request(app)
      .get('/api/payments/transactions/txn-456')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(fetchMock).toHaveBeenCalledWith(
      `${config.wompi.baseUrl}/transactions/txn-456`,
      expect.anything(),
    )
  })

  it('should return 404 when the transaction id is missing (no route match)', async () => {
    const { user } = await createUser('client')
    const token = generateToken(user)
    const res = await request(app)
      .get('/api/payments/transactions/')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(404)
  })
})

describe('POST /api/payments/webhook', () => {
  function buildSignedBody(overrides: Record<string, unknown> = {}) {
    const transactionId = 'txn-webhook-123'
    const amountInCents = 2500000
    const timestamp = 1747673128600
    const data = {
      transaction: {
        id: transactionId,
        reference: 'HC-REF-1',
        status: 'APPROVED',
        amount_in_cents: amountInCents,
        currency: 'COP',
      },
    }
    const properties = ['transaction.id', 'transaction.status', 'transaction.amount_in_cents']
    const payload = `${transactionId}APPROVED${amountInCents}${timestamp}${config.wompi.eventsSecret}`
    const checksum = crypto.createHash('sha256').update(payload).digest('hex')
    return {
      event: 'transaction.updated',
      data,
      signature: { properties, checksum, timestamp },
      sent_at: '2026-08-08T10:00:00.000Z',
      ...overrides,
    }
  }

  it('should reject when WOMPI_EVENTS_SECRET is not configured', async () => {
    const original = config.wompi.eventsSecret
    ;(config.wompi as { eventsSecret: string }).eventsSecret = ''
    const res = await request(app).post('/api/payments/webhook').send(buildSignedBody())
    ;(config.wompi as { eventsSecret: string }).eventsSecret = original
    expect(res.status).toBe(503)
  })

  it('should reject an event with an invalid signature', async () => {
    const body = buildSignedBody({ signature: { checksum: 'deadbeef', timestamp: 1 } })
    const res = await request(app).post('/api/payments/webhook').send(body)
    expect(res.status).toBe(401)
  })

  it('should mark an order as paid when the signed transaction is approved', async () => {
    const order = await createOrder()
    const transactionId = 'txn-webhook-ok'
    const amountInCents = Math.round(order.total * 100)
    const timestamp = 1747673128601
    const properties = ['transaction.id', 'transaction.status', 'transaction.amount_in_cents']
    const payload = `${transactionId}APPROVED${amountInCents}${timestamp}${config.wompi.eventsSecret}`
    const checksum = crypto.createHash('sha256').update(payload).digest('hex')

    const res = await request(app)
      .post('/api/payments/webhook')
      .send({
        event: 'transaction.updated',
        data: {
          transaction: {
            id: transactionId,
            reference: order.receiptNumber,
            status: 'APPROVED',
            amount_in_cents: amountInCents,
          },
        },
        signature: { properties, checksum, timestamp },
      })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)

    const updated = await prisma.order.findUnique({ where: { id: order.id } })
    expect(updated?.paymentStatus).toBe('paid')
    expect(updated?.paymentId).toBe(transactionId)
  })

  it('should mark an order as failed when the signed transaction is declined', async () => {
    const order = await createOrder()
    const transactionId = 'txn-webhook-declined'
    const amountInCents = Math.round(order.total * 100)
    const timestamp = 1747673128602
    const properties = ['transaction.id', 'transaction.status', 'transaction.amount_in_cents']
    const payload = `${transactionId}DECLINED${amountInCents}${timestamp}${config.wompi.eventsSecret}`
    const checksum = crypto.createHash('sha256').update(payload).digest('hex')

    const res = await request(app)
      .post('/api/payments/webhook')
      .send({
        event: 'transaction.updated',
        data: {
          transaction: {
            id: transactionId,
            reference: order.receiptNumber,
            status: 'DECLINED',
            amount_in_cents: amountInCents,
          },
        },
        signature: { properties, checksum, timestamp },
      })

    expect(res.status).toBe(200)
    const updated = await prisma.order.findUnique({ where: { id: order.id } })
    expect(updated?.paymentStatus).toBe('failed')
  })

  it('should accept a signed event that references an unknown order', async () => {
    const transactionId = 'txn-webhook-unknown'
    const amountInCents = 5000
    const timestamp = 1747673128603
    const properties = ['transaction.id', 'transaction.status', 'transaction.amount_in_cents']
    const payload = `${transactionId}APPROVED${amountInCents}${timestamp}${config.wompi.eventsSecret}`
    const checksum = crypto.createHash('sha256').update(payload).digest('hex')

    const res = await request(app)
      .post('/api/payments/webhook')
      .send({
        event: 'transaction.updated',
        data: {
          transaction: {
            id: transactionId,
            reference: 'UNKNOWN-REF',
            status: 'APPROVED',
            amount_in_cents: amountInCents,
          },
        },
        signature: { properties, checksum, timestamp },
      })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })
})
