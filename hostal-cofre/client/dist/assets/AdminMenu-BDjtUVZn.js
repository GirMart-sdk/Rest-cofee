import {
  r as n,
  j as e,
  B as y,
  b as E,
  m as f,
  F,
  C as P,
  D as z,
  h as k,
  a as o,
  z as l,
} from './index-BSHWOaHa.js'
function A() {
  const [m, c] = n.useState([]),
    [u, g] = n.useState(!0),
    [d, p] = n.useState(null),
    [h, x] = n.useState(!1),
    [s, t] = n.useState({ name: '', description: '', price: '', category: 'pasta', image: '' }),
    b = async () => {
      try {
        g(!0)
        const a = await o.get('/menu')
        c(a.data.data)
      } catch {
        l.error('Error al cargar menú')
      } finally {
        g(!1)
      }
    }
  n.useEffect(() => {
    b()
  }, [])
  const v = async () => {
      if (!s.name || !s.price) {
        l.error('Nombre y precio requeridos')
        return
      }
      try {
        if (d) {
          const a = await o.put(`/menu/${d}`, { ...s, price: parseFloat(s.price) })
          ;(c((r) => r.map((i) => (i.id === d ? a.data.data : i))),
            l.success('Platillo actualizado'))
        } else {
          const a = await o.post('/menu', { ...s, price: parseFloat(s.price) })
          ;(c((r) => [a.data.data, ...r]), l.success('Platillo agregado'))
        }
        ;(x(!1), p(null), t({ name: '', description: '', price: '', category: 'pasta', image: '' }))
      } catch {
        l.error('Error al guardar')
      }
    },
    N = (a) => {
      ;(t({
        name: a.name,
        description: a.description,
        price: a.price.toString(),
        category: a.category,
        image: a.image,
      }),
        p(a.id),
        x(!0))
    },
    C = async (a) => {
      if (confirm('¿Eliminar este platillo?'))
        try {
          ;(await o.delete(`/menu/${a}`),
            c((r) => r.filter((i) => i.id !== a)),
            l.success('Platillo eliminado'))
        } catch {
          l.error('Error al eliminar')
        }
    },
    w = async (a) => {
      try {
        const r = await o.put(`/menu/${a.id}`, { available: !a.available })
        ;(c((i) => i.map((j) => (j.id === a.id ? r.data.data : j))),
          l.success(a.available ? 'Marcado como agotado' : 'Marcado como disponible'))
      } catch {
        l.error('Error al actualizar')
      }
    }
  return e.jsxs('div', {
    className: 'container-main',
    children: [
      e.jsxs('div', {
        className: 'flex items-center justify-between mb-8',
        children: [
          e.jsx('h1', { className: 'text-3xl font-display', children: 'Gestionar Menú' }),
          e.jsxs('div', {
            className: 'flex gap-2',
            children: [
              e.jsxs('button', {
                onClick: b,
                className: 'btn-outline flex items-center gap-2',
                children: [e.jsx(y, {}), ' Actualizar'],
              }),
              e.jsxs('button', {
                onClick: () => {
                  ;(x(!h),
                    p(null),
                    t({ name: '', description: '', price: '', category: 'pasta', image: '' }))
                },
                className: 'btn-primary flex items-center gap-2',
                children: [e.jsx(E, {}), ' Nuevo Platillo'],
              }),
            ],
          }),
        ],
      }),
      h &&
        e.jsxs(f.div, {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          className: 'bg-white rounded-2xl p-6 shadow-md mb-8',
          children: [
            e.jsx('h3', {
              className: 'font-display text-xl mb-4',
              children: d ? 'Editar Platillo' : 'Nuevo Platillo',
            }),
            e.jsxs('div', {
              className: 'grid grid-cols-1 md:grid-cols-2 gap-4',
              children: [
                e.jsx('input', {
                  type: 'text',
                  placeholder: 'Nombre *',
                  value: s.name,
                  onChange: (a) => t({ ...s, name: a.target.value }),
                  className: 'input-field',
                }),
                e.jsx('input', {
                  type: 'number',
                  placeholder: 'Precio *',
                  value: s.price,
                  onChange: (a) => t({ ...s, price: a.target.value }),
                  className: 'input-field',
                }),
                e.jsx('input', {
                  type: 'text',
                  placeholder: 'Descripción',
                  value: s.description,
                  onChange: (a) => t({ ...s, description: a.target.value }),
                  className: 'input-field',
                }),
                e.jsxs('select', {
                  value: s.category,
                  onChange: (a) => t({ ...s, category: a.target.value }),
                  className: 'input-field',
                  children: [
                    e.jsx('option', { value: 'ensalada', children: 'Ensalada' }),
                    e.jsx('option', { value: 'pasta', children: 'Pasta' }),
                    e.jsx('option', { value: 'pizza', children: 'Pizza' }),
                    e.jsx('option', { value: 'postre', children: 'Postre' }),
                    e.jsx('option', { value: 'bebida', children: 'Bebida' }),
                  ],
                }),
                e.jsx('input', {
                  type: 'text',
                  placeholder: 'URL de imagen',
                  value: s.image,
                  onChange: (a) => t({ ...s, image: a.target.value }),
                  className: 'input-field md:col-span-2',
                }),
              ],
            }),
            e.jsxs('div', {
              className: 'flex gap-4 mt-4',
              children: [
                e.jsxs('button', {
                  onClick: v,
                  className: 'btn-primary flex items-center gap-2',
                  children: [e.jsx(F, {}), ' Guardar'],
                }),
                e.jsxs('button', {
                  onClick: () => {
                    ;(x(!1), p(null))
                  },
                  className: 'btn-outline flex items-center gap-2',
                  children: [e.jsx(P, {}), ' Cancelar'],
                }),
              ],
            }),
          ],
        }),
      u
        ? e.jsxs('div', {
            className: 'text-center py-16 text-gray-400',
            children: [
              e.jsx(y, { className: 'animate-spin mx-auto text-4xl mb-4' }),
              e.jsx('p', { children: 'Cargando menú...' }),
            ],
          })
        : e.jsx('div', {
            className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
            children: m.map((a) =>
              e.jsxs(
                f.div,
                {
                  layout: !0,
                  className: 'card',
                  children: [
                    e.jsxs('div', {
                      className: 'relative',
                      children: [
                        e.jsx('img', {
                          src: a.image,
                          alt: a.name,
                          className: 'w-full h-40 object-cover',
                        }),
                        e.jsx('span', {
                          className: `absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-bold ${a.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`,
                          children: a.available ? 'Disponible' : 'Agotado',
                        }),
                      ],
                    }),
                    e.jsxs('div', {
                      className: 'p-4',
                      children: [
                        e.jsx('h3', { className: 'font-display text-lg', children: a.name }),
                        e.jsx('p', {
                          className: 'text-sm text-gray-500 mb-2',
                          children: a.category,
                        }),
                        e.jsxs('p', {
                          className: 'text-primary font-bold text-xl mb-3',
                          children: ['$', a.price],
                        }),
                        e.jsxs('div', {
                          className: 'flex gap-2',
                          children: [
                            e.jsxs('button', {
                              onClick: () => N(a),
                              className:
                                'flex-1 flex items-center justify-center gap-1 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-semibold',
                              children: [e.jsx(z, {}), ' Editar'],
                            }),
                            e.jsx('button', {
                              onClick: () => w(a),
                              className: `flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-semibold ${a.available ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`,
                              children: a.available ? 'Agotar' : 'Disponer',
                            }),
                            e.jsx('button', {
                              onClick: () => C(a.id),
                              className:
                                'py-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100',
                              children: e.jsx(k, { size: 14 }),
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                },
                a.id,
              ),
            ),
          }),
      !u &&
        m.length === 0 &&
        e.jsxs('div', {
          className: 'text-center py-16 text-gray-400',
          children: [
            e.jsx('p', { className: 'text-xl', children: 'No hay platillos en el menú' }),
            e.jsx('p', {
              className: 'mt-2',
              children: 'Agrega el primer platillo con el botón "Nuevo Platillo"',
            }),
          ],
        }),
    ],
  })
}
export { A as default }
