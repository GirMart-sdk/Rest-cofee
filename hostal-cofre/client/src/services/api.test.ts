import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const TOKEN_KEY = 'hostal-cofee-token'

const mock = vi.hoisted(() => {
  const state: {
    requestHandler?: (config: { headers: Record<string, string> }) => unknown
    onFulfilled?: (res: unknown) => unknown
    onRejected?: (err: {
      response?: { status?: number }
      config?: Record<string, unknown>
    }) => Promise<unknown>
  } = {}

  const mockRefreshPost = vi.fn()

  const apiCallable = vi.fn(() => Promise.resolve({ data: {} }))
  apiCallable.get = vi.fn(() => Promise.resolve({ data: {} }))
  apiCallable.post = vi.fn(() => Promise.resolve({ data: {} }))
  apiCallable.patch = vi.fn(() => Promise.resolve({ data: {} }))
  apiCallable.delete = vi.fn(() => Promise.resolve({ data: {} }))
  apiCallable.interceptors = {
    request: {
      use: vi.fn((fn: typeof state.requestHandler) => {
        state.requestHandler = fn
      }),
    },
    response: {
      use: vi.fn((onOk: typeof state.onFulfilled, onErr: typeof state.onRejected) => {
        state.onFulfilled = onOk
        state.onRejected = onErr
      }),
    },
  }
  apiCallable.defaults = { headers: { common: {} } }

  return { state, mockRefreshPost, apiCallable }
})

vi.mock('axios', () => ({
  __esModule: true,
  default: {
    create: vi.fn(() => mock.apiCallable),
    post: mock.mockRefreshPost,
  },
}))

import { api, refreshTokens, clearTokens, whatsappService } from './api'

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
  vi.stubGlobal('location', { href: '' })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})

describe('api client', () => {
  it('attaches the Bearer token from localStorage to outgoing requests', () => {
    localStorage.setItem(TOKEN_KEY, 'abc123')
    const config = { headers: {} }
    const result = mock.state.requestHandler!(config)
    expect(result).toMatchObject({ headers: { Authorization: 'Bearer abc123' } })
  })

  it('does not attach a token when localStorage is empty', () => {
    const config = { headers: {} }
    const result = mock.state.requestHandler!(config)
    expect(result).toMatchObject({ headers: {} })
  })

  it('refreshes the token on 401 and retries the original request', async () => {
    localStorage.setItem(TOKEN_KEY, 'old-token')

    mock.mockRefreshPost.mockResolvedValue({
      data: { data: { accessToken: 'new-token' } },
    })

    const originalConfig = {
      url: '/api/menu',
      headers: {},
      _retry: undefined as boolean | undefined,
    }

    await mock.state.onRejected!({
      response: { status: 401 },
      config: originalConfig,
    })

    expect(mock.mockRefreshPost).toHaveBeenCalledWith('/api/auth/refresh')
    expect(localStorage.getItem(TOKEN_KEY)).toBe('new-token')
    expect(mock.apiCallable).toHaveBeenCalledWith(expect.objectContaining({ url: '/api/menu' }))
  })

  it('rejects a 401 when the refresh request fails', async () => {
    mock.mockRefreshPost.mockRejectedValue(new Error('no cookie'))
    const originalConfig = { url: '/api/menu', headers: {} }
    await expect(
      mock.state.onRejected!({ response: { status: 401 }, config: originalConfig }),
    ).rejects.toBeDefined()
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
  })

  it('does not retry twice for the same request', async () => {
    const originalConfig = { url: '/api/menu', headers: {}, _retry: true }

    await expect(
      mock.state.onRejected!({ response: { status: 401 }, config: originalConfig }),
    ).rejects.toBeDefined()
    expect(mock.mockRefreshPost).not.toHaveBeenCalled()
  })

  it('rejects errors that are not 401', async () => {
    const originalConfig = { url: '/api/menu', headers: {} }
    await expect(
      mock.state.onRejected!({ response: { status: 500 }, config: originalConfig }),
    ).rejects.toBeDefined()
  })

  it('is an axios instance with the /api base URL', () => {
    expect(api).toBeDefined()
  })

  it('clearTokens removes the stored access token', () => {
    localStorage.setItem(TOKEN_KEY, 'abc')
    clearTokens()
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
  })

  it('refreshTokens stores the new access token on success', async () => {
    mock.mockRefreshPost.mockResolvedValue({
      data: { data: { accessToken: 'new-token' } },
    })

    const ok = await refreshTokens()

    expect(ok).toBe(true)
    expect(mock.mockRefreshPost).toHaveBeenCalledWith('/api/auth/refresh')
    expect(localStorage.getItem(TOKEN_KEY)).toBe('new-token')
  })

  it('refreshTokens clears the token and returns false when the request fails', async () => {
    localStorage.setItem(TOKEN_KEY, 'old')
    mock.mockRefreshPost.mockRejectedValue(new Error('nope'))

    const ok = await refreshTokens()

    expect(ok).toBe(false)
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
  })

  it('refreshTokens returns false when the response has no access token', async () => {
    mock.mockRefreshPost.mockResolvedValue({ data: { data: {} } })
    const ok = await refreshTokens()
    expect(ok).toBe(false)
    expect(mock.mockRefreshPost).toHaveBeenCalledWith('/api/auth/refresh')
  })

  it('whatsappService opens a WhatsApp chat for orders', () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null)
    whatsappService.sendOrder('573001234567', 'Resumen del pedido')
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('wa.me/573001234567'), '_blank')
  })

  it('whatsappService opens a WhatsApp chat for reservations', () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null)
    whatsappService.sendReservation('573001234567', 'Reserva confirmada')
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('wa.me/573001234567'), '_blank')
  })
})
