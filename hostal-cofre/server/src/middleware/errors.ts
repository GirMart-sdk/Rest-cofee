import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${err.message}`)
  }

  if (err instanceof ZodError) {
    return res.status(400).json({ success: false, errors: err.errors })
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ success: false, error: 'A record with this value already exists.' })
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'The requested record was not found.' })
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({ success: false, error: 'Invalid data provided.' })
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({ success: false, error: err.message })
  }

  res.status(500).json({ success: false, error: 'An unexpected error occurred on the server.' })
}
