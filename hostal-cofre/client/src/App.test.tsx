import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

vi.mock('./services/api', () => ({
  api: {
    get: vi.fn().mockResolvedValue({ data: { data: [] } }),
    post: vi.fn().mockResolvedValue({ data: { data: {} } }),
  },
}))

function renderApp(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  localStorage.clear()
})

describe('App routing', () => {
  it('renders the home page at /', () => {
    renderApp('/')
    expect(screen.getByText(/Bienvenido a/i)).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    renderApp('/')
    expect(screen.getAllByText('Inicio').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Menú').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Reservas').length).toBeGreaterThan(0)
  })

  it('renders the login page at /login', async () => {
    renderApp('/login')
    expect(await screen.findByRole('heading', { name: /Iniciar Sesión/i })).toBeInTheDocument()
  })

  it('renders the 404 page for unknown routes', async () => {
    renderApp('/ruta-inexistente')
    expect(await screen.findByText('404')).toBeInTheDocument()
    expect(screen.getByText('Página no encontrada')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Volver al inicio/i })).toHaveAttribute('href', '/')
  })
})
