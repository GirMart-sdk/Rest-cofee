import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage, useDebounce } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns the initial value when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('reads an existing stored value', () => {
    localStorage.setItem('key', JSON.stringify({ a: 1 }))
    const { result } = renderHook(() => useLocalStorage('key', {}))
    expect(result.current[0]).toEqual({ a: 1 })
  })

  it('falls back to the initial value when the stored JSON is invalid', () => {
    localStorage.setItem('key', '{not-json')
    const { result } = renderHook(() => useLocalStorage('key', 'fallback'))
    expect(result.current[0]).toBe('fallback')
  })

  it('persists the value on set', () => {
    const { result } = renderHook(() => useLocalStorage('key', 0))
    act(() => {
      result.current[1](5)
    })
    expect(result.current[0]).toBe(5)
    expect(localStorage.getItem('key')).toBe('5')
  })

  it('supports functional updates', () => {
    localStorage.setItem('key', '1')
    const { result } = renderHook(() => useLocalStorage('key', 0))
    act(() => {
      result.current[1]((prev) => (prev as number) + 1)
    })
    expect(result.current[0]).toBe(2)
  })
})

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('updates the debounced value after the delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 100), {
      initialProps: { value: 'a' },
    })

    expect(result.current).toBe('a')
    rerender({ value: 'b' })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toBe('b')
  })
})
