import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import AdminReservations from './AdminReservations'

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

const reservations = [
  {
    id: 'r1',
    name: 'Ana',
    phone: '300',
    date: '2026-08-10',
    time: '19:00',
    guests: 2,
    status: 'pending',
  },
  {
    id: 'r2',
    name: 'Luis',
    phone: '301',
    date: '2026-08-11',
    time: '20:00',
    guests: 4,
    status: 'confirmed',
  },
  {
    id: 'r3',
    name: 'Rosa',
    phone: '302',
    date: '2026-08-12',
    time: '13:00',
    guests: 1,
    status: 'cancelled',
  },
]

function renderPage() {
  return render(<AdminReservations />)
}

describe('AdminReservations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    apiMock.api.get.mockResolvedValue({ data: { data: reservations } })
  })

  it('renders the reservations table', async () => {
    renderPage()
    expect(await screen.findByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('Luis')).toBeInTheDocument()
    expect(screen.getByText('Rosa')).toBeInTheDocument()
    expect(screen.getByText('Pendiente')).toBeInTheDocument()
    expect(screen.getByText('Confirmada')).toBeInTheDocument()
    expect(screen.getByText('Cancelada')).toBeInTheDocument()
    expect(screen.getAllByText('2026-08-10').length).toBeGreaterThan(0)
  })

  it('filters reservations by status', async () => {
    renderPage()
    await screen.findByText('Ana')

    fireEvent.click(screen.getByRole('button', { name: /Confirmada/ }))
    expect(screen.queryByText('Ana')).not.toBeInTheDocument()
    expect(screen.getByText('Luis')).toBeInTheDocument()
  })

  it('confirms a pending reservation', async () => {
    apiMock.api.patch.mockResolvedValue({ data: { data: {} } })
    renderPage()
    await screen.findByText('Ana')

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }))

    await waitFor(() =>
      expect(apiMock.api.patch).toHaveBeenCalledWith('/reservations/r1/status', {
        status: 'confirmed',
      }),
    )
    expect(toastMock.toast.success).toHaveBeenCalledWith('Reserva confirmada')
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'Confirmar' })).not.toBeInTheDocument(),
    )
  })

  it('cancels a reservation', async () => {
    apiMock.api.patch.mockResolvedValue({ data: { data: {} } })
    renderPage()
    await screen.findByText('Luis')

    const row = screen.getByText('Luis').closest('tr')!
    fireEvent.click(within(row).getByRole('button', { name: 'Cancelar' }))

    await waitFor(() =>
      expect(apiMock.api.patch).toHaveBeenCalledWith('/reservations/r2/status', {
        status: 'cancelled',
      }),
    )
    expect(toastMock.toast.success).toHaveBeenCalledWith('Reserva cancelada')
  })

  it('shows an error toast when updating fails', async () => {
    apiMock.api.patch.mockRejectedValue(new Error('nope'))
    renderPage()
    await screen.findByText('Ana')

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }))

    await waitFor(() => expect(toastMock.toast.error).toHaveBeenCalledWith('Error al actualizar'))
  })

  it('shows an error toast when reservations fail to load', async () => {
    apiMock.api.get.mockRejectedValue(new Error('nope'))
    renderPage()

    await waitFor(() =>
      expect(toastMock.toast.error).toHaveBeenCalledWith('Error al cargar reservas'),
    )
  })

  it('shows the empty state', async () => {
    apiMock.api.get.mockResolvedValue({ data: { data: [] } })
    renderPage()

    expect(await screen.findByText('No hay reservas')).toBeInTheDocument()
  })

  it('paginates reservations', async () => {
    apiMock.api.get.mockResolvedValue({
      data: {
        data: reservations,
        pagination: { page: 1, limit: 100, total: 230, totalPages: 3 },
      },
    })
    renderPage()
    await screen.findByText('Ana')
    expect(screen.getByText('Página 1 de 3')).toBeInTheDocument()

    apiMock.api.get.mockResolvedValue({
      data: {
        data: reservations,
        pagination: { page: 2, limit: 100, total: 230, totalPages: 3 },
      },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }))

    await waitFor(() =>
      expect(apiMock.api.get).toHaveBeenCalledWith('/reservations?page=2&limit=100'),
    )
  })
})
