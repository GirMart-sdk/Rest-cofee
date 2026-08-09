import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds = [0]

  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

class MockResizeObserver implements ResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
}

if (!('IntersectionObserver' in globalThis)) {
  globalThis.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver
}

if (!('ResizeObserver' in globalThis)) {
  globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

afterEach(() => {
  cleanup()
  localStorage.clear()
})
