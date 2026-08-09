import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import MenuPage from './MenuPage'

vi.mock('../components/menu/MenuGrid', () => ({
  default: () => <div>GridMock</div>,
}))

describe('MenuPage', () => {
  it('renders the heading and the menu grid', () => {
    render(<MenuPage />)
    expect(screen.getByRole('heading', { name: 'Nuestro Menú' })).toBeInTheDocument()
    expect(screen.getByText('GridMock')).toBeInTheDocument()
  })
})
