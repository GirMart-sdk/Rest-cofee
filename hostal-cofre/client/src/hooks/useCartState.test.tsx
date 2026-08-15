import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useCartState } from './useCartState'
import type { MenuItem } from '../types'

const CART_KEY = 'test-cart'

const pizza: MenuItem = {
  id: 'item-1',
  name: 'Pizza',
  description: 'Test',
  price: 25000,
  category: 'pizza',
  image: 'https://example.com/pizza.png',
  available: true,
}

function Probe({ persistKey }: { persistKey?: string }) {
  const cart = useCartState(persistKey)
  return (
    <div>
      <span data-testid="count">{cart.itemCount}</span>
      <span data-testid="total">{cart.total}</span>
      <button onClick={() => cart.addItem(pizza)}>add</button>
      <button onClick={() => cart.addItem({ ...pizza, id: 'item-2', name: 'Pasta' })}>add2</button>
      <button onClick={() => cart.removeItem(pizza.id)}>remove</button>
      <button onClick={() => cart.updateQuantity(pizza.id, 3)}>set3</button>
      <button onClick={() => cart.updateQuantity(pizza.id, 0)}>zero</button>
      <button onClick={() => cart.clearCart()}>clear</button>
    </div>
  )
}

describe('useCartState', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts empty without persistence', () => {
    render(<Probe />)
    expect(screen.getByTestId('count').textContent).toBe('0')
    expect(screen.getByTestId('total').textContent).toBe('0')
    fireEvent.click(screen.getByText('add'))
    expect(screen.getByTestId('count').textContent).toBe('1')
    expect(localStorage.getItem(CART_KEY)).toBeNull()
    expect(localStorage.getItem('hostal-cofee-cart')).toBeNull()
  })

  it('persists items when a key is provided', () => {
    render(<Probe persistKey={CART_KEY} />)
    fireEvent.click(screen.getByText('add'))
    fireEvent.click(screen.getByText('add'))
    fireEvent.click(screen.getByText('add2'))
    expect(screen.getByTestId('count').textContent).toBe('3')
    expect(screen.getByTestId('total').textContent).toBe('75000')
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    expect(saved).toHaveLength(2)
    expect(saved[0].quantity).toBe(2)
  })

  it('restores persisted items on mount', () => {
    localStorage.setItem(CART_KEY, JSON.stringify([{ menuItem: pizza, quantity: 2 }]))
    render(<Probe persistKey={CART_KEY} />)
    expect(screen.getByTestId('count').textContent).toBe('2')
    expect(screen.getByTestId('total').textContent).toBe('50000')
  })

  it('falls back to an empty cart when the stored value is corrupt', () => {
    localStorage.setItem(CART_KEY, 'not-json{')
    render(<Probe persistKey={CART_KEY} />)
    expect(screen.getByTestId('count').textContent).toBe('0')
  })

  it('updates quantities and removes items', () => {
    render(<Probe persistKey={CART_KEY} />)
    fireEvent.click(screen.getByText('add'))
    fireEvent.click(screen.getByText('set3'))
    expect(screen.getByTestId('count').textContent).toBe('3')
    fireEvent.click(screen.getByText('zero'))
    expect(screen.getByTestId('count').textContent).toBe('0')
    expect(localStorage.getItem(CART_KEY)).toBe('[]')
  })

  it('clears the cart keeping the persisted empty array', () => {
    render(<Probe persistKey={CART_KEY} />)
    fireEvent.click(screen.getByText('add'))
    fireEvent.click(screen.getByText('add2'))
    fireEvent.click(screen.getByText('clear'))
    expect(screen.getByTestId('count').textContent).toBe('0')
    expect(localStorage.getItem(CART_KEY)).toBe('[]')
  })

  it('clears the cart without touching storage when not persisted', () => {
    render(<Probe />)
    fireEvent.click(screen.getByText('add'))
    fireEvent.click(screen.getByText('clear'))
    expect(screen.getByTestId('count').textContent).toBe('0')
    expect(localStorage.getItem('hostal-cofee-cart')).toBeNull()
  })
})
