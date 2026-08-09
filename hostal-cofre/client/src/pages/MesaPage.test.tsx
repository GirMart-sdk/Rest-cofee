import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MesaPage from './MesaPage'

const apiMock = vi.hoisted(() => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

const waMock = vi.hoisted(() => ({
  whatsappService: { sendOrder: vi.fn(), sendReservation: vi.fn() },
}))

vi.mock('../services/api', () => ({ api: apiMock.api, whatsappService: waMock.whatsappService }))

const toastMock = vi.hoisted(() => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('react-hot-toast', () => ({ __esModule: true, default: toastMock.toast }))

const authMock = vi.hoisted(() => ({
  useAuth: { user: { id: 'u1', name: 'Carlos', email: 'carlos@x.com', role: 'client' as const } },
}))

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: authMock.useAuth.user }),
}))

const items = [
  {
    id: 'p1',
    name: 'Pizza Margarita',
    description: '',
    price: 28000,
    category: 'pizza',
    image: 'https://example.com/p1.png',
    available: true,
  },
  {
    id: 'p2',
    name: 'Ensalada César',
    description: '',
    price: 15000,
    category: 'ensalada',
    image: 'https://example.com/p2.png',
    available: false,
  },
]

function renderPage(path = '/mesa?t=5') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <MesaPage />
    </MemoryRouter>,
  )
}

describe('MesaPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    apiMock.api.get.mockResolvedValue({ data: { data: items } })
  })

  it('shows an invalid table message without a table param', () => {
    renderPage('/mesa')

    expect(screen.getByText('Mesa no válida')).toBeInTheDocument()
    expect(screen.getByText('Escanea el QR de tu mesa para comenzar')).toBeInTheDocument()
  })

  it('renders the menu and empty cart for a valid table', async () => {
    renderPage()

    expect(screen.getByText('Mesa #5')).toBeInTheDocument()
    expect(screen.getByText('Agrega platos del menú para ordenar')).toBeInTheDocument()
    expect(await screen.findByText('Pizza Margarita')).toBeInTheDocument()
    expect(screen.queryByText('Ensalada César')).not.toBeInTheDocument()
  })

  it('adds items to the cart and shows the total', async () => {
    renderPage()
    await screen.findByText('Pizza Margarita')

    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(toastMock.toast.success).toHaveBeenCalledWith('Pizza Margarita añadido')
    expect(screen.getByText('Tu Pedido')).toBeInTheDocument()
    expect(screen.getByText('$56000.00')).toBeInTheDocument()
  })

  it('updates the quantity and removes items from the cart', async () => {
    renderPage()
    await screen.findByText('Pizza Margarita')

    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }))
    const cartPanel = screen.getByText('Tu Pedido').closest('div.bg-white') as HTMLElement
    const [minus, plus, trash] = within(cartPanel).getAllByRole('button')

    fireEvent.click(plus)
    expect(screen.getByText('$56000.00')).toBeInTheDocument()

    fireEvent.click(minus)
    expect(screen.getByText('$28000.00')).toBeInTheDocument()

    fireEvent.click(trash)
    expect(screen.getByText('Agrega platos del menú para ordenar')).toBeInTheDocument()
  })

  it('sends an order to the kitchen and sends it by WhatsApp', async () => {
    apiMock.api.post.mockResolvedValue({ data: { data: {} } })
    renderPage()
    await screen.findByText('Pizza Margarita')

    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Enviar Pedido a Cocina' }))
    expect(screen.getByText('¿Confirmar pedido para Mesa #5?')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(screen.queryByText('¿Confirmar pedido para Mesa #5?')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Enviar Pedido a Cocina' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }))

    await waitFor(() =>
      expect(apiMock.api.post).toHaveBeenCalledWith('/orders/table', {
        customerName: 'Carlos',
        customerPhone: 'carlos@x.com',
        items: [{ menuItemId: 'p1', quantity: 1 }],
        paymentMethod: 'cash',
        tableNumber: 5,
      }),
    )
    expect(waMock.whatsappService.sendOrder).toHaveBeenCalledWith(
      '573001234567',
      expect.stringContaining('Mesa #5'),
    )
    expect(toastMock.toast.success).toHaveBeenCalledWith('Pedido enviado a la cocina')
    expect(await screen.findByText('Agrega platos del menú para ordenar')).toBeInTheDocument()
  })

  it('shows an error toast when sending the order fails', async () => {
    apiMock.api.post.mockRejectedValue(new Error('nope'))
    renderPage()
    await screen.findByText('Pizza Margarita')

    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Enviar Pedido a Cocina' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }))

    await waitFor(() =>
      expect(toastMock.toast.error).toHaveBeenCalledWith('Error al enviar pedido'),
    )
    expect(screen.getByText('Tu Pedido')).toBeInTheDocument()
  })
})
