import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger.js'
import { metrics } from '../utils/metrics.js'

function pathWithoutQuery(url: string): string {
  return url.split('?')[0]
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now()
  const path = pathWithoutQuery(req.originalUrl || req.url)
  metrics.trackRequest(req.method, path)

  res.on('finish', () => {
    const durationMs = Date.now() - start
    metrics.trackResponse(res.statusCode)
    logger.info('http request', {
      method: req.method,
      path,
      status: res.statusCode,
      durationMs,
      requestId: req.headers['x-request-id'],
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    })
  })

  next()
}
