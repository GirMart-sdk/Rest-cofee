import {
  r as l,
  j as e,
  m as a,
  q as o,
  s as d,
  t as n,
  v as b,
  l as c,
  x as j,
  y as v,
  L as u,
  a as m,
  z as f,
} from './index-BSHWOaHa.js'
function w() {
  const [t, x] = l.useState({ orders: 0, reservations: 0, revenue: 0, todaySales: 0 })
  l.useEffect(() => {
    ;(async () => {
      try {
        const [i, y] = await Promise.all([m.get('/reports/daily'), m.get('/reservations')]),
          r = i.data.data,
          g = y.data.data
        x({
          orders: r.summary.totalOrders,
          reservations: g.filter((p) => p.status !== 'cancelled').length,
          revenue: r.summary.totalSales,
          todaySales: r.summary.totalSales,
        })
      } catch {
        f.error('Error al cargar estadísticas')
      }
    })()
  }, [])
  const h = [
    {
      to: '/admin/pos',
      label: 'Punto de Venta',
      desc: 'Registrar ventas rápidas',
      icon: b,
      color: 'bg-primary',
    },
    {
      to: '/admin/pedidos',
      label: 'Pedidos',
      desc: 'Administrar pedidos en tiempo real',
      icon: d,
      color: 'bg-blue-500',
    },
    {
      to: '/admin/mesas',
      label: 'Mesas',
      desc: 'Gestionar mesas y códigos QR',
      icon: c,
      color: 'bg-green-500',
    },
    {
      to: '/admin/menu',
      label: 'Menú',
      desc: 'Agregar, editar o eliminar platillos',
      icon: c,
      color: 'bg-orange-500',
    },
    {
      to: '/admin/turnos',
      label: 'Turnos',
      desc: 'Abrir/cerrar caja y control de efectivo',
      icon: j,
      color: 'bg-purple-500',
    },
    {
      to: '/admin/reportes',
      label: 'Reportes',
      desc: 'Ventas diarias y estadísticas',
      icon: v,
      color: 'bg-pink-500',
    },
    {
      to: '/admin/reservas',
      label: 'Reservas',
      desc: 'Ver y confirmar reservaciones',
      icon: n,
      color: 'bg-teal-500',
    },
  ]
  return e.jsxs('div', {
    className: 'container-main',
    children: [
      e.jsx('h1', { className: 'text-3xl font-display mb-8', children: 'Panel de Administración' }),
      e.jsxs('div', {
        className: 'grid grid-cols-2 md:grid-cols-4 gap-4 mb-12',
        children: [
          e.jsxs(a.div, {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            className: 'bg-white rounded-2xl p-5 shadow-md',
            children: [
              e.jsx('div', {
                className:
                  'bg-primary w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3',
                children: e.jsx(o, { size: 18 }),
              }),
              e.jsxs('div', {
                className: 'text-2xl font-bold',
                children: ['$', t.todaySales.toLocaleString()],
              }),
              e.jsx('div', { className: 'text-gray-500 text-sm', children: 'Ventas Hoy' }),
            ],
          }),
          e.jsxs(a.div, {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.1 },
            className: 'bg-white rounded-2xl p-5 shadow-md',
            children: [
              e.jsx('div', {
                className:
                  'bg-blue-500 w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3',
                children: e.jsx(d, { size: 18 }),
              }),
              e.jsx('div', { className: 'text-2xl font-bold', children: t.orders }),
              e.jsx('div', { className: 'text-gray-500 text-sm', children: 'Pedidos Totales' }),
            ],
          }),
          e.jsxs(a.div, {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.2 },
            className: 'bg-white rounded-2xl p-5 shadow-md',
            children: [
              e.jsx('div', {
                className:
                  'bg-green-500 w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3',
                children: e.jsx(n, { size: 18 }),
              }),
              e.jsx('div', { className: 'text-2xl font-bold', children: t.reservations }),
              e.jsx('div', { className: 'text-gray-500 text-sm', children: 'Reservas' }),
            ],
          }),
          e.jsxs(a.div, {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.3 },
            className: 'bg-white rounded-2xl p-5 shadow-md',
            children: [
              e.jsx('div', {
                className:
                  'bg-purple-500 w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3',
                children: e.jsx(o, { size: 18 }),
              }),
              e.jsxs('div', {
                className: 'text-2xl font-bold',
                children: ['$', t.revenue.toLocaleString()],
              }),
              e.jsx('div', { className: 'text-gray-500 text-sm', children: 'Ingresos Totales' }),
            ],
          }),
        ],
      }),
      e.jsx('h2', { className: 'text-xl font-display mb-6', children: 'Accesos Rápidos' }),
      e.jsx('div', {
        className: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
        children: h.map((s, i) =>
          e.jsx(
            u,
            {
              to: s.to,
              children: e.jsxs(a.div, {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.4 + i * 0.05 },
                className: 'card p-5 hover:shadow-xl transition-shadow',
                children: [
                  e.jsx('div', {
                    className: `${s.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3`,
                    children: e.jsx(s.icon, { size: 20 }),
                  }),
                  e.jsx('h3', { className: 'font-display text-lg mb-1', children: s.label }),
                  e.jsx('p', { className: 'text-gray-500 text-xs', children: s.desc }),
                ],
              }),
            },
            i,
          ),
        ),
      }),
    ],
  })
}
export { w as default }
