import { Router, Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import { generateSecret, generateURI, verifySync } from 'otplib'
import { config } from '../config/index.js'
import { authenticate, AuthRequest } from '../middleware/auth.js'
import { checkLockout, recordLoginAttempt } from '../middleware/lockout.js'
import {
  revokeRefreshToken,
  revokeAllUserTokens,
  isRefreshTokenRevoked,
} from '../middleware/tokenBlacklist.js'
import { metrics } from '../utils/metrics.js'
import { hashToken, generateRefreshTokenValue } from '../utils/tokens.js'
import {
  REFRESH_COOKIE_NAME,
  setRefreshCookie,
  clearRefreshCookie,
  getRefreshToken,
} from '../utils/cookies.js'
import prisma from '../db.js'
import { z } from 'zod'
import { validate } from '../middleware/validation.js'

const authLimiter =
  process.env.NODE_ENV === 'test'
    ? (req: Request, _res: Response, next: NextFunction) => next()
    : rateLimit({
        windowMs: 15 * 60 * 1000,
        max: config.nodeEnv === 'production' ? 10 : 100,
        message: { success: false, error: 'Too many attempts, please try again after 15 minutes.' },
        standardHeaders: true,
        legacyHeaders: false,
      })

const twoFactorVerifyLimiter =
  process.env.NODE_ENV === 'test'
    ? (req: Request, _res: Response, next: NextFunction) => next()
    : rateLimit({
        windowMs: 15 * 60 * 1000,
        max: config.nodeEnv === 'production' ? 10 : 100,
        message: { success: false, error: 'Too many attempts, please try again after 15 minutes.' },
        standardHeaders: true,
        legacyHeaders: false,
      })

const router = Router()

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};:'"\\|,.<>/?]).{8,}$/

const TWO_FACTOR_ISSUER = 'Hostal Cofre'
const TWO_FACTOR_PENDING_EXPIRY = '5m'

function generateAccessToken(user: {
  id: string
  email: string
  role: string
  tokenVersion: number
}): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, ver: user.tokenVersion },
    config.jwtSecret,
    {
      algorithm: 'HS256',
      expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
    },
  )
}

async function generateRefreshToken(userId: string): Promise<string> {
  const token = generateRefreshTokenValue()
  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(token),
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })
  return token
}

function generatePendingTwoFactorToken(userId: string): string {
  return jwt.sign({ purpose: '2fa', id: userId }, config.jwtSecret, {
    algorithm: 'HS256',
    expiresIn: TWO_FACTOR_PENDING_EXPIRY,
  })
}

function verifyPendingTwoFactorToken(token: string): string {
  const payload = jwt.verify(token, config.jwtSecret, {
    algorithms: ['HS256'],
  }) as { purpose?: string; id?: string }
  if (payload.purpose !== '2fa' || !payload.id) {
    throw new Error('Invalid pending token')
  }
  return payload.id
}

function verifyTotpCode(secret: string, code: string): boolean {
  const digits = code.replace(/\s+/g, '')
  if (!/^\d{6}$/.test(digits)) return false
  const result = verifySync({ secret, token: digits, epochTolerance: 30 })
  return result.valid
}

function getClientIp(req: Request): string {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    'unknown'
  )
}

function publicUser(user: { id: string; name: string; email: string; role: string }) {
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required').max(100),
    email: z.string().trim().email('Invalid email format').max(255),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100)
      .regex(
        PASSWORD_REGEX,
        'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character',
      ),
  }),
})

router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ success: false, error: 'Email already registered' })
    }

    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({ data: { name, email, password: hashed } })

    const accessToken = generateAccessToken(user)
    const refreshToken = await generateRefreshToken(user.id)
    setRefreshCookie(res, refreshToken)

    res.status(201).json({
      success: true,
      data: {
        accessToken,
        user: publicUser(user),
      },
    })
  },
)

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Invalid email format').max(255),
    password: z.string().min(1, 'Password is required').max(100),
  }),
})

router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  checkLockout,
  async (req: Request, res: Response) => {
    const { email, password } = req.body
    const ip = getClientIp(req)

    const dummyHash = '$2a$10$invalidhashforhashingprevention'
    const user = await prisma.user.findUnique({ where: { email } })
    const passwordValid = user
      ? await bcrypt.compare(password, user.password)
      : await bcrypt.compare('x', dummyHash)

    await recordLoginAttempt(email, ip, !!user && passwordValid)

    if (!user || !passwordValid) {
      metrics.inc('authFailedLogins')
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }

    metrics.inc('authLogins')

    if (user.twoFactorEnabled) {
      const pendingToken = generatePendingTwoFactorToken(user.id)
      return res.json({
        success: true,
        requiresTwoFactor: true,
        data: { pendingToken },
      })
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = await generateRefreshToken(user.id)
    setRefreshCookie(res, refreshToken)

    res.json({
      success: true,
      data: {
        accessToken,
        user: publicUser(user),
      },
    })
  },
)

const twoFactorVerifySchema = z.object({
  body: z.object({
    pendingToken: z.string().min(1, 'Pending token is required'),
    code: z.string().min(1, 'Code is required').max(8),
  }),
})

