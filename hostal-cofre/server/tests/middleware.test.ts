import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import express from 'express'
import jwt from 'jsonwebtoken'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import { errorHandler } from '../src/middleware/errors.js'
import { sanitize } from '../src/middleware/sanitize.js'
import { requestId } from '../src/middleware/requestId.js'
import { authenticate, requireAdmin, optionalAuth, AuthRequest } from '../src/middleware/auth.js'
import { cleanupExpiredTokens } from '../src/middleware/tokenBlacklist.js'
import { createUser, cleanupData, prisma } from './helpers.js'

beforeAll(async () => {
  await prisma.$connect()
})

afterAll(async () => {
  await cleanupData()
  await prisma.$disconnect()
})

describe('requestId middleware', () => {
  const app = express()
  app.use(requestId)
  app.get('/ping', (_req, res) => res.json({ ok: true }))

  it('should generate an X-Request-Id header', async () => {
    const res = await request(app).get('/ping')
    expect(res.headers['x-request-id']).toBeTruthy()
  })

  it('should ignore a client-provided X-Request-Id', async () => {
    const res = await request(app).get('/ping').set('X-Request-Id', 'test-123')
    expect(res.headers['x-request-id']).toBeTruthy()
    expect(res.headers['x-request-id']).not.toBe('test-123')
  })
})

describe('sanitize middleware', () => {
  const app = express()
  app.use(express.json())
  app.use(sanitize)
  app.post('/echo', (req, res) => res.json({ body: req.body, query: req.query }))

  it('should strip script tags from string values', async () => {
    const res = await request(app).post('/echo').send({ name: '<script>alert(1)</script>John' })
    expect(res.body.body.name).not.toContain('<script>')
    expect(res.body.body.name).toContain('John')
  })

  it('should strip event handlers from string values', async () => {
    const res = await request(app).post('/echo').send({ name: 'John onclick=alert(1)' })
    expect(res.body.body.name).not.toContain('onclick=')
    expect(res.body.body.name).toContain('John')
  })

  it('should strip javascript: URIs', async () => {
    const res = await request(app).post('/echo').send({ url: 'javascript:alert(1)' })
    expect(res.body.body.url).not.toContain('javascript:')
  })

  it('should sanitize nested objects', async () => {
    const res = await request(app)
      .post('/echo')
      .send({ user: { name: '<b>Bob</b>', age: 30 } })
    expect(res.body.body.user.name).not.toContain('<b>')
    expect(res.body.body.user.name).toContain('Bob')
    expect(res.body.body.user.age).toBe(30)
  })

  it('should sanitize arrays of strings and objects', async () => {
    const res = await request(app)
      .post('/echo')
      .send({ items: ['<i>a</i>', { note: 'javascript:x' }], n: 5 })
    expect(res.body.body.items[0]).not.toContain('<i>')
    expect(res.body.body.items[1].note).not.toContain('javascript:')
    expect(res.body.body.n).toBe(5)
  })

  it('should sanitize query strings', async () => {
    const res = await request(app).post('/echo').query({ name: '<script>x</script>Bob' }).send({})
    expect(res.body.query.name).not.toContain('<script>')
    expect(res.body.query.name).toContain('Bob')
  })
})

