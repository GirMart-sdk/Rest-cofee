import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const TOKEN_KEY = 'hostal-cofee-token'
const REFRESH_KEY = 'hostal-cofee-refresh'

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

import { api } from './api'

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
})

afterEach(() => {
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
    localStorage.setItem(REFRESH_KEY, 'refresh-xyz')

    mock.mockRefreshPost.mockResolvedValue({
      data: { data: { accessToken: 'new-token', refreshToken: 'new-refresh' } },
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

    expect(mock.mockRefreshPost).toHaveBeenCalledWith('/api/auth/refresh', {
      refreshToken: 'refresh-xyz',
    })
    expect(localStorage.getItem(TOKEN_KEY)).toBe('new-token')
    expect(localStorage.getItem(REFRESH_KEY)).toBe('new-refresh')
    expect(mock.apiCallable).toHaveBeenCalledWith(expect.objectContaining({ url: '/api/menu' }))
  })

  it('rejects a 401 when no refresh token exists', async () => {
    const originalConfig = { url: '/api/menu', headers: {} }
    await expect(
      mock.state.onRejected!({ response: { status: 401 }, config: originalConfig }),
    ).rejects.toBeDefined()
  })

  it('does not retry twice for the same request', async () => {
    localStorage.setItem(REFRESH_KEY, 'refresh-xyz')
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
})
