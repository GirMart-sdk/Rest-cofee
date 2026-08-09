import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import request from 'supertest'
import { createTestApp, createUser, generateToken, cleanupData, prisma } from './helpers.js'
import { errorHandler } from '../src/middleware/errors.js'

let app: ReturnType<typeof createTestApp>

async function waitForAudit(action: string) {
  for (let i = 0; i < 40; i++) {
    const log = await prisma.auditLog.findFirst({ where: { action } })
    if (log) return log
    await new Promise((resolve) => setTimeout(resolve, 25))
  }
  return null
}

beforeAll(async () => {
  await prisma.$connect()
  app = createTestApp()
  const { default: menuRoutes } = await import('../src/routes/menu.js')
  const { default: auditRoutes } = await import('../src/routes/audit.js')
  app.use('/api/menu', menuRoutes)
  app.use('/api/audit', auditRoutes)
  app.use(errorHandler)
})

afterEach(async () => {
  await prisma.auditLog.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await cleanupData()
  await prisma.$disconnect()
})

describe('audit logging on admin mutations', () => {
  it('should record menu.create when an admin creates a menu item', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)

    const res = await request(app)
      .post('/api/menu')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Café Tinto', description: 'Café caliente', price: 5000, category: 'bebida' })

    expect(res.status).toBe(201)

    const log = await waitForAudit('menu.create')
    expect(log).not.toBeNull()
    expect(log!.userEmail).toBe(user.email)
    expect(log!.resource).toBe('menu')
    expect((log!.details as Record<string, unknown>).name).toBe('Café Tinto')
  })

  it('should not log a failed request', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)

    const res = await request(app)
      .post('/api/menu')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '', price: -5, category: 'bebida' })

    expect(res.status).toBe(400)
    await new Promise((resolve) => setTimeout(resolve, 100))
    const log = await prisma.auditLog.findFirst({ where: { action: 'menu.create' } })
    expect(log).toBeNull()
  })
})

describe('GET /api/audit', () => {
  it('should return audit logs for an admin', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userEmail: user.email,
        action: 'shift.close',
        resource: 'shift',
        resourceId: 'shift-1',
      },
    })

    const res = await request(app).get('/api/audit').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.length).toBeGreaterThanOrEqual(1)
    expect(res.body.data[0].action).toBe('shift.close')
  })

  it('should filter by action', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userEmail: user.email,
        action: 'order.status',
        resource: 'order',
      },
    })

    const res = await request(app)
      .get('/api/audit?action=order.status')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.data.every((log: { action: string }) => log.action === 'order.status')).toBe(
      true,
    )
  })

  it('should reject non-admin users', async () => {
    const { user } = await createUser('client')
    const token = generateToken(user)
    const res = await request(app).get('/api/audit').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(403)
  })
})
