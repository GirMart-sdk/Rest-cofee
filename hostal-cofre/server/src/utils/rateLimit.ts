import { Request, Response, NextFunction } from 'express'
import rateLimit from 'express-rate-limit'
import { config } from '../config/index.js'

export function makeLimiter(max: number) {
  if (process.env.NODE_ENV === 'test') {
    return (_req: Request, _res: Response, next: NextFunction) => next()
  }
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: config.nodeEnv === 'production' ? max : Math.max(max * 10, 100),
    message: { success: false, error: 'Too many attempts, please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
  })
}
