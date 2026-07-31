import {
  u as F,
  r as i,
  a as P,
  j as e,
  m as c,
  d as S,
  e as V,
  c as Z,
  f as A,
  A as L,
  g as R,
  b as O,
  h as B,
  i as W,
  k as G,
  l as H,
  z as j,
  n as Q,
  w as U,
} from './index-BSHWOaHa.js'
function J({ onNext: o, onBack: f }) {
  const { deliveryZone: r, setDeliveryZone: d } = F(),
    [u, v] = i.useState([]),
    [t, N] = i.useState(''),
    [h, m] = i.useState(''),
    [y, l] = i.useState(!0)
  i.useEffect(() => {
    P.get('/orders/zones')
      .then((s) => v(s.data.data))
      .catch(() => {})
      .finally(() => l(!1))
  }, [])
  const n = () => {
    !r || !t.trim() || o()
  }
  return y
    ? e.jsxs('div', {
        className: 'text-center py-12',
        children: [
          e.jsx('div', {
            className:
              'animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4',
          }),
          e.jsx('p', { className: 'text-gray-400', children: 'Cargando zonas de entrega...' }),
        ],
      })
    : e.jsxs(c.div, {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        className: 'space-y-6',
        children: [
          e.jsxs('div', {
            children: [
              e.jsxs('h3', {
                className: 'text-xl font-display mb-4 flex items-center gap-2',
                children: [e.jsx(S, { className: 'text-primary' }), ' Dirección de entrega'],
              }),
              e.jsx('input', {
                type: 'text',
                placeholder: 'Calle, número, barrio, referencias...',
                value: t,
                onChange: (s) => N(s.target.value),
                className: 'input-field',
              }),
              e.jsx('textarea', {
                placeholder:
                  'Indicaciones adicionales (optional): apartamento, punto de referencia, etc.',
                value: h,
                onChange: (s) => m(s.target.value),
                className: 'input-field h-20 resize-none mt-3',
              }),
            ],
          }),
          e.jsxs('div', {
            children: [
              e.jsx('h3', { className: 'text-xl font-display mb-4', children: 'Zona de entrega' }),
              e.jsx('div', {
                className: 'grid grid-cols-1 gap-3',
                children: u.map((s) =>
                  e.jsxs(
                    'button',
                    {
                      onClick: () => d(s.name),
                      className: `p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${r === s.name ? 'border-primary bg-primary/5 shadow-lg' : 'border-gray-200 hover:border-primary/50'}`,
                      children: [
                        e.jsxs('div', {
                          className: 'flex items-center gap-3',
                          children: [
                            e.jsx('div', {
                              className: `w-10 h-10 rounded-lg flex items-center justify-center ${r === s.name ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`,
                              children: e.jsx(S, { size: 18 }),
                            }),
                            e.jsxs('div', {
                              children: [
                                e.jsx('div', { className: 'font-bold', children: s.label }),
                                e.jsxs('div', {
                                  className: 'text-sm text-gray-500 flex items-center gap-1',
                                  children: [
                                    e.jsx(V, { size: 12 }),
                                    ' ~',
                                    s.estimatedMinutes,
                                    ' min',
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs('div', {
                          className: 'text-right',
                          children: [
                            e.jsxs('div', {
                              className: 'font-bold text-primary',
                              children: ['$', s.fee.toLocaleString()],
                            }),
                            e.jsx('div', { className: 'text-xs text-gray-400', children: 'envío' }),
                          ],
                        }),
                      ],
                    },
                    s.name,
                  ),
                ),
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'flex gap-4 pt-4',
            children: [
              e.jsx('button', { onClick: f, className: 'btn-outline flex-1', children: 'Volver' }),
              e.jsx('button', {
                onClick: n,
                disabled: !r || !t.trim(),
                className: 'btn-primary flex-1 disabled:opacity-50',
                children: 'Continuar',
              }),
            ],
          }),
        ],
      })
}
function K() {
  const {
      items: o,
      removeItem: f,
      updateQuantity: r,
      total: d,
      clearCart: u,
      itemCount: v,
      orderType: t,
      setOrderType: N,
      deliveryZone: h,
      deliveryFee: m,
      grandTotal: y,
    } = F(),
    { user: l } = Z(),
    [n, s] = i.useState('cart'),
    [x, I] = i.useState((l == null ? void 0 : l.name) || ''),
    [p, T] = i.useState(''),
    [C, q] = i.useState((l == null ? void 0 : l.email) || ''),
    [k, E] = i.useState('cash'),
    [w, $] = i.useState(!1)
  if (o.length === 0)
    return e.jsxs('div', {
      className: 'text-center py-20',
      children: [
        e.jsx(A, { className: 'mx-auto text-6xl text-gray-300 mb-6' }),
        e.jsx('h2', {
          className: 'text-2xl font-display text-gray-600 mb-4',
          children: 'Tu carrito está vacío',
        }),
        e.jsx('p', {
          className: 'text-gray-400 mb-8',
          children: 'Explora nuestro menú y añade tus platillos favoritos',
        }),
        e.jsx('a', { href: '/menu', className: 'btn-primary', children: 'Ver Menú' }),
      ],
    })
  const D = async () => {
    if (!x || !p) {
      j.error('Nombre y teléfono son requeridos')
      return
    }
    $(!0)
    try {
      const a = o.map((b) => ({ menuItemId: b.menuItem.id, quantity: b.quantity }))
      if (
        (await P.post('/orders', {
          customerName: x,
          customerPhone: p,
          ...(C ? { customerEmail: C } : {}),
          items: a,
          paymentMethod: k,
          orderType: t,
          deliveryZone: t === 'domicilio' ? h : void 0,
        }),
        t !== 'mesa')
      ) {
        const b = o.map(
            (g) =>
              `${g.quantity}x ${g.menuItem.name} - $${(g.menuItem.price * g.quantity).toFixed(0)}`,
          ),
          M = t === 'domicilio' ? 'Domicilio' : 'Tienda',
          z =
            b.join(`
`) +
            `

Tipo: ${M}` +
            (t === 'domicilio'
              ? `
Envío: $${m}`
              : '') +
            `

*Total: $${(t === 'domicilio' ? y : d).toFixed(2)}*
Método de pago: ${k.toUpperCase()}
Cliente: ${x}
Tel: ${p}`
        U.sendOrder('573001234567', z)
      }
      ;(j.success(
        t === 'mesa' ? 'Pedido registrado en mesa' : 'Pedido registrado y enviado por WhatsApp',
      ),
        u(),
        s('cart'))
    } catch {
      j.error('Error al registrar pedido')
    } finally {
      $(!1)
    }
  }
  return e.jsxs('div', {
    className: 'max-w-4xl mx-auto',
    children: [
      n === 'cart' &&
        e.jsxs(c.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          children: [
            e.jsxs('div', {
              className: 'flex items-center justify-between mb-8',
              children: [
                e.jsxs('h2', {
                  className: 'text-3xl font-display',
                  children: ['Tu Carrito (', v, ')'],
                }),
                e.jsx('button', {
                  onClick: u,
                  className: 'text-red-500 hover:text-red-700 text-sm font-semibold',
                  children: 'Vaciar',
                }),
              ],
            }),
            e.jsx('div', {
              className: 'space-y-4 mb-8',
              children: e.jsx(L, {
                children: o.map((a) =>
                  e.jsxs(
                    c.div,
                    {
                      layout: !0,
                      initial: { opacity: 0, x: -20 },
                      animate: { opacity: 1, x: 0 },
                      exit: { opacity: 0, x: 20 },
                      className: 'flex items-center gap-4 bg-white p-4 rounded-xl shadow-md',
                      children: [
                        e.jsx('img', {
                          src: a.menuItem.image,
                          alt: a.menuItem.name,
                          className: 'w-20 h-20 object-cover rounded-lg',
                        }),
                        e.jsxs('div', {
                          className: 'flex-1',
                          children: [
                            e.jsx('h3', {
                              className: 'font-display text-lg',
                              children: a.menuItem.name,
                            }),
                            e.jsxs('p', {
                              className: 'text-primary font-bold',
                              children: ['$', a.menuItem.price, ' c/u'],
                            }),
                          ],
                        }),
                        e.jsxs('div', {
                          className: 'flex items-center gap-2',
                          children: [
                            e.jsx('button', {
                              onClick: () => r(a.menuItem.id, a.quantity - 1),
                              className:
                                'w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200',
                              children: e.jsx(R, { size: 14 }),
                            }),
                            e.jsx('span', {
                              className: 'w-8 text-center font-bold',
                              children: a.quantity,
                            }),
                            e.jsx('button', {
                              onClick: () => r(a.menuItem.id, a.quantity + 1),
                              className:
                                'w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200',
                              children: e.jsx(O, { size: 14 }),
                            }),
                          ],
                        }),
                        e.jsxs('p', {
                          className: 'font-bold text-lg w-20 text-right',
                          children: ['$', (a.menuItem.price * a.quantity).toFixed(0)],
                        }),
                        e.jsx('button', {
                          onClick: () => f(a.menuItem.id),
                          className: 'text-gray-400 hover:text-red-500 transition-colors',
                          children: e.jsx(B, { size: 18 }),
                        }),
                      ],
                    },
                    a.menuItem.id,
                  ),
                ),
              }),
            }),
            e.jsx('div', {
              className: 'bg-gray-50 rounded-2xl p-6 mb-8',
              children: e.jsxs('div', {
                className: 'flex justify-between text-xl font-bold',
                children: [
                  e.jsx('span', { children: 'Subtotal' }),
                  e.jsxs('span', { className: 'text-primary', children: ['$', d.toFixed(2)] }),
                ],
              }),
            }),
            e.jsx('button', {
              onClick: () => s('type'),
              className: 'btn-primary w-full text-lg',
              children: 'Continuar al Checkout',
            }),
          ],
        }),
      n === 'type' &&
        e.jsxs(c.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          children: [
            e.jsx('h2', {
              className: 'text-3xl font-display mb-8',
              children: '¿Cómo quieres tu pedido?',
            }),
            e.jsx('div', {
              className: 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-8',
              children: [
                {
                  key: 'domicilio',
                  label: 'Domicilio',
                  icon: W,
                  desc: 'Te lo llevamos a tu dirección',
                  color: 'bg-orange-500',
                },
                {
                  key: 'tienda',
                  label: 'Recoger en tienda',
                  icon: G,
                  desc: 'Pasas a buscar tu pedido',
                  color: 'bg-blue-500',
                },
                {
                  key: 'mesa',
                  label: 'Para la mesa',
                  icon: H,
                  desc: 'Comer en el restaurante',
                  color: 'bg-green-500',
                },
              ].map((a) =>
                e.jsxs(
                  'button',
                  {
                    onClick: () => N(a.key),
                    className: `p-6 rounded-xl border-2 text-center transition-all ${t === a.key ? 'border-primary bg-primary/5 shadow-lg scale-105' : 'border-gray-200 hover:border-primary/50'}`,
                    children: [
                      e.jsx('div', {
                        className: `${a.color} w-14 h-14 rounded-xl flex items-center justify-center text-white mx-auto mb-3`,
                        children: e.jsx(a.icon, { size: 24 }),
                      }),
                      e.jsx('div', { className: 'font-bold text-lg', children: a.label }),
                      e.jsx('div', { className: 'text-sm text-gray-500 mt-1', children: a.desc }),
                    ],
                  },
                  a.key,
                ),
              ),
            }),
            e.jsxs('div', {
              className: 'flex gap-4',
              children: [
                e.jsx('button', {
                  onClick: () => s('cart'),
                  className: 'btn-outline flex-1',
                  children: 'Volver',
                }),
                e.jsx('button', {
                  onClick: () => s(t === 'domicilio' ? 'delivery' : 'details'),
                  className: 'btn-primary flex-1',
                  children: 'Siguiente',
                }),
              ],
            }),
          ],
        }),
      n === 'delivery' && e.jsx(J, { onBack: () => s('type'), onNext: () => s('details') }),
      n === 'details' &&
        e.jsxs(c.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          children: [
            e.jsx('h2', {
              className: 'text-3xl font-display mb-8',
              children: t === 'mesa' ? 'Datos Rápidos' : 'Datos del Pedido',
            }),
            t === 'mesa' &&
              e.jsx('p', {
                className: 'text-gray-500 text-sm mb-4 -mt-6',
                children: 'Solo nombre y teléfono para agilizar tu pedido en mesa',
              }),
            e.jsxs('div', {
              className: 'space-y-4 mb-8',
              children: [
                e.jsx('input', {
                  type: 'text',
                  placeholder: 'Nombre completo *',
                  value: x,
                  onChange: (a) => I(a.target.value),
                  className: 'input-field',
                }),
                e.jsx('input', {
                  type: 'tel',
                  placeholder: 'Teléfono *',
                  value: p,
                  onChange: (a) => T(a.target.value),
                  className: 'input-field',
                }),
                t !== 'mesa' &&
                  e.jsx('input', {
                    type: 'email',
                    placeholder: 'Email',
                    value: C,
                    onChange: (a) => q(a.target.value),
                    className: 'input-field',
                  }),
              ],
            }),
            e.jsxs('div', {
              className: 'flex gap-4',
              children: [
                e.jsx('button', {
                  onClick: () => s(t === 'domicilio' ? 'delivery' : 'type'),
                  className: 'btn-outline flex-1',
                  children: 'Volver',
                }),
                e.jsx('button', {
                  onClick: () => {
                    x && p ? s('payment') : j.error('Nombre y teléfono son requeridos')
                  },
                  className: 'btn-primary flex-1',
                  children: 'Siguiente',
                }),
              ],
            }),
          ],
        }),
      n === 'payment' &&
        e.jsxs(c.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          children: [
            e.jsx('h2', { className: 'text-3xl font-display mb-8', children: 'Método de Pago' }),
            e.jsx('div', {
              className: 'grid grid-cols-2 gap-4 mb-8',
              children: [
                { key: 'cash', label: 'Efectivo', icon: '💵', desc: 'Paga al recoger' },
                { key: 'wompi', label: 'Wompi', icon: '💳', desc: 'Tarjeta / PSE' },
                { key: 'nequi', label: 'Nequi', icon: '📱', desc: 'Transferencia' },
                { key: 'daviplata', label: 'DaviPlata', icon: '📲', desc: 'Transferencia' },
              ].map((a) =>
                e.jsxs(
                  'button',
                  {
                    onClick: () => E(a.key),
                    className: `p-4 rounded-xl border-2 text-left transition-all ${k === a.key ? 'border-primary bg-primary/5 shadow-lg' : 'border-gray-200 hover:border-gray-300'}`,
                    children: [
                      e.jsx('span', { className: 'text-2xl', children: a.icon }),
                      e.jsx('div', { className: 'font-bold mt-2', children: a.label }),
                      e.jsx('div', { className: 'text-sm text-gray-500', children: a.desc }),
                    ],
                  },
                  a.key,
                ),
              ),
            }),
            e.jsxs('div', {
              className: 'bg-gray-50 rounded-2xl p-6 mb-8 space-y-2',
              children: [
                e.jsxs('div', {
                  className: 'flex justify-between text-sm text-gray-600',
                  children: [
                    e.jsx('span', { children: 'Subtotal' }),
                    e.jsxs('span', { children: ['$', d.toFixed(2)] }),
                  ],
                }),
                t === 'domicilio' &&
                  m > 0 &&
                  e.jsxs('div', {
                    className: 'flex justify-between text-sm text-gray-600',
                    children: [
                      e.jsxs('span', { children: ['Envío (', h, ')'] }),
                      e.jsxs('span', { children: ['$', m.toLocaleString()] }),
                    ],
                  }),
                e.jsxs('div', {
                  className: 'border-t pt-2 flex justify-between text-xl font-bold',
                  children: [
                    e.jsx('span', { children: 'Total a pagar' }),
                    e.jsxs('span', {
                      className: 'text-primary',
                      children: ['$', (t === 'domicilio' ? y : d).toFixed(2)],
                    }),
                  ],
                }),
              ],
            }),
            e.jsxs('div', {
              className: 'flex gap-4',
              children: [
                e.jsx('button', {
                  onClick: () => s('details'),
                  className: 'btn-outline flex-1',
                  children: 'Volver',
                }),
                e.jsx('button', {
                  onClick: D,
                  disabled: w,
                  className:
                    'flex-1 flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50',
                  children: w
                    ? 'Registrando...'
                    : e.jsxs(e.Fragment, { children: [e.jsx(Q, { size: 20 }), ' Enviar Pedido'] }),
                }),
              ],
            }),
          ],
        }),
    ],
  })
}
function _() {
  return e.jsx('section', {
    className: 'section-padding pt-28',
    children: e.jsx('div', { className: 'container-main', children: e.jsx(K, {}) }),
  })
}
export { _ as default }
