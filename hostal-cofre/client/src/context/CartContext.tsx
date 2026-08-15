import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CartItem, MenuItem, OrderType, DeliveryZoneType } from '../types'
import toast from 'react-hot-toast'

interface CartContextType {
  items: CartItem[]
  addItem: (item: MenuItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
  orderType: OrderType
  setOrderType: (type: OrderType) => void
  deliveryZone: DeliveryZoneType | null
  setDeliveryZone: (zone: DeliveryZoneType | null) => void
  deliveryFee: number
  grandTotal: number
}

const CartContext = createContext<CartContextType | null>(null)

const DELIVERY_FEES: Record<DeliveryZoneType, number> = {
  centro: 3000,
  periurbano: 5000,
  lejano: 8000,
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('hostal-cofee-cart')
    return saved ? JSON.parse(saved) : []
  })

  const [orderType, setOrderType] = useState<OrderType>(() => {
    const saved = localStorage.getItem('hostal-cofee-orderType')
    return (saved as OrderType) || 'tienda'
  })

  const [deliveryZone, setDeliveryZoneState] = useState<DeliveryZoneType | null>(() => {
    const saved = localStorage.getItem('hostal-cofee-deliveryZone')
    return (saved as DeliveryZoneType) || null
  })

  const setDeliveryZone = useCallback((zone: DeliveryZoneType | null) => {
    setDeliveryZoneState(zone)
    if (zone) {
      localStorage.setItem('hostal-cofee-deliveryZone', zone)
    } else {
      localStorage.removeItem('hostal-cofee-deliveryZone')
    }
  }, [])

  const saveCart = useCallback((newItems: CartItem[]) => {
    setItems(newItems)
    localStorage.setItem('hostal-cofee-cart', JSON.stringify(newItems))
  }, [])

  const addItem = useCallback((item: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((ci) => ci.menuItem.id === item.id)
      let newItems: CartItem[]
      if (existing) {
        newItems = prev.map((ci) =>
          ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci,
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
    setItems((prev) => {
      const newItems = prev.filter((ci) => ci.menuItem.id !== itemId)
      localStorage.setItem('hostal-cofee-cart', JSON.stringify(newItems))
      return newItems
    })
  }, [])

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(itemId)
        return
      }
      setItems((prev) => {
        const newItems = prev.map((ci) => (ci.menuItem.id === itemId ? { ...ci, quantity } : ci))
        localStorage.setItem('hostal-cofee-cart', JSON.stringify(newItems))
        return newItems
      })
    },
    [removeItem],
  )

  const clearCart = useCallback(() => {
    saveCart([])
    localStorage.removeItem('hostal-cofee-orderType')
    localStorage.removeItem('hostal-cofee-deliveryZone')
    setOrderType('tienda')
    setDeliveryZoneState(null)
  }, [saveCart])

  const subtotal = items.reduce((sum, ci) => sum + ci.menuItem.price * ci.quantity, 0)
  const itemCount = items.reduce((sum, ci) => sum + ci.quantity, 0)
  const deliveryFeeValue =
    orderType === 'domicilio' && deliveryZone ? DELIVERY_FEES[deliveryZone] : 0
  const grandTotal = parseFloat((subtotal + deliveryFeeValue).toFixed(2))

  const handleSetOrderType = useCallback((type: OrderType) => {
    setOrderType(type)
    localStorage.setItem('hostal-cofee-orderType', type)
  }, [])

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total: subtotal,
        itemCount,
        orderType,
        setOrderType: handleSetOrderType,
        deliveryZone,
        setDeliveryZone,
        deliveryFee: deliveryFeeValue,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
