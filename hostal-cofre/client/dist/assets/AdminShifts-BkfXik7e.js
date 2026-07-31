import {
  r as l,
  j as e,
  E as D,
  m as g,
  G as $,
  H as L,
  e as H,
  C as T,
  a as m,
  z as i,
} from './index-BSHWOaHa.js'
import { S as n } from './index-D3_cjjpb.js'
function U() {
  const [j, A] = l.useState([]),
    [c, E] = l.useState([]),
    [b, u] = l.useState(!0),
    [z, o] = l.useState(!1),
    [a, d] = l.useState(null),
    [x, f] = l.useState(''),
    [N, F] = l.useState('manana'),
    [h, y] = l.useState(''),
    [v, C] = l.useState(''),
    [r, S] = l.useState(''),
    [w, k] = l.useState(''),
    p = async () => {
      try {
        u(!0)
        const [s, t] = await Promise.all([m.get('/shifts'), m.get('/shifts/current')])
        ;(A(s.data.data),
          E(Array.isArray(t.data.data) ? t.data.data : t.data.data ? [t.data.data] : []))
      } catch {
        i.error('Error al cargar turnos')
      } finally {
        u(!1)
      }
    }
  l.useEffect(() => {
    p()
  }, [])
  const O = async () => {
      var s, t
      if (!x || !h) {
        i.error('Nombre y efectivo inicial son requeridos')
        return
      }
      try {
        ;(await m.post('/shifts/open', {
          cashierName: x,
          shiftPeriod: N,
          openingCash: parseFloat(h),
          notes: v || void 0,
        }),
          i.success(`Turno abierto para ${x}`),
          o(!1),
          f(''),
          y(''),
          C(''),
          p())
      } catch (P) {
        i.error(
          ((t = (s = P.response) == null ? void 0 : s.data) == null ? void 0 : t.error) ||
            'Error al abrir turno',
        )
      }
    },
    R = async () => {
      if (!(!a || !r))
        try {
          ;(await m.patch(`/shifts/${a.id}/close`, {
            closingCash: parseFloat(r),
            notes: w || void 0,
          }),
            i.success(`Turno de ${a.cashierName} cerrado`),
            d(null),
            S(''),
            k(''),
            p())
        } catch {
          i.error('Error al cerrar turno')
        }
    }
  return e.jsxs(e.Fragment, {
    children: [
      e.jsxs('div', {
        className: 'container-main',
        children: [
          e.jsxs('div', {
            className: 'flex items-center justify-between mb-6',
            children: [
              e.jsx('h1', { className: 'text-3xl font-display', children: 'Turnos' }),
              e.jsxs('button', {
                onClick: () => o(!0),
                className: 'btn-primary text-sm px-4 py-2 flex items-center gap-1',
                children: [e.jsx(D, { size: 16 }), ' Abrir Turno'],
              }),
            ],
          }),
          c.length > 0 &&
            e.jsxs('div', {
              className: 'mb-6',
              children: [
                e.jsxs('h2', {
                  className: 'text-lg font-display mb-3 flex items-center gap-2',
                  children: [
                    e.jsx('span', { className: 'w-2 h-2 bg-green-500 rounded-full animate-pulse' }),
                    'Turnos Activos (',
                    c.length,
                    ')',
                  ],
                }),
                e.jsx('div', {
                  className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
                  children: c.map((s) => {
                    const t = n[s.shiftPeriod]
                    return e.jsxs(
                      g.div,
                      {
                        initial: { opacity: 0, y: 10 },
                        animate: { opacity: 1, y: 0 },
                        className: 'bg-primary/5 border-2 border-primary/20 rounded-2xl p-5',
                        children: [
                          e.jsxs('div', {
                            className: 'flex items-center justify-between mb-3',
                            children: [
                              e.jsxs('div', {
                                className: 'flex items-center gap-2',
                                children: [
                                  e.jsx('div', {
                                    className:
                                      'w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white',
                                    children: e.jsx($, { size: 16 }),
                                  }),
                                  e.jsxs('div', {
                                    children: [
                                      e.jsx('p', {
                                        className: 'font-bold text-green-800',
                                        children: s.cashierName,
                                      }),
                                      e.jsx('span', {
                                        className: `text-xs px-2 py-0.5 rounded-full font-semibold ${t.color}`,
                                        children: t.label,
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              e.jsxs('button', {
                                onClick: () => d(s),
                                className:
                                  'px-3 py-1.5 bg-accent text-white rounded-lg text-xs font-semibold hover:bg-accent-dark flex items-center gap-1',
                                children: [e.jsx(L, { size: 12 }), ' Cerrar'],
                              }),
                            ],
                          }),
                          e.jsxs('div', {
                            className: 'grid grid-cols-2 gap-2 mb-3',
                            children: [
                              e.jsxs('div', {
                                className: 'bg-white rounded-lg p-2 text-center',
                                children: [
                                  e.jsxs('div', {
                                    className: 'text-lg font-bold',
                                    children: ['$', s.totalSales.toLocaleString()],
                                  }),
                                  e.jsx('div', {
                                    className: 'text-xs text-gray-500',
                                    children: 'Ventas',
                                  }),
                                ],
                              }),
                              e.jsxs('div', {
                                className: 'bg-white rounded-lg p-2 text-center',
                                children: [
                                  e.jsx('div', {
                                    className: 'text-lg font-bold',
                                    children: s.totalOrders,
                                  }),
                                  e.jsx('div', {
                                    className: 'text-xs text-gray-500',
                                    children: 'Pedidos',
                                  }),
                                ],
                              }),
                            ],
                          }),
                          e.jsxs('div', {
                            className: 'flex justify-between text-xs text-gray-500',
                            children: [
                              e.jsxs('span', {
                                children: ['Efectivo: $', s.cashReceived.toLocaleString()],
                              }),
                              e.jsxs('span', {
                                children: ['Digital: $', s.digitalTotal.toLocaleString()],
                              }),
                            ],
                          }),
                          e.jsxs('p', {
                            className: 'text-xs text-gray-400 mt-2 flex items-center gap-1',
                            children: [
                              e.jsx(H, { size: 10 }),
                              ' ',
                              new Date(s.openedAt).toLocaleTimeString('es-CO', {
                                hour: '2-digit',
                                minute: '2-digit',
                              }),
                            ],
                          }),
                        ],
                      },
                      s.id,
                    )
                  }),
                }),
              ],
            }),
          c.length === 0 &&
            !b &&
            e.jsxs('div', {
              className: 'bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-center',
              children: [
                e.jsx('p', {
                  className: 'text-yellow-700 font-semibold',
                  children: 'No hay turnos abiertos',
                }),
                e.jsx('p', {
                  className: 'text-yellow-600 text-sm',
                  children: 'Abre un turno para comenzar a registrar ventas',
                }),
              ],
            }),
          e.jsx('h2', { className: 'text-lg font-display mb-3', children: 'Historial de Turnos' }),
          b
            ? e.jsx('div', {
                className: 'text-center py-12 text-gray-400',
                children: 'Cargando...',
              })
            : e.jsxs('div', {
                className: 'space-y-2',
                children: [
                  j
                    .filter((s) => s.status === 'closed')
                    .map((s) => {
                      const t = n[s.shiftPeriod]
                      return e.jsxs(
                        'div',
                        {
                          className:
                            'bg-white rounded-xl p-4 shadow-sm flex items-center justify-between',
                          children: [
                            e.jsxs('div', {
                              className: 'flex items-center gap-3',
                              children: [
                                e.jsx('div', {
                                  className:
                                    'w-10 h-10 rounded-lg bg-gray-400 flex items-center justify-center text-white',
                                  children: e.jsx(L, { size: 16 }),
                                }),
                                e.jsxs('div', {
                                  children: [
                                    e.jsxs('div', {
                                      className: 'flex items-center gap-2',
                                      children: [
                                        e.jsx('p', {
                                          className: 'font-semibold text-sm',
                                          children: s.cashierName,
                                        }),
                                        e.jsx('span', {
                                          className: `text-xs px-2 py-0.5 rounded-full font-semibold ${t.color}`,
                                          children: t.label,
                                        }),
                                      ],
                                    }),
                                    e.jsxs('p', {
                                      className: 'text-xs text-gray-500',
                                      children: [
                                        new Date(s.openedAt).toLocaleDateString('es-CO'),
                                        ' •',
                                        new Date(s.openedAt).toLocaleTimeString('es-CO', {
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        }),
                                        s.closedAt &&
                                          ` - ${new Date(s.closedAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`,
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            e.jsxs('div', {
                              className: 'text-right',
                              children: [
                                e.jsxs('p', {
                                  className: 'font-bold text-sm',
                                  children: ['$', s.totalSales.toLocaleString()],
                                }),
                                e.jsxs('p', {
                                  className: 'text-xs text-gray-500',
                                  children: [s.totalOrders, ' pedidos'],
                                }),
                              ],
                            }),
                          ],
                        },
                        s.id,
                      )
                    }),
                  j.filter((s) => s.status === 'closed').length === 0 &&
                    e.jsx('div', {
                      className: 'text-center py-12 text-gray-400',
                      children: 'No hay turnos cerrados',
                    }),
                ],
              }),
        ],
      }),
      z &&
        e.jsx('div', {
          className: 'modal-overlay',
          children: e.jsxs(g.div, {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            className: 'modal-content',
            children: [
              e.jsxs('div', {
                className: 'flex items-center justify-between mb-6',
                children: [
                  e.jsx('h2', { className: 'text-2xl font-display', children: 'Abrir Turno' }),
                  e.jsx('button', {
                    onClick: () => o(!1),
                    className: 'text-gray-400 hover:text-gray-600',
                    children: e.jsx(T, { size: 24 }),
                  }),
                ],
              }),
              e.jsxs('div', {
                className: 'space-y-4 mb-6',
                children: [
                  e.jsxs('div', {
                    children: [
                      e.jsx('label', {
                        className: 'text-sm font-semibold text-gray-700 mb-1 block',
                        children: 'Nombre del cajero/encargado *',
                      }),
                      e.jsx('input', {
                        type: 'text',
                        value: x,
                        onChange: (s) => f(s.target.value),
                        className: 'input-field',
                        placeholder: 'Ej: María López',
                      }),
                    ],
                  }),
                  e.jsxs('div', {
                    children: [
                      e.jsx('label', {
                        className: 'text-sm font-semibold text-gray-700 mb-2 block',
                        children: 'Turno *',
                      }),
                      e.jsx('div', {
                        className: 'grid grid-cols-2 gap-2',
                        children: Object.entries(n).map(([s, t]) =>
                          e.jsxs(
                            'button',
                            {
                              onClick: () => F(s),
                              className: `p-3 rounded-xl border-2 text-left transition-all ${N === s ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`,
                              children: [
                                e.jsx('div', { className: 'font-bold text-sm', children: t.label }),
                                e.jsx('div', {
                                  className: 'text-xs text-gray-500',
                                  children: t.hours,
                                }),
                              ],
                            },
                            s,
                          ),
                        ),
                      }),
                    ],
                  }),
                  e.jsxs('div', {
                    children: [
                      e.jsx('label', {
                        className: 'text-sm font-semibold text-gray-700 mb-1 block',
                        children: 'Efectivo en caja inicial *',
                      }),
                      e.jsx('input', {
                        type: 'number',
                        value: h,
                        onChange: (s) => y(s.target.value),
                        className: 'input-field text-xl font-bold text-center',
                        placeholder: '0',
                        min: '0',
                      }),
                    ],
                  }),
                  e.jsxs('div', {
                    children: [
                      e.jsx('label', {
                        className: 'text-sm font-semibold text-gray-700 mb-1 block',
                        children: 'Notas (opcional)',
                      }),
                      e.jsx('textarea', {
                        value: v,
                        onChange: (s) => C(s.target.value),
                        className: 'input-field h-16 resize-none text-sm',
                        placeholder: 'Observaciones del turno...',
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs('div', {
                className: 'flex gap-3',
                children: [
                  e.jsx('button', {
                    onClick: () => o(!1),
                    className: 'flex-1 py-3 border border-gray-300 rounded-xl font-semibold',
                    children: 'Cancelar',
                  }),
                  e.jsx('button', {
                    onClick: O,
                    className:
                      'flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark',
                    children: 'Abrir Turno',
                  }),
                ],
              }),
            ],
          }),
        }),
      a &&
        e.jsx('div', {
          className: 'modal-overlay',
          children: e.jsxs(g.div, {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            className: 'modal-content',
            children: [
              e.jsxs('div', {
                className: 'flex items-center justify-between mb-4',
                children: [
                  e.jsx('h2', { className: 'text-2xl font-display', children: 'Cerrar Turno' }),
                  e.jsx('button', {
                    onClick: () => d(null),
                    className: 'text-gray-400 hover:text-gray-600',
                    children: e.jsx(T, { size: 24 }),
                  }),
                ],
              }),
              e.jsxs('div', {
                className: 'bg-gray-50 rounded-xl p-4 mb-4',
                children: [
                  e.jsxs('div', {
                    className: 'flex items-center gap-2 mb-3',
                    children: [
                      e.jsx($, { size: 16, className: 'text-gray-500' }),
                      e.jsx('span', { className: 'font-bold', children: a.cashierName }),
                      e.jsx('span', {
                        className: `text-xs px-2 py-0.5 rounded-full font-semibold ${n[a.shiftPeriod].color}`,
                        children: n[a.shiftPeriod].label,
                      }),
                    ],
                  }),
                  e.jsxs('div', {
                    className: 'space-y-2 text-sm',
                    children: [
                      e.jsxs('div', {
                        className: 'flex justify-between',
                        children: [
                          e.jsx('span', {
                            className: 'text-gray-600',
                            children: 'Efectivo inicial:',
                          }),
                          e.jsxs('span', {
                            className: 'font-bold',
                            children: ['$', a.openingCash.toLocaleString()],
                          }),
                        ],
                      }),
                      e.jsxs('div', {
                        className: 'flex justify-between',
                        children: [
                          e.jsx('span', {
                            className: 'text-gray-600',
                            children: 'Ventas totales:',
                          }),
                          e.jsxs('span', {
                            className: 'font-bold',
                            children: ['$', a.totalSales.toLocaleString()],
                          }),
                        ],
                      }),
                      e.jsxs('div', {
                        className: 'flex justify-between',
                        children: [
                          e.jsx('span', {
                            className: 'text-gray-600',
                            children: 'Efectivo recibido:',
                          }),
                          e.jsxs('span', {
                            className: 'font-bold',
                            children: ['$', a.cashReceived.toLocaleString()],
                          }),
                        ],
                      }),
                      e.jsxs('div', {
                        className: 'border-t pt-2 flex justify-between',
                        children: [
                          e.jsx('span', {
                            className: 'text-gray-600 font-semibold',
                            children: 'Esperado en caja:',
                          }),
                          e.jsxs('span', {
                            className: 'font-bold text-primary',
                            children: ['$', (a.openingCash + a.cashReceived).toLocaleString()],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs('div', {
                className: 'space-y-4 mb-4',
                children: [
                  e.jsxs('div', {
                    children: [
                      e.jsx('label', {
                        className: 'text-sm font-semibold text-gray-700 mb-1 block',
                        children: 'Conteo de efectivo en caja *',
                      }),
                      e.jsx('input', {
                        type: 'number',
                        value: r,
                        onChange: (s) => S(s.target.value),
                        className: 'input-field text-xl font-bold text-center',
                        placeholder: '0',
                        min: '0',
                      }),
                    ],
                  }),
                  parseFloat(r) > 0 &&
                    e.jsx('div', {
                      className: `text-center p-3 rounded-lg ${parseFloat(r) >= a.openingCash + a.cashReceived ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`,
                      children: e.jsxs('p', {
                        className: 'text-sm font-semibold',
                        children: [
                          'Diferencia: ',
                          parseFloat(r) >= a.openingCash + a.cashReceived ? '+' : '',
                          '$',
                          (parseFloat(r) - (a.openingCash + a.cashReceived)).toFixed(2),
                        ],
                      }),
                    }),
                  e.jsxs('div', {
                    children: [
                      e.jsx('label', {
                        className: 'text-sm font-semibold text-gray-700 mb-1 block',
                        children: 'Notas de cierre (opcional)',
                      }),
                      e.jsx('textarea', {
                        value: w,
                        onChange: (s) => k(s.target.value),
                        className: 'input-field h-16 resize-none text-sm',
                        placeholder: 'Observaciones del cierre...',
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs('div', {
                className: 'flex gap-3',
                children: [
                  e.jsx('button', {
                    onClick: () => d(null),
                    className: 'flex-1 py-3 border border-gray-300 rounded-xl font-semibold',
                    children: 'Cancelar',
                  }),
                  e.jsx('button', {
                    onClick: R,
                    className:
                      'flex-1 py-3 bg-accent text-white rounded-xl font-bold hover:bg-accent-dark',
                    children: 'Cerrar Turno',
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  })
}
export { U as default }
