import { Router, Response } from 'express'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js'
import { ReportService } from '../services/report.service.js'

const router = Router()

router.get('/daily', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { date } = req.query
  const report = await ReportService.getDailyReport(date as string)
  res.json({ success: true, data: report })
})

router.get('/weekly', authenticate, requireAdmin, async (_req: AuthRequest, res: Response) => {
  const summary = await ReportService.getWeeklySummary()
  res.json({ success: true, data: summary })
})

export default router
