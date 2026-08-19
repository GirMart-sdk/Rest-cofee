import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import { logger } from '../utils/logger.js'
import { config } from '../config/index.js'

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    logger.warn('validation error', { errors: err.errors })
    return res.status(400).json({ success: false, errors: err.errors })
  }

  if (err.type === 'entity.too.large' || err.status === 413) {
    logger.warn('request body too large')
    return res.status(413).json({ success: false, error: 'Request body is too large.' })
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    logger.warn('database error', { code: err.code, message: err.message })
    if (err.code === 'P2002') {
      return res
        .status(409)
        .json({ success: false, error: 'A record with this value already exists.' })
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'The requested record was not found.' })
    }
    if (err.code === 'P2003') {
      return res.status(400).json({ success: false, error: 'Invalid reference: record not found.' })
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    logger.warn('database validation error', { message: err.message })
    return res.status(400).json({ success: false, error: 'Invalid data provided.' })
  }

  if (err.statusCode) {
    // Los detalles van solo al log del servidor, nunca al cliente.
    logger.warn('request error', {
      statusCode: err.statusCode,
      message: err.message,
      details: err.details,
    })
    // En producción, mensajes de 5xx nunca se exponen al cliente.
    const isServerError = err.statusCode >= 500
    const safeMessage =
      isServerError && config.nodeEnv === 'production'
        ? 'An unexpected error occurred on the server.'
        : err.message
    return res.status(err.statusCode).json({ success: false, error: safeMessage })
  }

  logger.error('unhandled error', {
    message: err?.message || String(err),
    stack: process.env.NODE_ENV === 'production' ? undefined : err?.stack,
  })
  res.status(500).json({ success: false, error: 'An unexpected error occurred on the server.' })
}
