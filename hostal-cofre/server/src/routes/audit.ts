import { Router, Response } from 'express'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js'
import prisma from '../db.js'

const router = Router()

router.get('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  const limit = Math.min(Math.max(parseInt(String(req.query.limit || '50'), 10) || 50, 1), 200)
  const resource = typeof req.query.resource === 'string' ? req.query.resource : undefined
  const action = typeof req.query.action === 'string' ? req.query.action : undefined

  const where: Record<string, string> = {}
  if (resource) where.resource = resource
  if (action) where.action = action

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  res.json({ success: true, data: logs })
})

export default router
