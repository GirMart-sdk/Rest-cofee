import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'

const authMock = vi.hoisted(() => ({
  useAuth: {
    user: { id: 'u1', name: 'Ana', email: 'ana@x.com', role: 'admin' as const },
    logout: vi.fn(),
  },
}))

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: authMock.useAuth.user, logout: authMock.useAuth.logout }),
}))

const NAV_LABELS = [
  'Dashboard',
  'Punto de Venta',
  'Pedidos',
  'Mesas',
  'Menú',
  'Turnos',
  'Reportes',
  'Reservas',
]

function renderSidebar(props: { isOpen?: boolean; onClose?: () => void } = {}) {
  return render(
    <MemoryRouter initialEntries={['/admin/mesas']}>
      <AdminSidebar isOpen={props.isOpen ?? false} onClose={props.onClose ?? vi.fn()} />
    </MemoryRouter>,
  )
}

describe('AdminSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all navigation links and the user info', () => {
    renderSidebar()

    for (const label of NAV_LABELS) {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute(
        'href',
        expect.stringContaining('/admin'),
      )
    }
    expect(screen.getByRole('link', { name: 'Ver Sitio Público' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Ver Menú' })).toHaveAttribute('href', '/menu')

    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('ana@x.com')).toBeInTheDocument()
  })

  it('marks the current section as active', () => {
    renderSidebar()

    const activeLink = screen.getByRole('link', { name: 'Mesas' })
    expect(activeLink.className).toContain('bg-primary')
  })

  it('calls logout when clicking Cerrar Sesión', () => {
    renderSidebar()

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar Sesión' }))
    expect(authMock.useAuth.logout).toHaveBeenCalled()
  })

  it('calls onClose when navigating to a link', () => {
    const onClose = vi.fn()
    renderSidebar({ onClose })

    fireEvent.click(screen.getByRole('link', { name: 'Dashboard' }))
    expect(onClose).toHaveBeenCalled()
  })

  it('shows the overlay only when open', () => {
    const { container, rerender } = renderSidebar()

    expect(container.querySelector('.fixed.inset-0')).toBeNull()

    rerender(
      <MemoryRouter initialEntries={['/admin/mesas']}>
        <AdminSidebar isOpen={true} onClose={vi.fn()} />
      </MemoryRouter>,
    )
    expect(container.querySelector('.fixed.inset-0')).not.toBeNull()
  })
})
