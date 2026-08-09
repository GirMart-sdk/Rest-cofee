import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ReservationsPage from './ReservationsPage'

vi.mock('../components/reservations/ReservationForm', () => ({
  default: () => <div>ReservationFormMock</div>,
}))

describe('ReservationsPage', () => {
  it('renders the reservation form inside the page header', () => {
    render(<ReservationsPage />)
    expect(screen.getByText('Tu Mesa')).toBeInTheDocument()
    expect(screen.getByText('ReservationFormMock')).toBeInTheDocument()
  })
})
