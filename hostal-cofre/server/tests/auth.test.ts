import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import request from 'supertest'
import { createTestApp, createUser, generateToken, cleanupData, prisma } from './helpers.js'
import { errorHandler } from '../src/middleware/errors.js'

let app: ReturnType<typeof createTestApp>

beforeAll(async () => {
  await prisma.$connect()
  app = createTestApp()
  const { default: authRoutes } = await import('../src/routes/auth.js')
  app.use('/api/auth', authRoutes)
  app.use(errorHandler)
})

afterEach(async () => {
  await prisma.loginAttempt.deleteMany()
  await prisma.refreshToken.deleteMany()
  await prisma.shift.deleteMany()
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await cleanupData()
  await prisma.$disconnect()
})

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'New User', email: `new-${Date.now()}@test.com`, password: 'Secure!Pass1' })
    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data.accessToken).toBeTruthy()
    expect(res.body.data.refreshToken).toBeTruthy()
    expect(res.body.data.user.email).toBeTruthy()
    expect(res.body.data.user.password).toBeUndefined()
  })

  it('should reject duplicate email', async () => {
    const { user } = await createUser('client')
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Dup', email: user.email, password: 'Secure!Pass1' })
    expect(res.status).toBe(409)
    expect(res.body.success).toBe(false)
  })

  it('should reject weak password (no uppercase)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: `weak-${Date.now()}@test.com`, password: 'alllower1!' })
    expect(res.status).toBe(400)
  })

  it('should reject weak password (no number)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: `weak-${Date.now()}@test.com`, password: 'Alllower!' })
    expect(res.status).toBe(400)
  })

  it('should reject weak password (no special char)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: `weak-${Date.now()}@test.com`, password: 'AllLower1' })
    expect(res.status).toBe(400)
  })
})

describe('POST /api/auth/login', () => {
  it('should login successfully', async () => {
    const email = `login-${Date.now()}@test.com`
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Login Test', email, password: 'TestPass!1' })
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'TestPass!1' })
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.accessToken).toBeTruthy()
    expect(res.body.data.refreshToken).toBeTruthy()
  })

  it('should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'noone@test.com', password: 'WrongPass!1' })
    expect(res.status).toBe(401)
  })

  it('should lock account after 5 failed attempts', async () => {
    const email = `lockout-${Date.now()}@test.com`
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Lockout Test', email, password: 'TestPass!1' })
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/auth/login')
        .send({ email, password: 'WrongPass!1' })
    }
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'WrongPass!1' })
    expect(res.status).toBe(429)
  })
})

describe('POST /api/auth/refresh', () => {
  it('should issue new tokens', async () => {
    const email = `refresh-${Date.now()}@test.com`
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Refresh Test', email, password: 'TestPass!1' })
    const refreshToken = registerRes.body.data.refreshToken

    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken })
    expect(res.status).toBe(200)
    expect(res.body.data.accessToken).toBeTruthy()
    expect(res.body.data.refreshToken).toBeTruthy()
  })

  it('should reject revoked refresh token', async () => {
    const email = `refresh-revoked-${Date.now()}@test.com`
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Refresh Revoked', email, password: 'TestPass!1' })
    const refreshToken = registerRes.body.data.refreshToken

    await request(app).post('/api/auth/refresh').send({ refreshToken })
    const res = await request(app).post('/api/auth/refresh').send({ refreshToken })
    expect(res.status).toBe(401)
  })

  it('should reject invalid UUID', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: '00000000-0000-0000-0000-000000000000' })
    expect(res.status).toBe(401)
  })
})

describe('POST /api/auth/logout', () => {
  it('should revoke refresh token', async () => {
    const email = `logout-${Date.now()}@test.com`
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Logout Test', email, password: 'TestPass!1' })
    const refreshToken = registerRes.body.data.refreshToken

    const logoutRes = await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken })
    expect(logoutRes.status).toBe(200)

    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken })
    expect(refreshRes.status).toBe(401)
  })
})

describe('POST /api/auth/change-password', () => {
  it('should change password and invalidate old refresh tokens', async () => {
    const email = `changepw-${Date.now()}@test.com`
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'PW Change', email, password: 'TestPass!1' })
    const accessToken = registerRes.body.data.accessToken
    const oldRefreshToken = registerRes.body.data.refreshToken

    const res = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ currentPassword: 'TestPass!1', newPassword: 'NewSecure!2' })
    expect(res.status).toBe(200)

    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: oldRefreshToken })
    expect(refreshRes.status).toBe(401)
  })

  it('should reject wrong current password', async () => {
    const { user } = await createUser('client')
    const token = generateToken(user)
    const res = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'WrongPass!1', newPassword: 'NewSecure!2' })
    expect(res.status).toBe(401)
  })
})

describe('GET /api/auth/me', () => {
  it('should return user profile', async () => {
    const { user } = await createUser('client')
    const token = generateToken(user)
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.data.email).toBe(user.email)
    expect(res.body.data.password).toBeUndefined()
  })

  it('should reject without token', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
  })
})
