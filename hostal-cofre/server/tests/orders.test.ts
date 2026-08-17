import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import request from 'supertest'
import {
  createTestApp,
  createUser,
  createMenuItem,
  createTable,
  generateToken,
  cleanupData,
  prisma,
} from './helpers.js'
import { errorHandler } from '../src/middleware/errors.js'

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

describe('POST /api/orders', () => {
  it('should create an order successfully', async () => {
    const menuItem = await createMenuItem()
    const res = await request(app)
      .post('/api/orders')
      .send({
        customerName: 'John Doe',
        customerPhone: '3001234567',
        paymentMethod: 'cash',
        items: [{ menuItemId: menuItem.id, quantity: 2 }],
      })
    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data.total).toBe(menuItem.price * 2)
    expect(res.body.data.receiptNumber).toMatch(/^HC-/)
    expect(res.body.data.items).toHaveLength(1)
  })

  it('should reject invalid menu item id', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        customerName: 'John Doe',
        customerPhone: '3001234567',
        paymentMethod: 'cash',
        items: [{ menuItemId: 'c0000000000000000000invalid', quantity: 1 }],
      })
    expect(res.status).toBe(400)
  })

  it('should reject empty items', async () => {
    const res = await request(app).post('/api/orders').send({
      customerName: 'John Doe',
      customerPhone: '3001234567',
      paymentMethod: 'cash',
      items: [],
    })
    expect(res.status).toBe(400)
  })

  it('should reject invalid payment method', async () => {
    const menuItem = await createMenuItem()
    const res = await request(app)
      .post('/api/orders')
      .send({
        customerName: 'John Doe',
        customerPhone: '3001234567',
        paymentMethod: 'bitcoin',
        items: [{ menuItemId: menuItem.id, quantity: 1 }],
      })
    expect(res.status).toBe(400)
  })
})

describe('POST /api/orders/table', () => {
  it('should create a table order', async () => {
    const menuItem = await createMenuItem()
    const table = await createTable()
    const res = await request(app)
      .post('/api/orders/table')
      .send({
        customerName: 'Mesa 5',
        paymentMethod: 'cash',
        items: [{ menuItemId: menuItem.id, quantity: 1 }],
        tableNumber: table.number,
      })
    expect(res.status).toBe(201)
    expect(res.body.data.orderType).toBe('mesa')
  })

  it('should reject invalid table number', async () => {
    const menuItem = await createMenuItem()
    const res = await request(app)
      .post('/api/orders/table')
      .send({
        customerName: 'Mesa X',
        paymentMethod: 'cash',
        items: [{ menuItemId: menuItem.id, quantity: 1 }],
        tableNumber: 99999,
      })
    expect(res.status).toBe(404)
  })
})

describe('GET /api/orders', () => {
  it('should return orders for authenticated user', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    const res = await request(app).get('/api/orders').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.pagination).toMatchObject({ page: 1, limit: 50, totalPages: 1 })
  })

  it('should reject without auth', async () => {
    const res = await request(app).get('/api/orders')
    expect(res.status).toBe(401)
  })

  it('should paginate orders', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    const menuItem = await createMenuItem()
    for (let i = 0; i < 3; i++) {
      await request(app)
        .post('/api/orders')
        .send({
          customerName: `Cliente ${i}`,
          customerPhone: '3001234567',
          paymentMethod: 'cash',
          items: [{ menuItemId: menuItem.id, quantity: 1 }],
        })
    }
    const res = await request(app)
      .get('/api/orders?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(2)
    expect(res.body.pagination).toMatchObject({ page: 1, limit: 2, total: 3, totalPages: 2 })

    const page2 = await request(app)
      .get('/api/orders?page=2&limit=2')
      .set('Authorization', `Bearer ${token}`)
    expect(page2.status).toBe(200)
    expect(page2.body.data).toHaveLength(1)
    expect(page2.body.pagination.page).toBe(2)
  })

  it('should cap the limit at 100', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    const res = await request(app)
      .get('/api/orders?limit=9999')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.pagination.limit).toBe(100)
  })

  it('should only return orders belonging to the non-admin user (by user or email)', async () => {
    const me = await createUser('client')
    const other = await createUser('client')
    const myToken = generateToken(me.user)
    const menuItem = await createMenuItem()

    await request(app)
      .post('/api/orders')
      .send({
        customerName: 'Mine by id',
        customerPhone: '3001234567',
        customerEmail: me.user.email,
        paymentMethod: 'cash',
        items: [{ menuItemId: menuItem.id, quantity: 1 }],
      })
    await request(app)
      .post('/api/orders')
      .send({
        customerName: 'Mine by email',
        customerPhone: '3001234567',
        customerEmail: me.user.email,
        paymentMethod: 'cash',
        items: [{ menuItemId: menuItem.id, quantity: 1 }],
      })
    await request(app)
      .post('/api/orders')
      .send({
        customerName: 'Someone else',
        customerPhone: '3001234567',
        customerEmail: other.user.email,
        paymentMethod: 'cash',
        items: [{ menuItemId: menuItem.id, quantity: 1 }],
      })

    const res = await request(app).get('/api/orders').set('Authorization', `Bearer ${myToken}`)
    expect(res.status).toBe(200)
    expect(res.body.pagination.total).toBe(2)
    const names = res.body.data.map((o: any) => o.customerName).sort()
    expect(names).toEqual(['Mine by email', 'Mine by id'])
  })
})

