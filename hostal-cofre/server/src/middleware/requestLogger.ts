import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger.js'
import { metrics } from '../utils/metrics.js'

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now()
  metrics.trackRequest(req.method, req.originalUrl || req.url)

  res.on('finish', () => {
    const durationMs = Date.now() - start
    metrics.trackResponse(res.statusCode)
    logger.info('http request', {
      method: req.method,
      path: req.originalUrl || req.url,
      status: res.statusCode,
      durationMs,
      requestId: req.headers['x-request-id'],
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    })
  })

  next()
}
