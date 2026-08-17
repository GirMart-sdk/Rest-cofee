import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import { generateSecret, generateURI, verifySync } from 'otplib'
import { config } from '../config/index.js'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js'
import { checkLockout, recordLoginAttempt } from '../middleware/lockout.js'
import { revokeRefreshToken, revokeAllUserTokens } from '../middleware/tokenBlacklist.js'
import { metrics } from '../utils/metrics.js'
import { logger } from '../utils/logger.js'
import { hashToken, generateRefreshTokenValue } from '../utils/tokens.js'
import { makeLimiter } from '../utils/rateLimit.js'
import { getClientIp } from '../utils/ip.js'
import { parseDurationToMs } from '../utils/duration.js'
import {
  REFRESH_COOKIE_NAME,
  setRefreshCookie,
  clearRefreshCookie,
  getRefreshToken,
} from '../utils/cookies.js'
import prisma from '../db.js'
import { z } from 'zod'
import { validate } from '../middleware/validation.js'

const REFRESH_TOKEN_MS = parseDurationToMs(config.jwtRefreshExpiresIn)

const authLimiter = makeLimiter(10)
const twoFactorVerifyLimiter = makeLimiter(5)
const refreshLimiter = makeLimiter(60)
const logoutLimiter = makeLimiter(60)
const changePasswordLimiter = makeLimiter(20)

const router = Router()

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};:'"\\|,.<>/?]).{8,}$/

const TWO_FACTOR_ISSUER = 'Hostal Cofre'
const TWO_FACTOR_PENDING_EXPIRY = '5m'

// Hash real generado una sola vez: evita la diferencia de tiempo de respuesta
// entre "usuario no existe" y "contraseña incorrecta" (timing attack).
const DUMMY_PASSWORD_HASH = bcrypt.hashSync(crypto.randomUUID(), 12)

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
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_MS),
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

    const user = await prisma.user.findUnique({ where: { email } })
    // Comparación con hash real incluso si el usuario no existe: timing constante.
    const passwordValid = user
      ? await bcrypt.compare(password, user.password)
      : await bcrypt.compare(password, DUMMY_PASSWORD_HASH)

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
    password: z.string().min(1, 'Password is required').max(100),
  }),
})

router.post(
  '/2fa/enable',
  authenticate,
  validate(twoFactorEnableSchema),
  async (req: AuthRequest, res: Response) => {
    const { code, password } = req.body

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
    // Re-autenticación: se exige la contraseña actual antes de activar 2FA.
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' })
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

router.post('/refresh', refreshLimiter, async (req: Request, res: Response) => {
  const refreshToken = getRefreshToken(req)
  if (!refreshToken) {
    return res.status(401).json({ success: false, error: 'No refresh token provided' })
  }

  const tokenHash = hashToken(refreshToken)

  try {
    // Rotación atómica: validar, revocar el actual y emitir el nuevo en una sola transacción.
    const result = await prisma.$transaction(async (tx) => {
      const record = await tx.refreshToken.findUnique({
        where: { tokenHash },
        include: { user: true },
      })

      if (!record || record.revoked) {
        throw Object.assign(new Error('Invalid refresh token'), { statusCode: 401 })
      }
      if (new Date() > record.expiresAt) {
        await tx.refreshToken.update({ where: { id: record.id }, data: { revoked: true } })
        throw Object.assign(new Error('Refresh token expired'), { statusCode: 401 })
      }

      await tx.refreshToken.update({ where: { id: record.id }, data: { revoked: true } })

      const newRefreshToken = generateRefreshTokenValue()
      await tx.refreshToken.create({
        data: {
          tokenHash: hashToken(newRefreshToken),
          userId: record.user.id,
          expiresAt: new Date(Date.now() + REFRESH_TOKEN_MS),
        },
      })

      return { user: record.user, newRefreshToken }
    })

    const newAccessToken = generateAccessToken(result.user)
    setRefreshCookie(res, result.newRefreshToken)

    res.json({
      success: true,
      data: { accessToken: newAccessToken },
    })
  } catch (error: any) {
    if (error?.statusCode) {
      return res.status(error.statusCode).json({ success: false, error: error.message })
    }
    throw error
  }
})

router.post('/logout', logoutLimiter, async (req: Request, res: Response) => {
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
  changePasswordLimiter,
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

const adminResetPasswordSchema = z.object({
  params: z.object({ userId: z.string().cuid('Invalid user ID') }),
  body: z.object({
    newPassword: z
      .string()
      .min(8)
      .max(100)
      .regex(
        PASSWORD_REGEX,
        'Password must contain uppercase, lowercase, number, and special character',
      ),
  }),
})

router.post(
  '/admin/reset-password/:userId',
  authenticate,
  requireAdmin,
  changePasswordLimiter,
  validate(adminResetPasswordSchema),
  async (req: AuthRequest, res: Response) => {
    const { userId } = req.params
    const { newPassword } = req.body

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return res.status(404).json({ success: false, error: 'User not found' })

    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, tokenVersion: { increment: 1 } },
    })

    await revokeAllUserTokens(user.id)
    res.json({
      success: true,
      message: `Password reset for ${user.email}. All sessions invalidated.`,
    })
  },
)

const forgotPasswordLimiter = makeLimiter(5)

const forgotPasswordSchema = z.object({
  body: z.object({ email: z.string().trim().email().max(255) }),
})

router.post(
  '/forgot-password',
  forgotPasswordLimiter,
  validate(forgotPasswordSchema),
  async (req: Request, res: Response) => {
    const { email } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.json({
        success: true,
        message: 'If the email exists, a reset link has been sent.',
      })
    }

    const resetToken = jwt.sign({ purpose: 'password-reset', id: user.id }, config.jwtSecret, {
      algorithm: 'HS256',
      expiresIn: '1h',
    })

    const resetUrl = `${config.corsOrigin}/reset-password?token=${resetToken}`

    logger.info('password reset requested', { email: user.email, resetUrl })

    res.json({
      success: true,
      message: 'If the email exists, a reset link has been sent.',
      ...(process.env.NODE_ENV !== 'production' ? { debug: { resetToken, resetUrl } } : {}),
    })
  },
)

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z
      .string()
      .min(8)
      .max(100)
      .regex(
        PASSWORD_REGEX,
        'Password must contain uppercase, lowercase, number, and special character',
      ),
  }),
})

