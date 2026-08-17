import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import request from 'supertest'
import { generateSync } from 'otplib'
import { createTestApp, createUser, generateToken, cleanupData, prisma } from './helpers.js'
import { errorHandler } from '../src/middleware/errors.js'
import { REFRESH_COOKIE_NAME } from '../src/routes/auth.js'

const COOKIE = REFRESH_COOKIE_NAME

function getCookieValue(
  res: { headers: Record<string, unknown> },
  name: string,
): string | undefined {
  const raw = res.headers['set-cookie']
  if (!Array.isArray(raw)) return undefined
  for (const cookie of raw as string[]) {
    const [pair] = cookie.split(';')
    const [key, ...rest] = pair.split('=')
    if (key === name) return decodeURIComponent(rest.join('='))
  }
  return undefined
}

function cookieHeader(name: string, value: string): string {
  return `${name}=${value}`
}

async function register(
  app: ReturnType<typeof createTestApp>,
  email: string,
  password = 'TestPass!1',
) {
  return request(app).post('/api/auth/register').send({ name: 'Register Test', email, password })
}

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
  it('should register a new user and set an httpOnly refresh cookie', async () => {
    const res = await register(app, `new-${Date.now()}@test.com`)
    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data.accessToken).toBeTruthy()
    expect(res.body.data.refreshToken).toBeUndefined()
    expect(res.body.data.user.email).toBeTruthy()
    expect(res.body.data.user.password).toBeUndefined()

    const cookie = getCookieValue(res, COOKIE)
    expect(cookie).toBeTruthy()
    const setCookie = res.headers['set-cookie'] as string[]
    expect(setCookie.join(';')).toContain('HttpOnly')
  })

  it('should reject duplicate email', async () => {
    const { user } = await createUser('client')
    const res = await register(app, user.email)
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
  it('should login successfully and set the refresh cookie', async () => {
    const email = `login-${Date.now()}@test.com`
    await register(app, email)
    const res = await request(app).post('/api/auth/login').send({ email, password: 'TestPass!1' })
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.accessToken).toBeTruthy()
    expect(res.body.data.refreshToken).toBeUndefined()
    expect(res.body.requiresTwoFactor).toBeUndefined()
    expect(getCookieValue(res, COOKIE)).toBeTruthy()
  })

  it('should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'noone@test.com', password: 'WrongPass!1' })
    expect(res.status).toBe(401)
  })

  it('should lock account after 5 failed attempts', async () => {
    const email = `lockout-${Date.now()}@test.com`
    await register(app, email)
    for (let i = 0; i < 5; i++) {
      await request(app).post('/api/auth/login').send({ email, password: 'WrongPass!1' })
    }
    const res = await request(app).post('/api/auth/login').send({ email, password: 'WrongPass!1' })
    expect(res.status).toBe(429)
  })
})

describe('POST /api/auth/refresh', () => {
  it('should issue a new access token from the cookie', async () => {
    const email = `refresh-${Date.now()}@test.com`
    const registerRes = await register(app, email)
    const cookie = getCookieValue(registerRes, COOKIE)!

    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', cookieHeader(COOKIE, cookie))
    expect(res.status).toBe(200)
    expect(res.body.data.accessToken).toBeTruthy()
    expect(res.body.data.refreshToken).toBeUndefined()
    expect(getCookieValue(res, COOKIE)).toBeTruthy()
  })

  it('should revoke the old refresh token after rotation', async () => {
    const email = `refresh-rotated-${Date.now()}@test.com`
    const registerRes = await register(app, email)
    const cookie = getCookieValue(registerRes, COOKIE)!

    const first = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', cookieHeader(COOKIE, cookie))
    expect(first.status).toBe(200)

    const second = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', cookieHeader(COOKIE, cookie))
    expect(second.status).toBe(401)
  })

  it('should reject an invalid refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', cookieHeader(COOKIE, '00000000-0000-0000-0000-000000000000'))
    expect(res.status).toBe(401)
  })

  it('should reject requests without a cookie', async () => {
    const res = await request(app).post('/api/auth/refresh')
    expect(res.status).toBe(401)
  })
})

describe('POST /api/auth/logout', () => {
  it('should revoke the refresh token and clear the cookie', async () => {
    const email = `logout-${Date.now()}@test.com`
    const registerRes = await register(app, email)
    const cookie = getCookieValue(registerRes, COOKIE)!

    const logoutRes = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', cookieHeader(COOKIE, cookie))
    expect(logoutRes.status).toBe(200)

    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', cookieHeader(COOKIE, cookie))
    expect(refreshRes.status).toBe(401)
  })
})

