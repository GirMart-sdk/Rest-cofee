import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string }
}

const ALLOWED_ALGORITHMS = ['HS256'] as const

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided' })
  }

  try {
    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, config.jwtSecret, {
      algorithms: ALLOWED_ALGORITHMS as unknown as string[],
    }) as { id: string; email: string; role: string }
    req.user = decoded
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

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (header?.startsWith('Bearer ')) {
    try {
      const token = header.split(' ')[1]
      const decoded = jwt.verify(token, config.jwtSecret, {
        algorithms: ALLOWED_ALGORITHMS as unknown as string[],
      }) as { id: string; email: string; role: string }
      req.user = decoded
    } catch {
      // Token inválido — continuar sin usuario autenticado
    }
  }
  next()
}
