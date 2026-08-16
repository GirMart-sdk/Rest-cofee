import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import request from 'supertest'
import {
  createTestApp,
  createUser,
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
  const { default: reservationRoutes } = await import('../src/routes/reservations.js')
  app.use('/api/reservations', reservationRoutes)
  app.use(errorHandler)
})

afterEach(async () => {
  await prisma.reservation.deleteMany()
  await prisma.shift.deleteMany()
  await prisma.table.deleteMany()
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await cleanupData()
  await prisma.$disconnect()
})

describe('POST /api/reservations', () => {
  it('should create a reservation', async () => {
    const table = await createTable()
    const res = await request(app).post('/api/reservations').send({
      name: 'John Doe',
      phone: '3001234567',
      email: 'john@test.com',
      date: '2026-12-31',
      time: '20:00',
      guests: 4,
      tableId: table.id,
      notes: 'Ventana por favor',
    })
    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data.name).toBe('John Doe')
    expect(res.body.data.tableId).toBe(table.id)
  })

  it('should reject invalid time format', async () => {
    const res = await request(app).post('/api/reservations').send({
      name: 'Test',
      phone: '3001234567',
      date: '2026-12-31',
      time: 'invalid',
      guests: 2,
    })
    expect(res.status).toBe(400)
  })

  it('should reject guests > 50', async () => {
    const res = await request(app).post('/api/reservations').send({
      name: 'Test',
      phone: '3001234567',
      date: '2026-12-31',
      time: '20:00',
      guests: 999,
    })
    expect(res.status).toBe(400)
  })

  it('should reject missing name', async () => {
    const res = await request(app).post('/api/reservations').send({
      phone: '3001234567',
      date: '2026-12-31',
      time: '20:00',
      guests: 2,
    })
    expect(res.status).toBe(400)
  })

  it('should create reservation without table', async () => {
    const res = await request(app).post('/api/reservations').send({
      name: 'Walk In',
      phone: '3001234567',
      date: '2026-12-31',
      time: '19:30',
      guests: 2,
    })
    expect(res.status).toBe(201)
    expect(res.body.data.tableId).toBeNull()
  })

  it('should create reservation with notes', async () => {
    const res = await request(app).post('/api/reservations').send({
      name: 'Notes Test',
      phone: '3001234567',
      date: '2026-12-31',
      time: '21:00',
      guests: 3,
      notes: 'Alergia al maní',
    })
    expect(res.status).toBe(201)
    expect(res.body.data.notes).toBe('Alergia al maní')
  })

  it('should reject overlapping reservation on the same table', async () => {
    const table = await createTable()
    await request(app).post('/api/reservations').send({
      name: 'First',
      phone: '3001234567',
      date: '2026-12-31',
      time: '20:00',
      guests: 2,
      tableId: table.id,
    })
    const res = await request(app).post('/api/reservations').send({
      name: 'Second',
      phone: '3001234567',
      date: '2026-12-31',
      time: '21:00',
      guests: 2,
      tableId: table.id,
    })
    expect(res.status).toBe(409)
  })

  it('should allow a reservation after the occupancy window ends', async () => {
    const table = await createTable()
    await request(app).post('/api/reservations').send({
      name: 'First',
      phone: '3001234567',
      date: '2026-12-31',
      time: '20:00',
      guests: 2,
      tableId: table.id,
    })
    const res = await request(app).post('/api/reservations').send({
      name: 'Later',
      phone: '3001234567',
      date: '2026-12-31',
      time: '22:30',
      guests: 2,
      tableId: table.id,
    })
    expect(res.status).toBe(201)
  })

  it('should not check availability for different tables or cancelled reservations', async () => {
    const table = await createTable()
    const first = await request(app).post('/api/reservations').send({
      name: 'First',
      phone: '3001234567',
      date: '2026-12-31',
      time: '20:00',
      guests: 2,
      tableId: table.id,
    })
    const { user } = await createUser('admin')
    const token = generateToken(user)
    await request(app)
      .patch(`/api/reservations/${first.body.data.id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'cancelled' })

    const res = await request(app).post('/api/reservations').send({
      name: 'After Cancel',
      phone: '3001234567',
      date: '2026-12-31',
      time: '20:30',
      guests: 2,
      tableId: table.id,
    })
    expect(res.status).toBe(201)
  })
})

describe('GET /api/reservations', () => {
  it('should return reservations for authenticated user', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    const res = await request(app).get('/api/reservations').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.pagination).toMatchObject({ page: 1, limit: 100, totalPages: 1 })
  })

  it('should reject without auth', async () => {
    const res = await request(app).get('/api/reservations')
    expect(res.status).toBe(401)
  })

  it('should paginate reservations', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    for (let i = 0; i < 3; i++) {
      await request(app)
        .post('/api/reservations')
        .send({
          name: `Cliente ${i}`,
          phone: '3001234567',
          date: '2026-12-31',
          time: '20:00',
          guests: 2,
        })
    }
    const res = await request(app)
      .get('/api/reservations?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(2)
    expect(res.body.pagination).toMatchObject({ page: 1, limit: 2, total: 3, totalPages: 2 })
  })
})

describe('GET /api/reservations/tables', () => {
  it('should return available tables', async () => {
    await createTable()
    const res = await request(app).get('/api/reservations/tables')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBeGreaterThanOrEqual(1)
  })
})

describe('PATCH /api/reservations/:id/status', () => {
  it('should confirm a reservation', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    const table = await createTable()
    const createRes = await request(app).post('/api/reservations').send({
      name: 'Confirm Test',
      phone: '3001234567',
      date: '2026-12-31',
      time: '20:00',
      guests: 2,
      tableId: table.id,
    })
    const resId = createRes.body.data.id

    const res = await request(app)
      .patch(`/api/reservations/${resId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'confirmed' })
    expect(res.status).toBe(200)
    expect(res.body.data.status).toBe('confirmed')
  })

  it('should cancel a reservation', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    const table = await createTable()
    const createRes = await request(app).post('/api/reservations').send({
      name: 'Cancel Test',
      phone: '3001234567',
      date: '2026-12-31',
      time: '20:00',
      guests: 2,
      tableId: table.id,
    })
    const resId = createRes.body.data.id

    const res = await request(app)
      .patch(`/api/reservations/${resId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'cancelled' })
    expect(res.status).toBe(200)
    expect(res.body.data.status).toBe('cancelled')
  })

  it('should reject invalid status', async () => {
    const { user } = await createUser('admin')
    const token = generateToken(user)
    const res = await request(app)
      .patch('/api/reservations/c00000000000000000000001/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'invalid_status' })
    expect(res.status).toBe(400)
  })
})
