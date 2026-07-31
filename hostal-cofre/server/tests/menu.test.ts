import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import request from 'supertest'
import { createTestApp, createUser, createMenuItem, generateToken, cleanupData, prisma } from './helpers.js'
import { errorHandler } from '../src/middleware/errors.js'

let app: ReturnType<typeof createTestApp>

beforeAll(async () => {
  await prisma.$connect()
  app = createTestApp()
  const { default: menuRoutes } = await import('../src/routes/menu.js')
  app.use('/api/menu', menuRoutes)
  app.use(errorHandler)
})

afterEach(async () => {
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.shift.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await cleanupData()
  await prisma.$disconnect()
})

describe('GET /api/menu', () => {
  it('should return all menu items', async () => {
    await createMenuItem()
    const res = await request(app).get('/api/menu')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBeGreaterThanOrEqual(1)
  })
})

describe('POST /api/menu', () => {
  it('should create a menu item as admin', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    const res = await request(app)
      .post('/api/menu')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Pizza', price: 30000, category: 'pizza', description: 'Delicious pizza' })
    expect(res.status).toBe(201)
    expect(res.body.data.name).toBe('New Pizza')
    expect(res.body.data.category).toBe('pizza')
  })

  it('should reject without auth', async () => {
    const res = await request(app)
      .post('/api/menu')
      .send({ name: 'Unauth Pizza', price: 30000, category: 'pizza' })
    expect(res.status).toBe(401)
  })

  it('should reject non-admin users', async () => {
    const { user } = await createUser('client')
    const token = generateToken(user)
    const res = await request(app)
      .post('/api/menu')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Client Pizza', price: 30000, category: 'pizza' })
    expect(res.status).toBe(403)
  })

  it('should reject invalid category', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    const res = await request(app)
      .post('/api/menu')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Bad Pizza', price: 30000, category: 'invalid_category' })
    expect(res.status).toBe(400)
  })

  it('should reject negative price', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    const res = await request(app)
      .post('/api/menu')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Negative Pizza', price: -5, category: 'pizza' })
    expect(res.status).toBe(400)
  })

  it('should reject missing name', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    const res = await request(app)
      .post('/api/menu')
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 30000, category: 'pizza' })
    expect(res.status).toBe(400)
  })
})

describe('PUT /api/menu/:id', () => {
  it('should update a menu item', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    const item = await createMenuItem()

    const res = await request(app)
      .put(`/api/menu/${item.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Pizza', price: 35000 })
    expect(res.status).toBe(200)
    expect(res.body.data.name).toBe('Updated Pizza')
    expect(res.body.data.price).toBe(35000)
  })

  it('should reject invalid ID format', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    const res = await request(app)
      .put('/api/menu/invalid-id')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test', price: 10 })
    expect(res.status).toBe(400)
  })
})

describe('DELETE /api/menu/:id', () => {
  it('should delete a menu item', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    const item = await createMenuItem()

    const res = await request(app)
      .delete(`/api/menu/${item.id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(204)
  })

  it('should reject non-existent item', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    const res = await request(app)
      .delete('/api/menu/c00000000000000000000001')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(404)
  })
})
