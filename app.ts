import 'express-async-errors' // Must be the first import
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { config } from './config/index.js'
import authRoutes from './routes/auth.js'
import menuRoutes from './routes/menu.js'
import orderRoutes from './routes/orders.js'
import reservationRoutes from './routes/reservations.js'
import paymentRoutes from './routes/payments.js'
import { errorHandler } from './middleware/errors.js'

const app = express()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita cada IP a 100 peticiones por ventana
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(cors({ origin: config.corsOrigin, credentials: true }))
app.use(express.json({ limit: '10kb' }))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use(helmet())
app.use(limiter)

app.use('/api/auth', authRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/reservations', reservationRoutes)
app.use('/api/payments', paymentRoutes)

app.use(errorHandler)

export default app