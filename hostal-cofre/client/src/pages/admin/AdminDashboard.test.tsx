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

const dailyReport = {
  data: { data: { summary: { totalOrders: 15, totalSales: 500000 } } },
}

const weeklyReport = {
  data: { data: { totalSales: 2500000, totalOrders: 80, dailyBreakdown: [] } },
}

const reservations = {
  data: { data: [{ id: 'r1', status: 'confirmed' }] },
}

const metricsData = {
  startedAt: new Date().toISOString(),
  uptimeSeconds: 3661,
  totalRequests: 1200,
  requestsByMethod: { GET: 800, POST: 400 },
  requestsByRoute: {},
  statusCodes: { '200': 1100, '500': 5 },
  totalErrors: 5,
  authLogins: 42,
  authFailedLogins: 7,
  ordersCreated: 30,
  ordersCancelled: 2,
  paymentsInitiated: 10,
  paymentsFailed: 1,
  paymentsWebhookRejected: 0,
  paymentsWebhookProcessed: 9,
  paymentsAmountMismatch: 0,
  whatsappSent: 25,
  whatsappFailed: 1,
  whatsappSkipped: 0,
}

function mockGet(url?: string) {
  if (url === '/reports/daily') return Promise.resolve(dailyReport)
  if (url === '/reports/weekly') return Promise.resolve(weeklyReport)
  if (url === '/health') return Promise.resolve({ data: { status: 'ok' } })
  if (url === '/metrics') return Promise.resolve({ data: { data: metricsData } })
  return Promise.resolve(reservations)
}

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
    apiMock.api.get.mockImplementation(mockGet)
  })

  it('renders the stats and quick access shortcuts', async () => {
    renderPage()
    expect(await screen.findByText('Panel de Administración')).toBeInTheDocument()
    expect(screen.getByText('Ventas Hoy')).toBeInTheDocument()
    expect(screen.getByText('Pedidos Hoy')).toBeInTheDocument()
    expect(screen.getByText('Ventas Semana')).toBeInTheDocument()
    expect(screen.getByText('Punto de Venta')).toBeInTheDocument()
    expect(screen.getByText('Pedidos')).toBeInTheDocument()
    expect(screen.getByText('Mesas')).toBeInTheDocument()
    expect(screen.getByText('Menú')).toBeInTheDocument()
    expect(screen.getByText('Turnos')).toBeInTheDocument()
    expect(screen.getByText('Reportes')).toBeInTheDocument()
    expect(screen.getAllByText('Reservas').length).toBeGreaterThanOrEqual(2)
  })

  it('counts only non-cancelled reservations', async () => {
    apiMock.api.get.mockImplementation((url?: string) => {
      if (url === '/reports/daily') return Promise.resolve(dailyReport)
      if (url === '/reports/weekly') return Promise.resolve(weeklyReport)
      return Promise.resolve({
        data: {
          data: [
            { id: 'r1', status: 'confirmed' },
            { id: 'r2', status: 'pending' },
            { id: 'r3', status: 'cancelled' },
          ],
        },
      })
    })
    renderPage()

    await waitFor(() => expect(apiMock.api.get).toHaveBeenCalledWith('/reservations'))
    expect(screen.getAllByText('Reservas').length).toBeGreaterThanOrEqual(2)
  })

  it('renders the server health and metrics section', async () => {
    renderPage()
    expect(await screen.findByText('Estado del Servidor')).toBeInTheDocument()
    expect(screen.getByText('Saludable')).toBeInTheDocument()
    expect(screen.getByText('Tiempo activo')).toBeInTheDocument()
    expect(screen.getByText('1h 1m')).toBeInTheDocument()
    expect(screen.getByText('Peticiones')).toBeInTheDocument()
    expect(screen.getByText('Logins (exitosos/fallidos)')).toBeInTheDocument()
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
