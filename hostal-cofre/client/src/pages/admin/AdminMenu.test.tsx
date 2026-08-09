import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import AdminMenu from './AdminMenu'

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
    id: 'm1',
    name: 'Pizza Margarita',
    description: 'Clásica',
    price: 28000,
    category: 'pizza',
    image: 'https://example.com/m1.png',
    available: true,
  },
  {
    id: 'm2',
    name: 'Pasta Carbonara',
    description: 'Crema',
    price: 24000,
    category: 'pasta',
    image: 'https://example.com/m2.png',
    available: false,
  },
]

function renderPage() {
  return render(<AdminMenu />)
}

describe('AdminMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    apiMock.api.get.mockResolvedValue({ data: { data: items } })
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  it('renders the menu items with their availability', async () => {
    renderPage()
    expect(await screen.findByText('Pizza Margarita')).toBeInTheDocument()
    expect(screen.getByText('Disponible')).toBeInTheDocument()
    expect(screen.getByText('Agotado')).toBeInTheDocument()
  })

  it('requires name and price before saving', async () => {
    renderPage()
    await screen.findByText('Pizza Margarita')

    fireEvent.click(screen.getByRole('button', { name: /Nuevo Platillo/ }))
    fireEvent.click(screen.getByRole('button', { name: /Guardar/ }))

    expect(toastMock.toast.error).toHaveBeenCalledWith('Nombre y precio requeridos')
    expect(apiMock.api.post).not.toHaveBeenCalled()
  })

  it('creates a new platillo', async () => {
    const created = { ...items[0], id: 'm3', name: 'Nueva Pizza', price: 30000 }
    apiMock.api.post.mockResolvedValue({ data: { data: created } })
    renderPage()
    await screen.findByText('Pizza Margarita')

    fireEvent.click(screen.getByRole('button', { name: /Nuevo Platillo/ }))
    fireEvent.change(screen.getByPlaceholderText('Nombre *'), { target: { value: 'Nueva Pizza' } })
    fireEvent.change(screen.getByPlaceholderText('Precio *'), { target: { value: '30000' } })
    fireEvent.click(screen.getByRole('button', { name: /Guardar/ }))

    await waitFor(() =>
      expect(apiMock.api.post).toHaveBeenCalledWith('/menu', {
        name: 'Nueva Pizza',
        description: '',
        price: 30000,
        category: 'pasta',
        image: '',
      }),
    )
    expect(toastMock.toast.success).toHaveBeenCalledWith('Platillo agregado')
    expect(await screen.findByText('Nueva Pizza')).toBeInTheDocument()
  })

  it('edits an existing platillo', async () => {
    apiMock.api.put.mockResolvedValue({
      data: { data: { ...items[0], name: 'Pizza Editada' } },
    })
    renderPage()
    await screen.findByText('Pizza Margarita')

    const card = screen.getByText('Pizza Margarita').closest('div')!
    fireEvent.click(within(card).getByRole('button', { name: /Editar/ }))
    fireEvent.change(screen.getByPlaceholderText('Nombre *'), {
      target: { value: 'Pizza Editada' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Guardar/ }))

    await waitFor(() =>
      expect(apiMock.api.put).toHaveBeenCalledWith(
        '/menu/m1',
        expect.objectContaining({ name: 'Pizza Editada' }),
      ),
    )
    expect(toastMock.toast.success).toHaveBeenCalledWith('Platillo actualizado')
  })

  it('toggles availability', async () => {
    apiMock.api.put.mockResolvedValue({
      data: { data: { ...items[0], available: false } },
    })
    renderPage()
    await screen.findByText('Pizza Margarita')

    const card = screen.getByText('Pizza Margarita').closest('div')!
    fireEvent.click(within(card).getByRole('button', { name: /Agotar/ }))

    await waitFor(() =>
      expect(apiMock.api.put).toHaveBeenCalledWith('/menu/m1', { available: false }),
    )
    expect(toastMock.toast.success).toHaveBeenCalledWith('Marcado como agotado')
  })

  it('deletes a platillo after confirmation', async () => {
    apiMock.api.delete.mockResolvedValue({ data: { data: {} } })
    renderPage()
    await screen.findByText('Pizza Margarita')

    const card = screen.getByText('Pizza Margarita').closest('div')!
    const buttons = within(card).getAllByRole('button')
    fireEvent.click(buttons[2])

    await waitFor(() => expect(apiMock.api.delete).toHaveBeenCalledWith('/menu/m1'))
    expect(toastMock.toast.success).toHaveBeenCalledWith('Platillo eliminado')
    await waitFor(() => expect(screen.queryByText('Pizza Margarita')).not.toBeInTheDocument())
  })

  it('does not delete when the confirmation is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    renderPage()
    await screen.findByText('Pizza Margarita')

    const card = screen.getByText('Pizza Margarita').closest('div')!
    const buttons = within(card).getAllByRole('button')
    fireEvent.click(buttons[2])

    expect(apiMock.api.delete).not.toHaveBeenCalled()
  })

  it('shows an error toast when saving fails', async () => {
    apiMock.api.post.mockRejectedValue(new Error('nope'))
    renderPage()
    await screen.findByText('Pizza Margarita')

    fireEvent.click(screen.getByRole('button', { name: /Nuevo Platillo/ }))
    fireEvent.change(screen.getByPlaceholderText('Nombre *'), { target: { value: 'X' } })
    fireEvent.change(screen.getByPlaceholderText('Precio *'), { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: /Guardar/ }))

    await waitFor(() => expect(toastMock.toast.error).toHaveBeenCalledWith('Error al guardar'))
  })

  it('shows an error toast when the menu fails to load', async () => {
    apiMock.api.get.mockRejectedValue(new Error('nope'))
    renderPage()

    await waitFor(() => expect(toastMock.toast.error).toHaveBeenCalledWith('Error al cargar menú'))
  })

  it('shows the empty state', async () => {
    apiMock.api.get.mockResolvedValue({ data: { data: [] } })
    renderPage()

    expect(await screen.findByText('No hay platillos en el menú')).toBeInTheDocument()
  })
})
