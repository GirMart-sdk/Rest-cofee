import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { subscribeOrders } from './events'

const apiMock = vi.hoisted(() => ({
  getAccessToken: vi.fn(),
  refreshTokens: vi.fn(),
}))

vi.mock('./api', () => apiMock)

const fetchMock = vi.hoisted(() => vi.fn())

function streamFromChunks(chunks: string[], close: boolean): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const c of chunks) controller.enqueue(encoder.encode(c))
      if (close) controller.close()
    },
  })
}

function okResponse(chunks: string[], close = false): Response {
  return new Response(streamFromChunks(chunks, close), {
    status: 200,
    headers: { 'Content-Type': 'text/event-stream' },
  })
}

const flush = () => new Promise<void>((resolve) => setTimeout(resolve, 0))
const flushTimes = async (n = 3) => {
  for (let i = 0; i < n; i++) await flush()
}

describe('subscribeOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    apiMock.getAccessToken.mockReturnValue('token-123')
    apiMock.refreshTokens.mockResolvedValue(true)
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('parses SSE events and forwards them to the callback', async () => {
    const chunk =
      'event: order.created\ndata: {"id":"o1"}\n\n' +
      'event: order.updated\ndata: {"id":"o2"}\n\n' +
      'data: plain text\n\n'
    fetchMock.mockResolvedValue(okResponse([chunk]))
    const onEvent = vi.fn()
    const unsubscribe = subscribeOrders(onEvent)

    await flushTimes()

    expect(onEvent).toHaveBeenCalledTimes(3)
    expect(onEvent).toHaveBeenNthCalledWith(1, { action: 'order.created', data: { id: 'o1' } })
    expect(onEvent).toHaveBeenNthCalledWith(2, { action: 'order.updated', data: { id: 'o2' } })
    expect(onEvent).toHaveBeenNthCalledWith(3, { action: 'message', data: 'plain text' })
    unsubscribe()
  })

  it('calls the orders events endpoint with the Bearer token', async () => {
    fetchMock.mockImplementation((url: string, init: RequestInit) => {
      expect(url).toBe('/api/orders/events')
      expect(init.headers).toEqual({ Authorization: 'Bearer token-123' })
      return Promise.resolve(okResponse(['data: {"a":1}\n\n']))
    })
    const onEvent = vi.fn()
    const unsubscribe = subscribeOrders(onEvent)

    await flushTimes()

    expect(onEvent).toHaveBeenCalledWith({ action: 'message', data: { a: 1 } })
    unsubscribe()
  })

  it('does not attach an Authorization header when there is no token', async () => {
    apiMock.getAccessToken.mockReturnValue(null)
    fetchMock.mockImplementation((_url: string, init: RequestInit) => {
      expect(init.headers).toEqual({})
      return Promise.resolve(okResponse(['data: {"a":1}\n\n']))
    })
    const onEvent = vi.fn()
    const unsubscribe = subscribeOrders(onEvent)

    await flushTimes()

    expect(onEvent).toHaveBeenCalledTimes(1)
    unsubscribe()
  })

  it('buffers data split across stream chunks', async () => {
    fetchMock.mockResolvedValue(okResponse(['event: a\nda', 'ta: {"v":1}\n\n']))
    const onEvent = vi.fn()
    const unsubscribe = subscribeOrders(onEvent)

    await flushTimes()

    expect(onEvent).toHaveBeenCalledWith({ action: 'a', data: { v: 1 } })
    unsubscribe()
  })

  it('ignores heartbeat chunks without data and trims values', async () => {
    fetchMock.mockResolvedValue(okResponse([': ping\n\nevent:   x \ndata:   5\n\n']))
    const onEvent = vi.fn()
    const unsubscribe = subscribeOrders(onEvent)

    await flushTimes()

    expect(onEvent).toHaveBeenCalledTimes(1)
    expect(onEvent).toHaveBeenCalledWith({ action: 'x', data: 5 })
    unsubscribe()
  })

  it('refreshes the token on 401 and reconnects', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockImplementation(() => Promise.resolve(okResponse(['data: {"id":"o3"}\n\n'])))
    const onEvent = vi.fn()
    const unsubscribe = subscribeOrders(onEvent)

    await flushTimes()

    expect(apiMock.refreshTokens).toHaveBeenCalledTimes(1)
    expect(onEvent).toHaveBeenCalledWith({ action: 'message', data: { id: 'o3' } })
    unsubscribe()
  })

  it('gives up after a 401 when the refresh fails', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 401 }))
    apiMock.refreshTokens.mockResolvedValue(false)
    const onEvent = vi.fn()
    const unsubscribe = subscribeOrders(onEvent)

    await flushTimes()

    expect(apiMock.refreshTokens).toHaveBeenCalledTimes(1)
    expect(onEvent).not.toHaveBeenCalled()
    unsubscribe()
  })

  it('schedules a reconnect on a network error', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    fetchMock
      .mockRejectedValueOnce(new TypeError('network error'))
      .mockImplementation(() => Promise.resolve(okResponse(['data: {"ok":true}\n\n'])))
    const onEvent = vi.fn()
    const unsubscribe = subscribeOrders(onEvent)

    await vi.advanceTimersByTimeAsync(2000)

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(onEvent).toHaveBeenCalledWith({ action: 'message', data: { ok: true } })
    unsubscribe()
  })

  it('reconnects when the response is not ok', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockImplementation(() => Promise.resolve(okResponse(['data: {"ok":true}\n\n'])))
    const onEvent = vi.fn()
    const unsubscribe = subscribeOrders(onEvent)

    await vi.advanceTimersByTimeAsync(2000)

    expect(fetchMock).toHaveBeenCalledTimes(2)
    unsubscribe()
  })

  it('reconnects when the response has no body', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 200 }))
      .mockImplementation(() => Promise.resolve(okResponse(['data: {"ok":true}\n\n'])))
    const onEvent = vi.fn()
    const unsubscribe = subscribeOrders(onEvent)

    await vi.advanceTimersByTimeAsync(2000)

    expect(fetchMock).toHaveBeenCalledTimes(2)
    unsubscribe()
  })

  it('reconnects after the stream ends', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    fetchMock.mockResolvedValue(okResponse(['data: {"ok":true}\n\n'], true))
    const onEvent = vi.fn()
    const unsubscribe = subscribeOrders(onEvent)

    await vi.advanceTimersByTimeAsync(2000)

    expect(onEvent).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    unsubscribe()
  })

  it('aborts the connection on cleanup', async () => {
    let capturedSignal: AbortSignal | undefined
    fetchMock.mockImplementation((_url: string, init: RequestInit) => {
      capturedSignal = init.signal
      return Promise.resolve(okResponse(['data: {"a":1}\n\n']))
    })
    const unsubscribe = subscribeOrders(vi.fn())

    await flushTimes()

    expect(capturedSignal).toBeDefined()
    unsubscribe()
    expect(capturedSignal!.aborted).toBe(true)
  })
})