describe('errorHandler', () => {
  function mockRes() {
    const res: any = { statusCode: 200 }
    res.status = vi.fn().mockReturnValue(res)
    res.json = vi.fn().mockReturnValue(res)
    return res
  }

  it('should return 400 for ZodError', () => {
    const res = mockRes()
    const err = new ZodError([{ code: 'custom', message: 'bad', path: ['name'] }])
    errorHandler(err, {} as any, res, () => {})
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json.mock.calls[0][0].errors).toBeDefined()
  })

  it('should return 409 for duplicate key (P2002)', () => {
    const res = mockRes()
    const err = new Prisma.PrismaClientKnownRequestError('dup', {
      code: 'P2002',
      clientVersion: '5',
    })
    errorHandler(err, {} as any, res, () => {})
    expect(res.status).toHaveBeenCalledWith(409)
  })

  it('should return 404 for missing record (P2025)', () => {
    const res = mockRes()
    const err = new Prisma.PrismaClientKnownRequestError('missing', {
      code: 'P2025',
      clientVersion: '5',
    })
    errorHandler(err, {} as any, res, () => {})
    expect(res.status).toHaveBeenCalledWith(404)
  })

  it('should return 400 for Prisma validation errors', () => {
    const res = mockRes()
    errorHandler(
      new Prisma.PrismaClientValidationError('bad data', { clientVersion: '5' }),
      {} as any,
      res,
      () => {},
    )
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('should honor err.statusCode', () => {
    const res = mockRes()
    errorHandler(
      Object.assign(new Error('Not found'), { statusCode: 404 }),
      {} as any,
      res,
      () => {},
    )
    expect(res.status).toHaveBeenCalledWith(404)
  })

  it('should return 500 for unknown errors', () => {
    const res = mockRes()
    errorHandler(new Error('boom'), {} as any, res, () => {})
    expect(res.status).toHaveBeenCalledWith(500)
  })
})

describe('auth middleware', () => {
  const app = express()
  app.use(express.json())
  app.get('/protected', authenticate, (req: AuthRequest, res) => res.json({ user: req.user }))
  app.get('/admin', authenticate, requireAdmin, (_req, res) => res.json({ ok: true }))
  app.get('/optional', optionalAuth, (req: AuthRequest, res) =>
    res.json({ user: req.user || null }),
  )
  app.use(errorHandler)

  function sign(user: { id: string; email: string; role: string }, expiresIn = '15m') {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'test-secret-that-is-at-least-32-characters-long!!',
      { expiresIn, algorithm: 'HS256' },
    )
  }

  it('should reject missing token', async () => {
    const res = await request(app).get('/protected')
    expect(res.status).toBe(401)
    expect(res.body.error).toBe('No token provided')
  })

  it('should reject malformed token', async () => {
    const res = await request(app).get('/protected').set('Authorization', 'Bearer not.a.jwt')
    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Invalid token')
  })

  it('should reject expired token', async () => {
    const { user } = await createUser('client')
    const expired = sign(user, '-1s')
    const res = await request(app).get('/protected').set('Authorization', `Bearer ${expired}`)
    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Token expired')
  })

  it('should allow access with valid token', async () => {
    const { user } = await createUser('client')
    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${sign(user)}`)
    expect(res.status).toBe(200)
    expect(res.body.user.email).toBe(user.email)
  })

  it('should deny non-admin users from admin routes', async () => {
    const { user } = await createUser('client')
    const res = await request(app)
      .get('/admin')
      .set('Authorization', `Bearer ${sign(user)}`)
    expect(res.status).toBe(403)
  })

  it('should allow admin users on admin routes', async () => {
    const { user } = await createUser('admin')
    const res = await request(app)
      .get('/admin')
      .set('Authorization', `Bearer ${sign(user)}`)
    expect(res.status).toBe(200)
  })

  it('should set user for valid token on optional routes', async () => {
    const { user } = await createUser('client')
    const res = await request(app)
      .get('/optional')
      .set('Authorization', `Bearer ${sign(user)}`)
    expect(res.status).toBe(200)
    expect(res.body.user).toBeTruthy()
  })

  it('should continue without user for invalid token on optional routes', async () => {
    const res = await request(app).get('/optional').set('Authorization', 'Bearer bad.token.here')
    expect(res.status).toBe(200)
    expect(res.body.user).toBeNull()
  })
})

describe('tokenBlacklist cleanup', () => {
  it('should delete expired refresh tokens', async () => {
    const { user } = await createUser('client')
    await prisma.refreshToken.create({
      data: {
        tokenHash: 'c0000000-0000-0000-0000-000000000001',
        userId: user.id,
        expiresAt: new Date(Date.now() - 60_000),
      },
    })
    await cleanupExpiredTokens()
    const gone = await prisma.refreshToken.findUnique({
      where: { tokenHash: 'c0000000-0000-0000-0000-000000000001' },
    })
    expect(gone).toBeNull()
  })
})
