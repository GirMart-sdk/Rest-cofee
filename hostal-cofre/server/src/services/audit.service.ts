import { Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import prisma from '../db.js'
import { logger } from '../utils/logger.js'
import { AuthRequest } from '../middleware/auth.js'

export interface AuditContext {
  userId?: string
  userEmail?: string
  ip?: string
}

export async function writeAuditLog(
  ctx: AuditContext,
  action: string,
  resource: string,
  resourceId?: string,
  details?: Record<string, unknown>,
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: ctx.userId || 'system',
        userEmail: ctx.userEmail || 'system',
        action,
        resource,
        resourceId,
        details: (details ?? undefined) as Prisma.InputJsonValue | undefined,
        ip: ctx.ip,
      },
    })
  } catch (error) {
    logger.warn('audit log write failed', {
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

export function auditMiddleware(
  action: string,
  resource: string,
  options?: {
    getResourceId?: (req: AuthRequest) => string | undefined
    getDetails?: (req: AuthRequest) => Record<string, unknown> | undefined
  },
) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    res.on('finish', () => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        void writeAuditLog(
          { userId: req.user?.id, userEmail: req.user?.email, ip: req.ip },
          action,
          resource,
          options?.getResourceId?.(req),
          options?.getDetails?.(req),
        )
      }
    })
    next()
  }
}
