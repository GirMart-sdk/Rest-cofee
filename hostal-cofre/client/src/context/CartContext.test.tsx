import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CartProvider, useCart } from './CartContext'
import type { MenuItem } from '../types'

vi.mock('../services/api', () => ({
  api: {
    get: vi.fn().mockResolvedValue({
      data: {
        data: [
          { name: 'centro', label: 'Centro', fee: 3000, estimatedMinutes: 20 },
          { name: 'periurbano', label: 'Periurbano', fee: 5000, estimatedMinutes: 35 },
          { name: 'lejano', label: 'Lejano', fee: 8000, estimatedMinutes: 50 },
        ],
      },
    }),
  },
}))

const CART_KEY = 'hostal-cofee-cart'

const pizza: MenuItem = {
  id: 'item-1',
  name: 'Pizza Margarita',
  description: 'Test pizza',
  price: 25000,
  category: 'pizza',
  image: 'https://example.com/pizza.png',
  available: true,
}

function Probe() {
  const cart = useCart()
  return (
    <div>
      <span data-testid="count">{cart.itemCount}</span>
      <span data-testid="total">{cart.total}</span>
      <span data-testid="grandTotal">{cart.grandTotal}</span>
      <span data-testid="deliveryFee">{cart.deliveryFee}</span>
      <button onClick={() => cart.addItem(pizza)}>add</button>
      <button onClick={() => cart.removeItem(pizza.id)}>remove</button>
      <button onClick={() => cart.updateQuantity(pizza.id, 3)}>set3</button>
      <button onClick={() => cart.clearCart()}>clear</button>
      <button onClick={() => cart.setOrderType('domicilio')}>domicilio</button>
      <button onClick={() => cart.setDeliveryZone('centro')}>zona</button>
    </div>
  )
}

describe('CartContext', () => {
  it('starts empty with zero totals', () => {
    render(
      <CartProvider>
        <Probe />
      </CartProvider>,
    )
    expect(screen.getByTestId('count').textContent).toBe('0')
    expect(screen.getByTestId('total').textContent).toBe('0')
    expect(screen.getByTestId('grandTotal').textContent).toBe('0')
  })

  it('adds an item and persists it to localStorage', () => {
    render(
      <CartProvider>
        <Probe />
      </CartProvider>,
    )
    fireEvent.click(screen.getByText('add'))
    expect(screen.getByTestId('count').textContent).toBe('1')
    expect(screen.getByTestId('total').textContent).toBe('25000')
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    expect(saved).toHaveLength(1)
    expect(saved[0].menuItem.name).toBe('Pizza Margarita')
  })

  it('increments quantity when adding the same item again', () => {
    render(
      <CartProvider>
        <Probe />
      </CartProvider>,
    )
    fireEvent.click(screen.getByText('add'))
    fireEvent.click(screen.getByText('add'))
    expect(screen.getByTestId('count').textContent).toBe('2')
    expect(screen.getByTestId('total').textContent).toBe('50000')
  })

  it('updates quantity via updateQuantity', () => {
    render(
      <CartProvider>
        <Probe />
      </CartProvider>,
    )
    fireEvent.click(screen.getByText('add'))
    fireEvent.click(screen.getByText('set3'))
    expect(screen.getByTestId('count').textContent).toBe('3')
  })

  it('removes an item', () => {
    render(
      <CartProvider>
        <Probe />
      </CartProvider>,
    )
    fireEvent.click(screen.getByText('add'))
    fireEvent.click(screen.getByText('remove'))
    expect(screen.getByTestId('count').textContent).toBe('0')
  })

  it('applies delivery fee for domicilio with a zone', () => {
    render(
      <CartProvider>
        <Probe />
      </CartProvider>,
    )
    fireEvent.click(screen.getByText('add'))
    fireEvent.click(screen.getByText('domicilio'))
    fireEvent.click(screen.getByText('zona'))
    expect(screen.getByTestId('deliveryFee').textContent).toBe('3000')
    expect(screen.getByTestId('grandTotal').textContent).toBe('28000')
  })

  it('clears the cart and removes persisted state', () => {
    render(
      <CartProvider>
        <Probe />
      </CartProvider>,
    )
    fireEvent.click(screen.getByText('add'))
    fireEvent.click(screen.getByText('clear'))
    expect(screen.getByTestId('count').textContent).toBe('0')
    expect(localStorage.getItem(CART_KEY)).toBe('[]')
  })

  it('restores the cart from localStorage on mount', () => {
    localStorage.setItem(CART_KEY, JSON.stringify([{ menuItem: pizza, quantity: 2 }]))
    render(
      <CartProvider>
        <Probe />
      </CartProvider>,
    )
    expect(screen.getByTestId('count').textContent).toBe('2')
    expect(screen.getByTestId('total').textContent).toBe('50000')
  })
})
