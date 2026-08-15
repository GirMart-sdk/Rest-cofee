import { useState, useCallback, useMemo } from 'react'
import { CartItem, MenuItem } from '../types'

export interface CartState {
  items: CartItem[]
  addItem: (item: MenuItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

export function useCartState(persistKey?: string): CartState {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (!persistKey) return []
    try {
      const saved = localStorage.getItem(persistKey)
      return saved ? (JSON.parse(saved) as CartItem[]) : []
    } catch {
      return []
    }
  })

  const persist = useCallback(
    (next: CartItem[]) => {
      if (persistKey) {
        localStorage.setItem(persistKey, JSON.stringify(next))
      }
    },
    [persistKey],
  )

  const addItem = useCallback(
    (item: MenuItem) => {
      setItems((prev) => {
        const existing = prev.find((ci) => ci.menuItem.id === item.id)
        const next = existing
          ? prev.map((ci) =>
              ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci,
            )
          : [...prev, { menuItem: item, quantity: 1 }]
        persist(next)
        return next
      })
    },
    [persist],
  )

  const removeItem = useCallback(
    (itemId: string) => {
      setItems((prev) => {
        const next = prev.filter((ci) => ci.menuItem.id !== itemId)
        persist(next)
        return next
      })
    },
    [persist],
  )

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(itemId)
        return
      }
      setItems((prev) => {
        const next = prev.map((ci) => (ci.menuItem.id === itemId ? { ...ci, quantity } : ci))
        persist(next)
        return next
      })
    },
    [persist, removeItem],
  )

  const clearCart = useCallback(() => {
    setItems([])
    if (persistKey) {
      localStorage.setItem(persistKey, '[]')
    }
  }, [persistKey])

  const total = useMemo(
    () => items.reduce((sum, ci) => sum + ci.menuItem.price * ci.quantity, 0),
    [items],
  )
  const itemCount = useMemo(() => items.reduce((sum, ci) => sum + ci.quantity, 0), [items])

  return { items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }
}
