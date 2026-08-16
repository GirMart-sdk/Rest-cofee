import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AdminPOS from './AdminPOS'

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
    name: 'Pasta Carbonara',
    description: '',
    price: 24000,
    category: 'pasta',
    image: 'https://example.com/p2.png',
    available: true,
  },
  {
    id: 'p3',
    name: 'Ensalada César',
    description: '',
    price: 15000,
    category: 'ensalada',
    image: 'https://example.com/p3.png',
    available: false,
  },
]

function renderPage() {
  return render(<AdminPOS />)
}

const addProduct = (name: string) => {
  fireEvent.click(screen.getAllByRole('button', { name: new RegExp(name) })[0])
}

describe('AdminPOS', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    apiMock.api.get.mockResolvedValue({ data: { data: items } })
  })

  it('shows loading while fetching the menu', () => {
    let resolveLoad!: (v: unknown) => void
    apiMock.api.get.mockReturnValue(
      new Promise((res) => {
        resolveLoad = res
      }),
    )

    renderPage()

    expect(screen.getByText('Cargando POS...')).toBeInTheDocument()
    resolveLoad({ data: { data: items } })
  })

  it('renders the available products and empty cart', async () => {
    renderPage()

    expect(await screen.findByText('Pizza Margarita')).toBeInTheDocument()
    expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument()
    expect(screen.queryByText('Ensalada César')).not.toBeInTheDocument()
    expect(screen.getByText('Agrega items del menú')).toBeInTheDocument()
  })

  it('adds items to the cart and computes the subtotal', async () => {
    renderPage()
    await screen.findByText('Pizza Margarita')

    addProduct('Pizza Margarita')
    addProduct('Pizza Margarita')
    addProduct('Pasta Carbonara')

    expect(screen.getByText('Items: 3')).toBeInTheDocument()
    expect(screen.getByText('$80.000')).toBeInTheDocument()
    expect(screen.getAllByText('Pizza Margarita').length).toBeGreaterThan(1)
  })

  it('updates and removes cart items', async () => {
    renderPage()
    await screen.findByText('Pizza Margarita')

    addProduct('Pizza Margarita')
    fireEvent.click(screen.getByRole('button', { name: 'Aumentar Pizza Margarita' }))
    expect(screen.getByText('Items: 2')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Disminuir Pizza Margarita' }))
    fireEvent.click(screen.getByRole('button', { name: 'Disminuir Pizza Margarita' }))
    expect(screen.getByText('Agrega items del menú')).toBeInTheDocument()

    addProduct('Pizza Margarita')
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Pizza Margarita' }))
    expect(screen.getByText('Agrega items del menú')).toBeInTheDocument()
  })

  it('clears the cart with the Limpiar button', async () => {
    renderPage()
    await screen.findByText('Pizza Margarita')

    addProduct('Pizza Margarita')
    expect(screen.getByText('Items: 1')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Limpiar' }))
    expect(screen.getByText('Agrega items del menú')).toBeInTheDocument()
  })

  it('filters products by category', async () => {
    renderPage()
    await screen.findByText('Pizza Margarita')

    fireEvent.click(screen.getByRole('button', { name: 'Pastas' }))
    expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument()
    expect(screen.queryByText('Pizza Margarita')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Todos' }))
    expect(screen.getByText('Pizza Margarita')).toBeInTheDocument()
  })

  it('registers a cash sale and shows the receipt', async () => {
    apiMock.api.post.mockResolvedValue({
      data: {
        data: {
          customerName: 'Cliente',
          total: 56000,
          paymentMethod: 'cash',
          change: 2000,
          receiptNumber: 'R-1',
        },
      },
    })
    renderPage()
    await screen.findByText('Pizza Margarita')

    addProduct('Pizza Margarita')
    addProduct('Pizza Margarita')
    fireEvent.click(screen.getByRole('button', { name: 'Cobrar' }))

    expect(screen.getByText('Efectivo recibido')).toBeInTheDocument()
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '60000' } })
    fireEvent.change(screen.getByPlaceholderText('Cliente'), { target: { value: 'Cliente' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Cobro' }))

    await waitFor(() =>
      expect(apiMock.api.post).toHaveBeenCalledWith(
        '/orders',
        expect.objectContaining({
          items: [{ menuItemId: 'p1', quantity: 2 }],
          paymentMethod: 'cash',
          orderType: 'tienda',
          customerName: 'Cliente',
        }),
      ),
    )

    expect(toastMock.toast.success).toHaveBeenCalledWith('Venta registrada')
    expect(await screen.findByText('TOTAL')).toBeInTheDocument()
    expect(screen.getByText('Pago: CASH')).toBeInTheDocument()
    expect(screen.getByText('Recibido: $60.000')).toBeInTheDocument()
    expect(screen.getByText('Cambio: $4.000')).toBeInTheDocument()
    expect(screen.getByText('Agrega items del menú')).toBeInTheDocument()
  })

  it('registers a digital (nequi) sale without cash fields', async () => {
    apiMock.api.post.mockResolvedValue({
      data: {
        data: { customerName: 'Cliente', total: 28000, paymentMethod: 'nequi', change: null },
      },
    })
    renderPage()
    await screen.findByText('Pizza Margarita')

    addProduct('Pizza Margarita')
    fireEvent.click(screen.getByRole('button', { name: 'Cobrar' }))

    fireEvent.click(screen.getByRole('button', { name: /Nequi/ }))
    expect(screen.queryByPlaceholderText('0')).not.toBeInTheDocument()
    expect(screen.getByText('Confirmo que recibí la transferencia del cliente')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Confirmo que recibí la transferencia del cliente'))

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Cobro' }))

    await waitFor(() => expect(apiMock.api.post).toHaveBeenCalled())
    const payload = apiMock.api.post.mock.calls[0][1] as Record<string, unknown>
    expect(payload.paymentMethod).toBe('nequi')
    expect(payload.cashReceived).toBeUndefined()
    expect(payload.orderType).toBe('tienda')
  })

  it('shows an error toast when the sale fails', async () => {
    apiMock.api.post.mockRejectedValue(new Error('nope'))
    renderPage()
    await screen.findByText('Pizza Margarita')

    addProduct('Pizza Margarita')
    fireEvent.click(screen.getByRole('button', { name: 'Cobrar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Cobro' }))

    await waitFor(() =>
      expect(toastMock.toast.error).toHaveBeenCalledWith('Error al registrar venta'),
    )
  })

  it('cancels the payment modal keeping the cart', async () => {
    renderPage()
    await screen.findByText('Pizza Margarita')

    addProduct('Pizza Margarita')
    fireEvent.click(screen.getByRole('button', { name: 'Cobrar' }))
    expect(screen.getByPlaceholderText('Cliente')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(screen.queryByPlaceholderText('Cliente')).not.toBeInTheDocument()
    expect(screen.getByText('Items: 1')).toBeInTheDocument()
  })
})
