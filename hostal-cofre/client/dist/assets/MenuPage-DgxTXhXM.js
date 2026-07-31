import { r as t, u as g, a as y, j as e, m as b, F as f, b as j } from './index-BSHWOaHa.js'
const N = [
  { key: 'all', label: 'Todos' },
  { key: 'ensalada', label: 'Ensaladas' },
  { key: 'pasta', label: 'Pastas' },
  { key: 'pizza', label: 'Pizzas' },
  { key: 'postre', label: 'Postres' },
  { key: 'bebida', label: 'Bebidas' },
]
function v() {
  const [l, o] = t.useState('all'),
    [r, x] = t.useState([]),
    [m, p] = t.useState(!0),
    [i, n] = t.useState(new Set()),
    { addItem: h } = g()
  t.useEffect(() => {
    y.get('/menu')
      .then((a) => x(a.data.data.filter((s) => s.available)))
      .catch(() => {})
      .finally(() => p(!1))
  }, [])
  const d = l === 'all' ? r : r.filter((a) => a.category === l),
    u = (a) => {
      ;(h(a),
        n((s) => new Set(s).add(a.id)),
        setTimeout(() => {
          n((s) => {
            const c = new Set(s)
            return (c.delete(a.id), c)
          })
        }, 1500))
    }
  return m
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
            className: 'flex flex-wrap justify-center gap-3 mb-10',
            children: N.map((a) =>
              e.jsx(
                'button',
                {
                  onClick: () => o(a.key),
                  className: `px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${l === a.key ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`,
                  children: a.label,
                },
                a.key,
              ),
            ),
          }),
          e.jsx('div', {
            className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
            children: d.map((a) =>
              e.jsxs(
                b.div,
                {
                  initial: { opacity: 0, scale: 0.9 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { duration: 0.3 },
                  className: 'card group',
                  children: [
                    e.jsxs('div', {
                      className: 'relative overflow-hidden h-52',
                      children: [
                        e.jsx('img', {
                          src: a.image,
                          alt: a.name,
                          loading: 'lazy',
                          className:
                            'w-full h-full object-cover transition-transform duration-500 group-hover:scale-110',
                        }),
                        e.jsx('span', {
                          className:
                            'absolute top-3 left-3 bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase',
                          children: a.category,
                        }),
                      ],
                    }),
                    e.jsxs('div', {
                      className: 'p-5',
                      children: [
                        e.jsx('h3', {
                          className: 'font-display text-xl text-gray-900 mb-2',
                          children: a.name,
                        }),
                        e.jsx('p', {
                          className: 'text-gray-500 text-sm mb-4 line-clamp-2',
                          children: a.description,
                        }),
                        e.jsxs('div', {
                          className: 'flex items-center justify-between',
                          children: [
                            e.jsxs('span', {
                              className: 'text-2xl font-bold text-primary',
                              children: ['$', a.price],
                            }),
                            e.jsx('button', {
                              onClick: () => u(a),
                              className: `flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${i.has(a.id) ? 'bg-primary text-white' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'}`,
                              children: i.has(a.id)
                                ? e.jsxs(e.Fragment, { children: [e.jsx(f, {}), ' Añadido'] })
                                : e.jsxs(e.Fragment, { children: [e.jsx(j, {}), ' Añadir'] }),
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
          d.length === 0 &&
            e.jsx('div', {
              className: 'text-center py-16 text-gray-400',
              children: e.jsx('p', {
                className: 'text-xl',
                children: 'No hay platillos disponibles en esta categoría',
              }),
            }),
        ],
      })
}
function k() {
  return e.jsx('section', {
    className: 'section-padding pt-28',
    children: e.jsxs('div', {
      className: 'container-main',
      children: [
        e.jsxs('div', {
          className: 'text-center mb-12',
          children: [
            e.jsx('p', {
              className: 'text-primary font-semibold text-lg mb-2',
              children: 'Descubre',
            }),
            e.jsx('h1', {
              className: 'text-4xl md:text-5xl font-display text-gray-900 mb-4',
              children: 'Nuestro Menú',
            }),
            e.jsx('p', {
              className: 'text-gray-500 text-lg max-w-2xl mx-auto',
              children: 'Platillos preparados con ingredientes frescos y recetas tradicionales',
            }),
          ],
        }),
        e.jsx(v, {}),
      ],
    }),
  })
}
export { k as default }