router.post(
  '/2fa/verify',
  twoFactorVerifyLimiter,
  validate(twoFactorVerifySchema),
  async (req: Request, res: Response) => {
    const { pendingToken, code } = req.body

    let userId: string
    try {
      userId = verifyPendingTwoFactorToken(pendingToken)
    } catch {
      return res.status(401).json({ success: false, error: 'Invalid or expired pending token' })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return res
        .status(401)
        .json({ success: false, error: 'Two-factor authentication is not enabled' })
    }

    if (!verifyTotpCode(user.twoFactorSecret, code)) {
      return res.status(401).json({ success: false, error: 'Invalid authentication code' })
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = await generateRefreshToken(user.id)
    setRefreshCookie(res, refreshToken)

    res.json({
      success: true,
      data: {
        accessToken,
        user: publicUser(user),
      },
    })
  },
)

router.get('/2fa/status', authenticate, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { twoFactorEnabled: true },
  })
  if (!user) return res.status(404).json({ success: false, error: 'User not found' })
  res.json({ success: true, data: { enabled: user.twoFactorEnabled } })
})

router.get('/2fa/setup', authenticate, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } })
  if (!user) return res.status(404).json({ success: false, error: 'User not found' })
  if (user.twoFactorEnabled) {
    return res
      .status(400)
      .json({ success: false, error: 'Two-factor authentication is already enabled' })
  }

  const secret = generateSecret()
  const otpauthUrl = generateURI({
    issuer: TWO_FACTOR_ISSUER,
    label: user.email,
    secret,
  })

  await prisma.user.update({ where: { id: user.id }, data: { twoFactorSecret: secret } })

  res.json({ success: true, data: { secret, otpauthUrl } })
})

const twoFactorEnableSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Code is required').max(8),
  }),
})

router.post(
  '/2fa/enable',
  authenticate,
  validate(twoFactorEnableSchema),
  async (req: AuthRequest, res: Response) => {
    const { code } = req.body

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } })
    if (!user) return res.status(404).json({ success: false, error: 'User not found' })
    if (user.twoFactorEnabled) {
      return res
        .status(400)
        .json({ success: false, error: 'Two-factor authentication is already enabled' })
    }
    if (!user.twoFactorSecret) {
      return res
        .status(400)
        .json({ success: false, error: 'Run the setup step before enabling 2FA' })
    }
    if (!verifyTotpCode(user.twoFactorSecret, code)) {
      return res.status(401).json({ success: false, error: 'Invalid authentication code' })
    }

    await prisma.user.update({ where: { id: user.id }, data: { twoFactorEnabled: true } })
    res.json({ success: true, message: 'Two-factor authentication enabled' })
  },
)

const twoFactorDisableSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Code is required').max(8),
    password: z.string().min(1, 'Password is required').max(100),
  }),
})

router.post(
  '/2fa/disable',
  authenticate,
  validate(twoFactorDisableSchema),
  async (req: AuthRequest, res: Response) => {
    const { code, password } = req.body

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } })
    if (!user) return res.status(404).json({ success: false, error: 'User not found' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' })
    }
    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      return res
        .status(400)
        .json({ success: false, error: 'Two-factor authentication is not enabled' })
    }
    if (!verifyTotpCode(user.twoFactorSecret, code)) {
      return res.status(401).json({ success: false, error: 'Invalid authentication code' })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: false, twoFactorSecret: null },
    })
    res.json({ success: true, message: 'Two-factor authentication disabled' })
  },
)

router.post('/refresh', async (req: Request, res: Response) => {
  const refreshToken = getRefreshToken(req)
  if (!refreshToken) {
    return res.status(401).json({ success: false, error: 'No refresh token provided' })
  }

  const tokenHash = hashToken(refreshToken)

  if (await isRefreshTokenRevoked(refreshToken)) {
    return res.status(401).json({ success: false, error: 'Refresh token has been revoked' })
  }

  const record = await prisma.refreshToken.findUnique({
    where: { tokenHash },
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
  setRefreshCookie(res, newRefreshToken)

  res.json({
    success: true,
    data: { accessToken: newAccessToken },
  })
})

router.post('/logout', async (req: Request, res: Response) => {
  const refreshToken = getRefreshToken(req)
  if (refreshToken) {
    await revokeRefreshToken(refreshToken)
  }
  clearRefreshCookie(res)
  res.json({ success: true, message: 'Logged out successfully' })
})

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(8)
      .max(100)
      .regex(
        PASSWORD_REGEX,
        'New password must contain uppercase, lowercase, number, and special character',
      ),
  }),
})

router.post(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } })
    if (!user) return res.status(404).json({ success: false, error: 'User not found' })

    const valid = await bcrypt.compare(currentPassword, user.password)
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' })
    }

    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, tokenVersion: { increment: 1 } },
    })

    await revokeAllUserTokens(user.id)
    clearRefreshCookie(res)

    res.json({ success: true, message: 'Password changed. All sessions invalidated.' })
  },
)

router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      twoFactorEnabled: true,
    },
  })
  if (!user) return res.status(404).json({ success: false, error: 'User not found' })
  res.json({ success: true, data: user })
})

export { router as default, REFRESH_COOKIE_NAME }
