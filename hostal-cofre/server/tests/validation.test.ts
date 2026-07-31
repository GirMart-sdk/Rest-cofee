import 'express-async-errors'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import express from 'express'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { errorHandler } from '../src/middleware/errors.js'

const prisma = new PrismaClient()

const app = express()
app.use(express.json())

// Import routes
import authRoutes from '../src/routes/auth.js'
import menuRoutes from '../src/routes/menu.js'
import orderRoutes from '../src/routes/orders.js'
import reservationRoutes from '../src/routes/reservations.js'

app.use('/api/auth', authRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/reservations', reservationRoutes)
app.use(errorHandler)

let adminToken = ''

beforeAll(async () => {
  await prisma.$connect()
  const hashed = await bcrypt.hash('AdminPass!1', 12)
  const admin = await prisma.user.create({
    data: { name: 'Admin Test', email: `admin-${Date.now()}@test.com`, password: hashed, role: 'admin' },
  })
  adminToken = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET || 'test-secret-that-is-at-least-32-characters-long!!',
    { expiresIn: '15m', algorithm: 'HS256' },
  )
})

afterAll(async () => {
  await prisma.menuItem.deleteMany()
  await prisma.user.deleteMany()
  await prisma.$disconnect()
})

describe('Health Check', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown')
    expect(res.status).toBe(404)
  })
})

describe('Menu Validation', () => {
  it('should reject invalid category', async () => {
    const res = await request(app)
      .post('/api/menu')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test', price: 10, category: 'invalid' })
    expect(res.status).toBe(400)
  })

  it('should reject missing name', async () => {
    const res = await request(app)
      .post('/api/menu')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 10, category: 'pizza' })
    expect(res.status).toBe(400)
  })

  it('should reject negative price', async () => {
    const res = await request(app)
      .post('/api/menu')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test', price: -5, category: 'pizza' })
    expect(res.status).toBe(400)
  })
})

describe('Reservation Validation', () => {
  it('should reject invalid time format', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .send({
        name: 'Test',
        phone: '1234567890',
        date: '2026-12-31',
        time: 'invalid',
        guests: 2,
      })
    expect(res.status).toBe(400)
  })

  it('should reject guests > 50', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .send({
        name: 'Test',
        phone: '1234567890',
        date: '2026-12-31',
        time: '20:00',
        guests: 999,
      })
    expect(res.status).toBe(400)
  })

  it('should reject missing name', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .send({
        phone: '1234567890',
        date: '2026-12-31',
        time: '20:00',
        guests: 2,
      })
    expect(res.status).toBe(400)
  })
})

describe('Order Validation', () => {
  it('should reject invalid payment method', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        customerName: 'Test',
        customerPhone: '123',
        paymentMethod: 'bitcoin',
        items: [{ menuItemId: 'test', quantity: 1 }],
      })
    expect(res.status).toBe(400)
  })

  it('should reject empty items', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        customerName: 'Test',
        customerPhone: '123',
        paymentMethod: 'cash',
        items: [],
      })
    expect(res.status).toBe(400)
  })
})
