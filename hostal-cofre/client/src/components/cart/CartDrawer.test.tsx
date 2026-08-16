import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CartDrawer from './CartDrawer'
import { CartProvider } from '../../context/CartContext'
import type { MenuItem } from '../../types'

const CART_KEY = 'hostal-cofee-cart'

const mocks = vi.hoisted(() => ({
  api: { get: vi.fn(), post: vi.fn() },
  whatsappService: { sendOrder: vi.fn(), sendReservation: vi.fn() },
  toast: { success: vi.fn(), error: vi.fn() },
  useAuth: { user: null as { name?: string; email?: string; role?: string } | null },
}))

vi.mock('../../services/api', () => ({
  api: mocks.api,
  whatsappService: mocks.whatsappService,
}))

vi.mock('react-hot-toast', () => ({ __esModule: true, default: mocks.toast }))

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: mocks.useAuth.user }),
}))

const pizza: MenuItem = {
  id: 'item-1',
  name: 'Pizza Margarita',
  description: 'Test pizza',
  price: 25000,
  category: 'pizza',
  image: 'https://example.com/pizza.png',
  available: true,
}

const zones = [
  { name: 'centro', label: 'Centro', estimatedMinutes: 15, fee: 3000 },
  { name: 'lejano', label: 'Lejano', estimatedMinutes: 45, fee: 8000 },
]

const tables = [
  { id: 't1', number: 1, capacity: 4, zone: 'interior' },
  { id: 't2', number: 2, capacity: 6, zone: 'exterior' },
]

function seedCart(quantity = 2) {
  localStorage.setItem(CART_KEY, JSON.stringify([{ menuItem: pizza, quantity }]))
}

function renderDrawer() {
  return render(
    <CartProvider>
      <CartDrawer />
    </CartProvider>,
  )
}

function iconButtons() {
  return screen.getAllByRole('button').filter((b) => b.textContent?.trim() === '')
}

async function goToTypeStep() {
  renderDrawer()
  fireEvent.click(screen.getByRole('button', { name: 'Continuar al Checkout' }))
  await screen.findByText('¿Cómo quieres tu pedido?')
}

async function goToDetails(orderTypeLabel: string) {
  await goToTypeStep()
  fireEvent.click(screen.getByRole('button', { name: new RegExp(orderTypeLabel) }))
  fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }))
  if (orderTypeLabel === 'Domicilio') {
    await screen.findByText('Centro')
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.useAuth.user = { name: 'Ana', email: 'ana@x.com', role: 'client' }
  mocks.api.get.mockImplementation((url?: string) =>
    url === '/tables'
      ? Promise.resolve({ data: { data: tables } })
      : Promise.resolve({ data: { data: zones } }),
  )
  mocks.api.post.mockResolvedValue({ data: { data: {} } })
})