describe('POST /api/auth/change-password', () => {
  it('should change password and invalidate old refresh tokens', async () => {
    const email = `changepw-${Date.now()}@test.com`
    const registerRes = await register(app, email)
    const accessToken = registerRes.body.data.accessToken
    const cookie = getCookieValue(registerRes, COOKIE)!

    const res = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ currentPassword: 'TestPass!1', newPassword: 'NewSecure!2' })
    expect(res.status).toBe(200)

    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', cookieHeader(COOKIE, cookie))
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

describe('2FA TOTP', () => {
  async function setupTwoFactor(email: string) {
    const registerRes = await register(app, email)
    const accessToken = registerRes.body.data.accessToken
    const setupRes = await request(app)
      .get('/api/auth/2fa/setup')
      .set('Authorization', `Bearer ${accessToken}`)
    return {
      accessToken,
      secret: setupRes.body.data.secret,
      otpauthUrl: setupRes.body.data.otpauthUrl,
    }
  }

  it('should return a secret and otpauth URL from setup', async () => {
    const email = `2fa-setup-${Date.now()}@test.com`
    const { otpauthUrl, secret } = await setupTwoFactor(email)
    expect(secret).toBeTruthy()
    expect(otpauthUrl).toContain('otpauth://totp/')
    expect(otpauthUrl).toContain('Hostal%20Cofre')
  })

  it('should enable 2FA with a valid code', async () => {
    const email = `2fa-enable-${Date.now()}@test.com`
    const { accessToken, secret } = await setupTwoFactor(email)
    const code = generateSync({ secret })

    const res = await request(app)
      .post('/api/auth/2fa/enable')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ code, password: 'TestPass!1' })
    expect(res.status).toBe(200)

    const statusRes = await request(app)
      .get('/api/auth/2fa/status')
      .set('Authorization', `Bearer ${accessToken}`)
    expect(statusRes.body.data.enabled).toBe(true)
  })

  it('should reject enabling with an invalid code', async () => {
    const email = `2fa-enable-bad-${Date.now()}@test.com`
    const { accessToken } = await setupTwoFactor(email)

    const res = await request(app)
      .post('/api/auth/2fa/enable')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ code: '000000', password: 'TestPass!1' })
    expect(res.status).toBe(401)

    const statusRes = await request(app)
      .get('/api/auth/2fa/status')
      .set('Authorization', `Bearer ${accessToken}`)
    expect(statusRes.body.data.enabled).toBe(false)
  })

  it('should require a second step when logging in with 2FA enabled', async () => {
    const email = `2fa-login-${Date.now()}@test.com`
    const { accessToken, secret } = await setupTwoFactor(email)
    const code = generateSync({ secret })
    await request(app)
      .post('/api/auth/2fa/enable')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ code, password: 'TestPass!1' })

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'TestPass!1' })
    expect(loginRes.status).toBe(200)
    expect(loginRes.body.requiresTwoFactor).toBe(true)
    expect(loginRes.body.data.accessToken).toBeUndefined()
    expect(loginRes.body.data.pendingToken).toBeTruthy()
    expect(getCookieValue(loginRes, COOKIE)).toBeUndefined()
  })

  it('should complete the 2FA login step with a valid code', async () => {
    const email = `2fa-verify-${Date.now()}@test.com`
    const { accessToken, secret } = await setupTwoFactor(email)
    const code = generateSync({ secret })
    await request(app)
      .post('/api/auth/2fa/enable')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ code, password: 'TestPass!1' })

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'TestPass!1' })
    const pendingToken = loginRes.body.data.pendingToken

    const verifyRes = await request(app)
      .post('/api/auth/2fa/verify')
      .send({ pendingToken, code: generateSync({ secret }) })
    expect(verifyRes.status).toBe(200)
    expect(verifyRes.body.data.accessToken).toBeTruthy()
    expect(verifyRes.body.data.refreshToken).toBeUndefined()
    expect(getCookieValue(verifyRes, COOKIE)).toBeTruthy()
  })

  it('should reject the 2FA step with an invalid code', async () => {
    const email = `2fa-verify-bad-${Date.now()}@test.com`
    const { accessToken, secret } = await setupTwoFactor(email)
    const code = generateSync({ secret })
    await request(app)
      .post('/api/auth/2fa/enable')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ code, password: 'TestPass!1' })

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'TestPass!1' })
    const pendingToken = loginRes.body.data.pendingToken

    const verifyRes = await request(app)
      .post('/api/auth/2fa/verify')
      .send({ pendingToken, code: '000000' })
    expect(verifyRes.status).toBe(401)
  })

  it('should disable 2FA with the password and a valid code', async () => {
    const email = `2fa-disable-${Date.now()}@test.com`
    const { accessToken, secret } = await setupTwoFactor(email)
    const code = generateSync({ secret })
    await request(app)
      .post('/api/auth/2fa/enable')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ code, password: 'TestPass!1' })

    const disableRes = await request(app)
      .post('/api/auth/2fa/disable')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ password: 'TestPass!1', code: generateSync({ secret }) })
    expect(disableRes.status).toBe(200)

    const statusRes = await request(app)
      .get('/api/auth/2fa/status')
      .set('Authorization', `Bearer ${accessToken}`)
    expect(statusRes.body.data.enabled).toBe(false)
  })

  it('should reject disabling with an invalid code', async () => {
    const email = `2fa-disable-bad-${Date.now()}@test.com`
    const { accessToken, secret } = await setupTwoFactor(email)
    const code = generateSync({ secret })
    await request(app)
      .post('/api/auth/2fa/enable')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ code, password: 'TestPass!1' })

    const disableRes = await request(app)
      .post('/api/auth/2fa/disable')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ password: 'TestPass!1', code: '000000' })
    expect(disableRes.status).toBe(401)
  })
})

