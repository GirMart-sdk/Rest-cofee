import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CartItem, MenuItem } from '../types'
import toast from 'react-hot-toast'

interface CartContextType {
  items: CartItem[]
  addItem: (item: MenuItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('hostal-cofee-cart')
    return saved ? JSON.parse(saved) : []
  })

  const saveCart = useCallback((newItems: CartItem[]) => {
    setItems(newItems)
    localStorage.setItem('hostal-cofee-cart', JSON.stringify(newItems))
  }, [])

  const addItem = useCallback((item: MenuItem) => {
    setItems(prev => {
      const existing = prev.find(ci => ci.menuItem.id === item.id)
      let newItems: CartItem[]
      if (existing) {
        newItems = prev.map(ci =>
          ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        )
      } else {
        newItems = [...prev, { menuItem: item, quantity: 1 }]
      }
      localStorage.setItem('hostal-cofee-cart', JSON.stringify(newItems))
      return newItems
    })
    toast.success(`${item.name} añadido al carrito`)
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setItems(prev => {
      const newItems = prev.filter(ci => ci.menuItem.id !== itemId)
      localStorage.setItem('hostal-cofee-cart', JSON.stringify(newItems))
      return newItems
    })
  }, [])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }
    setItems(prev => {
      const newItems = prev.map(ci =>
        ci.menuItem.id === itemId ? { ...ci, quantity } : ci
      )
      localStorage.setItem('hostal-cofee-cart', JSON.stringify(newItems))
      return newItems
    })
  }, [removeItem])

  const clearCart = useCallback(() => {
    saveCart([])
  }, [saveCart])

  const total = items.reduce((sum, ci) => sum + ci.menuItem.price * ci.quantity, 0)
  const itemCount = items.reduce((sum, ci) => sum + ci.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
