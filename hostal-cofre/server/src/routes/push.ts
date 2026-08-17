import { Router, Response } from 'express'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js'
import { config } from '../config/index.js'
import { logger } from '../utils/logger.js'
import { z } from 'zod'
import { validate } from '../middleware/validation.js'
import webpush from 'web-push'

const router = Router()

// In-memory subscription store (persist in DB for production multi-instance)
const subscriptions = new Map<string, webpush.PushSubscription>()

if (config.vapidPublicKey && config.vapidPrivateKey) {
  try {
    webpush.setVapidDetails(
      `mailto:${config.adminEmail || 'admin@hostalcofee.com'}`,
      config.vapidPublicKey,
      config.vapidPrivateKey,
    )
  } catch {
    logger.warn('VAPID keys invalid; push notifications disabled')
  }
}

const subscribeSchema = z.object({
  body: z.object({
    endpoint: z.string().url(),
    keys: z.object({
      p256dh: z.string().min(1),
      auth: z.string().min(1),
    }),
  }),
})

router.post('/subscribe', validate(subscribeSchema), async (req: AuthRequest, res: Response) => {
  const { endpoint, keys } = req.body
  const userId = req.user?.id || 'anonymous'
  subscriptions.set(`${userId}:${endpoint}`, { endpoint, keys })
  res.json({ success: true, message: 'Push subscription registered' })
})

router.post('/unsubscribe', async (req: AuthRequest, res: Response) => {
  const { endpoint } = req.body
  const userId = req.user?.id || 'anonymous'
  subscriptions.delete(`${userId}:${endpoint}`)
  res.json({ success: true, message: 'Push subscription removed' })
})

router.post('/test', authenticate, requireAdmin, async (_req: AuthRequest, res: Response) => {
  const subs = Array.from(subscriptions.values())
  if (subs.length === 0) {
    return res.json({ success: true, message: 'No push subscriptions registered', sent: 0 })
  }

  const payload = JSON.stringify({
    title: 'Hostal Cofee',
    body: 'Notificaciones push configuradas correctamente',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
  })

  let sent = 0
  for (const sub of subs) {
    try {
      await webpush.sendNotification(sub, payload)
      sent++
    } catch (err) {
      if ((err as { statusCode?: number }).statusCode === 410) {
        // Subscription expired, remove it
        subscriptions.delete(sub.endpoint)
      }
      logger.warn('push notification failed', { error: (err as Error).message })
    }
  }

  res.json({ success: true, sent, total: subs.length })
})

export function broadcastPush(title: string, body: string, url?: string) {
  if (subscriptions.size === 0) return

  const payload = JSON.stringify({
    title,
    body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    url: url || '/',
  })

  for (const [key, sub] of subscriptions) {
    void webpush.sendNotification(sub, payload).catch((err) => {
      if ((err as { statusCode?: number }).statusCode === 410) {
        subscriptions.delete(key)
      }
    })
  }
}

export default router