describe('GET /api/auth/me', () => {
  it('should return user profile with 2FA status', async () => {
    const { user } = await createUser('client')
    const token = generateToken(user)
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.data.email).toBe(user.email)
    expect(res.body.data.password).toBeUndefined()
    expect(res.body.data.twoFactorEnabled).toBe(false)
  })

  it('should reject without token', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
  })
})

describe('POST /api/auth/admin/reset-password/:userId', () => {
  it('should allow admin to reset a user password', async () => {
    const admin = await createUser('admin')
    const client = await createUser('client')
    const adminToken = generateToken(admin.user)

    const res = await request(app)
      .post(`/api/auth/admin/reset-password/${client.user.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ newPassword: 'NewPass!123' })
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: client.user.email, password: 'NewPass!123' })
    expect(loginRes.status).toBe(200)
    expect(loginRes.body.data.accessToken).toBeDefined()
  })

  it('should reject non-admin users', async () => {
    const client = await createUser('client')
    const otherClient = await createUser('client')
    const token = generateToken(client.user)

    const res = await request(app)
      .post(`/api/auth/admin/reset-password/${otherClient.user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ newPassword: 'NewPass!123' })
    expect(res.status).toBe(403)
  })

  it('should reject weak passwords', async () => {
    const admin = await createUser('admin')
    const client = await createUser('client')
    const adminToken = generateToken(admin.user)

    const res = await request(app)
      .post(`/api/auth/admin/reset-password/${client.user.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ newPassword: 'weak' })
    expect(res.status).toBe(400)
  })

  it('should return 404 for non-existent user', async () => {
    const admin = await createUser('admin')
    const adminToken = generateToken(admin.user)

    const res = await request(app)
      .post('/api/auth/admin/reset-password/c00000000000000000000001')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ newPassword: 'NewPass!123' })
    expect(res.status).toBe(404)
  })

  it('should invalidate all sessions of the reset user', async () => {
    const admin = await createUser('admin')
    const client = await createUser('client')
    const adminToken = generateToken(admin.user)

    await request(app)
      .post(`/api/auth/admin/reset-password/${client.user.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ newPassword: 'NewPass!123' })

    const oldToken = generateToken(client.user)
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${oldToken}`)
    expect(res.status).toBe(401)
  })
})

describe('POST /api/auth/forgot-password + /reset-password', () => {
  it('should return success even for non-existent email (no user enumeration)', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'nonexistent@test.com' })
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  it('should return a reset token in debug mode for existing users', async () => {
    const { user } = await createUser('client')
    const res = await request(app).post('/api/auth/forgot-password').send({ email: user.email })
    expect(res.status).toBe(200)
    expect(res.body.debug?.resetToken).toBeDefined()
  })

  it('should allow password reset with valid token', async () => {
    const { user } = await createUser('client')
    const forgotRes = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: user.email })
    const resetToken = forgotRes.body.debug.resetToken

    const resetRes = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: resetToken, newPassword: 'ResetPass!123' })
    expect(resetRes.status).toBe(200)
    expect(resetRes.body.success).toBe(true)

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: 'ResetPass!123' })
    expect(loginRes.status).toBe(200)
    expect(loginRes.body.data.accessToken).toBeDefined()
  })

  it('should reject invalid reset tokens', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: 'invalid-token', newPassword: 'ResetPass!123' })
    expect(res.status).toBe(400)
  })

  it('should reject weak passwords on reset', async () => {
    const { user } = await createUser('client')
    const forgotRes = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: user.email })
    const resetToken = forgotRes.body.debug.resetToken

    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: resetToken, newPassword: 'weak' })
    expect(res.status).toBe(400)
  })

  it('should invalidate old sessions after reset', async () => {
    const { user } = await createUser('client')
    const oldToken = generateToken(user)

    const forgotRes = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: user.email })
    const resetToken = forgotRes.body.debug.resetToken

    await request(app)
      .post('/api/auth/reset-password')
      .send({ token: resetToken, newPassword: 'ResetPass!123' })

    const meRes = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${oldToken}`)
    expect(meRes.status).toBe(401)
  })
})
