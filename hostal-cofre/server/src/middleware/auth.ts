import { Request, Response, NextFunction } from 'express'
import jwt, { Algorithm } from 'jsonwebtoken'
import { config } from '../config/index.js'
import prisma from '../db.js'

export interface AuthUser {
  id: string
  email: string
  role: string
}

export interface AuthRequest extends Request {
  user?: AuthUser
}

const ALLOWED_ALGORITHMS: Algorithm[] = ['HS256']

function decodeToken(token: string): { id: string; email: string; role: string; ver?: number } {
  return jwt.verify(token, config.jwtSecret, {
    algorithms: ALLOWED_ALGORITHMS,
  }) as unknown as { id: string; email: string; role: string; ver?: number }
}

async function resolveUser(payload: {
  id: string
  email: string
  role: string
  ver?: number
}): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, email: true, role: true, tokenVersion: true },
  })
  if (!user) return null
  if ((payload.ver ?? 0) !== user.tokenVersion) return null
  return { id: user.id, email: user.email, role: user.role }
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided' })
  }

  try {
    const token = header.split(' ')[1]
    const payload = decodeToken(token)
    const user = await resolveUser(payload)
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid token' })
    }
    req.user = user
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ success: false, error: 'Token expired' })
    }
    return res.status(401).json({ success: false, error: 'Invalid token' })
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required' })
  }
  next()
}

export async function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (header?.startsWith('Bearer ')) {
    try {
      const token = header.split(' ')[1]
      const payload = decodeToken(token)
      const user = await resolveUser(payload)
      if (user) {
        req.user = user
      }
    } catch {
      // Token inválido — continuar sin usuario autenticado
    }
  }
  next()
}
