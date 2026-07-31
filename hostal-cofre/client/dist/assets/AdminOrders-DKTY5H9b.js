import {
  r as i,
  j as t,
  B as N,
  l as C,
  k as _,
  i as $,
  m as F,
  a as v,
  z as x,
} from './index-BSHWOaHa.js'
const O = {
    pending: 'bg-yellow-100 text-yellow-700',
    preparing: 'bg-blue-100 text-blue-700',
    ready: 'bg-green-100 text-green-700',
    out_for_delivery: 'bg-orange-100 text-orange-700',
    delivered: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
  },
  r = {
    pending: 'Pendiente',
    preparing: 'Preparando',
    ready: 'Listo',
    out_for_delivery: 'En camino',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  },
  w = {
    domicilio: { label: 'Domicilio', icon: $, color: 'bg-orange-100 text-orange-700' },
    tienda: { label: 'Tienda/POS', icon: _, color: 'bg-blue-100 text-blue-700' },
    mesa: { label: 'Mesa', icon: C, color: 'bg-green-100 text-green-700' },
  }
function L() {
  const [m, p] = i.useState([]),
    [l, T] = i.useState('all'),
    [d, k] = i.useState('all'),
    [g, u] = i.useState(!0),
    y = async () => {
      try {
        u(!0)
        const e = await v.get('/orders')
        p(e.data.data)
      } catch {
        x.error('Error al cargar pedidos')
      } finally {
        u(!1)
      }
    }
  i.useEffect(() => {
    y()
  }, [])
  const b = m.filter(
      (e) => !((l !== 'all' && e.status !== l) || (d !== 'all' && e.orderType !== d)),
    ),
    c = async (e, s) => {
      try {
        ;(await v.patch(`/orders/${e}/status`, { status: s }),
          p((o) => o.map((a) => (a.id === e ? { ...a, status: s } : a))),
          x.success(`Estado cambiado a ${r[s]}`))
      } catch {
        x.error('Error al actualizar estado')
      }
    },
    E = (e) => ({ pending: 'preparing', preparing: 'ready', ready: 'delivered' })[e] || null
  return t.jsxs('div', {
    className: 'container-main',
    children: [
      t.jsxs('div', {
        className: 'flex items-center justify-between mb-8',
        children: [
          t.jsx('h1', { className: 'text-3xl font-display', children: 'Gestionar Pedidos' }),
          t.jsxs('button', {
            onClick: y,
            className: 'btn-outline flex items-center gap-2',
            children: [t.jsx(N, {}), ' Actualizar'],
          }),
        ],
      }),
      t.jsxs('div', {
        className: 'mb-4',
        children: [
          t.jsx('p', {
            className: 'text-sm font-semibold text-gray-600 mb-2',
            children: 'Tipo de pedido:',
          }),
          t.jsx('div', {
            className: 'flex flex-wrap gap-2 mb-4',
            children: [
              { key: 'all', label: 'Todos' },
              { key: 'domicilio', label: 'Domicilio' },
              { key: 'tienda', label: 'Tienda/POS' },
              { key: 'mesa', label: 'Mesa' },
            ].map((e) =>
              t.jsx(
                'button',
                {
                  onClick: () => k(e.key),
                  className: `px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${d === e.key ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`,
                  children: e.label,
                },
                e.key,
              ),
            ),
          }),
        ],
      }),
      t.jsx('div', {
        className: 'flex flex-wrap gap-2 mb-8',
        children: ['all', 'pending', 'preparing', 'ready', 'out_for_delivery', 'delivered'].map(
          (e) =>
            t.jsxs(
              'button',
              {
                onClick: () => T(e),
                className: `px-4 py-2 rounded-full text-sm font-semibold transition-all ${l === e ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`,
                children: [
                  e === 'all' ? 'Todos' : r[e],
                  ' ',
                  e !== 'all' && `(${m.filter((s) => s.status === e).length})`,
                ],
              },
              e,
            ),
        ),
      }),
      g
        ? t.jsxs('div', {
            className: 'text-center py-16 text-gray-400',
            children: [
              t.jsx(N, { className: 'animate-spin mx-auto text-4xl mb-4' }),
              t.jsx('p', { children: 'Cargando pedidos...' }),
            ],
          })
        : t.jsx('div', {
            className: 'space-y-4',
            children: b.map((e) => {
              var h
              const s = w[e.orderType] || w.tienda,
                o = s.icon,
                a = E(e.status)
              return t.jsxs(
                F.div,
                {
                  layout: !0,
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  className: 'bg-white rounded-2xl p-6 shadow-md',
                  children: [
                    t.jsxs('div', {
                      className: 'flex flex-wrap items-start justify-between gap-4 mb-4',
                      children: [
                        t.jsxs('div', {
                          children: [
                            t.jsxs('div', {
                              className: 'flex items-center gap-2 mb-1',
                              children: [
                                t.jsxs('h3', {
                                  className: 'font-display text-lg',
                                  children: ['#', e.receiptNumber || e.id.slice(0, 8)],
                                }),
                                t.jsxs('span', {
                                  className: `px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${s.color}`,
                                  children: [
                                    t.jsx(o, { size: 10 }),
                                    ' ',
                                    s.label,
                                    ((h = e.table) == null ? void 0 : h.number) &&
                                      ` #${e.table.number}`,
                                  ],
                                }),
                              ],
                            }),
                            t.jsxs('p', {
                              className: 'text-gray-500 text-sm',
                              children: [e.customerName, ' • ', e.customerPhone],
                            }),
                            e.address &&
                              t.jsxs('p', {
                                className: 'text-gray-400 text-xs mt-1',
                                children: ['📍 ', e.address, ' (', e.deliveryZone, ')'],
                              }),
                          ],
                        }),
                        t.jsxs('div', {
                          className: 'flex items-center gap-3',
                          children: [
                            t.jsx('span', {
                              className: `px-3 py-1 rounded-full text-xs font-bold ${O[e.status]}`,
                              children: r[e.status],
                            }),
                            t.jsxs('span', {
                              className: 'text-xl font-bold text-primary',
                              children: ['$', e.total.toLocaleString()],
                            }),
                          ],
                        }),
                      ],
                    }),
                    t.jsxs('div', {
                      className: 'border-t pt-4 mb-4',
                      children: [
                        e.items.map((n, S) => {
                          var f, j
                          return t.jsxs(
                            'div',
                            {
                              className: 'flex justify-between text-sm py-1',
                              children: [
                                t.jsxs('span', {
                                  children: [
                                    n.quantity,
                                    'x ',
                                    ((f = n.menuItem) == null ? void 0 : f.name) || 'Platillo',
                                  ],
                                }),
                                t.jsxs('span', {
                                  children: [
                                    '$',
                                    (((j = n.menuItem) == null ? void 0 : j.price) || 0) *
                                      n.quantity,
                                  ],
                                }),
                              ],
                            },
                            S,
                          )
                        }),
                        e.deliveryFee > 0 &&
                          t.jsxs('div', {
                            className: 'flex justify-between text-sm py-1 text-orange-600',
                            children: [
                              t.jsx('span', { children: 'Envío' }),
                              t.jsxs('span', { children: ['$', e.deliveryFee] }),
                            ],
                          }),
                      ],
                    }),
                    t.jsxs('div', {
                      className: 'flex gap-2 flex-wrap',
                      children: [
                        a &&
                          e.status !== 'cancelled' &&
                          t.jsxs('button', {
                            onClick: () => c(e.id, a),
                            className:
                              'px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90',
                            children: [
                              a === 'preparing' && 'Iniciar Preparación',
                              a === 'ready' && 'Marcar Listo',
                              a === 'delivered' && 'Marcar Entregado',
                            ],
                          }),
                        e.status === 'pending' &&
                          e.orderType === 'domicilio' &&
                          t.jsx('button', {
                            onClick: () => c(e.id, 'out_for_delivery'),
                            className:
                              'px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600',
                            children: 'Salir a Entregar',
                          }),
                        e.status !== 'delivered' &&
                          e.status !== 'cancelled' &&
                          t.jsx('button', {
                            onClick: () => c(e.id, 'cancelled'),
                            className:
                              'px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-200',
                            children: 'Cancelar',
                          }),
                      ],
                    }),
                  ],
                },
                e.id,
              )
            }),
          }),
      !g &&
        b.length === 0 &&
        t.jsx('div', {
          className: 'text-center py-16 text-gray-400',
          children: t.jsxs('p', {
            className: 'text-xl',
            children: ['No hay pedidos ', l !== 'all' ? `con estado "${r[l]}"` : ''],
          }),
        }),
    ],
  })
}
export { L as default }
