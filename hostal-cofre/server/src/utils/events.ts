import { Response } from 'express'
import { logger } from './logger.js'

const MAX_CLIENTS = 20

class EventBus {
  private clients = new Set<Response>()

  addClient(res: Response): boolean {
    if (this.clients.size >= MAX_CLIENTS) {
      logger.warn('SSE client rejected: max connections reached', {
        current: this.clients.size,
        max: MAX_CLIENTS,
      })
      return false
    }
    this.clients.add(res)
    return true
  }

  removeClient(res: Response): void {
    this.clients.delete(res)
  }

  clientCount(): number {
    return this.clients.size
  }

  broadcast(action: string, data: unknown): void {
    if (this.clients.size === 0) return
    const payload = `event: ${action}\ndata: ${JSON.stringify(data)}\n\n`
    for (const client of this.clients) {
      try {
        client.write(payload)
      } catch (error) {
        logger.warn('failed to write to SSE client', {
          error: error instanceof Error ? error.message : String(error),
        })
        this.clients.delete(client)
      }
    }
  }
}

export const eventBus = new EventBus()
