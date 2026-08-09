import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useApi, useMenu, useOrders, useReservations } from './useApi'

const apiMock = vi.hoisted(() => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('../services/api', () => apiMock)

const toastMock = vi.hoisted(() => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('react-hot-toast', () => ({ __esModule: true, default: toastMock.toast }))

const ok = (data: unknown) => ({ data: { data } })

describe('useApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('executes successfully and stores the result', async () => {
    const { result } = renderHook(() => useApi<string[]>())

    let returned: unknown
    await act(async () => {
      returned = await result.current.execute(() => Promise.resolve(['a']))
    })

    expect(returned).toEqual(['a'])
    expect(result.current.data).toEqual(['a'])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('shows a success toast when a message is provided', async () => {
    const { result } = renderHook(() => useApi())
    await act(async () => {
      await result.current.execute(() => Promise.resolve(1), '¡Listo!')
    })
    expect(toastMock.toast.success).toHaveBeenCalledWith('¡Listo!')
  })

  it('stores the API error message and throws', async () => {
    const { result } = renderHook(() => useApi())
    const error = { response: { data: { error: 'Fallo del servidor' } } }

    await act(async () => {
      await expect(result.current.execute(() => Promise.reject(error))).rejects.toBe(error)
    })

    expect(result.current.error).toBe('Fallo del servidor')
    expect(toastMock.toast.error).toHaveBeenCalledWith('Fallo del servidor')
  })

  it('falls back to the error message and then to a generic one', async () => {
    const { result } = renderHook(() => useApi())

    await act(async () => {
      await expect(
        result.current.execute(() => Promise.reject(new Error('boom'))),
      ).rejects.toBeDefined()
    })
    expect(result.current.error).toBe('boom')

    await act(async () => {
      await expect(result.current.execute(() => Promise.reject({}))).rejects.toBeDefined()
    })
    expect(result.current.error).toBe('An error occurred')
  })
})

describe('useMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches the menu', async () => {
    apiMock.api.get.mockResolvedValue(ok([{ id: 'm1', name: 'Pizza' }]))
    const { result } = renderHook(() => useMenu())

    await act(async () => {
      await result.current.fetchMenu()
    })

    expect(apiMock.api.get).toHaveBeenCalledWith('/menu')
    expect(result.current.items).toEqual([{ id: 'm1', name: 'Pizza' }])
  })

  it('creates, updates and deletes menu items', async () => {
    apiMock.api.post.mockResolvedValue(ok({ id: 'm2', name: 'Pasta' }))
    apiMock.api.put.mockResolvedValue(ok({ id: 'm1', name: 'Editado' }))
    apiMock.api.delete.mockResolvedValue(ok({ id: 'm1' }))
    const { result } = renderHook(() => useMenu())

    await act(async () => {
      await result.current.createItem({ name: 'Pasta' })
    })
    expect(apiMock.api.post).toHaveBeenCalledWith('/menu', { name: 'Pasta' })

    await act(async () => {
      await result.current.updateItem('m1', { name: 'Editado' })
    })
    expect(apiMock.api.put).toHaveBeenCalledWith('/menu/m1', { name: 'Editado' })

    await act(async () => {
      await result.current.deleteItem('m1')
    })
    expect(apiMock.api.delete).toHaveBeenCalledWith('/menu/m1')
  })
})

describe('useOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches orders and updates their status and payment', async () => {
    apiMock.api.get.mockResolvedValue(ok([{ id: 'o1' }]))
    apiMock.api.post.mockResolvedValue(ok({ id: 'o2' }))
    apiMock.api.patch.mockResolvedValue(ok({ id: 'o1' }))
    const { result } = renderHook(() => useOrders())

    await act(async () => {
      await result.current.fetchOrders()
    })
    expect(apiMock.api.get).toHaveBeenCalledWith('/orders')
    expect(result.current.orders).toEqual([{ id: 'o1' }])

    await act(async () => {
      await result.current.createOrder({ id: 'o2' })
    })
    expect(apiMock.api.post).toHaveBeenCalledWith('/orders', { id: 'o2' })

    await act(async () => {
      await result.current.updateStatus('o1', 'preparing')
    })
    expect(apiMock.api.patch).toHaveBeenCalledWith('/orders/o1/status', { status: 'preparing' })

    await act(async () => {
      await result.current.updatePayment('o1', 'paid')
    })
    expect(apiMock.api.patch).toHaveBeenCalledWith('/orders/o1/payment', { paymentStatus: 'paid' })
  })
})

describe('useReservations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches, creates and updates reservations', async () => {
    apiMock.api.get.mockResolvedValue(ok([{ id: 'r1' }]))
    apiMock.api.post.mockResolvedValue(ok({ id: 'r2' }))
    apiMock.api.patch.mockResolvedValue(ok({ id: 'r1' }))
    const { result } = renderHook(() => useReservations())

    await act(async () => {
      await result.current.fetchReservations()
    })
    expect(apiMock.api.get).toHaveBeenCalledWith('/reservations')
    expect(result.current.reservations).toEqual([{ id: 'r1' }])

    await act(async () => {
      await result.current.createReservation({ id: 'r2' })
    })
    expect(apiMock.api.post).toHaveBeenCalledWith('/reservations', { id: 'r2' })

    await act(async () => {
      await result.current.updateStatus('r1', 'confirmed')
    })
    expect(apiMock.api.patch).toHaveBeenCalledWith('/reservations/r1/status', {
      status: 'confirmed',
    })
  })
})
