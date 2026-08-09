import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AdminLayout from './AdminLayout'

const authMock = vi.hoisted(() => ({
  useAuth: {
    user: { id: 'u1', name: 'Ana', email: 'ana@x.com', role: 'admin' as const },
    logout: vi.fn(),
  },
}))

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: authMock.useAuth.user, logout: authMock.useAuth.logout }),
}))

function renderLayout() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<div>PANEL CONTENT</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('AdminLayout', () => {
  it('renders the sidebar, header date and the outlet content', () => {
    const { container } = renderLayout()

    expect(screen.getByText('PANEL CONTENT')).toBeInTheDocument()
    expect(screen.getByText('Punto de Venta')).toBeInTheDocument()
    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument()
    expect(screen.getByText('Hostal')).toBeInTheDocument()

    const expectedDate = new Date().toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    expect(container.textContent).toContain(expectedDate)
  })

  it('opens and closes the mobile sidebar', () => {
    const { container } = renderLayout()

    expect(container.querySelector('.fixed.inset-0')).toBeNull()

    const menuButton = container.querySelector('header button') as HTMLButtonElement
    fireEvent.click(menuButton)
    expect(container.querySelector('.fixed.inset-0')).not.toBeNull()

    const overlay = container.querySelector('.fixed.inset-0') as HTMLElement
    fireEvent.click(overlay)
    expect(container.querySelector('.fixed.inset-0')).toBeNull()
  })
})
