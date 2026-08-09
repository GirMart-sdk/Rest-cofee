import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ReservationForm from './ReservationForm'

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

vi.mock('../../services/api', () => ({ api: apiMock.api, whatsappService: waMock.whatsappService }))

const toastMock = vi.hoisted(() => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('react-hot-toast', () => ({ __esModule: true, default: toastMock.toast }))

const authMock = vi.hoisted(() => ({
  useAuth: { user: { id: 'u1', name: 'Ana', email: 'ana@x.com', role: 'client' as const } },
}))

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: authMock.useAuth.user }),
}))

const tables = [
  { id: 't1', number: 1, capacity: 2, zone: 'interior' },
  { id: 't2', number: 2, capacity: 6, zone: 'exterior' },
]

function renderForm() {
  return render(
    <MemoryRouter>
      <ReservationForm />
    </MemoryRouter>,
  )
}

function fillRequiredFields(container: HTMLElement) {
  fireEvent.change(screen.getByPlaceholderText('Tu nombre'), { target: { value: 'Ana' } })
  fireEvent.change(screen.getByPlaceholderText('Tu teléfono'), { target: { value: '3001234567' } })
  fireEvent.change(container.querySelector('input[type="date"]') as HTMLInputElement, {
    target: { value: '2026-08-20' },
  })
  fireEvent.change(screen.getByRole('combobox'), { target: { value: '19:00' } })
}

describe('ReservationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    apiMock.api.get.mockResolvedValue({ data: { data: tables } })
  })

  it('prefills name and email from the logged in user', async () => {
    const { container } = renderForm()

    expect((screen.getByPlaceholderText('Tu nombre') as HTMLInputElement).value).toBe('Ana')
    expect((screen.getByPlaceholderText('Tu email') as HTMLInputElement).value).toBe('ana@x.com')
    expect(container.querySelector('input[type="date"]')).toBeInTheDocument()
  })

  it('validates required fields before selecting a table', async () => {
    renderForm()

    fireEvent.click(screen.getByRole('button', { name: 'Seleccionar Mesa' }))
    expect(toastMock.toast.error).toHaveBeenCalledWith('Completa nombre, teléfono, fecha y hora')
    expect(screen.queryByText('Elige tu Mesa')).not.toBeInTheDocument()
  })

  it('filters available tables by party size', async () => {
    const { container } = renderForm()

    fireEvent.click(screen.getByRole('button', { name: '+' }))
    expect(screen.getByText('3')).toBeInTheDocument()

    fillRequiredFields(container)
    fireEvent.click(screen.getByRole('button', { name: 'Seleccionar Mesa' }))

    expect(await screen.findByText('Elige tu Mesa')).toBeInTheDocument()
    expect(screen.getByText('Mesa 2')).toBeInTheDocument()
    expect(screen.queryByText('Mesa 1')).not.toBeInTheDocument()
    expect(screen.getByText(/Mesa para 3 personas/)).toBeInTheDocument()
  })

  it('shows a message when no table fits the party size', async () => {
    const { container } = renderForm()

    for (let i = 0; i < 7; i++) fireEvent.click(screen.getByRole('button', { name: '+' }))
    expect(screen.getByText('9')).toBeInTheDocument()

    fillRequiredFields(container)
    fireEvent.click(screen.getByRole('button', { name: 'Seleccionar Mesa' }))

    expect(await screen.findByText(/No hay mesas disponibles para 9 personas/)).toBeInTheDocument()
  })

  it('requires selecting a table before confirming', async () => {
    const { container } = renderForm()
    fillRequiredFields(container)
    fireEvent.click(screen.getByRole('button', { name: 'Seleccionar Mesa' }))
    await screen.findByText('Elige tu Mesa')

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Reserva' }))
    expect(toastMock.toast.error).toHaveBeenCalledWith('Selecciona una mesa')
    expect(screen.queryByText('Resumen de tu Reserva')).not.toBeInTheDocument()
  })

  it('completes a reservation and sends it by WhatsApp', async () => {
    apiMock.api.post.mockResolvedValue({ data: { data: {} } })
    const { container } = renderForm()

    fireEvent.change(screen.getByPlaceholderText('Tu nombre'), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByPlaceholderText('Tu teléfono'), {
      target: { value: '3001234567' },
    })
    fireEvent.change(container.querySelector('input[type="date"]') as HTMLInputElement, {
      target: { value: '2026-08-20' },
    })
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '19:00' } })
    fireEvent.change(screen.getByPlaceholderText('Alergias, celebraciones, preferencias...'), {
      target: { value: 'Ventana' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Seleccionar Mesa' }))

    await screen.findByText('Elige tu Mesa')
    fireEvent.click(screen.getByText('Mesa 2'))
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Reserva' }))

    expect(screen.getByText('Resumen de tu Reserva')).toBeInTheDocument()
    expect(screen.getByText('#2')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Enviar por WhatsApp' }))

    await waitFor(() =>
      expect(apiMock.api.post).toHaveBeenCalledWith('/reservations', {
        name: 'Ana',
        phone: '3001234567',
        email: 'ana@x.com',
        date: '2026-08-20',
        time: '19:00',
        guests: 2,
        tableId: 't2',
        notes: 'Ventana',
      }),
    )
    expect(waMock.whatsappService.sendReservation).toHaveBeenCalledWith(
      '573001234567',
      expect.stringContaining('Mesa: #2 (exterior)'),
    )
    expect(toastMock.toast.success).toHaveBeenCalledWith('¡Reserva creada y enviada por WhatsApp!')

    await waitFor(() =>
      expect((screen.getByPlaceholderText('Tu nombre') as HTMLInputElement).value).toBe(''),
    )
  })

  it('shows an error toast when creating the reservation fails', async () => {
    apiMock.api.post.mockRejectedValue(new Error('nope'))
    const { container } = renderForm()

    fillRequiredFields(container)
    fireEvent.click(screen.getByRole('button', { name: 'Seleccionar Mesa' }))
    await screen.findByText('Elige tu Mesa')
    fireEvent.click(screen.getByText('Mesa 1'))
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Reserva' }))
    fireEvent.click(screen.getByRole('button', { name: 'Enviar por WhatsApp' }))

    await waitFor(() =>
      expect(toastMock.toast.error).toHaveBeenCalledWith('Error al crear reserva'),
    )
  })

  it('navigates back to the form with the Volver buttons', async () => {
    const { container } = renderForm()
    fillRequiredFields(container)
    fireEvent.click(screen.getByRole('button', { name: 'Seleccionar Mesa' }))
    await screen.findByText('Elige tu Mesa')

    fireEvent.click(screen.getByRole('button', { name: 'Volver' }))
    expect(screen.getByText('Seleccionar Mesa')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Seleccionar Mesa' }))
    await screen.findByText('Elige tu Mesa')
    fireEvent.click(screen.getByText('Mesa 1'))
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Reserva' }))
    fireEvent.click(screen.getByRole('button', { name: 'Volver' }))
    expect(screen.getByText('Elige tu Mesa')).toBeInTheDocument()
  })
})
