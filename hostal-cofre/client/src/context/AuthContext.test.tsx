import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'

const TOKEN_KEY = 'hostal-cofee-token'

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}))

vi.mock('../services/api', () => ({
  api: mockApi,
}))

function Probe() {
  const { user, login, register, logout, isAdmin, loading } = useAuth()
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user?.email || 'none'}</span>
      <span data-testid="admin">{String(isAdmin)}</span>
      <button onClick={() => void login('a@b.com', 'Pass!123')}>login</button>
      <button onClick={() => void register('Ana', 'a@b.com', 'Pass!123')}>register</button>
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
  localStorage.clear()
  vi.clearAllMocks()
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
    expect(localStorage.getItem(TOKEN_KEY)).toBe('access-1')
  })

  it('returns false and does not store tokens on failed login', async () => {
    mockApi.post.mockRejectedValue(new Error('invalid credentials'))
    renderAuth()
    screen.getByText('login').click()
    await waitFor(() => expect(localStorage.getItem(TOKEN_KEY)).toBeNull())
    expect(screen.getByTestId('user').textContent).toBe('none')
  })

  it('does not log in when the response requires a 2FA step', async () => {
    mockApi.post.mockResolvedValue({
      data: { requiresTwoFactor: true, data: { pendingToken: 'pt-1' } },
    })
    renderAuth()
    screen.getByText('login').click()
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('none'))
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
  })

  it('restores the user from /auth/me when a token exists', async () => {
    localStorage.setItem(TOKEN_KEY, 'access-1')
    mockApi.get.mockResolvedValue({
      data: { data: { id: 'u1', name: 'Ana', email: 'a@b.com', role: 'client' } },
    })

    renderAuth()
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('a@b.com'))
    expect(mockApi.get).toHaveBeenCalledWith('/auth/me')
    expect(screen.getByTestId('loading').textContent).toBe('false')
  })

  it('refreshes the token and reloads the user when /auth/me fails', async () => {
    localStorage.setItem(TOKEN_KEY, 'expired')
    mockApi.get.mockRejectedValueOnce(new Error('expired'))
    mockApi.post.mockResolvedValue({ data: { data: { accessToken: 'a2' } } })
    mockApi.get.mockResolvedValueOnce({
      data: { data: { id: 'u1', name: 'Ana', email: 'a@b.com', role: 'client' } },
    })

    renderAuth()
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('a@b.com'))
    expect(mockApi.post).toHaveBeenCalledWith('/auth/refresh')
    expect(localStorage.getItem(TOKEN_KEY)).toBe('a2')
  })

  it('clears the token when the refresh also fails', async () => {
    localStorage.setItem(TOKEN_KEY, 'expired')
    mockApi.get.mockRejectedValueOnce(new Error('expired'))
    mockApi.post.mockRejectedValue(new Error('no cookie'))

    renderAuth()
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))
    expect(screen.getByTestId('user').textContent).toBe('none')
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
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
    expect(localStorage.getItem(TOKEN_KEY)).toBe('reg-1')
  })

  it('does not register when the response has no access token', async () => {
    mockApi.post.mockResolvedValue({ data: { data: {} } })

    renderAuth()
    screen.getByText('register').click()
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('none'))
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
  })

  it('returns false and keeps the user logged out when registration fails', async () => {
    mockApi.post.mockRejectedValue(new Error('email taken'))

    renderAuth()
    screen.getByText('register').click()
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('none'))
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
  })

  it('logs out, clears the token and resets the user', async () => {
    localStorage.setItem(TOKEN_KEY, 'access-1')
    mockApi.get.mockRejectedValue(new Error('expired'))
    mockApi.post.mockResolvedValue({ data: { data: { accessToken: 'a2' } } })
    mockApi.get.mockResolvedValueOnce({
      data: { data: { id: 'u1', name: 'Ana', email: 'a@b.com', role: 'client' } },
    })

    renderAuth()
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('a@b.com'))

    screen.getByText('logout').click()
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('none'))
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
    expect(mockApi.post).toHaveBeenCalledWith('/auth/logout')
  })
})