router.post(
  '/reset-password',
  forgotPasswordLimiter,
  validate(resetPasswordSchema),
  async (req: Request, res: Response) => {
    const { token, newPassword } = req.body

    let payload: { purpose?: string; id?: string }
    try {
      payload = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] }) as typeof payload
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid or expired reset token' })
    }

    if (payload.purpose !== 'password-reset' || !payload.id) {
      return res.status(400).json({ success: false, error: 'Invalid reset token' })
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } })
    if (!user) return res.status(404).json({ success: false, error: 'User not found' })

    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, tokenVersion: { increment: 1 } },
    })

    await revokeAllUserTokens(user.id)
    res.json({
      success: true,
      message: 'Password reset successfully. Please login with your new password.',
    })
  },
)

const setupSecurityQuestionSchema = z.object({
  body: z.object({
    question: z.string().trim().min(10, 'Question must be at least 10 characters').max(200),
    answer: z.string().trim().min(3, 'Answer must be at least 3 characters').max(100),
  }),
})

router.post(
  '/setup-security-question',
  authenticate,
  validate(setupSecurityQuestionSchema),
  async (req: AuthRequest, res: Response) => {
    const { question, answer } = req.body
    const hashedAnswer = await bcrypt.hash(answer.toLowerCase().trim(), 12)
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { securityQuestion: question, securityAnswer: hashedAnswer },
    })
    res.json({ success: true, message: 'Security question set successfully' })
  },
)

const getSecurityQuestionSchema = z.object({
  body: z.object({ email: z.string().trim().email().max(255) }),
})

router.post(
  '/security-question',
  forgotPasswordLimiter,
  validate(getSecurityQuestionSchema),
  async (req: Request, res: Response) => {
    const { email } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.securityQuestion) {
      return res.json({
        success: true,
        data: { hasQuestion: false },
        message: 'If the email exists and has a security question, it will be returned.',
      })
    }
    res.json({
      success: true,
      data: { hasQuestion: true, question: user.securityQuestion },
    })
  },
)

const verifySecurityAnswerSchema = z.object({
  body: z.object({
    email: z.string().trim().email().max(255),
    answer: z.string().trim().min(1, 'Answer is required').max(100),
  }),
})

router.post(
  '/verify-security-answer',
  forgotPasswordLimiter,
  validate(verifySecurityAnswerSchema),
  async (req: Request, res: Response) => {
    const { email, answer } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.securityAnswer) {
      return res.status(401).json({ success: false, error: 'Invalid email or security answer' })
    }

    const valid = await bcrypt.compare(answer.toLowerCase().trim(), user.securityAnswer)
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid email or security answer' })
    }

    const resetToken = jwt.sign({ purpose: 'password-reset', id: user.id }, config.jwtSecret, {
      algorithm: 'HS256',
      expiresIn: '15m',
    })

    res.json({ success: true, data: { resetToken } })
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
