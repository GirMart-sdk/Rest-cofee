import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import request from 'supertest'
import {
  createTestApp,
  createUser,
  createMenuItem,
  createReservation,
  generateToken,
  cleanupData,
  prisma,
} from './helpers.js'
import { errorHandler } from '../src/middleware/errors.js'

let app: ReturnType<typeof createTestApp>

beforeAll(async () => {
  await prisma.$connect()
  app = createTestApp()
  const { default: tableRoutes } = await import('../src/routes/tables.js')
  app.use('/api/tables', tableRoutes)
  app.use(errorHandler)
})

afterEach(async () => {
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.reservation.deleteMany()
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

describe('GET /api/tables', () => {
  it('should return all tables (public) without exposing reservations or order PII', async () => {
    const table = await prisma.table.create({
      data: { number: 101, capacity: 4, zone: 'interior' },
    })
    const menuItem = await createMenuItem()
    await prisma.order.create({
      data: {
        customerName: 'John Doe',
        customerPhone: '3001234567',
        customerEmail: 'john@x.com',
        total: menuItem.price,
        paymentMethod: 'cash',
        status: 'pending',
        orderType: 'mesa',
        receiptNumber: 'HC-SECRET-1',
        tableId: table.id,
        items: {
          create: { menuItemId: menuItem.id, quantity: 1, price: menuItem.price },
        },
      },
    })
    await createReservation({ tableId: table.id })

    const res = await request(app).get('/api/tables')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    const entry = res.body.data.find((t: any) => t.id === table.id)
    expect(entry).toBeDefined()
    expect(entry).not.toHaveProperty('reservations')
    expect(entry.orders).toHaveLength(1)
    const order = entry.orders[0]
    expect(order).not.toHaveProperty('customerName')
    expect(order).not.toHaveProperty('customerPhone')
    expect(order).not.toHaveProperty('customerEmail')
    expect(order).not.toHaveProperty('receiptNumber')
  })
})

describe('GET /api/tables/active', () => {
  it('should return active tables with occupancy for admin', async () => {
    const token = await adminToken()
    await prisma.table.create({
      data: { number: 102, capacity: 4, zone: 'interior' },
    })
    const res = await request(app).get('/api/tables/active').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data[0]).toHaveProperty('isOccupied')
    expect(res.body.data[0]).toHaveProperty('activeOrderCount')
    expect(res.body.data[0]).toHaveProperty('totalPending')
  })

  it('should reject without auth', async () => {
    const res = await request(app).get('/api/tables/active')
    expect(res.status).toBe(401)
  })

  it('should reject non-admin users', async () => {
    const token = await clientToken()
    const res = await request(app).get('/api/tables/active').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(403)
  })
})

describe('POST /api/tables', () => {
  it('should create a table as admin', async () => {
    const token = await adminToken()
    const res = await request(app)
      .post('/api/tables')
      .set('Authorization', `Bearer ${token}`)
      .send({ number: 103, capacity: 6, zone: 'exterior' })
    expect(res.status).toBe(201)
    expect(res.body.data.number).toBe(103)
    expect(res.body.data.zone).toBe('exterior')
  })

  it('should reject duplicate table number', async () => {
    const token = await adminToken()
    await prisma.table.create({
      data: { number: 104, capacity: 4, zone: 'interior' },
    })
    const res = await request(app)
      .post('/api/tables')
      .set('Authorization', `Bearer ${token}`)
      .send({ number: 104, capacity: 4, zone: 'interior' })
    expect(res.status).toBe(400)
  })

  it('should reject invalid zone', async () => {
    const token = await adminToken()
    const res = await request(app)
      .post('/api/tables')
      .set('Authorization', `Bearer ${token}`)
      .send({ number: 105, capacity: 4, zone: 'rooftop' })
    expect(res.status).toBe(400)
  })

  it('should reject without auth', async () => {
    const res = await request(app)
      .post('/api/tables')
      .send({ number: 106, capacity: 4, zone: 'interior' })
    expect(res.status).toBe(401)
  })
})

describe('PUT /api/tables/:id', () => {
  it('should update a table as admin', async () => {
    const token = await adminToken()
    const table = await prisma.table.create({
      data: { number: 107, capacity: 4, zone: 'interior' },
    })
    const res = await request(app)
      .put(`/api/tables/${table.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ capacity: 8, zone: 'privado' })
    expect(res.status).toBe(200)
    expect(res.body.data.capacity).toBe(8)
    expect(res.body.data.zone).toBe('privado')
  })

  it('should return 404 for non-existent table', async () => {
    const token = await adminToken()
    const res = await request(app)
      .put('/api/tables/c00000000000000000000001')
      .set('Authorization', `Bearer ${token}`)
      .send({ capacity: 4 })
    expect(res.status).toBe(404)
  })

  it('should reject changing to an existing table number', async () => {
    const token = await adminToken()
    const first = await prisma.table.create({
      data: { number: 108, capacity: 4, zone: 'interior' },
    })
    await prisma.table.create({
      data: { number: 109, capacity: 4, zone: 'interior' },
    })
    const res = await request(app)
      .put(`/api/tables/${first.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ number: 109 })
    expect(res.status).toBe(400)
  })

  it('should reject invalid table id format', async () => {
    const token = await adminToken()
    const res = await request(app)
      .put('/api/tables/not-a-cuid')
      .set('Authorization', `Bearer ${token}`)
      .send({ capacity: 4 })
    expect(res.status).toBe(400)
  })
})

describe('DELETE /api/tables/:id', () => {
  it('should delete a table as admin', async () => {
    const token = await adminToken()
    const table = await prisma.table.create({
      data: { number: 110, capacity: 4, zone: 'interior' },
    })
    const res = await request(app)
      .delete(`/api/tables/${table.id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(204)
    expect(await prisma.table.findUnique({ where: { id: table.id } })).toBeNull()
  })

  it('should return 404 for non-existent table', async () => {
    const token = await adminToken()
    const res = await request(app)
      .delete('/api/tables/c00000000000000000000001')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(404)
  })

  it('should reject deleting a table with active orders', async () => {
    const token = await adminToken()
    const table = await prisma.table.create({
      data: { number: 111, capacity: 4, zone: 'interior' },
    })
    const menuItem = await createMenuItem()
    await prisma.order.create({
      data: {
        customerName: 'Table Order',
        customerPhone: '3001234567',
        total: menuItem.price,
        paymentMethod: 'cash',
        status: 'pending',
        orderType: 'mesa',
        receiptNumber: `HC-${Date.now()}`,
        tableId: table.id,
        items: {
          create: { menuItemId: menuItem.id, quantity: 1, price: menuItem.price },
        },
      },
    })
    const res = await request(app)
      .delete(`/api/tables/${table.id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(400)
  })

  it('should reject deleting a table with active reservations', async () => {
    const token = await adminToken()
    const table = await prisma.table.create({
      data: { number: 112, capacity: 4, zone: 'interior' },
    })
    await createReservation({ tableId: table.id })
    const res = await request(app)
      .delete(`/api/tables/${table.id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(400)
  })
})

describe('GET /api/tables/:number', () => {
  it('should return a table by number without order PII', async () => {
    const table = await prisma.table.create({
      data: { number: 113, capacity: 4, zone: 'interior' },
    })
    const menuItem = await createMenuItem()
    await prisma.order.create({
      data: {
        customerName: 'Secret Customer',
        customerPhone: '3000000000',
        total: menuItem.price,
        paymentMethod: 'cash',
        status: 'pending',
        orderType: 'mesa',
        receiptNumber: 'HC-TOP-SECRET',
        tableId: table.id,
        items: {
          create: { menuItemId: menuItem.id, quantity: 1, price: menuItem.price },
        },
      },
    })
    const res = await request(app).get(`/api/tables/${table.number}`)
    expect(res.status).toBe(200)
    expect(res.body.data.id).toBe(table.id)
    expect(res.body.data.orders).toHaveLength(1)
    const order = res.body.data.orders[0]
    expect(order).not.toHaveProperty('customerName')
    expect(order).not.toHaveProperty('customerPhone')
    expect(order).not.toHaveProperty('customerEmail')
    expect(order).not.toHaveProperty('receiptNumber')
  })

  it('should return 404 for non-existent table number', async () => {
    const res = await request(app).get('/api/tables/995')
    expect(res.status).toBe(404)
  })

  it('should reject an out-of-range table number', async () => {
    const res = await request(app).get('/api/tables/0')
    expect(res.status).toBe(400)
  })
})
