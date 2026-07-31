import { c as v, r as i, a as u, j as e, m as d, z as o, F as y, w as N } from './index-BSHWOaHa.js'
const C = [
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
]
function k() {
  var p
  const { user: n } = v(),
    [c, g] = i.useState([]),
    [s, t] = i.useState({
      name: (n == null ? void 0 : n.name) || '',
      phone: '',
      email: (n == null ? void 0 : n.email) || '',
      date: '',
      time: '',
      guests: 2,
      notes: '',
    }),
    [l, x] = i.useState(''),
    [m, r] = i.useState('form')
  i.useEffect(() => {
    u.get('/reservations/tables')
      .then((a) => g(a.data.data))
      .catch(() => {})
  }, [])
  const h = c.filter((a) => a.capacity >= s.guests),
    b = async () => {
      if (!s.name || !s.phone || !s.date || !s.time || !l) {
        o.error('Completa todos los campos obligatorios')
        return
      }
      try {
        await u.post('/reservations', {
          name: s.name,
          phone: s.phone,
          email: s.email,
          date: s.date,
          time: s.time,
          guests: s.guests,
          tableId: l,
          notes: s.notes,
        })
        const a = c.find((f) => f.id === l),
          j = `Nombre: ${s.name}
Tel: ${s.phone}
Fecha: ${s.date}
Hora: ${s.time}
Personas: ${s.guests}
Mesa: #${a == null ? void 0 : a.number} (${a == null ? void 0 : a.zone})
Notas: ${s.notes || 'Ninguna'}`
        ;(N.sendReservation('573001234567', j),
          o.success('¡Reserva creada y enviada por WhatsApp!'),
          r('form'),
          t({ name: '', phone: '', email: '', date: '', time: '', guests: 2, notes: '' }),
          x(''))
      } catch {
        o.error('Error al crear reserva')
      }
    }
  return e.jsxs('div', {
    className: 'max-w-3xl mx-auto',
    children: [
      m === 'form' &&
        e.jsxs(d.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          className: 'space-y-6',
          children: [
            e.jsxs('div', {
              className: 'grid grid-cols-1 md:grid-cols-2 gap-6',
              children: [
                e.jsxs('div', {
                  children: [
                    e.jsx('label', {
                      className: 'block text-sm font-semibold text-gray-700 mb-2',
                      children: 'Nombre *',
                    }),
                    e.jsx('input', {
                      type: 'text',
                      value: s.name,
                      onChange: (a) => t({ ...s, name: a.target.value }),
                      className: 'input-field',
                      placeholder: 'Tu nombre',
                    }),
                  ],
                }),
                e.jsxs('div', {
                  children: [
                    e.jsx('label', {
                      className: 'block text-sm font-semibold text-gray-700 mb-2',
                      children: 'Teléfono *',
                    }),
                    e.jsx('input', {
                      type: 'tel',
                      value: s.phone,
                      onChange: (a) => t({ ...s, phone: a.target.value }),
                      className: 'input-field',
                      placeholder: 'Tu teléfono',
                    }),
                  ],
                }),
                e.jsxs('div', {
                  children: [
                    e.jsx('label', {
                      className: 'block text-sm font-semibold text-gray-700 mb-2',
                      children: 'Email',
                    }),
                    e.jsx('input', {
                      type: 'email',
                      value: s.email,
                      onChange: (a) => t({ ...s, email: a.target.value }),
                      className: 'input-field',
                      placeholder: 'Tu email',
                    }),
                  ],
                }),
                e.jsxs('div', {
                  children: [
                    e.jsx('label', {
                      className: 'block text-sm font-semibold text-gray-700 mb-2',
                      children: 'Fecha *',
                    }),
                    e.jsx('input', {
                      type: 'date',
                      value: s.date,
                      onChange: (a) => t({ ...s, date: a.target.value }),
                      className: 'input-field',
                      min: new Date().toISOString().split('T')[0],
                    }),
                  ],
                }),
                e.jsxs('div', {
                  children: [
                    e.jsx('label', {
                      className: 'block text-sm font-semibold text-gray-700 mb-2',
                      children: 'Hora *',
                    }),
                    e.jsxs('select', {
                      value: s.time,
                      onChange: (a) => t({ ...s, time: a.target.value }),
                      className: 'input-field',
                      children: [
                        e.jsx('option', { value: '', children: 'Seleccionar hora' }),
                        C.map((a) => e.jsx('option', { value: a, children: a }, a)),
                      ],
                    }),
                  ],
                }),
                e.jsxs('div', {
                  children: [
                    e.jsx('label', {
                      className: 'block text-sm font-semibold text-gray-700 mb-2',
                      children: 'Personas *',
                    }),
                    e.jsxs('div', {
                      className: 'flex items-center gap-4',
                      children: [
                        e.jsx('button', {
                          onClick: () => t({ ...s, guests: Math.max(1, s.guests - 1) }),
                          className:
                            'w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold hover:bg-gray-200',
                          children: '-',
                        }),
                        e.jsx('span', {
                          className: 'text-2xl font-bold w-8 text-center',
                          children: s.guests,
                        }),
                        e.jsx('button', {
                          onClick: () => t({ ...s, guests: Math.min(10, s.guests + 1) }),
                          className:
                            'w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold hover:bg-gray-200',
                          children: '+',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            e.jsxs('div', {
              children: [
                e.jsx('label', {
                  className: 'block text-sm font-semibold text-gray-700 mb-2',
                  children: 'Notas especiales',
                }),
                e.jsx('textarea', {
                  value: s.notes,
                  onChange: (a) => t({ ...s, notes: a.target.value }),
                  className: 'input-field h-24 resize-none',
                  placeholder: 'Alergias, celebraciones, preferencias...',
                }),
              ],
            }),
            e.jsx('button', {
              onClick: () => {
                s.name && s.phone && s.date && s.time
                  ? r('table')
                  : o.error('Completa nombre, teléfono, fecha y hora')
              },
              className: 'btn-primary w-full text-lg',
              children: 'Seleccionar Mesa',
            }),
          ],
        }),
      m === 'table' &&
        e.jsxs(d.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          children: [
            e.jsx('h3', { className: 'text-2xl font-display mb-6', children: 'Elige tu Mesa' }),
            e.jsxs('p', {
              className: 'text-gray-500 mb-6',
              children: ['Mesa para ', s.guests, ' personas • ', s.date, ' a las ', s.time],
            }),
            e.jsx('div', {
              className: 'grid grid-cols-3 gap-4 mb-8',
              children: h.map((a) =>
                e.jsxs(
                  'button',
                  {
                    onClick: () => x(a.id),
                    className: `p-4 rounded-xl border-2 text-center transition-all ${l === a.id ? 'border-primary bg-primary/5 shadow-lg scale-105' : 'border-gray-200 hover:border-primary/50'}`,
                    children: [
                      e.jsx('div', { className: 'text-3xl mb-2', children: '🪑' }),
                      e.jsxs('div', { className: 'font-bold', children: ['Mesa ', a.number] }),
                      e.jsxs('div', {
                        className: 'text-sm text-gray-500',
                        children: [a.capacity, ' personas'],
                      }),
                      e.jsx('span', {
                        className: `inline-block mt-2 text-xs px-2 py-1 rounded-full ${a.zone === 'interior' ? 'bg-blue-100 text-blue-700' : a.zone === 'exterior' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`,
                        children: a.zone,
                      }),
                    ],
                  },
                  a.id,
                ),
              ),
            }),
            h.length === 0 &&
              e.jsxs('p', {
                className: 'text-center text-gray-500 py-8',
                children: ['No hay mesas disponibles para ', s.guests, ' personas en este horario'],
              }),
            e.jsxs('div', {
              className: 'flex gap-4',
              children: [
                e.jsx('button', {
                  onClick: () => r('form'),
                  className: 'btn-outline flex-1',
                  children: 'Volver',
                }),
                e.jsx('button', {
                  onClick: () => {
                    l ? r('confirm') : o.error('Selecciona una mesa')
                  },
                  className: 'btn-primary flex-1',
                  children: 'Confirmar Reserva',
                }),
              ],
            }),
          ],
        }),
      m === 'confirm' &&
        e.jsxs(d.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          className: 'text-center',
          children: [
            e.jsx('div', {
              className:
                'w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6',
              children: e.jsx(y, { className: 'text-primary', size: 40 }),
            }),
            e.jsx('h3', {
              className: 'text-3xl font-display mb-4',
              children: 'Resumen de tu Reserva',
            }),
            e.jsxs('div', {
              className: 'bg-gray-50 rounded-2xl p-6 text-left space-y-3 mb-8 max-w-md mx-auto',
              children: [
                e.jsxs('p', { children: [e.jsx('strong', { children: 'Nombre:' }), ' ', s.name] }),
                e.jsxs('p', { children: [e.jsx('strong', { children: 'Fecha:' }), ' ', s.date] }),
                e.jsxs('p', { children: [e.jsx('strong', { children: 'Hora:' }), ' ', s.time] }),
                e.jsxs('p', {
                  children: [e.jsx('strong', { children: 'Personas:' }), ' ', s.guests],
                }),
                e.jsxs('p', {
                  children: [
                    e.jsx('strong', { children: 'Mesa:' }),
                    ' #',
                    (p = c.find((a) => a.id === l)) == null ? void 0 : p.number,
                  ],
                }),
                s.notes &&
                  e.jsxs('p', {
                    children: [e.jsx('strong', { children: 'Notas:' }), ' ', s.notes],
                  }),
              ],
            }),
            e.jsx('p', {
              className: 'text-gray-500 mb-6',
              children: 'Se enviará tu reserva por WhatsApp para confirmación',
            }),
            e.jsxs('div', {
              className: 'flex gap-4 max-w-md mx-auto',
              children: [
                e.jsx('button', {
                  onClick: () => r('table'),
                  className: 'btn-outline flex-1',
                  children: 'Volver',
                }),
                e.jsx('button', {
                  onClick: b,
                  className:
                    'flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors',
                  children: 'Enviar por WhatsApp',
                }),
              ],
            }),
          ],
        }),
    ],
  })
}
function T() {
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
              children: 'Reserva',
            }),
            e.jsx('h1', {
              className: 'text-4xl md:text-5xl font-display text-gray-900 mb-4',
              children: 'Tu Mesa',
            }),
            e.jsx('p', {
              className: 'text-gray-500 text-lg max-w-2xl mx-auto',
              children: 'Selecciona fecha, hora y mesa para garantizar tu lugar',
            }),
          ],
        }),
        e.jsx(k, {}),
      ],
    }),
  })
}
export { T as default }
