import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CartItem, MenuItem, OrderType, DeliveryZoneType } from '../types'
import { useCartState } from '../hooks/useCartState'
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
  const cart = useCartState('hostal-cofee-cart')
  const { addItem: addCartItem, clearCart: clearCartState, removeItem, updateQuantity } = cart

  const [orderType, setOrderTypeState] = useState<OrderType>(() => {
    const saved = localStorage.getItem('hostal-cofee-orderType')
    return (saved as OrderType) || 'tienda'
  })

  const [deliveryZone, setDeliveryZoneState] = useState<DeliveryZoneType | null>(() => {
    const saved = localStorage.getItem('hostal-cofee-deliveryZone')
    return (saved as DeliveryZoneType) || null
  })

  const setOrderType = useCallback((type: OrderType) => {
    setOrderTypeState(type)
    localStorage.setItem('hostal-cofee-orderType', type)
  }, [])

  const setDeliveryZone = useCallback((zone: DeliveryZoneType | null) => {
    setDeliveryZoneState(zone)
    if (zone) {
      localStorage.setItem('hostal-cofee-deliveryZone', zone)
    } else {
      localStorage.removeItem('hostal-cofee-deliveryZone')
    }
  }, [])

  const clearCart = useCallback(() => {
    clearCartState()
    localStorage.removeItem('hostal-cofee-orderType')
    localStorage.removeItem('hostal-cofee-deliveryZone')
    setOrderTypeState('tienda')
    setDeliveryZoneState(null)
  }, [clearCartState])

  const addItem = useCallback(
    (item: MenuItem) => {
      addCartItem(item)
      toast.success(`${item.name} añadido al carrito`)
    },
    [addCartItem],
  )

  const deliveryFeeValue =
    orderType === 'domicilio' && deliveryZone ? DELIVERY_FEES[deliveryZone] : 0
  const grandTotal = parseFloat((cart.total + deliveryFeeValue).toFixed(2))

  return (
    <CartContext.Provider
      value={{
        items: cart.items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total: cart.total,
        itemCount: cart.itemCount,
        orderType,
        setOrderType,
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
