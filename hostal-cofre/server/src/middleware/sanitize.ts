import { Request, Response, NextFunction } from 'express'

const HTML_TAG_REGEX = /<[^>]*>/g
const EVENT_HANDLER_REGEX = /\bon\w+\s*=/gi
const JAVASCRIPT_URI_REGEX = /javascript\s*:/gi
const DANGEROUS_ATTRS = /style\s*=\s*["'][^"']*expression\s*\(/gi

function sanitizeString(value: string): string {
  let clean = value.replace(HTML_TAG_REGEX, '')
  clean = clean.replace(EVENT_HANDLER_REGEX, '')
  clean = clean.replace(JAVASCRIPT_URI_REGEX, '')
  clean = clean.replace(DANGEROUS_ATTRS, '')
  return clean
}

function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value)
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>)
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) => {
        if (typeof item === 'string') return sanitizeString(item)
        if (typeof item === 'object' && item !== null)
          return sanitizeObject(item as Record<string, unknown>)
        return item
      })
    } else {
      sanitized[key] = value
    }
  }
  return sanitized
}

export function sanitize(req: Request, _res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body)
  }
  if (req.query && typeof req.query === 'object') {
    const sanitized = sanitizeObject(req.query as Record<string, unknown>)
    req.query = Object.fromEntries(Object.entries(sanitized)) as Request['query']
  }
  next()
}
