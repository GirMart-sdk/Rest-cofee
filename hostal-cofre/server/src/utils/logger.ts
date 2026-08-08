type Level = 'debug' | 'info' | 'warn' | 'error'

const LEVELS: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 }

function levelEnabled(level: Level): boolean {
  if (process.env.NODE_ENV === 'test' && level !== 'error') return false
  const configured = process.env.LOG_LEVEL as Level
  const threshold =
    LEVELS[configured] ?? (process.env.NODE_ENV === 'production' ? LEVELS.info : LEVELS.debug)
  return LEVELS[level] >= threshold
}

function write(level: Level, message: string, meta?: Record<string, unknown>) {
  if (!levelEnabled(level)) return
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    service: 'hostal-cofee-api',
    ...(meta && Object.keys(meta).length > 0 ? meta : {}),
  }
  const line = JSON.stringify(entry)
  if (level === 'error' || level === 'warn') {
    console.error(line)
  } else {
    console.log(line)
  }
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => write('debug', message, meta),
  info: (message: string, meta?: Record<string, unknown>) => write('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => write('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => write('error', message, meta),
}
