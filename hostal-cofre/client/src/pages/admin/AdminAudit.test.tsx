import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AdminAudit from './AdminAudit'

const apiMock = vi.hoisted(() => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('../../services/api', () => apiMock)

const toastMock = vi.hoisted(() => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('react-hot-toast', () => ({ __esModule: true, default: toastMock.toast }))

const logs = [
  {
    id: 'l1',
    userId: 'u1',
    userEmail: 'admin@hostal.com',
    action: 'LOGIN',
    resource: 'auth',
    resourceId: null,
    ip: '127.0.0.1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'l2',
    userId: 'u1',
    userEmail: 'admin@hostal.com',
    action: 'UPDATE',
    resource: 'menu',
    resourceId: 'm1',
    details: { name: 'Pizza' },
    ip: '127.0.0.1',
    createdAt: new Date().toISOString(),
  },
]

function renderPage() {
  return render(<AdminAudit />)
}

describe('AdminAudit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    apiMock.api.get.mockResolvedValue({ data: { data: logs } })
  })

  it('renders the audit log entries', async () => {
    renderPage()
    expect((await screen.findAllByText('admin@hostal.com')).length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('LOGIN')).toBeInTheDocument()
    expect(screen.getByText('UPDATE')).toBeInTheDocument()
    expect(screen.getAllByText('Autenticación').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Menú').length).toBeGreaterThan(0)
    expect(apiMock.api.get).toHaveBeenCalledWith('/audit', { params: { limit: 100 } })
  })

  it('filters by resource when selected', async () => {
    renderPage()
    await screen.findByText('LOGIN')

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'menu' } })

    await waitFor(() =>
      expect(apiMock.api.get).toHaveBeenCalledWith('/audit', {
        params: { resource: 'menu' },
      }),
    )
  })

  it('shows the empty state when there are no logs', async () => {
    apiMock.api.get.mockResolvedValue({ data: { data: [] } })
    renderPage()

    expect(await screen.findByText('Sin registros')).toBeInTheDocument()
  })

  it('shows an error toast when loading fails', async () => {
    apiMock.api.get.mockRejectedValue(new Error('nope'))
    renderPage()

    await waitFor(() =>
      expect(toastMock.toast.error).toHaveBeenCalledWith(
        'Error al cargar el registro de auditoría',
      ),
    )
  })
})
