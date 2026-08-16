import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}))

vi.mock('../services/api', () => ({
  api: mockApi,
  setAccessToken: vi.fn(),
  clearTokens: vi.fn(),
}))

import { setAccessToken, clearTokens } from '../services/api'

function Probe() {
  const { user, login, register, logout, isAdmin, loading, twoFactorPending, verifyTwoFactor } =
    useAuth()
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user?.email || 'none'}</span>
      <span data-testid="admin">{String(isAdmin)}</span>
      <span data-testid="2fa">{twoFactorPending || 'none'}</span>
      <button onClick={() => void login('a@b.com', 'Pass!123')}>login</button>
      <button onClick={() => void register('Ana', 'a@b.com', 'Pass!123')}>register</button>
      <button onClick={() => void verifyTwoFactor('123456')}>verify</button>
      <button onClick={logout}>logout</button>
    </div>
  )
}

function renderAuth() {
  return render(
    <AuthProvider>
      <Probe />
    </AuthProvider>,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mockApi.post.mockRejectedValue(new Error('no cookie'))
  mockApi.get.mockRejectedValue(new Error('no session'))
})

describe('AuthContext', () => {
  it('shows no user when there is no token', async () => {
    renderAuth()
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))
    expect(screen.getByTestId('user').textContent).toBe('none')
  })

  it('logs in successfully, stores the access token and sets the user', async () => {
    mockApi.post.mockResolvedValue({
      data: {
        data: {
          accessToken: 'access-1',
          user: { id: 'u1', name: 'Ana', email: 'a@b.com', role: 'admin' },
        },
      },
    })
    renderAuth()
    screen.getByText('login').click()
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('a@b.com'))
    expect(screen.getByTestId('admin').textContent).toBe('true')
    expect(setAccessToken).toHaveBeenCalledWith('access-1')
  })

  it('returns false and does not store tokens on failed login', async () => {
    renderAuth()
    screen.getByText('login').click()
    await waitFor(() => expect(setAccessToken).not.toHaveBeenCalled())
    expect(screen.getByTestId('user').textContent).toBe('none')
  })

  it('does not log in when the response requires a 2FA step', async () => {
    mockApi.post.mockResolvedValue({
      data: { requiresTwoFactor: true, data: { pendingToken: 'pt-1' } },
    })
    renderAuth()
    screen.getByText('login').click()
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('none'))
    expect(setAccessToken).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.getByTestId('2fa').textContent).toBe('pt-1'))
  })

  it('completes the 2FA step and stores the session', async () => {
    mockApi.post.mockResolvedValue({
      data: { requiresTwoFactor: true, data: { pendingToken: 'pt-1' } },
    })
    renderAuth()
    screen.getByText('login').click()
    await waitFor(() => expect(screen.getByTestId('2fa').textContent).toBe('pt-1'))

    mockApi.post.mockResolvedValue({
      data: {
        data: {
          accessToken: '2fa-access',
          user: { id: 'u1', name: 'Ana', email: 'a@b.com', role: 'client' },
        },
      },
    })
    screen.getByText('verify').click()
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('a@b.com'))
    expect(mockApi.post).toHaveBeenCalledWith('/auth/2fa/verify', {
      pendingToken: 'pt-1',
      code: '123456',
    })
    expect(setAccessToken).toHaveBeenCalledWith('2fa-access')
    await waitFor(() => expect(screen.getByTestId('2fa').textContent).toBe('none'))
  })

  it('restores the user from /auth/me after a successful refresh', async () => {
    mockApi.post.mockResolvedValue({ data: { data: { accessToken: 'a2' } } })
    mockApi.get.mockResolvedValue({
      data: { data: { id: 'u1', name: 'Ana', email: 'a@b.com', role: 'client' } },
    })

    renderAuth()
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('a@b.com'))
    expect(mockApi.post).toHaveBeenCalledWith('/auth/refresh')
    expect(mockApi.get).toHaveBeenCalledWith('/auth/me')
    expect(screen.getByTestId('loading').textContent).toBe('false')
  })

  it('clears the session when /auth/me fails after a successful refresh', async () => {
    mockApi.post.mockResolvedValue({ data: { data: { accessToken: 'a2' } } })

    renderAuth()
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))
    expect(screen.getByTestId('user').textContent).toBe('none')
    expect(clearTokens).toHaveBeenCalled()
  })

  it('clears the token when the refresh fails', async () => {
    renderAuth()
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))
    expect(screen.getByTestId('user').textContent).toBe('none')
    expect(mockApi.post).toHaveBeenCalledWith('/auth/refresh')
    expect(clearTokens).toHaveBeenCalled()
  })

  it('registers a new user, stores the token and marks admin when the role is admin', async () => {
    mockApi.post.mockResolvedValue({
      data: {
        data: {
          accessToken: 'reg-1',
          user: { id: 'u2', name: 'Luis', email: 'l@b.com', role: 'admin' },
        },
      },
    })

    renderAuth()
    screen.getByText('register').click()
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('l@b.com'))
    expect(mockApi.post).toHaveBeenCalledWith('/auth/register', {
      name: 'Ana',
      email: 'a@b.com',
      password: 'Pass!123',
    })
    expect(screen.getByTestId('admin').textContent).toBe('true')
    expect(setAccessToken).toHaveBeenCalledWith('reg-1')
  })

  it('does not register when the response has no access token', async () => {
    mockApi.post.mockResolvedValue({ data: { data: {} } })

    renderAuth()
    screen.getByText('register').click()
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('none'))
    expect(setAccessToken).not.toHaveBeenCalled()
  })

  it('returns false and keeps the user logged out when registration fails', async () => {
    renderAuth()
    screen.getByText('register').click()
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('none'))
    expect(setAccessToken).not.toHaveBeenCalled()
  })

  it('logs out, clears the token and resets the user', async () => {
    mockApi.post.mockResolvedValue({ data: { data: { accessToken: 'a2' } } })
    mockApi.get.mockResolvedValue({
      data: { data: { id: 'u1', name: 'Ana', email: 'a@b.com', role: 'client' } },
    })

    renderAuth()
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('a@b.com'))

    screen.getByText('logout').click()
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('none'))
    expect(clearTokens).toHaveBeenCalled()
    expect(mockApi.post).toHaveBeenCalledWith('/auth/logout')
  })
})
