import {
  r as l,
  a as C,
  j as e,
  e as M,
  f as w,
  g as O,
  b as L,
  h as D,
  m as k,
  z as I,
} from './index-BSHWOaHa.js'
const V = [
  { key: 'all', label: 'Todos' },
  { key: 'ensalada', label: 'Ensaladas' },
  { key: 'pasta', label: 'Pastas' },
  { key: 'pizza', label: 'Pizzas' },
  { key: 'postre', label: 'Postres' },
  { key: 'bebida', label: 'Bebidas' },
]
function G() {
  var v
  const [u, S] = l.useState([]),
    [x, F] = l.useState('all'),
    [r, i] = l.useState([]),
    [P, q] = l.useState(!0),
    [y, j] = l.useState(!1),
    [$, h] = l.useState(!1),
    [c, R] = l.useState('cash'),
    [d, g] = l.useState(''),
    [f, N] = l.useState(''),
    [n, p] = l.useState(null)
  l.useEffect(() => {
    C.get('/menu')
      .then((s) => S(s.data.data.filter((t) => t.available)))
      .catch(() => {})
      .finally(() => q(!1))
  }, [])
  const T = x === 'all' ? u : u.filter((s) => s.category === x),
    o = r.reduce((s, t) => s + t.menuItem.price * t.quantity, 0),
    z = r.reduce((s, t) => s + t.quantity, 0),
    E = (s) => {
      i((t) =>
        t.find((a) => a.menuItem.id === s.id)
          ? t.map((a) => (a.menuItem.id === s.id ? { ...a, quantity: a.quantity + 1 } : a))
          : [...t, { menuItem: s, quantity: 1 }],
      )
    },
    b = (s, t) => {
      if (t <= 0) {
        i((m) => m.filter((a) => a.menuItem.id !== s))
        return
      }
      i((m) => m.map((a) => (a.menuItem.id === s ? { ...a, quantity: t } : a)))
    },
    A = () => i([]),
    X = async () => {
      if (r.length !== 0) {
        j(!0)
        try {
          const s = await C.post('/orders', {
            customerName: f || 'Cliente POS',
            customerPhone: 'N/A',
            items: r.map((t) => ({ menuItemId: t.menuItem.id, quantity: t.quantity })),
            paymentMethod: c,
            orderType: 'tienda',
          })
          ;(p({
            ...s.data.data,
            cart: [...r],
            cashReceived: c === 'cash' ? parseFloat(d) || 0 : void 0,
            change: c === 'cash' ? Math.max(0, (parseFloat(d) || 0) - o) : void 0,
          }),
            i([]),
            h(!1),
            N(''),
            g(''),
            I.success('Venta registrada'))
        } catch {
          I.error('Error al registrar venta')
        } finally {
          j(!1)
        }
      }
    }
  return P
    ? e.jsxs('div', {
        className: 'container-main text-center py-20',
        children: [
          e.jsx('div', {
            className:
              'animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4',
          }),
          e.jsx('p', { className: 'text-gray-400', children: 'Cargando POS...' }),
        ],
      })
    : e.jsxs(e.Fragment, {
        children: [
          e.jsxs('div', {
            className: 'container-main',
            children: [
              e.jsxs('div', {
                className: 'flex items-center justify-between mb-6',
                children: [
                  e.jsx('h1', { className: 'text-3xl font-display', children: 'Punto de Venta' }),
                  e.jsxs('div', {
                    className: 'flex items-center gap-2 text-sm text-gray-500',
                    children: [e.jsx(M, { size: 14 }), ' ', new Date().toLocaleString('es-CO')],
                  }),
                ],
              }),
              e.jsxs('div', {
                className: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
                children: [
                  e.jsxs('div', {
                    className: 'lg:col-span-2',
                    children: [
                      e.jsx('div', {
                        className: 'flex flex-wrap gap-2 mb-4',
                        children: V.map((s) =>
                          e.jsx(
                            'button',
                            {
                              onClick: () => F(s.key),
                              className: `px-4 py-2 rounded-full text-sm font-semibold transition-all ${x === s.key ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`,
                              children: s.label,
                            },
                            s.key,
                          ),
                        ),
                      }),
                      e.jsx('div', {
                        className: 'grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2',
                        children: T.map((s) =>
                          e.jsxs(
                            'button',
                            {
                              onClick: () => E(s),
                              className:
                                'pos-item bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all text-center active:scale-95',
                              children: [
                                e.jsx('img', {
                                  src: s.image,
                                  alt: s.name,
                                  className: 'w-full h-20 object-cover rounded-lg mb-2',
                                }),
                                e.jsx('p', {
                                  className: 'font-semibold text-xs line-clamp-1',
                                  children: s.name,
                                }),
                                e.jsxs('p', {
                                  className: 'text-primary font-bold text-sm',
                                  children: ['$', s.price],
                                }),
                              ],
                            },
                            s.id,
                          ),
                        ),
                      }),
                    ],
                  }),
                  e.jsx('div', {
                    className: 'lg:col-span-1',
                    children: e.jsxs('div', {
                      className: 'bg-white rounded-2xl shadow-md p-4 sticky top-28',
                      children: [
                        e.jsxs('div', {
                          className: 'flex items-center justify-between mb-4',
                          children: [
                            e.jsxs('h2', {
                              className: 'font-display text-lg flex items-center gap-2',
                              children: [e.jsx(w, {}), ' Venta Actual'],
                            }),
                            r.length > 0 &&
                              e.jsx('button', {
                                onClick: A,
                                className: 'text-red-500 text-xs font-semibold',
                                children: 'Limpiar',
                              }),
                          ],
                        }),
                        r.length === 0
                          ? e.jsxs('div', {
                              className: 'text-center py-8 text-gray-400',
                              children: [
                                e.jsx(w, { className: 'mx-auto text-3xl mb-2' }),
                                e.jsx('p', {
                                  className: 'text-sm',
                                  children: 'Agrega items del menú',
                                }),
                              ],
                            })
                          : e.jsxs(e.Fragment, {
                              children: [
                                e.jsx('div', {
                                  className: 'space-y-2 mb-4 max-h-64 overflow-y-auto',
                                  children: r.map((s) =>
                                    e.jsxs(
                                      'div',
                                      {
                                        className:
                                          'flex items-center gap-2 py-2 border-b last:border-0',
                                        children: [
                                          e.jsxs('div', {
                                            className: 'flex-1',
                                            children: [
                                              e.jsx('p', {
                                                className: 'font-semibold text-sm line-clamp-1',
                                                children: s.menuItem.name,
                                              }),
                                              e.jsxs('p', {
                                                className: 'text-xs text-gray-500',
                                                children: ['$', s.menuItem.price],
                                              }),
                                            ],
                                          }),
                                          e.jsxs('div', {
                                            className: 'flex items-center gap-1',
                                            children: [
                                              e.jsx('button', {
                                                onClick: () => b(s.menuItem.id, s.quantity - 1),
                                                className:
                                                  'w-6 h-6 rounded bg-gray-100 flex items-center justify-center',
                                                children: e.jsx(O, { size: 10 }),
                                              }),
                                              e.jsx('span', {
                                                className: 'w-6 text-center text-sm font-bold',
                                                children: s.quantity,
                                              }),
                                              e.jsx('button', {
                                                onClick: () => b(s.menuItem.id, s.quantity + 1),
                                                className:
                                                  'w-6 h-6 rounded bg-gray-100 flex items-center justify-center',
                                                children: e.jsx(L, { size: 10 }),
                                              }),
                                            ],
                                          }),
                                          e.jsxs('p', {
                                            className: 'font-bold text-sm w-16 text-right',
                                            children: [
                                              '$',
                                              (s.menuItem.price * s.quantity).toFixed(0),
                                            ],
                                          }),
                                          e.jsx('button', {
                                            onClick: () => b(s.menuItem.id, 0),
                                            className: 'text-gray-400 hover:text-red-500',
                                            children: e.jsx(D, { size: 12 }),
                                          }),
                                        ],
                                      },
                                      s.menuItem.id,
                                    ),
                                  ),
                                }),
                                e.jsxs('div', {
                                  className: 'border-t pt-3 space-y-1',
                                  children: [
                                    e.jsxs('div', {
                                      className: 'flex justify-between text-sm text-gray-600',
                                      children: [
                                        e.jsxs('span', { children: ['Items: ', z] }),
                                        e.jsx('span', { children: 'Subtotal' }),
                                      ],
                                    }),
                                    e.jsxs('div', {
                                      className: 'flex justify-between text-xl font-bold',
                                      children: [
                                        e.jsx('span', { children: 'Total' }),
                                        e.jsxs('span', {
                                          className: 'text-primary',
                                          children: ['$', o.toFixed(2)],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                e.jsx('button', {
                                  onClick: () => h(!0),
                                  className:
                                    'w-full mt-4 py-3 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-dark transition-colors',
                                  children: 'Cobrar',
                                }),
                              ],
                            }),
                      ],
                    }),
                  }),
                ],
              }),
            ],
          }),
          $ &&
            e.jsx('div', {
              className: 'modal-overlay',
              children: e.jsxs(k.div, {
                initial: { opacity: 0, scale: 0.9 },
                animate: { opacity: 1, scale: 1 },
                className: 'modal-content',
                children: [
                  e.jsx('h2', {
                    className: 'text-2xl font-display mb-6 text-center',
                    children: 'Cobrar',
                  }),
                  e.jsxs('div', {
                    className: 'mb-4',
                    children: [
                      e.jsx('label', {
                        className: 'text-sm font-semibold text-gray-700 mb-1 block',
                        children: 'Nombre del cliente (opcional)',
                      }),
                      e.jsx('input', {
                        type: 'text',
                        value: f,
                        onChange: (s) => N(s.target.value),
                        className: 'input-field',
                        placeholder: 'Cliente',
                      }),
                    ],
                  }),
                  e.jsx('div', {
                    className: 'grid grid-cols-2 gap-2 mb-6',
                    children: [
                      { key: 'cash', label: 'Efectivo', icon: '💵' },
                      { key: 'nequi', label: 'Nequi', icon: '📱' },
                      { key: 'daviplata', label: 'DaviPlata', icon: '📲' },
                      { key: 'wompi', label: 'Tarjeta/PSE', icon: '💳' },
                    ].map((s) =>
                      e.jsxs(
                        'button',
                        {
                          onClick: () => R(s.key),
                          className: `p-3 rounded-xl border-2 text-center transition-all ${c === s.key ? 'border-primary bg-primary/5' : 'border-gray-200'}`,
                          children: [
                            e.jsx('span', { className: 'text-xl', children: s.icon }),
                            e.jsx('div', {
                              className: 'font-semibold text-sm mt-1',
                              children: s.label,
                            }),
                          ],
                        },
                        s.key,
                      ),
                    ),
                  }),
                  c === 'cash' &&
                    e.jsxs('div', {
                      className: 'mb-4',
                      children: [
                        e.jsx('label', {
                          className: 'text-sm font-semibold text-gray-700 mb-1 block',
                          children: 'Efectivo recibido',
                        }),
                        e.jsx('input', {
                          type: 'number',
                          value: d,
                          onChange: (s) => g(s.target.value),
                          className: 'input-field text-2xl font-bold text-center',
                          placeholder: '0',
                        }),
                        parseFloat(d) > 0 &&
                          e.jsxs('div', {
                            className: 'text-center mt-2',
                            children: [
                              e.jsx('span', {
                                className: 'text-sm text-gray-500',
                                children: 'Cambio: ',
                              }),
                              e.jsxs('span', {
                                className: 'text-lg font-bold text-primary',
                                children: ['$', Math.max(0, parseFloat(d) - o).toFixed(2)],
                              }),
                            ],
                          }),
                      ],
                    }),
                  e.jsx('div', {
                    className: 'bg-gray-50 rounded-xl p-4 mb-6',
                    children: e.jsxs('div', {
                      className: 'flex justify-between text-xl font-bold',
                      children: [
                        e.jsx('span', { children: 'Total' }),
                        e.jsxs('span', {
                          className: 'text-primary',
                          children: ['$', o.toFixed(2)],
                        }),
                      ],
                    }),
                  }),
                  e.jsxs('div', {
                    className: 'flex gap-3',
                    children: [
                      e.jsx('button', {
                        onClick: () => h(!1),
                        className: 'flex-1 py-3 border border-gray-300 rounded-xl font-semibold',
                        children: 'Cancelar',
                      }),
                      e.jsx('button', {
                        onClick: X,
                        disabled: y,
                        className:
                          'flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark disabled:opacity-50',
                        children: y ? 'Procesando...' : 'Confirmar Cobro',
                      }),
                    ],
                  }),
                ],
              }),
            }),
          n &&
            e.jsx('div', {
              className: 'modal-overlay',
              children: e.jsxs(k.div, {
                initial: { opacity: 0, scale: 0.9 },
                animate: { opacity: 1, scale: 1 },
                className: 'modal-content max-w-sm receipt-container',
                id: 'receipt',
                children: [
                  e.jsxs('div', {
                    className: 'receipt p-6 text-center',
                    children: [
                      e.jsx('h2', {
                        className: 'font-display text-xl font-bold mb-1',
                        children: 'Hostal Cofre',
                      }),
                      e.jsx('p', {
                        className: 'text-xs text-gray-500 mb-4',
                        children: 'NIT: XXX-XXXX-X',
                      }),
                      e.jsxs('div', {
                        className: 'border-t border-b border-dashed border-gray-300 py-2 mb-4',
                        children: [
                          e.jsxs('p', {
                            className: 'text-xs text-gray-500',
                            children: ['Recibo #', n.receiptNumber],
                          }),
                          e.jsx('p', {
                            className: 'text-xs text-gray-500',
                            children: new Date(n.createdAt).toLocaleString('es-CO'),
                          }),
                        ],
                      }),
                      e.jsx('div', {
                        className: 'text-left space-y-1 mb-4',
                        children:
                          (v = n.cart) == null
                            ? void 0
                            : v.map((s, t) =>
                                e.jsxs(
                                  'div',
                                  {
                                    className: 'flex justify-between text-sm',
                                    children: [
                                      e.jsxs('span', {
                                        children: [s.quantity, 'x ', s.menuItem.name],
                                      }),
                                      e.jsxs('span', {
                                        children: ['$', (s.menuItem.price * s.quantity).toFixed(0)],
                                      }),
                                    ],
                                  },
                                  t,
                                ),
                              ),
                      }),
                      e.jsxs('div', {
                        className: 'border-t border-dashed border-gray-300 pt-2 mb-4',
                        children: [
                          e.jsxs('div', {
                            className: 'flex justify-between font-bold text-lg',
                            children: [
                              e.jsx('span', { children: 'TOTAL' }),
                              e.jsxs('span', { children: ['$', n.total.toFixed(2)] }),
                            ],
                          }),
                          e.jsxs('p', {
                            className: 'text-xs text-gray-500 mt-1',
                            children: ['Pago: ', n.paymentMethod.toUpperCase()],
                          }),
                          n.cashReceived !== void 0 &&
                            e.jsxs(e.Fragment, {
                              children: [
                                e.jsxs('p', {
                                  className: 'text-xs text-gray-500',
                                  children: ['Recibido: $', n.cashReceived.toFixed(2)],
                                }),
                                e.jsxs('p', {
                                  className: 'text-xs text-gray-500',
                                  children: ['Cambio: $', n.change.toFixed(2)],
                                }),
                              ],
                            }),
                        ],
                      }),
                      e.jsx('p', {
                        className: 'text-xs text-gray-400',
                        children: '¡Gracias por su compra!',
                      }),
                    ],
                  }),
                  e.jsxs('div', {
                    className: 'flex gap-2 p-4',
                    children: [
                      e.jsx('button', {
                        onClick: () => p(null),
                        className:
                          'flex-1 py-2 border border-gray-300 rounded-lg text-sm font-semibold',
                        children: 'Cerrar',
                      }),
                      e.jsx('button', {
                        onClick: () => {
                          ;(window.print(), p(null))
                        },
                        className:
                          'flex-1 py-2 bg-primary text-white rounded-lg text-sm font-semibold',
                        children: 'Imprimir',
                      }),
                    ],
                  }),
                ],
              }),
            }),
        ],
      })
}
export { G as default }
