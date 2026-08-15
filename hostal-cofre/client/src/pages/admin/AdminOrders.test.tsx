import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminOrders from './AdminOrders'

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

const eventsMock = vi.hoisted(() => ({
  subscribeOrders: vi.fn(),
}))

vi.mock('../../services/events', () => eventsMock)

const toastMock = vi.hoisted(() => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('react-hot-toast', () => ({ __esModule: true, default: toastMock.toast }))

const orders = [
  {
    id: 'o1',
    receiptNumber: 'A-001',
    status: 'pending',
    orderType: 'domicilio',
    customerName: 'Ana',
    customerPhone: '300 123',
    address: 'Calle 1',
    deliveryZone: 'centro',
    total: 30000,
    deliveryFee: 5000,
    items: [{ quantity: 2, menuItem: { name: 'Pizza', price: 15000 } }],
  },
  {
    id: 'o2',
    status: 'preparing',
    orderType: 'tienda',
    customerName: 'Luis',
    customerPhone: '301 456',
    total: 20000,
    deliveryFee: 0,
    items: [{ quantity: 1, menuItem: { name: 'Pasta', price: 20000 } }],
  },
  {
    id: 'o3',
    status: 'delivered',
    orderType: 'mesa',
    customerName: 'Mesa',
    customerPhone: '-',
    total: 50000,
    deliveryFee: 0,
    items: [],
    table: { number: 5 },
  },
  {
    id: 'o4',
    status: 'cancelled',
    orderType: 'tienda',
    customerName: 'Rosa',
    customerPhone: '302 789',
    total: 1000,
    deliveryFee: 0,
    items: [],
  },
]

function renderPage() {
  return render(
    <MemoryRouter>
      <AdminOrders />
    </MemoryRouter>,
  )
}

describe('AdminOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    apiMock.api.get.mockResolvedValue({ data: { data: orders } })
    eventsMock.subscribeOrders.mockImplementation(() => () => {})
  })

  it('renders the orders after loading', async () => {
    renderPage()
    expect(await screen.findByText('#A-001')).toBeInTheDocument()
    expect(screen.getByText(/Ana/)).toBeInTheDocument()
    expect(screen.getByText('Pendiente')).toBeInTheDocument()
    expect(screen.getByText('Preparando')).toBeInTheDocument()
    expect(screen.getByText('Entregado')).toBeInTheDocument()
    expect(screen.getByText('2x Pizza')).toBeInTheDocument()
    expect(screen.getByText('Envío')).toBeInTheDocument()
    expect(screen.getByText(/Mesa #5/)).toBeInTheDocument()
  })

  it('filters orders by status', async () => {
    renderPage()
    await screen.findByText('#A-001')

    fireEvent.click(screen.getByRole('button', { name: /Pendiente/ }))
    expect(screen.getByText('#A-001')).toBeInTheDocument()
    expect(screen.queryByText('1x Pasta')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Entregado/ }))
    expect(screen.queryByText('#A-001')).not.toBeInTheDocument()
    expect(screen.getByText('#o3')).toBeInTheDocument()
  })

  it('filters orders by type', async () => {
    renderPage()
    await screen.findByText('#A-001')

    fireEvent.click(screen.getByRole('button', { name: 'Domicilio' }))
    expect(screen.getByText('#A-001')).toBeInTheDocument()
    expect(screen.queryByText('1x Pasta')).not.toBeInTheDocument()
  })

  it('adds new orders received via SSE', async () => {
    let sseCallback: ((event: { action: string; data: unknown }) => void) | undefined
    eventsMock.subscribeOrders.mockImplementation((cb) => {
      sseCallback = cb
      return () => {}
    })
    renderPage()
    await screen.findByText('#A-001')
    expect(screen.getByText('Reconectando...')).toBeInTheDocument()

    const newOrder = {
      id: 'o5',
      receiptNumber: 'A-002',
      status: 'pending',
      orderType: 'tienda',
      customerName: 'Nuevo Cliente',
      customerPhone: '305',
      total: 12000,
      deliveryFee: 0,
      items: [],
    }
    await act(async () => {
      sseCallback!({ action: 'order.created', data: newOrder })
    })

    expect(screen.getByText('#A-002')).toBeInTheDocument()
    expect(screen.getByText('Tiempo real')).toBeInTheDocument()
    expect(toastMock.toast.success).toHaveBeenCalledWith('Nuevo pedido A-002')
  })

  it('updates existing orders received via SSE', async () => {
    let sseCallback: ((event: { action: string; data: unknown }) => void) | undefined
    eventsMock.subscribeOrders.mockImplementation((cb) => {
      sseCallback = cb
      return () => {}
    })
    renderPage()
    await screen.findByText('#A-001')

    await act(async () => {
      sseCallback!({ action: 'order.updated', data: { ...orders[0], status: 'ready' } })
    })

    await waitFor(() => expect(screen.getByText('Listo')).toBeInTheDocument())
    expect(screen.getByText('Marcar Listo')).toBeInTheDocument()
  })

  it('advances the status of an order', async () => {
    apiMock.api.patch.mockResolvedValue({ data: { data: {} } })
    renderPage()
    await screen.findByText('#A-001')

    fireEvent.click(screen.getByRole('button', { name: 'Iniciar Preparación' }))

    await waitFor(() =>
      expect(apiMock.api.patch).toHaveBeenCalledWith('/orders/o1/status', { status: 'preparing' }),
    )
    expect(toastMock.toast.success).toHaveBeenCalledWith('Estado cambiado a Preparando')
  })

  it('sends a pending domicilio order out for delivery', async () => {
    apiMock.api.patch.mockResolvedValue({ data: { data: {} } })
    renderPage()
    await screen.findByText('#A-001')

    fireEvent.click(screen.getByRole('button', { name: 'Salir a Entregar' }))

    await waitFor(() =>
      expect(apiMock.api.patch).toHaveBeenCalledWith('/orders/o1/status', {
        status: 'out_for_delivery',
      }),
    )
  })

  it('cancels an order', async () => {
    apiMock.api.patch.mockResolvedValue({ data: { data: {} } })
    renderPage()
    await screen.findByText('#A-001')

    const card = screen
      .getByRole('button', { name: 'Iniciar Preparación' })
      .closest('div.bg-white') as HTMLElement
    fireEvent.click(within(card).getByRole('button', { name: 'Cancelar' }))

    await waitFor(() =>
      expect(apiMock.api.patch).toHaveBeenCalledWith('/orders/o1/status', { status: 'cancelled' }),
    )
  })

  it('shows an error toast when updating the status fails', async () => {
    apiMock.api.patch.mockRejectedValue(new Error('nope'))
    renderPage()
    await screen.findByText('#A-001')

    fireEvent.click(screen.getByRole('button', { name: 'Iniciar Preparación' }))

    await waitFor(() =>
      expect(toastMock.toast.error).toHaveBeenCalledWith('Error al actualizar estado'),
    )
  })

  it('shows an error toast when the orders fail to load', async () => {
    apiMock.api.get.mockRejectedValue(new Error('nope'))
    renderPage()

    await waitFor(() =>
      expect(toastMock.toast.error).toHaveBeenCalledWith('Error al cargar pedidos'),
    )
    expect(screen.getByText('No hay pedidos')).toBeInTheDocument()
  })

  it('shows the empty state', async () => {
    apiMock.api.get.mockResolvedValue({ data: { data: [] } })
    renderPage()

    expect(await screen.findByText('No hay pedidos')).toBeInTheDocument()
  })

  it('paginates orders and skips SSE prepends off page 1', async () => {
    let sseCallback: ((event: { action: string; data: unknown }) => void) | undefined
    eventsMock.subscribeOrders.mockImplementation((cb) => {
      sseCallback = cb
      return () => {}
    })
    apiMock.api.get.mockResolvedValue({
      data: { data: orders, pagination: { page: 1, limit: 50, total: 120, totalPages: 3 } },
    })
    renderPage()
    await screen.findByText('#A-001')
    expect(screen.getByText('Página 1 de 3')).toBeInTheDocument()

    apiMock.api.get.mockResolvedValue({
      data: { data: orders, pagination: { page: 2, limit: 50, total: 120, totalPages: 3 } },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }))

    await waitFor(() => expect(apiMock.api.get).toHaveBeenCalledWith('/orders?page=2&limit=50'))

    const newOrder = {
      id: 'o9',
      receiptNumber: 'A-099',
      status: 'pending',
      orderType: 'tienda',
      customerName: 'X',
      customerPhone: '1',
      total: 1,
      deliveryFee: 0,
      items: [],
    }
    await act(async () => {
      sseCallback!({ action: 'order.created', data: newOrder })
    })
    expect(screen.queryByText('#A-099')).not.toBeInTheDocument()
    expect(toastMock.toast.success).toHaveBeenCalledWith('Nuevo pedido A-099')
  })
})
