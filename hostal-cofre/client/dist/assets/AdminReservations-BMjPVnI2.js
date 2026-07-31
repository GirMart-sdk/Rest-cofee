import { r as n, j as e, B as g, m as f, a as y, z as d } from './index-BSHWOaHa.js'
const u = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  },
  r = { pending: 'Pendiente', confirmed: 'Confirmada', cancelled: 'Cancelada' }
function v() {
  const [l, c] = n.useState([]),
    [s, j] = n.useState('all'),
    [x, o] = n.useState(!0),
    m = async () => {
      try {
        o(!0)
        const t = await y.get('/reservations')
        c(t.data.data)
      } catch {
        d.error('Error al cargar reservas')
      } finally {
        o(!1)
      }
    }
  n.useEffect(() => {
    m()
  }, [])
  const h = s === 'all' ? l : l.filter((t) => t.status === s),
    p = async (t, a) => {
      try {
        ;(await y.patch(`/reservations/${t}/status`, { status: a }),
          c((b) => b.map((i) => (i.id === t ? { ...i, status: a } : i))),
          d.success(`Reserva ${r[a || 'pending'].toLowerCase()}`))
      } catch {
        d.error('Error al actualizar')
      }
    }
  return e.jsxs('div', {
    className: 'container-main',
    children: [
      e.jsxs('div', {
        className: 'flex items-center justify-between mb-8',
        children: [
          e.jsx('h1', { className: 'text-3xl font-display', children: 'Gestionar Reservas' }),
          e.jsxs('button', {
            onClick: m,
            className: 'btn-outline flex items-center gap-2',
            children: [e.jsx(g, {}), ' Actualizar'],
          }),
        ],
      }),
      e.jsx('div', {
        className: 'flex flex-wrap gap-2 mb-8',
        children: ['all', 'pending', 'confirmed', 'cancelled'].map((t) =>
          e.jsxs(
            'button',
            {
              onClick: () => j(t),
              className: `px-4 py-2 rounded-full text-sm font-semibold transition-all ${s === t ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`,
              children: [
                t === 'all' ? 'Todas' : r[t],
                ' (',
                t === 'all' ? l.length : l.filter((a) => a.status === t).length,
                ')',
              ],
            },
            t,
          ),
        ),
      }),
      x
        ? e.jsxs('div', {
            className: 'text-center py-16 text-gray-400',
            children: [
              e.jsx(g, { className: 'animate-spin mx-auto text-4xl mb-4' }),
              e.jsx('p', { children: 'Cargando reservas...' }),
            ],
          })
        : e.jsx('div', {
            className: 'bg-white rounded-2xl shadow-md overflow-hidden',
            children: e.jsx('div', {
              className: 'overflow-x-auto',
              children: e.jsxs('table', {
                className: 'w-full text-left',
                children: [
                  e.jsx('thead', {
                    className: 'bg-gray-50 border-b',
                    children: e.jsxs('tr', {
                      children: [
                        e.jsx('th', {
                          className: 'px-6 py-4 text-sm font-bold text-gray-600',
                          children: 'Cliente',
                        }),
                        e.jsx('th', {
                          className: 'px-6 py-4 text-sm font-bold text-gray-600',
                          children: 'Fecha/Hora',
                        }),
                        e.jsx('th', {
                          className: 'px-6 py-4 text-sm font-bold text-gray-600',
                          children: 'Personas',
                        }),
                        e.jsx('th', {
                          className: 'px-6 py-4 text-sm font-bold text-gray-600',
                          children: 'Mesa',
                        }),
                        e.jsx('th', {
                          className: 'px-6 py-4 text-sm font-bold text-gray-600',
                          children: 'Estado',
                        }),
                        e.jsx('th', {
                          className: 'px-6 py-4 text-sm font-bold text-gray-600',
                          children: 'Acciones',
                        }),
                      ],
                    }),
                  }),
                  e.jsx('tbody', {
                    className: 'divide-y',
                    children: h.map((t) =>
                      e.jsxs(
                        f.tr,
                        {
                          initial: { opacity: 0 },
                          animate: { opacity: 1 },
                          className: 'hover:bg-gray-50',
                          children: [
                            e.jsxs('td', {
                              className: 'px-6 py-4',
                              children: [
                                e.jsx('div', { className: 'font-semibold', children: t.name }),
                                e.jsx('div', {
                                  className: 'text-sm text-gray-500',
                                  children: t.phone,
                                }),
                              ],
                            }),
                            e.jsxs('td', {
                              className: 'px-6 py-4',
                              children: [
                                e.jsx('div', { children: t.date }),
                                e.jsx('div', {
                                  className: 'text-sm text-gray-500',
                                  children: t.time,
                                }),
                              ],
                            }),
                            e.jsx('td', {
                              className: 'px-6 py-4 font-semibold',
                              children: t.guests,
                            }),
                            e.jsx('td', {
                              className: 'px-6 py-4',
                              children: t.tableId ? `Mesa ${t.tableId}` : '-',
                            }),
                            e.jsx('td', {
                              className: 'px-6 py-4',
                              children: e.jsx('span', {
                                className: `px-3 py-1 rounded-full text-xs font-bold ${u[t.status || 'pending']}`,
                                children: r[t.status || 'pending'],
                              }),
                            }),
                            e.jsx('td', {
                              className: 'px-6 py-4',
                              children: e.jsxs('div', {
                                className: 'flex gap-2',
                                children: [
                                  t.status === 'pending' &&
                                    t.id &&
                                    e.jsx('button', {
                                      onClick: () => p(t.id, 'confirmed'),
                                      className:
                                        'px-3 py-1 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-dark',
                                      children: 'Confirmar',
                                    }),
                                  t.status !== 'cancelled' &&
                                    t.id &&
                                    e.jsx('button', {
                                      onClick: () => p(t.id, 'cancelled'),
                                      className:
                                        'px-3 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200',
                                      children: 'Cancelar',
                                    }),
                                ],
                              }),
                            }),
                          ],
                        },
                        t.id,
                      ),
                    ),
                  }),
                ],
              }),
            }),
          }),
      !x &&
        h.length === 0 &&
        e.jsx('div', {
          className: 'text-center py-16 text-gray-400',
          children: e.jsxs('p', {
            className: 'text-xl',
            children: ['No hay reservas ', s !== 'all' ? `con estado "${r[s]}"` : ''],
          }),
        }),
    ],
  })
}
export { v as default }
