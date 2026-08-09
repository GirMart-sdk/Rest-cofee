import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

const mocks = vi.hoisted(() => ({
  cart: { itemCount: 0 },
  auth: {
    user: null as { name?: string; email?: string; role?: string } | null,
    logout: vi.fn(),
    isAdmin: false,
  },
}))

vi.mock('../../context/CartContext', () => ({
  useCart: () => ({ itemCount: mocks.cart.itemCount }),
}))

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: mocks.auth.user,
    logout: mocks.auth.logout,
    isAdmin: mocks.auth.isAdmin,
  }),
}))

function renderNav() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>,
  )
}

function mobileMenu(container: HTMLElement) {
  return Array.from(container.querySelectorAll('div')).find((d) =>
    (d as HTMLElement).className.includes('md:hidden overflow-hidden'),
  ) as HTMLElement
}

function mobileToggle(container: HTMLElement) {
  return Array.from(container.querySelectorAll('button')).find((b) =>
    (b.parentElement as HTMLElement)?.className.includes('md:hidden'),
  ) as HTMLButtonElement
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.cart.itemCount = 0
  mocks.auth.user = null
  mocks.auth.isAdmin = false
})

describe('Navbar', () => {
  it('renders the logo and the navigation links', () => {
    const { container } = renderNav()
    expect(screen.getAllByText('Hostal').length).toBeGreaterThan(0)
    expect(container.querySelector('a[href="/menu"]')).not.toBeNull()
    expect(container.querySelector('a[href="/reservas"]')).not.toBeNull()
  })

  it('shows the cart badge when there are items in the cart', () => {
    mocks.cart.itemCount = 3
    renderNav()
    expect(screen.getAllByText('3').length).toBeGreaterThan(0)
  })

  it('links to login when there is no user', () => {
    renderNav()
    expect(screen.getAllByText('Iniciar Sesión').length).toBeGreaterThan(0)
  })

  it('shows the admin panel link and logs out when a user is logged in', () => {
    mocks.auth.user = { name: 'Ana', email: 'a@b.com', role: 'admin' }
    mocks.auth.isAdmin = true
    renderNav()
    expect(screen.getAllByText('Panel Admin').length).toBeGreaterThan(0)
    fireEvent.click(screen.getAllByText('Cerrar Sesión')[0])
    expect(mocks.auth.logout).toHaveBeenCalledTimes(1)
  })

  it('opens and closes the mobile menu with the toggle button', () => {
    const { container } = renderNav()
    expect(mobileMenu(container).className).toContain('max-h-0')

    fireEvent.click(mobileToggle(container))
    expect(mobileMenu(container).className).toContain('max-h-[500px]')

    fireEvent.click(mobileToggle(container))
    expect(mobileMenu(container).className).toContain('max-h-0')
  })

  it('applies the scrolled style when the window scrolls', async () => {
    const { container } = renderNav()
    const nav = container.querySelector('nav') as HTMLElement
    expect(nav.className).toContain('bg-transparent')

    Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value: 120 })
    fireEvent.scroll(window)

    await waitFor(() => expect(nav.className).toContain('bg-black/95'))
  })
})
