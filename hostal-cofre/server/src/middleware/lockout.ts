import { Request, Response, NextFunction } from 'express'
import prisma from '../db.js'
import { config } from '../config/index.js'

export async function checkLockout(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body
  if (!email) return next()

  const windowStart = new Date(Date.now() - config.lockout.windowMs)

  const recentAttempts = await prisma.loginAttempt.findMany({
    where: {
      email: email.toLowerCase(),
      createdAt: { gte: windowStart },
    },
    orderBy: { createdAt: 'desc' },
  })

  const failedAttempts = recentAttempts.filter((a) => !a.success)

  if (failedAttempts.length >= config.lockout.maxAttempts) {
    const lastFailed = failedAttempts[0]
    const lockoutEnd = new Date(lastFailed.createdAt.getTime() + config.lockout.lockoutMs)

    if (new Date() < lockoutEnd) {
      const remainingSec = Math.ceil((lockoutEnd.getTime() - Date.now()) / 1000)
      return res.status(429).json({
        success: false,
        error: `Account temporarily locked. Try again in ${remainingSec} seconds.`,
      })
    }
  }

  next()
}

export async function recordLoginAttempt(email: string, ip: string, success: boolean) {
  await prisma.loginAttempt.create({
    data: { email: email.toLowerCase(), ip, success },
  })

  const windowStart = new Date(Date.now() - config.lockout.windowMs)
  await prisma.loginAttempt.deleteMany({
    where: {
      createdAt: { lt: windowStart },
    },
  })
}
