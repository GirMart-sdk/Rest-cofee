import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import rateLimit from 'express-rate-limit'
import { config } from '../config/index.js'
import { authenticate, AuthRequest } from '../middleware/auth.js'
import { checkLockout, recordLoginAttempt } from '../middleware/lockout.js'
import { revokeRefreshToken, revokeAllUserTokens, isRefreshTokenRevoked } from '../middleware/tokenBlacklist.js'
import prisma from '../db.js'
import { z } from 'zod'
import { validate } from '../middleware/validation.js'

const authLimiter = process.env.NODE_ENV === 'test'
  ? (req: Request, _res: Response, next: NextFunction) => next()
  : rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, error: 'Too many attempts, please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
  })

const router = Router()

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};:'"\\|,.<>/?]).{8,}$/

function generateAccessToken(user: { id: string; email: string; role: string }): string {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwtSecret, {
    algorithm: 'HS256',
    expiresIn: config.jwtExpiresIn,
  })
}

async function generateRefreshToken(userId: string): Promise<string> {
  const token = crypto.randomUUID()
  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })
  return token
}

function getClientIp(req: Request): string {
  return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown'
}

const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required').max(100),
    email: z.string().trim().email('Invalid email format').max(255),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100)
      .regex(PASSWORD_REGEX, 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character'),
  }),
})

router.post('/register', authLimiter, validate(registerSchema), async (req: Request, res: Response) => {
  const { name, email, password } = req.body

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return res.status(409).json({ success: false, error: 'Email already registered' })
  }

  const hashed = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({ data: { name, email, password: hashed } })

  const accessToken = generateAccessToken(user)
  const refreshToken = await generateRefreshToken(user.id)

  res.status(201).json({
    success: true,
    data: {
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    },
  })
})

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Invalid email format').max(255),
    password: z.string().min(1, 'Password is required').max(100),
  }),
})

router.post('/login', authLimiter, validate(loginSchema), checkLockout, async (req: Request, res: Response) => {
  const { email, password } = req.body
  const ip = getClientIp(req)

  const dummyHash = '$2a$10$invalidhashforhashingprevention'
  const user = await prisma.user.findUnique({ where: { email } })
  const passwordValid = user ? await bcrypt.compare(password, user.password) : await bcrypt.compare('x', dummyHash)

  await recordLoginAttempt(email, ip, !!user && passwordValid)

  if (!user || !passwordValid) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' })
  }

  const accessToken = generateAccessToken(user)
  const refreshToken = await generateRefreshToken(user.id)

  res.json({
    success: true,
    data: {
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    },
  })
})

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().uuid('Invalid refresh token format'),
  }),
})

router.post('/refresh', validate(refreshSchema), async (req: Request, res: Response) => {
  const { refreshToken } = req.body

  if (await isRefreshTokenRevoked(refreshToken)) {
    return res.status(401).json({ success: false, error: 'Refresh token has been revoked' })
  }

  const record = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  })

  if (!record || record.revoked) {
    return res.status(401).json({ success: false, error: 'Invalid refresh token' })
  }

  if (new Date() > record.expiresAt) {
    await revokeRefreshToken(refreshToken)
    return res.status(401).json({ success: false, error: 'Refresh token expired' })
  }

  await revokeRefreshToken(refreshToken)

  const newAccessToken = generateAccessToken(record.user)
  const newRefreshToken = await generateRefreshToken(record.user.id)

  res.json({
    success: true,
    data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
  })
})

const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string().uuid(),
  }),
})

router.post('/logout', validate(logoutSchema), async (req: Request, res: Response) => {
  await revokeRefreshToken(req.body.refreshToken)
  res.json({ success: true, message: 'Logged out successfully' })
})

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(8)
      .max(100)
      .regex(PASSWORD_REGEX, 'New password must contain uppercase, lowercase, number, and special character'),
  }),
})

router.post('/change-password', authenticate, validate(changePasswordSchema), async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body

  const user = await prisma.user.findUnique({ where: { id: req.user!.id } })
  if (!user) return res.status(404).json({ success: false, error: 'User not found' })

  const valid = await bcrypt.compare(currentPassword, user.password)
  if (!valid) {
    return res.status(401).json({ success: false, error: 'Current password is incorrect' })
  }

  const hashed = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } })

  await revokeAllUserTokens(user.id)

  res.json({ success: true, message: 'Password changed. All sessions invalidated.' })
})

router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, name: true, email: true, role: true },
  })
  if (!user) return res.status(404).json({ success: false, error: 'User not found' })
  res.json({ success: true, data: user })
})

export default router
