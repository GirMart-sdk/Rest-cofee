import 'dotenv/config'

const JWT_MIN_LENGTH = 32
const JWT_PLACEHOLDER_PATTERN =
  /change[-_\s]?me|your[-_\s]?(secret|password|key)|reemplaza|cambia[-_\s]?esta|placeholder|example[-_\s]?(secret|key)|tu[-_\s]?clave|test[-_\s]?secret/i

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET || ''

  if (!secret || secret === 'fallback-secret') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        "[FATAL] JWT_SECRET must be set in production. Generate one with: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\"",
      )
    }
    console.warn('[SECURITY] Using default JWT_SECRET — NOT secure for production!')
  }

  if (JWT_PLACEHOLDER_PATTERN.test(secret)) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        "[FATAL] JWT_SECRET looks like a template/placeholder value. Generate a real one with: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\"",
      )
    }
    console.warn('[SECURITY] JWT_SECRET looks like a placeholder — NOT secure for production!')
  }

  if (secret.length < JWT_MIN_LENGTH) {
    throw new Error(
      `[FATAL] JWT_SECRET must be at least ${JWT_MIN_LENGTH} characters. Current length: ${secret.length}`,
    )
  }

  return secret
}

export const config = {
  port: parseInt(process.env.PORT || '3001'),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: getJwtSecret(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  wompi: {
    mode: (process.env.WOMPI_MODE === 'production' ? 'production' : 'sandbox') as
      'production' | 'sandbox',
    publicKey: process.env.WOMPI_PUBLIC_KEY || '',
    privateKey: process.env.WOMPI_PRIVATE_KEY || '',
    eventsSecret: process.env.WOMPI_EVENTS_SECRET || '',
    baseUrl:
      process.env.WOMPI_BASE_URL ||
      (process.env.WOMPI_MODE === 'production'
        ? 'https://production.wompi.co/v1'
        : 'https://sandbox.wompi.co/v1'),
  },
  whatsapp: {
    phone: process.env.WHATSAPP_PHONE || '',
    apiToken: process.env.WHATSAPP_API_TOKEN || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  },
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  clientEmail: process.env.CLIENT_EMAIL || '',
  clientPassword: process.env.CLIENT_PASSWORD || '',
  restaurant: {
    name: process.env.RESTAURANT_NAME || 'Hostal Cofre',
    nit: process.env.RESTAURANT_NIT || '',
  },
  lockout: {
    maxAttempts: parseInt(process.env.LOCKOUT_MAX_ATTEMPTS || '5'),
    windowMs: parseInt(process.env.LOCKOUT_WINDOW_MS || '900000'), // 15 min
    lockoutMs: parseInt(process.env.LOCKOUT_DURATION_MS || '900000'), // 15 min
    ipMaxAttempts: parseInt(process.env.LOCKOUT_IP_MAX_ATTEMPTS || '10'),
  },
}
