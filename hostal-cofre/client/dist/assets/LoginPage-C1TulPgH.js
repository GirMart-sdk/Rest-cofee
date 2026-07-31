import { r as s, c as y, o as j, j as e, m as v, z as u } from './index-BSHWOaHa.js'
function C() {
  const [a, d] = s.useState(!1),
    [l, m] = s.useState(''),
    [i, p] = s.useState(''),
    [n, x] = s.useState(''),
    { login: g, register: h } = y(),
    f = j(),
    [c, o] = s.useState(!1),
    N = async (t) => {
      ;(t.preventDefault(), o(!0))
      let r
      ;(a ? (r = await h(l, i, n)) : (r = await g(i, n)),
        o(!1),
        r
          ? (u.success(a ? '¡Cuenta creada!' : '¡Bienvenido!'), f('/'))
          : u.error('Credenciales incorrectas'))
    }
  return e.jsx('section', {
    className: 'section-padding pt-28 min-h-screen flex items-center bg-gray-50',
    children: e.jsx(v.div, {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: 'max-w-md mx-auto w-full',
      children: e.jsxs('div', {
        className: 'bg-white rounded-2xl shadow-xl p-8',
        children: [
          e.jsxs('div', {
            className: 'text-center mb-8',
            children: [
              e.jsx('h1', {
                className: 'text-3xl font-display mb-2',
                children: a ? 'Crear Cuenta' : 'Iniciar Sesión',
              }),
              e.jsx('p', {
                className: 'text-gray-500',
                children: a ? 'Regístrate para hacer pedidos' : 'Accede a tu cuenta',
              }),
            ],
          }),
          e.jsxs('form', {
            onSubmit: N,
            className: 'space-y-4',
            children: [
              a &&
                e.jsx('input', {
                  type: 'text',
                  placeholder: 'Nombre completo',
                  value: l,
                  onChange: (t) => m(t.target.value),
                  className: 'input-field',
                  required: !0,
                }),
              e.jsx('input', {
                type: 'email',
                placeholder: 'Email',
                value: i,
                onChange: (t) => p(t.target.value),
                className: 'input-field',
                required: !0,
              }),
              e.jsx('input', {
                type: 'password',
                placeholder: 'Contraseña',
                value: n,
                onChange: (t) => x(t.target.value),
                className: 'input-field',
                required: !0,
                minLength: 6,
              }),
              e.jsx('button', {
                type: 'submit',
                disabled: c,
                className: 'btn-primary w-full text-lg disabled:opacity-50',
                children: c ? 'Procesando...' : a ? 'Crear Cuenta' : 'Iniciar Sesión',
              }),
            ],
          }),
          e.jsx('div', {
            className: 'text-center mt-6',
            children: e.jsx('button', {
              onClick: () => d(!a),
              className: 'text-primary hover:underline font-semibold',
              children: a ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate',
            }),
          }),
        ],
      }),
    }),
  })
}
export { C as default }
