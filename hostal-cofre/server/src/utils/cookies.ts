import { Request, Response } from 'express'
import { config } from '../config/index.js'

export const REFRESH_COOKIE_NAME = 'hostal_refresh'

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  sameSite: 'lax' as const,
  path: '/api/auth',
}

const REFRESH_COOKIE_SET_OPTIONS = {
  ...REFRESH_COOKIE_OPTIONS,
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

export function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE_NAME, token, REFRESH_COOKIE_SET_OPTIONS)
}

export function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTIONS)
}

export function getRefreshToken(req: Request): string | undefined {
  const header = req.headers.cookie
  if (!header) return undefined
  for (const part of header.split(';')) {
    const [name, ...rest] = part.trim().split('=')
    if (name === REFRESH_COOKIE_NAME) {
      return decodeURIComponent(rest.join('='))
    }
  }
  return undefined
}
