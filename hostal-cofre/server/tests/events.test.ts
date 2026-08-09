import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest'
import request from 'supertest'
import { createTestApp, createUser, generateToken, cleanupData, prisma } from './helpers.js'
import { errorHandler } from '../src/middleware/errors.js'
import { eventBus } from '../src/utils/events.js'

let app: ReturnType<typeof createTestApp>

beforeAll(async () => {
  await prisma.$connect()
  app = createTestApp()
  const { default: orderRoutes } = await import('../src/routes/orders.js')
  app.use('/api/orders', orderRoutes)
  app.use(errorHandler)
})

afterEach(async () => {
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.shift.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.table.deleteMany()
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await cleanupData()
  await prisma.$disconnect()
})

describe('GET /api/orders/events (SSE)', () => {
  it('should require authentication', async () => {
    const res = await request(app).get('/api/orders/events')
    expect(res.status).toBe(401)
  })

  it('should require admin role', async () => {
    const { user } = await createUser('client')
    const token = generateToken(user)
    const res = await request(app).get('/api/orders/events').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(403)
  })
})

describe('eventBus', () => {
  it('should broadcast to registered clients in SSE format', () => {
    const write = vi.fn()
    const fakeRes = { write } as unknown as Parameters<typeof eventBus.addClient>[0]

    eventBus.addClient(fakeRes)
    eventBus.broadcast('order.created', { id: 'order-1', total: 100 })

    expect(write).toHaveBeenCalledWith(
      'event: order.created\ndata: {"id":"order-1","total":100}\n\n',
    )
    expect(eventBus.clientCount()).toBe(1)
    eventBus.removeClient(fakeRes)
    expect(eventBus.clientCount()).toBe(0)
  })
})
