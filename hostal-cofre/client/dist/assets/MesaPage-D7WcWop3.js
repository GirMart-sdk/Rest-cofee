import {
  p as f,
  j as e,
  r as c,
  l as I,
  a as b,
  m as j,
  b as N,
  c as k,
  g as M,
  h as P,
  F as $,
  z as y,
  w as z,
} from './index-BSHWOaHa.js'
const v = c.createContext(null)
function q({ children: n }) {
  const [i, d] = c.useState([]),
    m = (a) => {
      ;(d((t) =>
        t.find((r) => r.menuItem.id === a.id)
          ? t.map((r) => (r.menuItem.id === a.id ? { ...r, quantity: r.quantity + 1 } : r))
          : [...t, { menuItem: a, quantity: 1 }],
      ),
        y.success(`${a.name} añadido`))
    },
    x = (a) => {
      d((t) => t.filter((p) => p.menuItem.id !== a))
    },
    g = (a, t) => {
      if (t <= 0) {
        x(a)
        return
      }
      d((p) => p.map((r) => (r.menuItem.id === a ? { ...r, quantity: t } : r)))
    },
    u = () => d([]),
    h = i.reduce((a, t) => a + t.menuItem.price * t.quantity, 0),
    s = i.reduce((a, t) => a + t.quantity, 0)
  return e.jsx(v.Provider, {
    value: {
      items: i,
      addItem: m,
      removeItem: x,
      updateQuantity: g,
      total: h,
      itemCount: s,
      clearCart: u,
    },
    children: n,
  })
}
function w() {
  const n = c.useContext(v)
  if (!n) throw new Error('useMesaCart must be used within MesaCartProvider')
  return n
}
const E = [
  { key: 'all', label: 'Todos' },
  { key: 'ensalada', label: 'Ensaladas' },
  { key: 'pasta', label: 'Pastas' },
  { key: 'pizza', label: 'Pizzas' },
  { key: 'postre', label: 'Postres' },
  { key: 'bebida', label: 'Bebidas' },
]
function F() {
  const [n, i] = c.useState('all'),
    [d, m] = c.useState([]),
    [x, g] = c.useState(!0),
    { addItem: u } = w()
  c.useEffect(() => {
    b.get('/menu')
      .then((s) => m(s.data.data.filter((a) => a.available)))
      .catch(() => {})
      .finally(() => g(!1))
  }, [])
  const h = n === 'all' ? d : d.filter((s) => s.category === n)
  return x
    ? e.jsxs('div', {
        className: 'text-center py-20',
        children: [
          e.jsx('div', {
            className:
              'animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4',
          }),
          e.jsx('p', { className: 'text-gray-400', children: 'Cargando menú...' }),
        ],
      })
    : e.jsxs('div', {
        children: [
          e.jsx('div', {
            className: 'flex flex-wrap justify-center gap-2 mb-6',
            children: E.map((s) =>
              e.jsx(
                'button',
                {
                  onClick: () => i(s.key),
                  className: `px-4 py-2 rounded-full font-semibold text-sm transition-all ${n === s.key ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`,
                  children: s.label,
                },
                s.key,
              ),
            ),
          }),
          e.jsx('div', {
            className: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3',
            children: h.map((s) =>
              e.jsxs(
                j.div,
                {
                  layout: !0,
                  className: 'bg-white rounded-xl shadow-md overflow-hidden',
                  children: [
                    e.jsx('img', {
                      src: s.image,
                      alt: s.name,
                      className: 'w-full h-28 object-cover',
                    }),
                    e.jsxs('div', {
                      className: 'p-3',
                      children: [
                        e.jsx('h3', {
                          className: 'font-semibold text-sm mb-1 line-clamp-1',
                          children: s.name,
                        }),
                        e.jsxs('p', {
                          className: 'text-primary font-bold text-sm',
                          children: ['$', s.price],
                        }),
                        e.jsxs('button', {
                          onClick: () => u(s),
                          className:
                            'mt-2 w-full py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-semibold hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-1',
                          children: [e.jsx(N, { size: 12 }), ' Agregar'],
                        }),
                      ],
                    }),
                  ],
                },
                s.id,
              ),
            ),
          }),
        ],
      })
}
function S() {
  const { items: n, removeItem: i, updateQuantity: d, total: m, itemCount: x, clearCart: g } = w(),
    [u, h] = c.useState(!1),
    [s, a] = c.useState(!1),
    { user: t } = k(),
    [p] = f(),
    r = parseInt(p.get('t') || '0')
  if (n.length === 0)
    return e.jsx('div', {
      className: 'text-center py-8 text-gray-400',
      children: e.jsx('p', { children: 'Agrega platos del menú para ordenar' }),
    })
  const C = async () => {
    h(!0)
    try {
      await b.post('/orders/table', {
        customerName: (t == null ? void 0 : t.name) || `Mesa ${r}`,
        customerPhone: (t == null ? void 0 : t.email) || '',
        items: n.map((o) => ({ menuItemId: o.menuItem.id, quantity: o.quantity })),
        paymentMethod: 'cash',
        tableNumber: r,
      })
      const l = n.map(
        (o) => `${o.quantity}x ${o.menuItem.name} - $${(o.menuItem.price * o.quantity).toFixed(0)}`,
      ).join(`
`)
      ;(z.sendOrder(
        '573001234567',
        `Mesa #${r}

${l}

*Total: $${m.toFixed(2)}*`,
      ),
        y.success('Pedido enviado a la cocina'),
        g(),
        a(!1))
    } catch {
      y.error('Error al enviar pedido')
    } finally {
      h(!1)
    }
  }
  return e.jsxs('div', {
    className: 'bg-white rounded-xl shadow-md p-4',
    children: [
      e.jsxs('div', {
        className: 'flex items-center justify-between mb-4',
        children: [
          e.jsx('h3', { className: 'font-display text-lg', children: 'Tu Pedido' }),
          e.jsx('span', {
            className: 'bg-primary text-white text-xs px-2 py-1 rounded-full font-bold',
            children: x,
          }),
        ],
      }),
      e.jsx('div', {
        className: 'space-y-3 mb-4 max-h-60 overflow-y-auto',
        children: n.map((l) =>
          e.jsxs(
            'div',
            {
              className: 'flex items-center gap-3',
              children: [
                e.jsxs('div', {
                  className: 'flex-1',
                  children: [
                    e.jsx('p', { className: 'font-semibold text-sm', children: l.menuItem.name }),
                    e.jsxs('p', {
                      className: 'text-primary text-xs font-bold',
                      children: ['$', l.menuItem.price, ' c/u'],
                    }),
                  ],
                }),
                e.jsxs('div', {
                  className: 'flex items-center gap-1',
                  children: [
                    e.jsx('button', {
                      onClick: () => d(l.menuItem.id, l.quantity - 1),
                      className:
                        'w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center',
                      children: e.jsx(M, { size: 10 }),
                    }),
                    e.jsx('span', {
                      className: 'w-6 text-center text-sm font-bold',
                      children: l.quantity,
                    }),
                    e.jsx('button', {
                      onClick: () => d(l.menuItem.id, l.quantity + 1),
                      className:
                        'w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center',
                      children: e.jsx(N, { size: 10 }),
                    }),
                  ],
                }),
                e.jsxs('p', {
                  className: 'font-bold text-sm w-16 text-right',
                  children: ['$', (l.menuItem.price * l.quantity).toFixed(0)],
                }),
                e.jsx('button', {
                  onClick: () => i(l.menuItem.id),
                  className: 'text-gray-400 hover:text-red-500',
                  children: e.jsx(P, { size: 14 }),
                }),
              ],
            },
            l.menuItem.id,
          ),
        ),
      }),
      e.jsx('div', {
        className: 'border-t pt-3 mb-4',
        children: e.jsxs('div', {
          className: 'flex justify-between font-bold text-lg',
          children: [
            e.jsx('span', { children: 'Total' }),
            e.jsxs('span', { className: 'text-primary', children: ['$', m.toFixed(2)] }),
          ],
        }),
      }),
      s
        ? e.jsxs(j.div, {
            initial: { opacity: 0, y: -10 },
            animate: { opacity: 1, y: 0 },
            className: 'bg-green-50 rounded-lg p-4',
            children: [
              e.jsxs('p', {
                className: 'text-sm text-green-700 mb-3 text-center',
                children: ['¿Confirmar pedido para Mesa #', r, '?'],
              }),
              e.jsxs('div', {
                className: 'flex gap-2',
                children: [
                  e.jsx('button', {
                    onClick: () => a(!1),
                    className:
                      'flex-1 py-2 border border-gray-300 rounded-lg text-sm font-semibold',
                    children: 'Cancelar',
                  }),
                  e.jsx('button', {
                    onClick: C,
                    disabled: u,
                    className:
                      'flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-1',
                    children: u
                      ? 'Enviando...'
                      : e.jsxs(e.Fragment, { children: [e.jsx($, { size: 14 }), ' Confirmar'] }),
                  }),
                ],
              }),
            ],
          })
        : e.jsx('button', {
            onClick: () => a(!0),
            className:
              'w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors',
            children: 'Enviar Pedido a Cocina',
          }),
    ],
  })
}
function A({ tableNumber: n }) {
  return e.jsxs('div', {
    className: 'bg-primary text-white rounded-xl p-4 mb-6 flex items-center gap-3',
    children: [
      e.jsx('div', {
        className: 'bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center',
        children: e.jsx(I, { size: 24 }),
      }),
      e.jsxs('div', {
        children: [
          e.jsxs('h2', { className: 'font-display text-xl', children: ['Mesa #', n] }),
          e.jsx('p', {
            className: 'text-white/80 text-sm',
            children: 'Agrega platos y envía tu pedido',
          }),
        ],
      }),
    ],
  })
}
function O() {
  const [n] = f(),
    i = parseInt(n.get('t') || '0')
  return !i || i < 1
    ? e.jsx('div', {
        className: 'min-h-screen bg-gray-50 flex items-center justify-center p-4',
        children: e.jsxs('div', {
          className: 'text-center',
          children: [
            e.jsx('h1', {
              className: 'text-2xl font-display text-gray-600 mb-4',
              children: 'Mesa no válida',
            }),
            e.jsx('p', {
              className: 'text-gray-400',
              children: 'Escanea el QR de tu mesa para comenzar',
            }),
          ],
        }),
      })
    : e.jsx(q, {
        children: e.jsx('div', {
          className: 'min-h-screen bg-gray-50',
          children: e.jsxs('div', {
            className: 'max-w-4xl mx-auto px-4 py-6',
            children: [
              e.jsx(A, { tableNumber: i }),
              e.jsxs('div', {
                className: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
                children: [
                  e.jsx('div', { className: 'lg:col-span-2', children: e.jsx(F, {}) }),
                  e.jsx('div', {
                    className: 'lg:col-span-1',
                    children: e.jsx('div', { className: 'sticky top-6', children: e.jsx(S, {}) }),
                  }),
                ],
              }),
            ],
          }),
        }),
      })
}
export { O as default }
