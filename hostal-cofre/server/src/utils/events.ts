import { Response } from 'express'
import { logger } from './logger.js'

class EventBus {
  private clients = new Set<Response>()

  addClient(res: Response): void {
    this.clients.add(res)
  }

  removeClient(res: Response): void {
    this.clients.delete(res)
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

  clientCount(): number {
    return this.clients.size
  }
}

export const eventBus = new EventBus()