describe('GET /api/orders/table/:tableNumber', () => {
  it('should return active orders for table without exposing personal data', async () => {
    const menuItem = await createMenuItem()
    const table = await createTable()
    await request(app)
      .post('/api/orders/table')
      .send({
        customerName: 'Mesa Test',
        customerPhone: '3001234567',
        paymentMethod: 'cash',
        items: [{ menuItemId: menuItem.id, quantity: 1 }],
        tableNumber: table.number,
      })
    const res = await request(app).get(`/api/orders/table/${table.number}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBeGreaterThanOrEqual(1)

    const order = res.body.data[0]
    expect(order).not.toHaveProperty('customerName')
    expect(order).not.toHaveProperty('customerPhone')
    expect(order).not.toHaveProperty('customerEmail')
    expect(order).not.toHaveProperty('address')
    expect(order).not.toHaveProperty('deliveryNotes')
    expect(order).not.toHaveProperty('receiptNumber')
    expect(order).toHaveProperty('items')
    expect(order.items[0]).toHaveProperty('menuItem')
  })

  it('should return 404 for non-existent table', async () => {
    const res = await request(app).get('/api/orders/table/995')
    expect(res.status).toBe(404)
  })

  it('should reject an out-of-range table number', async () => {
    const res = await request(app).get('/api/orders/table/0')
    expect(res.status).toBe(400)
  })
})

describe('PATCH /api/orders/:id/status', () => {
  it('should update order status', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    const menuItem = await createMenuItem()
    const createRes = await request(app)
      .post('/api/orders')
      .send({
        customerName: 'Status Test',
        customerPhone: '3001234567',
        paymentMethod: 'cash',
        items: [{ menuItemId: menuItem.id, quantity: 1 }],
      })
    const orderId = createRes.body.data.id

    const res = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'preparing' })
    expect(res.status).toBe(200)
    expect(res.body.data.status).toBe('preparing')
  })

  it('should reject invalid status enum', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    const res = await request(app)
      .patch('/api/orders/c00000000000000000000001/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'invalid_status' })
    expect(res.status).toBe(400)
  })
})

describe('PATCH /api/orders/:id/payment', () => {
  it('should update payment status', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    const menuItem = await createMenuItem()
    const createRes = await request(app)
      .post('/api/orders')
      .send({
        customerName: 'Payment Test',
        customerPhone: '3001234567',
        paymentMethod: 'cash',
        items: [{ menuItemId: menuItem.id, quantity: 1 }],
      })
    const orderId = createRes.body.data.id

    const res = await request(app)
      .patch(`/api/orders/${orderId}/payment`)
      .set('Authorization', `Bearer ${token}`)
      .send({ paymentStatus: 'paid' })
    expect(res.status).toBe(200)
    expect(res.body.data.paymentStatus).toBe('paid')
  })
})

describe('GET /api/orders/zones', () => {
  it('should return delivery zones', async () => {
    const res = await request(app).get('/api/orders/zones')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBeGreaterThanOrEqual(3)
  })
})
