interface PublicOrderItem {
  id: string
  quantity: number
  price: number
  menuItem: { id: string; name: string; price: number } | null
}

export interface PublicOrder {
  id: string
  status: string
  total: number
  orderType: string | null
  createdAt: Date
  items: PublicOrderItem[]
}

export function toPublicOrder(order: {
  id: string
  status: string
  total: number
  orderType?: string | null
  createdAt: Date
  items?: Array<{
    id: string
    quantity: number
    price: number
    menuItem?: { id: string; name: string; price: number } | null
  }>
}): PublicOrder {
  return {
    id: order.id,
    status: order.status,
    total: order.total,
    orderType: order.orderType ?? null,
    createdAt: order.createdAt,
    items: (order.items ?? []).map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      menuItem: item.menuItem
        ? { id: item.menuItem.id, name: item.menuItem.name, price: item.menuItem.price }
        : null,
    })),
  }
}
