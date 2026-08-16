import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AdminPayments from './AdminPayments'

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

const payments = [
  {
    id: 'o1',
    customerName: 'Cliente Uno',
    total: 80000,
    paymentMethod: 'wompi',
    paymentStatus: 'pending',
    receiptNumber: 'R-0001',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'o2',
    customerName: 'Cliente Dos',
    total: 34000,
    paymentMethod: 'wompi',
    paymentStatus: 'paid',
    receiptNumber: 'R-0002',
    paymentId: 'txn-123',
    createdAt: new Date().toISOString(),
  },
]

function mockGet(url?: string) {
  if (url === '/payments/status') {
    return Promise.resolve({ data: { data: { mode: 'test', publicKeyConfigured: true } } })
  }
  if (url === '/payments' || url === '/payments?limit=100') {
    return Promise.resolve({ data: { data: payments } })
  }
  if (url?.startsWith('/payments?status=')) {
    const status = url.split('=')[1]
    return Promise.resolve({ data: { data: payments.filter((p) => p.paymentStatus === status) } })
  }
  if (url?.startsWith('/payments/transactions/')) {
    return Promise.resolve({ data: { data: { id: 'txn-123', status: 'APPROVED' } } })
  }
  return Promise.resolve({ data: { data: [] } })
}

function renderPage() {
  return render(<AdminPayments />)
}

describe('AdminPayments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    apiMock.api.get.mockImplementation(mockGet)
  })

  it('renders the wompi payments list', async () => {
    renderPage()
    expect(await screen.findByText('Cliente Uno')).toBeInTheDocument()
    expect(screen.getByText('Cliente Dos')).toBeInTheDocument()
    expect(screen.getByText('$80.000')).toBeInTheDocument()
    expect(screen.getByText('Pendiente')).toBeInTheDocument()
    expect(screen.getByText('Pagado')).toBeInTheDocument()
    expect(screen.getByText('Pruebas')).toBeInTheDocument()
  })

  it('filters payments by status', async () => {
    renderPage()
    await screen.findByText('Cliente Uno')

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'paid' } })

    await waitFor(() =>
      expect(apiMock.api.get).toHaveBeenCalledWith('/payments', { params: { status: 'paid' } }),
    )
  })

  it('shows the transaction detail when requested', async () => {
    renderPage()
    await screen.findByText('Cliente Dos')

    fireEvent.click(screen.getByRole('button', { name: /Ver transacción/ }))

    expect(await screen.findByText('Detalle de Transacción')).toBeInTheDocument()
    expect(screen.getByText(/APPROVED/)).toBeInTheDocument()
  })

  it('shows the empty state when there are no payments', async () => {
    apiMock.api.get.mockImplementation((url?: string) => {
      if (url === '/payments/status') {
        return Promise.resolve({ data: { data: { mode: 'test', publicKeyConfigured: true } } })
      }
      return Promise.resolve({ data: { data: [] } })
    })
    renderPage()

    expect(await screen.findByText('Sin pagos Wompi')).toBeInTheDocument()
  })
})
