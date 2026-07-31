import {
  r as i,
  j as e,
  t as j,
  m as d,
  q as c,
  f as u,
  y,
  i as N,
  l as f,
  k as b,
  a as v,
  z as w,
} from './index-BSHWOaHa.js'
import { S } from './index-D3_cjjpb.js'
function T() {
  const [a, o] = i.useState(null),
    [x, n] = i.useState(!0),
    [r, m] = i.useState(new Date().toISOString().split('T')[0]),
    h = async (s) => {
      try {
        n(!0)
        const t = await v.get('/reports/daily', { params: { date: s || r } })
        o(t.data.data)
      } catch {
        w.error('Error al cargar reporte')
      } finally {
        n(!1)
      }
    }
  return (
    i.useEffect(() => {
      h()
    }, [r]),
    e.jsxs('div', {
      className: 'container-main',
      children: [
        e.jsxs('div', {
          className: 'flex items-center justify-between mb-8',
          children: [
            e.jsx('h1', { className: 'text-3xl font-display', children: 'Reportes Diarios' }),
            e.jsxs('div', {
              className: 'flex items-center gap-2',
              children: [
                e.jsx(j, { className: 'text-gray-400' }),
                e.jsx('input', {
                  type: 'date',
                  value: r,
                  onChange: (s) => m(s.target.value),
                  className: 'input-field',
                }),
              ],
            }),
          ],
        }),
        x
          ? e.jsx('div', {
              className: 'text-center py-20 text-gray-400',
              children: 'Cargando reporte...',
            })
          : a
            ? e.jsxs(e.Fragment, {
                children: [
                  e.jsxs('div', {
                    className: 'grid grid-cols-2 md:grid-cols-4 gap-4 mb-8',
                    children: [
                      e.jsxs(d.div, {
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        className: 'bg-white rounded-2xl p-5 shadow-md',
                        children: [
                          e.jsx('div', {
                            className:
                              'bg-purple-500 w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3',
                            children: e.jsx(c, { size: 18 }),
                          }),
                          e.jsxs('div', {
                            className: 'text-2xl font-bold',
                            children: ['$', a.summary.totalSales.toLocaleString()],
                          }),
                          e.jsx('div', {
                            className: 'text-sm text-gray-500',
                            children: 'Ventas Totales',
                          }),
                        ],
                      }),
                      e.jsxs(d.div, {
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        transition: { delay: 0.1 },
                        className: 'bg-white rounded-2xl p-5 shadow-md',
                        children: [
                          e.jsx('div', {
                            className:
                              'bg-blue-500 w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3',
                            children: e.jsx(u, { size: 18 }),
                          }),
                          e.jsx('div', {
                            className: 'text-2xl font-bold',
                            children: a.summary.totalOrders,
                          }),
                          e.jsx('div', {
                            className: 'text-sm text-gray-500',
                            children: 'Pedidos Totales',
                          }),
                        ],
                      }),
                      e.jsxs(d.div, {
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        transition: { delay: 0.2 },
                        className: 'bg-white rounded-2xl p-5 shadow-md',
                        children: [
                          e.jsx('div', {
                            className:
                              'bg-green-500 w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3',
                            children: e.jsx(y, { size: 18 }),
                          }),
                          e.jsxs('div', {
                            className: 'text-2xl font-bold',
                            children: ['$', a.summary.averageTicket.toLocaleString()],
                          }),
                          e.jsx('div', {
                            className: 'text-sm text-gray-500',
                            children: 'Ticket Promedio',
                          }),
                        ],
                      }),
                      e.jsxs(d.div, {
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        transition: { delay: 0.3 },
                        className: 'bg-white rounded-2xl p-5 shadow-md',
                        children: [
                          e.jsx('div', {
                            className:
                              'bg-orange-500 w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3',
                            children: e.jsx(c, { size: 18 }),
                          }),
                          e.jsxs('div', {
                            className: 'text-2xl font-bold',
                            children: ['$', a.summary.cashSales.toLocaleString()],
                          }),
                          e.jsx('div', {
                            className: 'text-sm text-gray-500',
                            children: 'Efectivo',
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs('div', {
                    className: 'grid grid-cols-1 md:grid-cols-2 gap-6 mb-8',
                    children: [
                      e.jsxs('div', {
                        className: 'bg-white rounded-2xl p-6 shadow-md',
                        children: [
                          e.jsx('h3', {
                            className: 'font-display text-lg mb-4',
                            children: 'Ventas por Tipo de Pedido',
                          }),
                          e.jsx('div', {
                            className: 'space-y-3',
                            children: [
                              {
                                label: 'Domicilio',
                                count: a.summary.deliveryOrders,
                                icon: N,
                                color: 'bg-orange-500',
                              },
                              {
                                label: 'Tienda/POS',
                                count: a.summary.posOrders,
                                icon: f,
                                color: 'bg-blue-500',
                              },
                              {
                                label: 'Mesa',
                                count: a.summary.dineInOrders,
                                icon: b,
                                color: 'bg-green-500',
                              },
                            ].map((s, t) =>
                              e.jsxs(
                                'div',
                                {
                                  className: 'flex items-center gap-3',
                                  children: [
                                    e.jsx('div', {
                                      className: `${s.color} w-8 h-8 rounded-lg flex items-center justify-center text-white`,
                                      children: e.jsx(s.icon, { size: 14 }),
                                    }),
                                    e.jsxs('div', {
                                      className: 'flex-1',
                                      children: [
                                        e.jsxs('div', {
                                          className: 'flex justify-between text-sm',
                                          children: [
                                            e.jsx('span', { children: s.label }),
                                            e.jsx('span', {
                                              className: 'font-bold',
                                              children: s.count,
                                            }),
                                          ],
                                        }),
                                        e.jsx('div', {
                                          className: 'w-full bg-gray-100 rounded-full h-2 mt-1',
                                          children: e.jsx('div', {
                                            className: `${s.color} h-2 rounded-full`,
                                            style: {
                                              width: `${a.summary.totalOrders > 0 ? (s.count / a.summary.totalOrders) * 100 : 0}%`,
                                            },
                                          }),
                                        }),
                                      ],
                                    }),
                                  ],
                                },
                                t,
                              ),
                            ),
                          }),
                        ],
                      }),
                      e.jsxs('div', {
                        className: 'bg-white rounded-2xl p-6 shadow-md',
                        children: [
                          e.jsx('h3', {
                            className: 'font-display text-lg mb-4',
                            children: 'Métodos de Pago',
                          }),
                          e.jsxs('div', {
                            className: 'space-y-3',
                            children: [
                              e.jsxs('div', {
                                className: 'flex justify-between items-center py-2 border-b',
                                children: [
                                  e.jsx('span', {
                                    className: 'text-gray-600',
                                    children: 'Efectivo',
                                  }),
                                  e.jsxs('span', {
                                    className: 'font-bold',
                                    children: ['$', a.summary.cashSales.toLocaleString()],
                                  }),
                                ],
                              }),
                              e.jsxs('div', {
                                className: 'flex justify-between items-center py-2 border-b',
                                children: [
                                  e.jsx('span', {
                                    className: 'text-gray-600',
                                    children: 'Digital',
                                  }),
                                  e.jsxs('span', {
                                    className: 'font-bold',
                                    children: ['$', a.summary.digitalSales.toLocaleString()],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  a.topItems.length > 0 &&
                    e.jsxs('div', {
                      className: 'bg-white rounded-2xl p-6 shadow-md mb-8',
                      children: [
                        e.jsx('h3', {
                          className: 'font-display text-lg mb-4',
                          children: 'Top 10 Platos Más Vendidos',
                        }),
                        e.jsx('div', {
                          className: 'space-y-2',
                          children: a.topItems.map((s, t) =>
                            e.jsxs(
                              'div',
                              {
                                className: 'flex items-center gap-3 py-2 border-b last:border-0',
                                children: [
                                  e.jsx('span', {
                                    className:
                                      'w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold',
                                    children: t + 1,
                                  }),
                                  e.jsxs('div', {
                                    className: 'flex-1',
                                    children: [
                                      e.jsx('span', {
                                        className: 'font-semibold text-sm',
                                        children: s.name,
                                      }),
                                      e.jsxs('span', {
                                        className: 'text-gray-500 text-sm ml-2',
                                        children: ['(', s.count, ' uds)'],
                                      }),
                                    ],
                                  }),
                                  e.jsxs('span', {
                                    className: 'font-bold text-sm',
                                    children: ['$', s.revenue.toLocaleString()],
                                  }),
                                ],
                              },
                              t,
                            ),
                          ),
                        }),
                      ],
                    }),
                  a.hourlySales.length > 0 &&
                    e.jsxs('div', {
                      className: 'bg-white rounded-2xl p-6 shadow-md',
                      children: [
                        e.jsx('h3', {
                          className: 'font-display text-lg mb-4',
                          children: 'Ventas por Hora',
                        }),
                        e.jsx('div', {
                          className: 'flex items-end gap-1 h-40',
                          children: a.hourlySales.map((s, t) => {
                            const l = Math.max(...a.hourlySales.map((p) => p.sales)),
                              g = l > 0 ? (s.sales / l) * 100 : 0
                            return e.jsxs(
                              'div',
                              {
                                className: 'flex-1 flex flex-col items-center',
                                children: [
                                  e.jsxs('div', {
                                    className: 'text-xs text-gray-500 mb-1',
                                    children: ['$', (s.sales / 1e3).toFixed(0), 'k'],
                                  }),
                                  e.jsx('div', {
                                    className: 'w-full bg-primary rounded-t',
                                    style: {
                                      height: `${g}%`,
                                      minHeight: s.sales > 0 ? '4px' : '0',
                                    },
                                  }),
                                  e.jsxs('div', {
                                    className: 'text-xs text-gray-500 mt-1',
                                    children: [s.hour, 'h'],
                                  }),
                                ],
                              },
                              t,
                            )
                          }),
                        }),
                      ],
                    }),
                  a.shifts.length > 0 &&
                    e.jsxs('div', {
                      className: 'bg-white rounded-2xl p-6 shadow-md mt-8',
                      children: [
                        e.jsx('h3', {
                          className: 'font-display text-lg mb-4',
                          children: 'Turnos del Día',
                        }),
                        e.jsx('div', {
                          className: 'space-y-3',
                          children: a.shifts.map((s, t) => {
                            const l = s.shiftPeriod ? S[s.shiftPeriod] : null
                            return e.jsxs(
                              'div',
                              {
                                className: 'bg-gray-50 rounded-xl p-4',
                                children: [
                                  e.jsxs('div', {
                                    className: 'flex items-center justify-between mb-2',
                                    children: [
                                      e.jsxs('div', {
                                        className: 'flex items-center gap-2',
                                        children: [
                                          e.jsx('span', {
                                            className: 'font-semibold text-sm',
                                            children: s.cashier,
                                          }),
                                          l &&
                                            e.jsx('span', {
                                              className: `text-xs px-2 py-0.5 rounded-full font-semibold ${l.color}`,
                                              children: l.label,
                                            }),
                                          e.jsx('span', {
                                            className: `text-xs px-2 py-0.5 rounded-full font-semibold ${s.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`,
                                            children: s.status === 'open' ? 'Abierto' : 'Cerrado',
                                          }),
                                        ],
                                      }),
                                      e.jsxs('span', {
                                        className: 'text-gray-500 text-xs',
                                        children: [
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
                                  e.jsxs('div', {
                                    className: 'grid grid-cols-4 gap-2 text-center',
                                    children: [
                                      e.jsxs('div', {
                                        className: 'bg-white rounded-lg p-2',
                                        children: [
                                          e.jsxs('div', {
                                            className: 'text-sm font-bold',
                                            children: ['$', s.totalSales.toLocaleString()],
                                          }),
                                          e.jsx('div', {
                                            className: 'text-xs text-gray-500',
                                            children: 'Ventas',
                                          }),
                                        ],
                                      }),
                                      e.jsxs('div', {
                                        className: 'bg-white rounded-lg p-2',
                                        children: [
                                          e.jsx('div', {
                                            className: 'text-sm font-bold',
                                            children: s.totalOrders,
                                          }),
                                          e.jsx('div', {
                                            className: 'text-xs text-gray-500',
                                            children: 'Pedidos',
                                          }),
                                        ],
                                      }),
                                      e.jsxs('div', {
                                        className: 'bg-white rounded-lg p-2',
                                        children: [
                                          e.jsxs('div', {
                                            className: 'text-sm font-bold text-green-600',
                                            children: ['$', s.cashReceived.toLocaleString()],
                                          }),
                                          e.jsx('div', {
                                            className: 'text-xs text-gray-500',
                                            children: 'Efectivo',
                                          }),
                                        ],
                                      }),
                                      e.jsxs('div', {
                                        className: 'bg-white rounded-lg p-2',
                                        children: [
                                          e.jsxs('div', {
                                            className: 'text-sm font-bold text-blue-600',
                                            children: ['$', s.digitalTotal.toLocaleString()],
                                          }),
                                          e.jsx('div', {
                                            className: 'text-xs text-gray-500',
                                            children: 'Digital',
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              },
                              t,
                            )
                          }),
                        }),
                      ],
                    }),
                ],
              })
            : e.jsx('div', {
                className: 'text-center py-16 text-gray-400',
                children: e.jsx('p', {
                  className: 'text-xl',
                  children: 'No hay datos para esta fecha',
                }),
              }),
      ],
    })
  )
}
export { T as default }
