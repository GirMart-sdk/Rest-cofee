import 'express-async-errors'
import express from 'express'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { config } from './config/index.js'
import authRoutes from './routes/auth.js'
import menuRoutes from './routes/menu.js'
import orderRoutes from './routes/orders.js'
import reservationRoutes from './routes/reservations.js'
import paymentRoutes from './routes/payments.js'
import shiftRoutes from './routes/shifts.js'
import tableRoutes from './routes/tables.js'
import reportRoutes from './routes/reports.js'
import auditRoutes from './routes/audit.js'
import { errorHandler } from './middleware/errors.js'
import { sanitize } from './middleware/sanitize.js'
import { requestId } from './middleware/requestId.js'
import { requestLogger } from './middleware/requestLogger.js'
import { authenticate, requireAdmin, AuthRequest } from './middleware/auth.js'
import { metrics } from './utils/metrics.js'
import { logger } from './utils/logger.js'
import { cleanupExpiredTokens } from './middleware/tokenBlacklist.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
  const app = express()

  // Solo confiamos en proxies (p.ej. Caddy) en producción; en dev X-Forwarded-For no altera req.ip.
  app.set('trust proxy', config.nodeEnv === 'production' ? 1 : false)

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: config.nodeEnv === 'production' ? 300 : 2000,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      if (!req.path.startsWith('/api/')) return true
      if (req.path.startsWith('/api/payments/webhook')) return true
      return false
    },
  })

  if (config.nodeEnv === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')))
  } else {
    app.use(cors({ origin: config.corsOrigin, credentials: true }))
  }

  app.use(express.json({ limit: '32kb' }))
  app.use(requestId)
  app.use(requestLogger)
  app.use(sanitize)

  const isDev = config.nodeEnv !== 'production'
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: isDev ? ["'self'", "'unsafe-inline'", "'unsafe-eval'"] : ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          imgSrc: ["'self'", 'data:', 'https:'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          connectSrc: isDev ? ["'self'", 'ws://localhost:3001'] : ["'self'"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          ...(isDev ? {} : { upgradeInsecureRequests: [] }),
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'same-site' },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      hsts: { maxAge: 31536000, includeSubDomains: true },
      noSniff: true,
      xssFilter: true,
      frameguard: { action: 'deny' },
    }),
  )

  app.use(limiter)

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  app.get('/api/metrics', authenticate, requireAdmin, (req: AuthRequest, res) => {
    res.json({ success: true, data: metrics.snapshot() })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/menu', menuRoutes)
  app.use('/api/orders', orderRoutes)
  app.use('/api/reservations', reservationRoutes)
  app.use('/api/payments', paymentRoutes)
  app.use('/api/shifts', shiftRoutes)
  app.use('/api/tables', tableRoutes)
  app.use('/api/reports', reportRoutes)
  app.use('/api/audit', auditRoutes)

  // Rutas /api no encontradas devuelven JSON (antes del fallback SPA)
  app.use('/api', (_req, res) => {
    res.status(404).json({ success: false, error: 'API route not found' })
  })

  const httpServer = http.createServer(app)

  // Dev: Vite middleware (HMR + SPA routing + static)
  if (config.nodeEnv !== 'production') {
    const { createServer: createViteServer } = await import('vite')
    const react = (await import('@vitejs/plugin-react')).default
    const vite = await createViteServer({
      root: path.resolve(__dirname, '../../client'),
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../../client/src'),
        },
      },
      server: {
        middlewareMode: true,
        hmr: { server: httpServer },
      },
      appType: 'spa',
      configFile: false,
    })
    app.use(vite.middlewares)
  }

  app.use(errorHandler)

  if (config.nodeEnv === 'production') {
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
    })
  }

  let cleanupRunning = false
  const TOKEN_CLEANUP_INTERVAL_MS = 6 * 60 * 60 * 1000

  async function runTokenCleanup() {
    if (cleanupRunning) return
    cleanupRunning = true
    try {
      await cleanupExpiredTokens()
      logger.info('expired refresh tokens cleaned')
    } catch (err) {
      logger.error('token cleanup failed', err as Record<string, unknown>)
    } finally {
      cleanupRunning = false
    }
  }

  void runTokenCleanup()
  setInterval(() => void runTokenCleanup(), TOKEN_CLEANUP_INTERVAL_MS)

  httpServer.listen(config.port, () => {
    logger.info('server started', {
      port: config.port,
      nodeEnv: config.nodeEnv,
      wompiMode: config.wompi.mode,
      whatsappApiEnabled: config.whatsapp.apiToken && config.whatsapp.phoneNumberId ? true : false,
    })
  })
}

main().catch(console.error)
