import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AdminShifts from './AdminShifts'

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

const openShift = {
  id: 's1',
  userId: 'u1',
  cashierName: 'Ana',
  shiftPeriod: 'manana',
  openingCash: 100000,
  totalSales: 50000,
  totalOrders: 8,
  cashReceived: 150000,
  digitalTotal: 20000,
  status: 'open',
  openedAt: '2026-08-16T08:00:00.000Z',
}

const closedShift = {
  id: 's2',
  userId: 'u2',
  cashierName: 'Luis',
  shiftPeriod: 'tarde',
  openingCash: 50000,
  closingCash: 60000,
  totalSales: 80000,
  totalOrders: 12,
  cashReceived: 40000,
  digitalTotal: 40000,
  status: 'closed',
  openedAt: '2026-08-15T16:00:00.000Z',
  closedAt: '2026-08-15T20:00:00.000Z',
}

function renderPage() {
  return render(<AdminShifts />)
}

describe('AdminShifts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    apiMock.api.get.mockImplementation((url: string) => {
      if (url === '/shifts/current') return Promise.resolve({ data: { data: [openShift] } })
      return Promise.resolve({ data: { data: [closedShift, openShift] } })
    })
  })

  it('renders active and closed shifts', async () => {
    renderPage()

    expect(await screen.findByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('Turnos Activos (1)')).toBeInTheDocument()
    expect(screen.getByText('Mañana')).toBeInTheDocument()
    expect(screen.getByText('Luis')).toBeInTheDocument()
    expect(screen.getByText('Tarde')).toBeInTheDocument()
    expect(screen.getByText('$50.000')).toBeInTheDocument()
    expect(screen.getByText('$80.000')).toBeInTheDocument()
  })

  it('shows the empty states when there are no shifts', async () => {
    apiMock.api.get.mockResolvedValue({ data: { data: [] } })
    renderPage()

    expect(await screen.findByText('No hay turnos abiertos')).toBeInTheDocument()
    expect(screen.getByText('No hay turnos cerrados')).toBeInTheDocument()
  })

  it('shows an error toast when loading fails', async () => {
    apiMock.api.get.mockRejectedValue(new Error('nope'))
    renderPage()

    await waitFor(() =>
      expect(toastMock.toast.error).toHaveBeenCalledWith('Error al cargar turnos'),
    )
  })

  it('opens a shift', async () => {
    apiMock.api.post.mockResolvedValue({ data: { data: {} } })
    renderPage()
    await screen.findByText('Ana')

    fireEvent.click(screen.getByRole('button', { name: 'Abrir Turno' }))
    expect(screen.getByPlaceholderText('Ej: María López')).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('Ej: María López'), { target: { value: 'María' } })
    fireEvent.change(screen.getByPlaceholderText('Observaciones del turno...'), {
      target: { value: 'Apertura' },
    })
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '100000' } })
    fireEvent.click(screen.getByRole('button', { name: /Tarde/ }))

    const openButtons = screen.getAllByRole('button', { name: 'Abrir Turno' })
    fireEvent.click(openButtons[openButtons.length - 1])

    await waitFor(() =>
      expect(apiMock.api.post).toHaveBeenCalledWith('/shifts/open', {
        cashierName: 'María',
        shiftPeriod: 'tarde',
        openingCash: 100000,
        notes: 'Apertura',
      }),
    )
    expect(toastMock.toast.success).toHaveBeenCalledWith('Turno abierto para María')
  })

  it('validates the open shift form', async () => {
    renderPage()
    await screen.findByText('Ana')

    fireEvent.click(screen.getByRole('button', { name: 'Abrir Turno' }))
    const openButtons = screen.getAllByRole('button', { name: 'Abrir Turno' })
    fireEvent.click(openButtons[openButtons.length - 1])

    await waitFor(() =>
      expect(toastMock.toast.error).toHaveBeenCalledWith(
        'Nombre y efectivo inicial son requeridos',
      ),
    )
    expect(apiMock.api.post).not.toHaveBeenCalled()
  })

  it('closes a shift', async () => {
    apiMock.api.patch.mockResolvedValue({ data: { data: {} } })
    renderPage()
    await screen.findByText('Ana')

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }))
    expect(screen.getByPlaceholderText('Observaciones del cierre...')).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('Observaciones del cierre...'), {
      target: { value: 'Cierre' },
    })
    fireEvent.change(screen.getAllByPlaceholderText('0')[0], { target: { value: '300000' } })

    expect(screen.getByText(/Diferencia:/)).toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: 'Cerrar Turno' })[0])

    await waitFor(() =>
      expect(apiMock.api.patch).toHaveBeenCalledWith('/shifts/s1/close', {
        closingCash: 300000,
        notes: 'Cierre',
      }),
    )
    expect(toastMock.toast.success).toHaveBeenCalledWith('Turno de Ana cerrado')
  })

  it('shows an error toast when closing a shift fails', async () => {
    apiMock.api.patch.mockRejectedValue(new Error('nope'))
    renderPage()
    await screen.findByText('Ana')

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }))
    fireEvent.change(screen.getAllByPlaceholderText('0')[0], { target: { value: '300000' } })
    fireEvent.click(screen.getAllByRole('button', { name: 'Cerrar Turno' })[0])

    await waitFor(() => expect(toastMock.toast.error).toHaveBeenCalledWith('Error al cerrar turno'))
  })
})
