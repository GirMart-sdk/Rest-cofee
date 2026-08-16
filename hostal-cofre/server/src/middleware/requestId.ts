import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'

export function requestId(req: Request, res: Response, next: NextFunction) {
  // Siempre generamos un nuevo ID: ignoramos el proporcionado por el cliente
  // para evitar reflejos/spoofing y garantizar unicidad.
  const id = crypto.randomUUID()
  req.headers['x-request-id'] = id
  res.setHeader('X-Request-Id', id)
  next()
}
