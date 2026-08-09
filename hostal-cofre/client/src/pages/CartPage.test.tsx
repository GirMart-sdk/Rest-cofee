import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CartPage from './CartPage'

vi.mock('../components/cart/CartDrawer', () => ({
  default: () => <div>DrawerMock</div>,
}))

describe('CartPage', () => {
  it('renders the cart drawer', () => {
    render(<CartPage />)
    expect(screen.getByText('DrawerMock')).toBeInTheDocument()
  })
})
