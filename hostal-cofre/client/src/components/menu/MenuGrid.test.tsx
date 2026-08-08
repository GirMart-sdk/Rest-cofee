import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import MenuGrid from './MenuGrid'
import { CartProvider } from '../../context/CartContext'

vi.mock('../../services/api', () => ({
  api: {
    get: vi.fn().mockResolvedValue({
      data: {
        data: [
          {
            id: 'm1',
            name: 'Pizza Margarita',
            description: 'Clásica con tomate y albahaca',
            price: 28000,
            category: 'pizza',
            image: 'https://example.com/margarita.png',
            available: true,
          },
          {
            id: 'm2',
            name: 'Pasta Carbonara',
            description: 'Crema, panceta y parmesano',
            price: 24000,
            category: 'pasta',
            image: 'https://example.com/carbonara.png',
            available: true,
          },
        ],
      },
    }),
    post: vi.fn(),
  },
}))

function renderGrid() {
  return render(
    <CartProvider>
      <MenuGrid />
    </CartProvider>,
  )
}

beforeEach(() => {
  localStorage.clear()
})

describe('MenuGrid', () => {
  it('renders the menu items after loading', async () => {
    renderGrid()
    expect(await screen.findByText('Pizza Margarita')).toBeInTheDocument()
    expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument()
  })

  it('shows all categories and filters by one', async () => {
    renderGrid()
    await screen.findByText('Pizza Margarita')

    expect(screen.getByText('Todos')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Pastas'))
    await waitFor(() => expect(screen.queryByText('Pizza Margarita')).not.toBeInTheDocument())
    expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument()
  })

  it('adds an item to the cart', async () => {
    renderGrid()
    const addButtons = await screen.findAllByText('Añadir')
    fireEvent.click(addButtons[0])

    await waitFor(() => expect(screen.getByText('Añadido')).toBeInTheDocument())
    const saved = JSON.parse(localStorage.getItem('hostal-cofee-cart') || '[]')
    expect(saved).toHaveLength(1)
    expect(saved[0].menuItem.name).toBe('Pizza Margarita')
  })
})
