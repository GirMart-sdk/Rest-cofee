import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import AdminTables from './AdminTables'

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

const tables = [
  {
    id: 't1',
    number: 1,
    capacity: 4,
    zone: 'interior',
    isOccupied: true,
    totalPending: 20000,
    orders: [
      { id: 'abc12345', total: 20000, items: [{ quantity: 2, menuItem: { name: 'Pizza' } }] },
    ],
  },
  { id: 't2', number: 2, capacity: 6, zone: 'exterior' },
]

function renderPage() {
  return render(<AdminTables />)
}

describe('AdminTables', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    apiMock.api.get.mockResolvedValue({ data: { data: tables } })
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } })
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  it('renders the table cards with their details', async () => {
    renderPage()

    expect(await screen.findByText('Mesa #1')).toBeInTheDocument()
    expect(screen.getByText('Mesa #2')).toBeInTheDocument()
    expect(screen.getByText('4 personas')).toBeInTheDocument()
    expect(screen.getByText('6 personas')).toBeInTheDocument()
    expect(screen.getByText('$20.000 pendiente')).toBeInTheDocument()
  })

  it('shows a loading message while fetching', () => {
    apiMock.api.get.mockReturnValue(new Promise(() => {}))
    renderPage()

    expect(screen.getByText('Cargando mesas...')).toBeInTheDocument()
  })

  it('shows an error toast when loading fails', async () => {
    apiMock.api.get.mockRejectedValue(new Error('nope'))
    renderPage()

    await waitFor(() => expect(toastMock.toast.error).toHaveBeenCalledWith('Error al cargar mesas'))
  })

  it('creates a new table', async () => {
    apiMock.api.post.mockResolvedValue({ data: { data: {} } })
    renderPage()
    await screen.findByText('Mesa #1')

    fireEvent.click(screen.getAllByRole('button', { name: 'Agregar Mesa' })[0])
    expect(screen.getByText('Nueva Mesa')).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('Ej: 8'), { target: { value: '8' } })
    fireEvent.change(screen.getByPlaceholderText('Ej: 4'), { target: { value: '4' } })
    fireEvent.click(screen.getByRole('button', { name: 'Exterior' }))
    fireEvent.click(screen.getByRole('button', { name: 'Crear Mesa' }))

    await waitFor(() =>
      expect(apiMock.api.post).toHaveBeenCalledWith('/tables', {
        number: 8,
        capacity: 4,
        zone: 'exterior',
      }),
    )
    expect(toastMock.toast.success).toHaveBeenCalledWith('Mesa creada')
  })

  it('validates the create form', async () => {
    renderPage()
    await screen.findByText('Mesa #1')

    fireEvent.click(screen.getAllByRole('button', { name: 'Agregar Mesa' })[0])
    fireEvent.click(screen.getByRole('button', { name: 'Crear Mesa' }))

    await waitFor(() =>
      expect(toastMock.toast.error).toHaveBeenCalledWith('Número y capacidad son requeridos'),
    )
    expect(apiMock.api.post).not.toHaveBeenCalled()
  })

  it('shows the table detail modal with QR code and copies the link', async () => {
    renderPage()
    await screen.findByText('Mesa #1')

    fireEvent.click(screen.getByText('Mesa #1'))
    expect(screen.getByText('Ocupada')).toBeInTheDocument()
    expect(screen.getByText('Pedidos Activos:')).toBeInTheDocument()
    expect(screen.getByText('Escanea este QR para ordenar desde la mesa')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Copiar enlace' }))

    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        `${window.location.origin}/mesa?t=1`,
      ),
    )
    expect(toastMock.toast.success).toHaveBeenCalledWith('Enlace copiado')
  })

  it('shows a free table with Libre state', async () => {
    renderPage()
    await screen.findByText('Mesa #2')

    fireEvent.click(screen.getByText('Mesa #2'))
    expect(screen.getByText('Libre')).toBeInTheDocument()
  })

  it('edits an existing table', async () => {
    apiMock.api.put.mockResolvedValue({ data: { data: {} } })
    renderPage()
    await screen.findByText('Mesa #1')

    fireEvent.click(screen.getByText('Mesa #1'))
    fireEvent.click(screen.getByRole('button', { name: 'Editar' }))

    expect(screen.getByText('Editar Mesa')).toBeInTheDocument()
    expect((screen.getByPlaceholderText('Ej: 4') as HTMLInputElement).value).toBe('4')

    fireEvent.change(screen.getByPlaceholderText('Ej: 4'), { target: { value: '5' } })
    const modal = screen.getByText('Editar Mesa').closest('.modal-overlay') as HTMLElement
    fireEvent.click(within(modal).getByRole('button', { name: 'Actualizar' }))

    await waitFor(() =>
      expect(apiMock.api.put).toHaveBeenCalledWith('/tables/t1', {
        number: 1,
        capacity: 5,
        zone: 'interior',
      }),
    )
    expect(toastMock.toast.success).toHaveBeenCalledWith('Mesa actualizada')
  })

  it('deletes a table after confirmation', async () => {
    apiMock.api.delete.mockResolvedValue({ data: { data: {} } })
    renderPage()
    await screen.findByText('Mesa #1')

    const card = document.querySelector('.bg-white.rounded-2xl') as HTMLElement
    const buttons = within(card).getAllByRole('button')
    fireEvent.click(buttons[buttons.length - 1])

    await waitFor(() => expect(apiMock.api.delete).toHaveBeenCalledWith('/tables/t1'))
    expect(toastMock.toast.success).toHaveBeenCalledWith('Mesa eliminada')
  })

  it('does not delete when confirmation is cancelled', async () => {
    vi.mocked(window.confirm).mockReturnValue(false)
    renderPage()
    await screen.findByText('Mesa #1')

    const card = document.querySelector('.bg-white.rounded-2xl') as HTMLElement
    const buttons = within(card).getAllByRole('button')
    fireEvent.click(buttons[buttons.length - 1])

    expect(apiMock.api.delete).not.toHaveBeenCalled()
  })

  it('shows an error toast when saving a table fails', async () => {
    apiMock.api.post.mockRejectedValue(new Error('nope'))
    renderPage()
    await screen.findByText('Mesa #1')

    fireEvent.click(screen.getAllByRole('button', { name: 'Agregar Mesa' })[0])
    fireEvent.change(screen.getByPlaceholderText('Ej: 8'), { target: { value: '8' } })
    fireEvent.change(screen.getByPlaceholderText('Ej: 4'), { target: { value: '4' } })
    fireEvent.click(screen.getByRole('button', { name: 'Crear Mesa' }))

    await waitFor(() => expect(toastMock.toast.error).toHaveBeenCalledWith('Error al guardar mesa'))
  })

  it('shows an error toast when deleting a table fails', async () => {
    apiMock.api.delete.mockRejectedValue(new Error('nope'))
    renderPage()
    await screen.findByText('Mesa #1')

    const card = document.querySelector('.bg-white.rounded-2xl') as HTMLElement
    const buttons = within(card).getAllByRole('button')
    fireEvent.click(buttons[buttons.length - 1])

    await waitFor(() =>
      expect(toastMock.toast.error).toHaveBeenCalledWith('No se puede eliminar esta mesa'),
    )
  })
})
