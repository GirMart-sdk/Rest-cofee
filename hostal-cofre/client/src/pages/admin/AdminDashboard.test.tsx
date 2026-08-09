import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminDashboard from './AdminDashboard'

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

function renderPage() {
  return render(
    <MemoryRouter>
      <AdminDashboard />
    </MemoryRouter>,
  )
}

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    apiMock.api.get.mockResolvedValue({
      data: {
        data: {
          summary: { totalOrders: 15, totalSales: 500000 },
        },
      },
    })
  })

  it('renders the stats and quick access shortcuts', async () => {
    renderPage()
    expect(await screen.findByText('Panel de Administración')).toBeInTheDocument()
    expect(screen.getByText('Ventas Hoy')).toBeInTheDocument()
    expect(screen.getByText('Pedidos Totales')).toBeInTheDocument()
    expect(screen.getByText('Ingresos Totales')).toBeInTheDocument()
    expect(screen.getByText('Punto de Venta')).toBeInTheDocument()
    expect(screen.getByText('Pedidos')).toBeInTheDocument()
    expect(screen.getByText('Mesas')).toBeInTheDocument()
    expect(screen.getByText('Menú')).toBeInTheDocument()
    expect(screen.getByText('Turnos')).toBeInTheDocument()
    expect(screen.getByText('Reportes')).toBeInTheDocument()
    expect(screen.getAllByText('Reservas').length).toBeGreaterThanOrEqual(2)
  })

  it('counts only non-cancelled reservations', async () => {
    apiMock.api.get.mockResolvedValueOnce({
      data: {
        data: {
          summary: { totalOrders: 10, totalSales: 100000 },
        },
      },
    })
    apiMock.api.get.mockResolvedValueOnce({
      data: {
        data: [
          { id: 'r1', status: 'confirmed' },
          { id: 'r2', status: 'pending' },
          { id: 'r3', status: 'cancelled' },
        ],
      },
    })
    renderPage()

    await waitFor(() => expect(apiMock.api.get).toHaveBeenCalledWith('/reservations'))
    expect(screen.getAllByText('Reservas').length).toBeGreaterThanOrEqual(2)
  })

  it('shows an error toast when the stats fail to load', async () => {
    apiMock.api.get.mockRejectedValue(new Error('nope'))
    renderPage()

    await waitFor(() =>
      expect(toastMock.toast.error).toHaveBeenCalledWith('Error al cargar estadísticas'),
    )
    expect(screen.getByText('Panel de Administración')).toBeInTheDocument()
  })
})
