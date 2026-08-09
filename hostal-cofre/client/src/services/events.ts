import { getAccessToken, refreshTokens } from './api'

export interface SseEvent {
  action: string
  data: unknown
}

function parseSseEvent(text: string): SseEvent | null {
  let action = 'message'
  let data = ''
  for (const line of text.split('\n')) {
    if (line.startsWith('event:')) action = line.slice(6).trim()
    else if (line.startsWith('data:')) data += line.slice(5).trim() + '\n'
  }
  data = data.trim()
  if (!data) return null
  try {
    return { action, data: JSON.parse(data) }
  } catch {
    return { action, data }
  }
}

export function subscribeOrders(onEvent: (event: SseEvent) => void): () => void {
  let controller: AbortController | null = null
  let shouldRun = true
  let retryDelay = 1000

  async function connect(): Promise<void> {
    if (!shouldRun) return
    controller = new AbortController()

    const headers: Record<string, string> = {}
    const token = getAccessToken()
    if (token) headers.Authorization = `Bearer ${token}`

    let res: Response
    try {
      res = await fetch('/api/orders/events', { headers, signal: controller.signal })
    } catch {
      if (shouldRun) scheduleReconnect()
      return
    }

    if (res.status === 401) {
      const refreshed = await refreshTokens()
      if (refreshed && shouldRun) {
        retryDelay = 1000
        connect()
      }
      return
    }

    if (!res.ok || !res.body) {
      scheduleReconnect()
      return
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (shouldRun) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const parts = buffer.split('\n\n')
        buffer = parts.pop() ?? ''
        for (const part of parts) {
          const parsed = parseSseEvent(part)
          if (parsed) onEvent(parsed)
        }
      }
    } catch {
      // Stream roto: se reconecta
    } finally {
      reader.releaseLock()
    }

    scheduleReconnect()
  }

  function scheduleReconnect(): void {
    if (!shouldRun) return
    retryDelay = Math.min(retryDelay * 2, 30000)
    setTimeout(() => {
      void connect()
    }, retryDelay)
  }

  void connect()

  return () => {
    shouldRun = false
    controller?.abort()
  }
}
