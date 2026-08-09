import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

const authState = vi.hoisted(() => ({
  user: null as null | { id: string; name: string; email: string; role: 'admin' | 'client' },
  loading: false,
}))

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: authState.user, loading: authState.loading }),
}))

function renderProtected(adminOnly: boolean, content = 'PROTECTED CONTENT') {
  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route path="/login" element={<div>LOGIN PAGE</div>} />
        <Route path="/" element={<div>HOME PAGE</div>} />
        <Route
          path="/protected"
          element={
            <ProtectedRoute adminOnly={adminOnly}>
              <div>{content}</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

const admin = { id: 'u1', name: 'Ana', email: 'ana@x.com', role: 'admin' as const }
const client = { id: 'u2', name: 'Leo', email: 'leo@x.com', role: 'client' as const }

describe('ProtectedRoute', () => {
  beforeEach(() => {
    authState.user = null
    authState.loading = false
  })

  it('shows a loader while the session is loading', () => {
    authState.loading = true
    authState.user = admin

    const { container } = renderProtected(true)

    expect(container.querySelector('.animate-spin')).not.toBeNull()
    expect(screen.queryByText('PROTECTED CONTENT')).not.toBeInTheDocument()
    expect(screen.queryByText('LOGIN PAGE')).not.toBeInTheDocument()
  })

  it('redirects unauthenticated users to /login', async () => {
    renderProtected(false)

    expect(await screen.findByText('LOGIN PAGE')).toBeInTheDocument()
    expect(screen.queryByText('PROTECTED CONTENT')).not.toBeInTheDocument()
  })

  it('redirects non-admin users to / when adminOnly', async () => {
    authState.user = client

    renderProtected(true)

    expect(await screen.findByText('HOME PAGE')).toBeInTheDocument()
  })

  it('renders children for admin users when adminOnly', () => {
    authState.user = admin

    renderProtected(true)

    expect(screen.getByText('PROTECTED CONTENT')).toBeInTheDocument()
  })

  it('renders children for any authenticated user by default', () => {
    authState.user = client

    renderProtected(false)

    expect(screen.getByText('PROTECTED CONTENT')).toBeInTheDocument()
  })
})
