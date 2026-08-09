import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AdminReports from './AdminReports'

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

const report = {
  date: '2026-08-08',
  summary: {
    totalSales: 150000,
    totalOrders: 12,
    cashSales: 80000,
    digitalSales: 70000,
    deliveryOrders: 5,
    dineInOrders: 4,
    posOrders: 3,
    averageTicket: 12500,
  },
  topItems: [{ name: 'Pizza Margarita', count: 3, revenue: 90000 }],
  hourlySales: [
    { hour: 12, sales: 40000 },
    { hour: 13, sales: 60000 },
  ],
  shifts: [
    {
      id: 's1',
      cashier: 'Ana',
      shiftPeriod: 'manana',
      openingCash: 0,
      totalSales: 90000,
      totalOrders: 8,
      cashReceived: 40000,
      digitalTotal: 50000,
      status: 'open',
      openedAt: new Date().toISOString(),
    },
  ],
}

function renderPage() {
  return render(<AdminReports />)
}

describe('AdminReports', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    apiMock.api.get.mockResolvedValue({ data: { data: report } })
  })

  it('renders the daily report sections', async () => {
    renderPage()
    expect(await screen.findByText('Ventas Totales')).toBeInTheDocument()
    expect(screen.getByText('Pedidos Totales')).toBeInTheDocument()
    expect(screen.getByText('Ticket Promedio')).toBeInTheDocument()
    expect(screen.getAllByText('Efectivo').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('Top 10 Platos Más Vendidos')).toBeInTheDocument()
    expect(screen.getByText('Pizza Margarita')).toBeInTheDocument()
    expect(screen.getByText('Ventas por Hora')).toBeInTheDocument()
    expect(screen.getByText('Turnos del Día')).toBeInTheDocument()
    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('Abierto')).toBeInTheDocument()
    expect(screen.getAllByText('Digital').length).toBeGreaterThanOrEqual(2)
  })

  it('refetches the report when the date changes', async () => {
    renderPage()
    await screen.findByText('Ventas Totales')

    const today = new Date().toISOString().split('T')[0]
    const input = screen.getByDisplayValue(today) as HTMLInputElement
    fireEvent.change(input, { target: { value: '2026-08-07' } })

    await waitFor(() =>
      expect(apiMock.api.get).toHaveBeenLastCalledWith('/reports/daily', {
        params: { date: '2026-08-07' },
      }),
    )
  })

  it('hides the optional sections when there is no data', async () => {
    apiMock.api.get.mockResolvedValue({
      data: {
        data: {
          date: '2026-08-08',
          summary: {
            totalSales: 0,
            totalOrders: 0,
            cashSales: 0,
            digitalSales: 0,
            deliveryOrders: 0,
            dineInOrders: 0,
            posOrders: 0,
            averageTicket: 0,
          },
          topItems: [],
          hourlySales: [],
          shifts: [],
        },
      },
    })
    renderPage()

    await screen.findByText('Ventas Totales')
    expect(screen.queryByText('Top 10 Platos Más Vendidos')).not.toBeInTheDocument()
    expect(screen.queryByText('Ventas por Hora')).not.toBeInTheDocument()
    expect(screen.queryByText('Turnos del Día')).not.toBeInTheDocument()
  })

  it('shows the empty state when there is no report for the date', async () => {
    apiMock.api.get.mockResolvedValue({ data: { data: null } })
    renderPage()

    expect(await screen.findByText('No hay datos para esta fecha')).toBeInTheDocument()
  })

  it('shows an error toast when the report fails to load', async () => {
    apiMock.api.get.mockRejectedValue(new Error('nope'))
    renderPage()

    await waitFor(() =>
      expect(toastMock.toast.error).toHaveBeenCalledWith('Error al cargar reporte'),
    )
  })
})
