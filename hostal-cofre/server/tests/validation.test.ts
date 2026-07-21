import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import express from 'express'
import { PrismaClient } from '@prisma/client'

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

beforeAll(async () => {
  await prisma.$connect()
})

afterAll(async () => {
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
      .send({ name: 'Test', price: 10, category: 'invalid' })
    expect(res.status).toBe(400)
  })

  it('should reject missing name', async () => {
    const res = await request(app)
      .post('/api/menu')
      .send({ price: 10, category: 'pizza' })
    expect(res.status).toBe(400)
  })

  it('should reject negative price', async () => {
    const res = await request(app)
      .post('/api/menu')
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
