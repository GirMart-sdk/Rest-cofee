import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import request from 'supertest'
import { createTestApp, createUser, generateToken, cleanupData, prisma } from './helpers.js'
import { errorHandler } from '../src/middleware/errors.js'

let app: ReturnType<typeof createTestApp>

beforeAll(async () => {
  await prisma.$connect()
  app = createTestApp()
  const { default: shiftRoutes } = await import('../src/routes/shifts.js')
  app.use('/api/shifts', shiftRoutes)
  app.use(errorHandler)
})

afterEach(async () => {
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.shift.deleteMany()
  await prisma.refreshToken.deleteMany()
  await prisma.loginAttempt.deleteMany()
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await cleanupData()
  await prisma.$disconnect()
})

describe('POST /api/shifts/open', () => {
  it('should open a shift as admin', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    const res = await request(app)
      .post('/api/shifts/open')
      .set('Authorization', `Bearer ${token}`)
      .send({ cashierName: 'Test Cashier', shiftPeriod: 'manana', openingCash: 200000 })
    expect(res.status).toBe(201)
    expect(res.body.data.status).toBe('open')
    expect(res.body.data.cashierName).toBe('Test Cashier')
    expect(res.body.data.openingCash).toBe(200000)
  })

  it('should reject without auth', async () => {
    const res = await request(app)
      .post('/api/shifts/open')
      .send({ cashierName: 'Test', shiftPeriod: 'manana', openingCash: 100000 })
    expect(res.status).toBe(401)
  })

  it('should reject non-admin users', async () => {
    const { user } = await createUser('client')
    const token = generateToken(user)
    const res = await request(app)
      .post('/api/shifts/open')
      .set('Authorization', `Bearer ${token}`)
      .send({ cashierName: 'Test', shiftPeriod: 'manana', openingCash: 100000 })
    expect(res.status).toBe(403)
  })

  it('should reject opening a second shift while one is open', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    await request(app)
      .post('/api/shifts/open')
      .set('Authorization', `Bearer ${token}`)
      .send({ cashierName: 'First', shiftPeriod: 'manana', openingCash: 200000 })
    const res = await request(app)
      .post('/api/shifts/open')
      .set('Authorization', `Bearer ${token}`)
      .send({ cashierName: 'Second', shiftPeriod: 'tarde', openingCash: 100000 })
    expect(res.status).toBe(400)
  })
})

describe('GET /api/shifts', () => {
  it('should return all shifts for admin', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    await request(app)
      .post('/api/shifts/open')
      .set('Authorization', `Bearer ${token}`)
      .send({ cashierName: 'Test Cashier', shiftPeriod: 'manana', openingCash: 200000 })
    const res = await request(app).get('/api/shifts').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBeGreaterThanOrEqual(1)
  })

  it('should reject non-admin', async () => {
    const { user } = await createUser('client')
    const token = generateToken(user)
    const res = await request(app).get('/api/shifts').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(403)
  })
})

describe('GET /api/shifts/current', () => {
  it('should return current open shifts', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    await request(app)
      .post('/api/shifts/open')
      .set('Authorization', `Bearer ${token}`)
      .send({ cashierName: 'Test Cashier', shiftPeriod: 'manana', openingCash: 200000 })
    const res = await request(app)
      .get('/api/shifts/current')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })
})

describe('GET /api/shifts/:id', () => {
  it('should return shift by id', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    const openRes = await request(app)
      .post('/api/shifts/open')
      .set('Authorization', `Bearer ${token}`)
      .send({ cashierName: 'Test Cashier', shiftPeriod: 'manana', openingCash: 200000 })
    const shiftId = openRes.body.data.id
    const res = await request(app)
      .get(`/api/shifts/${shiftId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.data.id).toBe(shiftId)
  })

  it('should return 404 for non-existent shift', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    const res = await request(app)
      .get('/api/shifts/c00000000000000000000001')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(404)
  })
})

describe('PATCH /api/shifts/:id/close', () => {
  it('should close an open shift', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    const openRes = await request(app)
      .post('/api/shifts/open')
      .set('Authorization', `Bearer ${token}`)
      .send({ cashierName: 'Test Cashier', shiftPeriod: 'manana', openingCash: 200000 })
    const shiftId = openRes.body.data.id
    const res = await request(app)
      .patch(`/api/shifts/${shiftId}/close`)
      .set('Authorization', `Bearer ${token}`)
      .send({ closingCash: 350000 })
    expect(res.status).toBe(200)
    expect(res.body.data.status).toBe('closed')
    expect(res.body.data.closingCash).toBe(350000)
  })

  it('should reject closing an already closed shift', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    const openRes = await request(app)
      .post('/api/shifts/open')
      .set('Authorization', `Bearer ${token}`)
      .send({ cashierName: 'Test Cashier', shiftPeriod: 'manana', openingCash: 200000 })
    const shiftId = openRes.body.data.id
    await request(app)
      .patch(`/api/shifts/${shiftId}/close`)
      .set('Authorization', `Bearer ${token}`)
      .send({ closingCash: 350000 })
    const res = await request(app)
      .patch(`/api/shifts/${shiftId}/close`)
      .set('Authorization', `Bearer ${token}`)
      .send({ closingCash: 350000 })
    expect(res.status).toBe(400)
  })

  it('should compute expected cash and cash mismatch when closing', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    const openRes = await request(app)
      .post('/api/shifts/open')
      .set('Authorization', `Bearer ${token}`)
      .send({ cashierName: 'Test Cashier', shiftPeriod: 'manana', openingCash: 200000 })
    const shiftId = openRes.body.data.id

    await prisma.order.create({
      data: {
        customerName: 'Cuadre Test',
        customerPhone: '3001234567',
        total: 15000,
        paymentMethod: 'cash',
        status: 'delivered',
        orderType: 'tienda',
        receiptNumber: `HC-${Date.now()}`,
        shiftId,
      },
    })

    const res = await request(app)
      .patch(`/api/shifts/${shiftId}/close`)
      .set('Authorization', `Bearer ${token}`)
      .send({ closingCash: 215000 })
    expect(res.status).toBe(200)
    expect(res.body.data.status).toBe('closed')
    expect(res.body.data.cashReceived).toBe(15000)
    expect(res.body.data.expectedCash).toBe(215000)
    expect(res.body.data.cashMismatch).toBe(0)
  })
})

describe('GET /api/shifts/:id/summary', () => {
  it('should return shift summary', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    const openRes = await request(app)
      .post('/api/shifts/open')
      .set('Authorization', `Bearer ${token}`)
      .send({ cashierName: 'Test Cashier', shiftPeriod: 'manana', openingCash: 200000 })
    const shiftId = openRes.body.data.id
    const res = await request(app)
      .get(`/api/shifts/${shiftId}/summary`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveProperty('breakdown')
    expect(res.body.data.breakdown).toHaveProperty('paymentMethods')
    expect(res.body.data.breakdown).toHaveProperty('orderTypes')
  })
})

describe('GET /api/shifts/by-period', () => {
  it('should return shifts by date', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    await request(app)
      .post('/api/shifts/open')
      .set('Authorization', `Bearer ${token}`)
      .send({ cashierName: 'Test Cashier', shiftPeriod: 'manana', openingCash: 200000 })
    const today = new Date().toISOString().split('T')[0]
    const res = await request(app)
      .get(`/api/shifts/by-period?date=${today}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })
})