describe('CartDrawer', () => {
  it('shows an empty state when there are no items', () => {
    renderDrawer()
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver Menú' })).toHaveAttribute('href', '/menu')
  })

  it('renders the cart items with quantity controls', () => {
    seedCart()
    renderDrawer()
    expect(screen.getByText('Tu Carrito (2)')).toBeInTheDocument()
    expect(screen.getByText('Pizza Margarita')).toBeInTheDocument()
    expect(screen.getAllByText('$50.000').length).toBeGreaterThan(0)

    const [minus, plus] = iconButtons()
    fireEvent.click(plus)
    expect(screen.getByText('Tu Carrito (3)')).toBeInTheDocument()
    fireEvent.click(minus)
    expect(screen.getByText('Tu Carrito (2)')).toBeInTheDocument()
  })

  it('removes an item with the trash button', () => {
    seedCart(1)
    renderDrawer()
    const [, , trash] = iconButtons()
    fireEvent.click(trash)
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
  })

  it('clears the whole cart with the Vaciar button', () => {
    seedCart()
    renderDrawer()
    fireEvent.click(screen.getByRole('button', { name: 'Vaciar' }))
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
  })

  it('goes back from the order type step to the cart', async () => {
    seedCart()
    await goToTypeStep()
    fireEvent.click(screen.getByRole('button', { name: 'Volver' }))
    expect(screen.getByText('Tu Carrito (2)')).toBeInTheDocument()
  })

  it('completes a domicilio order with delivery zone and sends it by WhatsApp', async () => {
    seedCart()
    await goToDetails('Domicilio')

    fireEvent.click(screen.getByText('Centro'))
    fireEvent.change(screen.getByPlaceholderText(/Calle, número/), {
      target: { value: 'Cra 12-34' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Indicaciones adicionales/), {
      target: { value: 'Casa verde' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    await screen.findByText('Datos del Pedido')
    fireEvent.change(screen.getByPlaceholderText('Nombre completo *'), {
      target: { value: 'Ana Maria' },
    })
    fireEvent.change(screen.getByPlaceholderText('Teléfono *'), {
      target: { value: '3001234567' },
    })
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'ana.maria@x.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }))

    await screen.findByText('Método de Pago')
    expect(screen.getByText('Envío (Centro)')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Nequi/ }))
    fireEvent.click(screen.getByRole('button', { name: /Enviar Pedido/ }))

    await waitFor(() =>
      expect(mocks.api.post).toHaveBeenCalledWith(
        '/orders',
        expect.objectContaining({
          customerName: 'Ana Maria',
          customerPhone: '3001234567',
          customerEmail: 'ana.maria@x.com',
          orderType: 'domicilio',
          deliveryZone: 'centro',
          address: 'Cra 12-34',
          deliveryNotes: 'Casa verde',
          paymentMethod: 'nequi',
        }),
      ),
    )
    expect(mocks.whatsappService.sendOrder).toHaveBeenCalledWith(
      '573001234567',
      expect.stringContaining('Total'),
    )
    expect(mocks.toast.success).toHaveBeenCalledWith('Pedido registrado y enviado por WhatsApp')
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
  })

  it('completes a tienda order without a delivery zone', async () => {
    seedCart()
    await goToDetails('Recoger en tienda')

    await screen.findByText('Datos del Pedido')
    fireEvent.change(screen.getByPlaceholderText('Teléfono *'), {
      target: { value: '3001234567' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }))

    await screen.findByText('Método de Pago')
    fireEvent.click(screen.getByRole('button', { name: /Enviar Pedido/ }))

    await waitFor(() =>
      expect(mocks.api.post).toHaveBeenCalledWith(
        '/orders',
        expect.objectContaining({
          orderType: 'tienda',
        }),
      ),
    )
    expect(mocks.whatsappService.sendOrder).toHaveBeenCalled()
  })

  it('starts a Wompi payment after creating an order', async () => {
    seedCart()
    await goToDetails('Recoger en tienda')

    await screen.findByText('Datos del Pedido')
    fireEvent.change(screen.getByPlaceholderText('Teléfono *'), {
      target: { value: '3001234567' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }))

    await screen.findByText('Método de Pago')
    mocks.api.post.mockResolvedValueOnce({ data: { data: { id: 'order-1' } } })
    mocks.api.post.mockResolvedValueOnce({
      data: { data: { id: 'txn-1', payment_link: 'https://checkout.wompi.co/p/abc' } },
    })
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    fireEvent.click(screen.getByRole('button', { name: /Wompi/ }))
    fireEvent.click(screen.getByRole('button', { name: /Enviar Pedido/ }))

    await waitFor(() =>
      expect(mocks.api.post).toHaveBeenCalledWith('/payments/create-transaction', {
        orderId: 'order-1',
      }),
    )
    expect(openSpy).toHaveBeenCalledWith('https://checkout.wompi.co/p/abc', '_blank')
    expect(mocks.toast.success).toHaveBeenCalledWith(
      'Pago iniciado con Wompi. Completa el pago en la nueva ventana.',
    )
    openSpy.mockRestore()
  })

  it('registers a mesa order with a selected table without sending WhatsApp', async () => {
    seedCart()
    await goToDetails('Para la mesa')
    expect(screen.queryByPlaceholderText('Email')).not.toBeInTheDocument()

    await screen.findByRole('option', { name: /Mesa 1/ })
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 't1' } })
    fireEvent.change(screen.getByPlaceholderText('Teléfono *'), {
      target: { value: '3001234567' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }))

    await screen.findByText('Método de Pago')
    fireEvent.click(screen.getByRole('button', { name: /Enviar Pedido/ }))

    await waitFor(() =>
      expect(mocks.api.post).toHaveBeenCalledWith(
        '/orders',
        expect.objectContaining({ orderType: 'mesa', tableId: 't1' }),
      ),
    )
    expect(mocks.whatsappService.sendOrder).not.toHaveBeenCalled()
    expect(mocks.toast.success).toHaveBeenCalledWith('Pedido registrado en mesa')
  })

  it('navigates back between the checkout steps', async () => {
    seedCart()
    await goToDetails('Domicilio')

    fireEvent.click(screen.getByRole('button', { name: 'Volver' }))
    await screen.findByText('¿Cómo quieres tu pedido?')

    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }))
    await screen.findByText('Centro')
    fireEvent.click(screen.getByText('Centro'))
    fireEvent.change(screen.getByPlaceholderText(/Calle, número/), {
      target: { value: 'Cra 5-10' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    await screen.findByText('Datos del Pedido')
    fireEvent.click(screen.getByRole('button', { name: 'Volver' }))
    await screen.findByText('Centro')
    fireEvent.click(screen.getByText('Centro'))
    fireEvent.change(screen.getByPlaceholderText(/Calle, número/), {
      target: { value: 'Cra 5-10' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    await screen.findByText('Datos del Pedido')
    fireEvent.change(screen.getByPlaceholderText('Teléfono *'), {
      target: { value: '3001234567' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }))

    await screen.findByText('Método de Pago')
    fireEvent.click(screen.getByRole('button', { name: 'Volver' }))
    expect(screen.getByText('Datos del Pedido')).toBeInTheDocument()
  })

  it('validates the customer details before advancing', async () => {
    seedCart()
    await goToDetails('Recoger en tienda')

    await screen.findByText('Datos del Pedido')
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }))
    expect(mocks.toast.error).toHaveBeenCalledWith('Nombre y teléfono son requeridos')
    expect(screen.queryByText('Método de Pago')).not.toBeInTheDocument()
  })

  it('shows an error toast when the order cannot be registered', async () => {
    mocks.api.post.mockRejectedValue(new Error('nope'))
    seedCart()
    await goToDetails('Recoger en tienda')

    await screen.findByText('Datos del Pedido')
    fireEvent.change(screen.getByPlaceholderText('Teléfono *'), {
      target: { value: '3001234567' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }))

    await screen.findByText('Método de Pago')
    fireEvent.click(screen.getByRole('button', { name: /Enviar Pedido/ }))

    await waitFor(() => expect(mocks.toast.error).toHaveBeenCalledWith('Error al registrar pedido'))
  })
})
