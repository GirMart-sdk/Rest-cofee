import { Request, Response, NextFunction } from 'express'
import prisma from '../db.js'
import { config } from '../config/index.js'
import { getClientIp } from '../utils/ip.js'

function countFailed(recent: Array<{ success: boolean }>): number {
  return recent.filter((a) => !a.success).length
}

export async function checkLockout(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body
  if (!email) return next()

  const windowStart = new Date(Date.now() - config.lockout.windowMs)

  const [emailAttempts, ipAttempts] = await Promise.all([
    prisma.loginAttempt.findMany({
      where: {
        email: email.toLowerCase(),
        createdAt: { gte: windowStart },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.loginAttempt.findMany({
      where: {
        ip: getClientIp(req),
        createdAt: { gte: windowStart },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const emailFailed = countFailed(emailAttempts)
  const ipFailed = countFailed(ipAttempts)

  if (emailFailed >= config.lockout.maxAttempts || ipFailed >= config.lockout.ipMaxAttempts) {
    const sources = [
      emailFailed >= config.lockout.maxAttempts ? emailAttempts : [],
      ipFailed >= config.lockout.ipMaxAttempts ? ipAttempts : [],
    ]
      .filter((list) => list.length > 0)
      .flat()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const lastFailed = sources[0]
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
