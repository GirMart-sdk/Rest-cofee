import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import request from 'supertest'
import {
  createTestApp,
  createUser,
  createMenuItem,
  createShift,
  generateToken,
  cleanupData,
  prisma,
} from './helpers.js'
import { errorHandler } from '../src/middleware/errors.js'

let app: ReturnType<typeof createTestApp>

beforeAll(async () => {
  await prisma.$connect()
  app = createTestApp()
  const { default: reportRoutes } = await import('../src/routes/reports.js')
  app.use('/api/reports', reportRoutes)
  app.use(errorHandler)
})

afterEach(async () => {
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.reservation.deleteMany()
  await prisma.loginAttempt.deleteMany()
  await prisma.refreshToken.deleteMany()
  await prisma.shift.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.table.deleteMany()
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await cleanupData()
  await prisma.$disconnect()
})

async function adminToken() {
  const { user } = await createUser('admin')
  return generateToken(user)
}

async function clientToken() {
  const { user } = await createUser('client')
  return generateToken(user)
}

async function seedSalesData() {
  const menuItem = await createMenuItem()
  const shift = await createShift()
  await prisma.order.create({
    data: {
      customerName: 'Sales Test',
      customerPhone: '3001234567',
      total: menuItem.price * 2,
      paymentMethod: 'cash',
      status: 'delivered',
      orderType: 'tienda',
      receiptNumber: `HC-${Date.now()}`,
      shiftId: shift.id,
      items: {
        create: [{ menuItemId: menuItem.id, quantity: 2, price: menuItem.price }],
      },
    },
  })
  return { menuItem, shift }
}

describe('GET /api/reports/daily', () => {
  it('should return daily report for admin', async () => {
    const token = await adminToken()
    await seedSalesData()
    const res = await request(app).get('/api/reports/daily').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveProperty('summary')
    expect(res.body.data.summary.totalOrders).toBeGreaterThanOrEqual(1)
    expect(res.body.data).toHaveProperty('topItems')
    expect(res.body.data).toHaveProperty('hourlySales')
    expect(Array.isArray(res.body.data.shifts)).toBe(true)
    expect(res.body.data.shifts.length).toBeGreaterThanOrEqual(1)
    expect(res.body.data.shifts[0]).toHaveProperty('cashier')
  })

  it('should accept a date parameter', async () => {
    const token = await adminToken()
    const res = await request(app)
      .get('/api/reports/daily?date=2026-12-31')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.data.date).toBe('2026-12-31')
  })

  it('should reject non-admin users', async () => {
    const token = await clientToken()
    const res = await request(app).get('/api/reports/daily').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(403)
  })

  it('should reject without auth', async () => {
    const res = await request(app).get('/api/reports/daily')
    expect(res.status).toBe(401)
  })
})

describe('GET /api/reports/weekly', () => {
  it('should return weekly summary for admin', async () => {
    const token = await adminToken()
    await seedSalesData()
    const res = await request(app)
      .get('/api/reports/weekly')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveProperty('totalSales')
    expect(res.body.data).toHaveProperty('totalOrders')
    expect(Array.isArray(res.body.data.dailyBreakdown)).toBe(true)
  })

  it('should reject non-admin users', async () => {
    const token = await clientToken()
    const res = await request(app)
      .get('/api/reports/weekly')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(403)
  })
})
