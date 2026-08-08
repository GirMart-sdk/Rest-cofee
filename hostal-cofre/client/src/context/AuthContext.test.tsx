import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'

const TOKEN_KEY = 'hostal-cofee-token'
const REFRESH_KEY = 'hostal-cofee-refresh'

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}))

vi.mock('../services/api', () => ({
  api: mockApi,
}))

function Probe() {
  const { user, login, logout, isAdmin, loading } = useAuth()
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user?.email || 'none'}</span>
      <span data-testid="admin">{String(isAdmin)}</span>
      <button onClick={() => void login('a@b.com', 'Pass!123')}>login</button>
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

  it('logs in successfully, stores tokens and sets the user', async () => {
    mockApi.post.mockResolvedValue({
      data: {
        data: {
          accessToken: 'access-1',
          refreshToken: 'refresh-1',
          user: { id: 'u1', name: 'Ana', email: 'a@b.com', role: 'admin' },
        },
      },
    })
    renderAuth()
    screen.getByText('login').click()
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('a@b.com'))
    expect(screen.getByTestId('admin').textContent).toBe('true')
    expect(localStorage.getItem(TOKEN_KEY)).toBe('access-1')
    expect(localStorage.getItem(REFRESH_KEY)).toBe('refresh-1')
  })

  it('returns false and does not store tokens on failed login', async () => {
    mockApi.post.mockRejectedValue(new Error('invalid credentials'))
    renderAuth()
    screen.getByText('login').click()
    await waitFor(() => expect(localStorage.getItem(TOKEN_KEY)).toBeNull())
    expect(screen.getByTestId('user').textContent).toBe('none')
  })

  it('logs out, clears tokens and resets the user', async () => {
    localStorage.setItem(TOKEN_KEY, 'access-1')
    localStorage.setItem(REFRESH_KEY, 'refresh-1')
    mockApi.get.mockRejectedValue(new Error('expired'))
    mockApi.post.mockResolvedValue({ data: { data: { accessToken: 'a2', refreshToken: 'r2' } } })
    mockApi.get.mockResolvedValueOnce({
      data: { data: { id: 'u1', name: 'Ana', email: 'a@b.com', role: 'client' } },
    })

    renderAuth()
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('a@b.com'))

    screen.getByText('logout').click()
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('none'))
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
    expect(localStorage.getItem(REFRESH_KEY)).toBeNull()
  })
})
