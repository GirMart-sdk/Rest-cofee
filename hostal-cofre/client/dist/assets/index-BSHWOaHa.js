const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      'assets/AdminShifts-BkfXik7e.js',
      'assets/index-D3_cjjpb.js',
      'assets/AdminReports-YEA1y_Pe.js',
    ]),
) => i.map((i) => d[i])
function uv(e, t) {
  for (var n = 0; n < t.length; n++) {
    const r = t[n]
    if (typeof r != 'string' && !Array.isArray(r)) {
      for (const i in r)
        if (i !== 'default' && !(i in e)) {
          const s = Object.getOwnPropertyDescriptor(r, i)
          s && Object.defineProperty(e, i, s.get ? s : { enumerable: !0, get: () => r[i] })
        }
    }
  }
  return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }))
}
;(function () {
  const t = document.createElement('link').relList
  if (t && t.supports && t.supports('modulepreload')) return
  for (const i of document.querySelectorAll('link[rel="modulepreload"]')) r(i)
  new MutationObserver((i) => {
    for (const s of i)
      if (s.type === 'childList')
        for (const o of s.addedNodes) o.tagName === 'LINK' && o.rel === 'modulepreload' && r(o)
  }).observe(document, { childList: !0, subtree: !0 })
  function n(i) {
    const s = {}
    return (
      i.integrity && (s.integrity = i.integrity),
      i.referrerPolicy && (s.referrerPolicy = i.referrerPolicy),
      i.crossOrigin === 'use-credentials'
        ? (s.credentials = 'include')
        : i.crossOrigin === 'anonymous'
          ? (s.credentials = 'omit')
          : (s.credentials = 'same-origin'),
      s
    )
  }
  function r(i) {
    if (i.ep) return
    i.ep = !0
    const s = n(i)
    fetch(i.href, s)
  }
})()
function cv(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, 'default') ? e.default : e
}
var Cp = { exports: {} },
  bo = {},
  kp = { exports: {} },
  I = {}
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var qi = Symbol.for('react.element'),
  fv = Symbol.for('react.portal'),
  dv = Symbol.for('react.fragment'),
  hv = Symbol.for('react.strict_mode'),
  pv = Symbol.for('react.profiler'),
  mv = Symbol.for('react.provider'),
  gv = Symbol.for('react.context'),
  yv = Symbol.for('react.forward_ref'),
  vv = Symbol.for('react.suspense'),
  xv = Symbol.for('react.memo'),
  wv = Symbol.for('react.lazy'),
  Sf = Symbol.iterator
function Sv(e) {
  return e === null || typeof e != 'object'
    ? null
    : ((e = (Sf && e[Sf]) || e['@@iterator']), typeof e == 'function' ? e : null)
}
var Tp = {
    isMounted: function () {
      return !1
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  Rp = Object.assign,
  Ap = {}
function br(e, t, n) {
  ;((this.props = e), (this.context = t), (this.refs = Ap), (this.updater = n || Tp))
}
br.prototype.isReactComponent = {}
br.prototype.setState = function (e, t) {
  if (typeof e != 'object' && typeof e != 'function' && e != null)
    throw Error(
      'setState(...): takes an object of state variables to update or a function which returns an object of state variables.',
    )
  this.updater.enqueueSetState(this, e, t, 'setState')
}
br.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, 'forceUpdate')
}
function _p() {}
_p.prototype = br.prototype
function Ru(e, t, n) {
  ;((this.props = e), (this.context = t), (this.refs = Ap), (this.updater = n || Tp))
}
var Au = (Ru.prototype = new _p())
Au.constructor = Ru
Rp(Au, br.prototype)
Au.isPureReactComponent = !0
var Ef = Array.isArray,
  jp = Object.prototype.hasOwnProperty,
  _u = { current: null },
  Op = { key: !0, ref: !0, __self: !0, __source: !0 }
function Lp(e, t, n) {
  var r,
    i = {},
    s = null,
    o = null
  if (t != null)
    for (r in (t.ref !== void 0 && (o = t.ref), t.key !== void 0 && (s = '' + t.key), t))
      jp.call(t, r) && !Op.hasOwnProperty(r) && (i[r] = t[r])
  var a = arguments.length - 2
  if (a === 1) i.children = n
  else if (1 < a) {
    for (var l = Array(a), u = 0; u < a; u++) l[u] = arguments[u + 2]
    i.children = l
  }
  if (e && e.defaultProps) for (r in ((a = e.defaultProps), a)) i[r] === void 0 && (i[r] = a[r])
  return { $$typeof: qi, type: e, key: s, ref: o, props: i, _owner: _u.current }
}
function Ev(e, t) {
  return { $$typeof: qi, type: e.type, key: t, ref: e.ref, props: e.props, _owner: e._owner }
}
function ju(e) {
  return typeof e == 'object' && e !== null && e.$$typeof === qi
}
function Pv(e) {
  var t = { '=': '=0', ':': '=2' }
  return (
    '$' +
    e.replace(/[=:]/g, function (n) {
      return t[n]
    })
  )
}
var Pf = /\/+/g
function fa(e, t) {
  return typeof e == 'object' && e !== null && e.key != null ? Pv('' + e.key) : t.toString(36)
}
function Ls(e, t, n, r, i) {
  var s = typeof e
  ;(s === 'undefined' || s === 'boolean') && (e = null)
  var o = !1
  if (e === null) o = !0
  else
    switch (s) {
      case 'string':
      case 'number':
        o = !0
        break
      case 'object':
        switch (e.$$typeof) {
          case qi:
          case fv:
            o = !0
        }
    }
  if (o)
    return (
      (o = e),
      (i = i(o)),
      (e = r === '' ? '.' + fa(o, 0) : r),
      Ef(i)
        ? ((n = ''),
          e != null && (n = e.replace(Pf, '$&/') + '/'),
          Ls(i, t, n, '', function (u) {
            return u
          }))
        : i != null &&
          (ju(i) &&
            (i = Ev(
              i,
              n +
                (!i.key || (o && o.key === i.key) ? '' : ('' + i.key).replace(Pf, '$&/') + '/') +
                e,
            )),
          t.push(i)),
      1
    )
  if (((o = 0), (r = r === '' ? '.' : r + ':'), Ef(e)))
    for (var a = 0; a < e.length; a++) {
      s = e[a]
      var l = r + fa(s, a)
      o += Ls(s, t, n, l, i)
    }
  else if (((l = Sv(e)), typeof l == 'function'))
    for (e = l.call(e), a = 0; !(s = e.next()).done;)
      ((s = s.value), (l = r + fa(s, a++)), (o += Ls(s, t, n, l, i)))
  else if (s === 'object')
    throw (
      (t = String(e)),
      Error(
        'Objects are not valid as a React child (found: ' +
          (t === '[object Object]' ? 'object with keys {' + Object.keys(e).join(', ') + '}' : t) +
          '). If you meant to render a collection of children, use an array instead.',
      )
    )
  return o
}
function ls(e, t, n) {
  if (e == null) return e
  var r = [],
    i = 0
  return (
    Ls(e, r, '', '', function (s) {
      return t.call(n, s, i++)
    }),
    r
  )
}
function Cv(e) {
  if (e._status === -1) {
    var t = e._result
    ;((t = t()),
      t.then(
        function (n) {
          ;(e._status === 0 || e._status === -1) && ((e._status = 1), (e._result = n))
        },
        function (n) {
          ;(e._status === 0 || e._status === -1) && ((e._status = 2), (e._result = n))
        },
      ),
      e._status === -1 && ((e._status = 0), (e._result = t)))
  }
  if (e._status === 1) return e._result.default
  throw e._result
}
var Ne = { current: null },
  Ns = { transition: null },
  kv = { ReactCurrentDispatcher: Ne, ReactCurrentBatchConfig: Ns, ReactCurrentOwner: _u }
function Np() {
  throw Error('act(...) is not supported in production builds of React.')
}
I.Children = {
  map: ls,
  forEach: function (e, t, n) {
    ls(
      e,
      function () {
        t.apply(this, arguments)
      },
      n,
    )
  },
  count: function (e) {
    var t = 0
    return (
      ls(e, function () {
        t++
      }),
      t
    )
  },
  toArray: function (e) {
    return (
      ls(e, function (t) {
        return t
      }) || []
    )
  },
  only: function (e) {
    if (!ju(e)) throw Error('React.Children.only expected to receive a single React element child.')
    return e
  },
}
I.Component = br
I.Fragment = dv
I.Profiler = pv
I.PureComponent = Ru
I.StrictMode = hv
I.Suspense = vv
I.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = kv
I.act = Np
I.cloneElement = function (e, t, n) {
  if (e == null)
    throw Error(
      'React.cloneElement(...): The argument must be a React element, but you passed ' + e + '.',
    )
  var r = Rp({}, e.props),
    i = e.key,
    s = e.ref,
    o = e._owner
  if (t != null) {
    if (
      (t.ref !== void 0 && ((s = t.ref), (o = _u.current)),
      t.key !== void 0 && (i = '' + t.key),
      e.type && e.type.defaultProps)
    )
      var a = e.type.defaultProps
    for (l in t)
      jp.call(t, l) &&
        !Op.hasOwnProperty(l) &&
        (r[l] = t[l] === void 0 && a !== void 0 ? a[l] : t[l])
  }
  var l = arguments.length - 2
  if (l === 1) r.children = n
  else if (1 < l) {
    a = Array(l)
    for (var u = 0; u < l; u++) a[u] = arguments[u + 2]
    r.children = a
  }
  return { $$typeof: qi, type: e.type, key: i, ref: s, props: r, _owner: o }
}
I.createContext = function (e) {
  return (
    (e = {
      $$typeof: gv,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    }),
    (e.Provider = { $$typeof: mv, _context: e }),
    (e.Consumer = e)
  )
}
I.createElement = Lp
I.createFactory = function (e) {
  var t = Lp.bind(null, e)
  return ((t.type = e), t)
}
I.createRef = function () {
  return { current: null }
}
I.forwardRef = function (e) {
  return { $$typeof: yv, render: e }
}
I.isValidElement = ju
I.lazy = function (e) {
  return { $$typeof: wv, _payload: { _status: -1, _result: e }, _init: Cv }
}
I.memo = function (e, t) {
  return { $$typeof: xv, type: e, compare: t === void 0 ? null : t }
}
I.startTransition = function (e) {
  var t = Ns.transition
  Ns.transition = {}
  try {
    e()
  } finally {
    Ns.transition = t
  }
}
I.unstable_act = Np
I.useCallback = function (e, t) {
  return Ne.current.useCallback(e, t)
}
I.useContext = function (e) {
  return Ne.current.useContext(e)
}
I.useDebugValue = function () {}
I.useDeferredValue = function (e) {
  return Ne.current.useDeferredValue(e)
}
I.useEffect = function (e, t) {
  return Ne.current.useEffect(e, t)
}
I.useId = function () {
  return Ne.current.useId()
}
I.useImperativeHandle = function (e, t, n) {
  return Ne.current.useImperativeHandle(e, t, n)
}
I.useInsertionEffect = function (e, t) {
  return Ne.current.useInsertionEffect(e, t)
}
I.useLayoutEffect = function (e, t) {
  return Ne.current.useLayoutEffect(e, t)
}
I.useMemo = function (e, t) {
  return Ne.current.useMemo(e, t)
}
I.useReducer = function (e, t, n) {
  return Ne.current.useReducer(e, t, n)
}
I.useRef = function (e) {
  return Ne.current.useRef(e)
}
I.useState = function (e) {
  return Ne.current.useState(e)
}
I.useSyncExternalStore = function (e, t, n) {
  return Ne.current.useSyncExternalStore(e, t, n)
}
I.useTransition = function () {
  return Ne.current.useTransition()
}
I.version = '18.3.1'
kp.exports = I
var w = kp.exports
const Dt = cv(w),
  Tv = uv({ __proto__: null, default: Dt }, [w])
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Rv = w,
  Av = Symbol.for('react.element'),
  _v = Symbol.for('react.fragment'),
  jv = Object.prototype.hasOwnProperty,
  Ov = Rv.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  Lv = { key: !0, ref: !0, __self: !0, __source: !0 }
function Dp(e, t, n) {
  var r,
    i = {},
    s = null,
    o = null
  ;(n !== void 0 && (s = '' + n),
    t.key !== void 0 && (s = '' + t.key),
    t.ref !== void 0 && (o = t.ref))
  for (r in t) jv.call(t, r) && !Lv.hasOwnProperty(r) && (i[r] = t[r])
  if (e && e.defaultProps) for (r in ((t = e.defaultProps), t)) i[r] === void 0 && (i[r] = t[r])
  return { $$typeof: Av, type: e, key: s, ref: o, props: i, _owner: Ov.current }
}
bo.Fragment = _v
bo.jsx = Dp
bo.jsxs = Dp
Cp.exports = bo
var y = Cp.exports,
  sl = {},
  Mp = { exports: {} },
  Qe = {},
  bp = { exports: {} },
  Fp = {}
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ ;(function (e) {
  function t(_, M) {
    var N = _.length
    _.push(M)
    e: for (; 0 < N;) {
      var V = (N - 1) >>> 1,
        H = _[V]
      if (0 < i(H, M)) ((_[V] = M), (_[N] = H), (N = V))
      else break e
    }
  }
  function n(_) {
    return _.length === 0 ? null : _[0]
  }
  function r(_) {
    if (_.length === 0) return null
    var M = _[0],
      N = _.pop()
    if (N !== M) {
      _[0] = N
      e: for (var V = 0, H = _.length, at = H >>> 1; V < at;) {
        var Ue = 2 * (V + 1) - 1,
          Jn = _[Ue],
          B = Ue + 1,
          pe = _[B]
        if (0 > i(Jn, N))
          B < H && 0 > i(pe, Jn)
            ? ((_[V] = pe), (_[B] = N), (V = B))
            : ((_[V] = Jn), (_[Ue] = N), (V = Ue))
        else if (B < H && 0 > i(pe, N)) ((_[V] = pe), (_[B] = N), (V = B))
        else break e
      }
    }
    return M
  }
  function i(_, M) {
    var N = _.sortIndex - M.sortIndex
    return N !== 0 ? N : _.id - M.id
  }
  if (typeof performance == 'object' && typeof performance.now == 'function') {
    var s = performance
    e.unstable_now = function () {
      return s.now()
    }
  } else {
    var o = Date,
      a = o.now()
    e.unstable_now = function () {
      return o.now() - a
    }
  }
  var l = [],
    u = [],
    c = 1,
    f = null,
    d = 3,
    g = !1,
    v = !1,
    x = !1,
    S = typeof setTimeout == 'function' ? setTimeout : null,
    h = typeof clearTimeout == 'function' ? clearTimeout : null,
    p = typeof setImmediate < 'u' ? setImmediate : null
  typeof navigator < 'u' &&
    navigator.scheduling !== void 0 &&
    navigator.scheduling.isInputPending !== void 0 &&
    navigator.scheduling.isInputPending.bind(navigator.scheduling)
  function m(_) {
    for (var M = n(u); M !== null;) {
      if (M.callback === null) r(u)
      else if (M.startTime <= _) (r(u), (M.sortIndex = M.expirationTime), t(l, M))
      else break
      M = n(u)
    }
  }
  function P(_) {
    if (((x = !1), m(_), !v))
      if (n(l) !== null) ((v = !0), vt(C))
      else {
        var M = n(u)
        M !== null && Y(P, M.startTime - _)
      }
  }
  function C(_, M) {
    ;((v = !1), x && ((x = !1), h(T), (T = -1)), (g = !0))
    var N = d
    try {
      for (m(M), f = n(l); f !== null && (!(f.expirationTime > M) || (_ && !W()));) {
        var V = f.callback
        if (typeof V == 'function') {
          ;((f.callback = null), (d = f.priorityLevel))
          var H = V(f.expirationTime <= M)
          ;((M = e.unstable_now()),
            typeof H == 'function' ? (f.callback = H) : f === n(l) && r(l),
            m(M))
        } else r(l)
        f = n(l)
      }
      if (f !== null) var at = !0
      else {
        var Ue = n(u)
        ;(Ue !== null && Y(P, Ue.startTime - M), (at = !1))
      }
      return at
    } finally {
      ;((f = null), (d = N), (g = !1))
    }
  }
  var k = !1,
    A = null,
    T = -1,
    b = 5,
    L = -1
  function W() {
    return !(e.unstable_now() - L < b)
  }
  function ze() {
    if (A !== null) {
      var _ = e.unstable_now()
      L = _
      var M = !0
      try {
        M = A(!0, _)
      } finally {
        M ? yt() : ((k = !1), (A = null))
      }
    } else k = !1
  }
  var yt
  if (typeof p == 'function')
    yt = function () {
      p(ze)
    }
  else if (typeof MessageChannel < 'u') {
    var Ee = new MessageChannel(),
      kn = Ee.port2
    ;((Ee.port1.onmessage = ze),
      (yt = function () {
        kn.postMessage(null)
      }))
  } else
    yt = function () {
      S(ze, 0)
    }
  function vt(_) {
    ;((A = _), k || ((k = !0), yt()))
  }
  function Y(_, M) {
    T = S(function () {
      _(e.unstable_now())
    }, M)
  }
  ;((e.unstable_IdlePriority = 5),
    (e.unstable_ImmediatePriority = 1),
    (e.unstable_LowPriority = 4),
    (e.unstable_NormalPriority = 3),
    (e.unstable_Profiling = null),
    (e.unstable_UserBlockingPriority = 2),
    (e.unstable_cancelCallback = function (_) {
      _.callback = null
    }),
    (e.unstable_continueExecution = function () {
      v || g || ((v = !0), vt(C))
    }),
    (e.unstable_forceFrameRate = function (_) {
      0 > _ || 125 < _
        ? console.error(
            'forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported',
          )
        : (b = 0 < _ ? Math.floor(1e3 / _) : 5)
    }),
    (e.unstable_getCurrentPriorityLevel = function () {
      return d
    }),
    (e.unstable_getFirstCallbackNode = function () {
      return n(l)
    }),
    (e.unstable_next = function (_) {
      switch (d) {
        case 1:
        case 2:
        case 3:
          var M = 3
          break
        default:
          M = d
      }
      var N = d
      d = M
      try {
        return _()
      } finally {
        d = N
      }
    }),
    (e.unstable_pauseExecution = function () {}),
    (e.unstable_requestPaint = function () {}),
    (e.unstable_runWithPriority = function (_, M) {
      switch (_) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break
        default:
          _ = 3
      }
      var N = d
      d = _
      try {
        return M()
      } finally {
        d = N
      }
    }),
    (e.unstable_scheduleCallback = function (_, M, N) {
      var V = e.unstable_now()
      switch (
        (typeof N == 'object' && N !== null
          ? ((N = N.delay), (N = typeof N == 'number' && 0 < N ? V + N : V))
          : (N = V),
        _)
      ) {
        case 1:
          var H = -1
          break
        case 2:
          H = 250
          break
        case 5:
          H = 1073741823
          break
        case 4:
          H = 1e4
          break
        default:
          H = 5e3
      }
      return (
        (H = N + H),
        (_ = {
          id: c++,
          callback: M,
          priorityLevel: _,
          startTime: N,
          expirationTime: H,
          sortIndex: -1,
        }),
        N > V
          ? ((_.sortIndex = N),
            t(u, _),
            n(l) === null && _ === n(u) && (x ? (h(T), (T = -1)) : (x = !0), Y(P, N - V)))
          : ((_.sortIndex = H), t(l, _), v || g || ((v = !0), vt(C))),
        _
      )
    }),
    (e.unstable_shouldYield = W),
    (e.unstable_wrapCallback = function (_) {
      var M = d
      return function () {
        var N = d
        d = M
        try {
          return _.apply(this, arguments)
        } finally {
          d = N
        }
      }
    }))
})(Fp)
bp.exports = Fp
var Nv = bp.exports
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Dv = w,
  Ge = Nv
function R(e) {
  for (
    var t = 'https://reactjs.org/docs/error-decoder.html?invariant=' + e, n = 1;
    n < arguments.length;
    n++
  )
    t += '&args[]=' + encodeURIComponent(arguments[n])
  return (
    'Minified React error #' +
    e +
    '; visit ' +
    t +
    ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
  )
}
var Vp = new Set(),
  Ei = {}
function Xn(e, t) {
  ;(Cr(e, t), Cr(e + 'Capture', t))
}
function Cr(e, t) {
  for (Ei[e] = t, e = 0; e < t.length; e++) Vp.add(t[e])
}
var Vt = !(
    typeof window > 'u' ||
    typeof window.document > 'u' ||
    typeof window.document.createElement > 'u'
  ),
  ol = Object.prototype.hasOwnProperty,
  Mv =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  Cf = {},
  kf = {}
function bv(e) {
  return ol.call(kf, e) ? !0 : ol.call(Cf, e) ? !1 : Mv.test(e) ? (kf[e] = !0) : ((Cf[e] = !0), !1)
}
function Fv(e, t, n, r) {
  if (n !== null && n.type === 0) return !1
  switch (typeof t) {
    case 'function':
    case 'symbol':
      return !0
    case 'boolean':
      return r
        ? !1
        : n !== null
          ? !n.acceptsBooleans
          : ((e = e.toLowerCase().slice(0, 5)), e !== 'data-' && e !== 'aria-')
    default:
      return !1
  }
}
function Vv(e, t, n, r) {
  if (t === null || typeof t > 'u' || Fv(e, t, n, r)) return !0
  if (r) return !1
  if (n !== null)
    switch (n.type) {
      case 3:
        return !t
      case 4:
        return t === !1
      case 5:
        return isNaN(t)
      case 6:
        return isNaN(t) || 1 > t
    }
  return !1
}
function De(e, t, n, r, i, s, o) {
  ;((this.acceptsBooleans = t === 2 || t === 3 || t === 4),
    (this.attributeName = r),
    (this.attributeNamespace = i),
    (this.mustUseProperty = n),
    (this.propertyName = e),
    (this.type = t),
    (this.sanitizeURL = s),
    (this.removeEmptyString = o))
}
var Se = {}
'children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style'
  .split(' ')
  .forEach(function (e) {
    Se[e] = new De(e, 0, !1, e, null, !1, !1)
  })
;[
  ['acceptCharset', 'accept-charset'],
  ['className', 'class'],
  ['htmlFor', 'for'],
  ['httpEquiv', 'http-equiv'],
].forEach(function (e) {
  var t = e[0]
  Se[t] = new De(t, 1, !1, e[1], null, !1, !1)
})
;['contentEditable', 'draggable', 'spellCheck', 'value'].forEach(function (e) {
  Se[e] = new De(e, 2, !1, e.toLowerCase(), null, !1, !1)
})
;['autoReverse', 'externalResourcesRequired', 'focusable', 'preserveAlpha'].forEach(function (e) {
  Se[e] = new De(e, 2, !1, e, null, !1, !1)
})
'allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope'
  .split(' ')
  .forEach(function (e) {
    Se[e] = new De(e, 3, !1, e.toLowerCase(), null, !1, !1)
  })
;['checked', 'multiple', 'muted', 'selected'].forEach(function (e) {
  Se[e] = new De(e, 3, !0, e, null, !1, !1)
})
;['capture', 'download'].forEach(function (e) {
  Se[e] = new De(e, 4, !1, e, null, !1, !1)
})
;['cols', 'rows', 'size', 'span'].forEach(function (e) {
  Se[e] = new De(e, 6, !1, e, null, !1, !1)
})
;['rowSpan', 'start'].forEach(function (e) {
  Se[e] = new De(e, 5, !1, e.toLowerCase(), null, !1, !1)
})
var Ou = /[\-:]([a-z])/g
function Lu(e) {
  return e[1].toUpperCase()
}
'accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height'
  .split(' ')
  .forEach(function (e) {
    var t = e.replace(Ou, Lu)
    Se[t] = new De(t, 1, !1, e, null, !1, !1)
  })
'xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type'
  .split(' ')
  .forEach(function (e) {
    var t = e.replace(Ou, Lu)
    Se[t] = new De(t, 1, !1, e, 'http://www.w3.org/1999/xlink', !1, !1)
  })
;['xml:base', 'xml:lang', 'xml:space'].forEach(function (e) {
  var t = e.replace(Ou, Lu)
  Se[t] = new De(t, 1, !1, e, 'http://www.w3.org/XML/1998/namespace', !1, !1)
})
;['tabIndex', 'crossOrigin'].forEach(function (e) {
  Se[e] = new De(e, 1, !1, e.toLowerCase(), null, !1, !1)
})
Se.xlinkHref = new De('xlinkHref', 1, !1, 'xlink:href', 'http://www.w3.org/1999/xlink', !0, !1)
;['src', 'href', 'action', 'formAction'].forEach(function (e) {
  Se[e] = new De(e, 1, !1, e.toLowerCase(), null, !0, !0)
})
function Nu(e, t, n, r) {
  var i = Se.hasOwnProperty(t) ? Se[t] : null
  ;(i !== null
    ? i.type !== 0
    : r || !(2 < t.length) || (t[0] !== 'o' && t[0] !== 'O') || (t[1] !== 'n' && t[1] !== 'N')) &&
    (Vv(t, n, i, r) && (n = null),
    r || i === null
      ? bv(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, '' + n))
      : i.mustUseProperty
        ? (e[i.propertyName] = n === null ? (i.type === 3 ? !1 : '') : n)
        : ((t = i.attributeName),
          (r = i.attributeNamespace),
          n === null
            ? e.removeAttribute(t)
            : ((i = i.type),
              (n = i === 3 || (i === 4 && n === !0) ? '' : '' + n),
              r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))))
}
var Wt = Dv.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  us = Symbol.for('react.element'),
  tr = Symbol.for('react.portal'),
  nr = Symbol.for('react.fragment'),
  Du = Symbol.for('react.strict_mode'),
  al = Symbol.for('react.profiler'),
  Ip = Symbol.for('react.provider'),
  Bp = Symbol.for('react.context'),
  Mu = Symbol.for('react.forward_ref'),
  ll = Symbol.for('react.suspense'),
  ul = Symbol.for('react.suspense_list'),
  bu = Symbol.for('react.memo'),
  Qt = Symbol.for('react.lazy'),
  zp = Symbol.for('react.offscreen'),
  Tf = Symbol.iterator
function Kr(e) {
  return e === null || typeof e != 'object'
    ? null
    : ((e = (Tf && e[Tf]) || e['@@iterator']), typeof e == 'function' ? e : null)
}
var te = Object.assign,
  da
function ni(e) {
  if (da === void 0)
    try {
      throw Error()
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/)
      da = (t && t[1]) || ''
    }
  return (
    `
` +
    da +
    e
  )
}
var ha = !1
function pa(e, t) {
  if (!e || ha) return ''
  ha = !0
  var n = Error.prepareStackTrace
  Error.prepareStackTrace = void 0
  try {
    if (t)
      if (
        ((t = function () {
          throw Error()
        }),
        Object.defineProperty(t.prototype, 'props', {
          set: function () {
            throw Error()
          },
        }),
        typeof Reflect == 'object' && Reflect.construct)
      ) {
        try {
          Reflect.construct(t, [])
        } catch (u) {
          var r = u
        }
        Reflect.construct(e, [], t)
      } else {
        try {
          t.call()
        } catch (u) {
          r = u
        }
        e.call(t.prototype)
      }
    else {
      try {
        throw Error()
      } catch (u) {
        r = u
      }
      e()
    }
  } catch (u) {
    if (u && r && typeof u.stack == 'string') {
      for (
        var i = u.stack.split(`
`),
          s = r.stack.split(`
`),
          o = i.length - 1,
          a = s.length - 1;
        1 <= o && 0 <= a && i[o] !== s[a];
      )
        a--
      for (; 1 <= o && 0 <= a; o--, a--)
        if (i[o] !== s[a]) {
          if (o !== 1 || a !== 1)
            do
              if ((o--, a--, 0 > a || i[o] !== s[a])) {
                var l =
                  `
` + i[o].replace(' at new ', ' at ')
                return (
                  e.displayName &&
                    l.includes('<anonymous>') &&
                    (l = l.replace('<anonymous>', e.displayName)),
                  l
                )
              }
            while (1 <= o && 0 <= a)
          break
        }
    }
  } finally {
    ;((ha = !1), (Error.prepareStackTrace = n))
  }
  return (e = e ? e.displayName || e.name : '') ? ni(e) : ''
}
function Iv(e) {
  switch (e.tag) {
    case 5:
      return ni(e.type)
    case 16:
      return ni('Lazy')
    case 13:
      return ni('Suspense')
    case 19:
      return ni('SuspenseList')
    case 0:
    case 2:
    case 15:
      return ((e = pa(e.type, !1)), e)
    case 11:
      return ((e = pa(e.type.render, !1)), e)
    case 1:
      return ((e = pa(e.type, !0)), e)
    default:
      return ''
  }
}
function cl(e) {
  if (e == null) return null
  if (typeof e == 'function') return e.displayName || e.name || null
  if (typeof e == 'string') return e
  switch (e) {
    case nr:
      return 'Fragment'
    case tr:
      return 'Portal'
    case al:
      return 'Profiler'
    case Du:
      return 'StrictMode'
    case ll:
      return 'Suspense'
    case ul:
      return 'SuspenseList'
  }
  if (typeof e == 'object')
    switch (e.$$typeof) {
      case Bp:
        return (e.displayName || 'Context') + '.Consumer'
      case Ip:
        return (e._context.displayName || 'Context') + '.Provider'
      case Mu:
        var t = e.render
        return (
          (e = e.displayName),
          e ||
            ((e = t.displayName || t.name || ''),
            (e = e !== '' ? 'ForwardRef(' + e + ')' : 'ForwardRef')),
          e
        )
      case bu:
        return ((t = e.displayName || null), t !== null ? t : cl(e.type) || 'Memo')
      case Qt:
        ;((t = e._payload), (e = e._init))
        try {
          return cl(e(t))
        } catch {}
    }
  return null
}
function Bv(e) {
  var t = e.type
  switch (e.tag) {
    case 24:
      return 'Cache'
    case 9:
      return (t.displayName || 'Context') + '.Consumer'
    case 10:
      return (t._context.displayName || 'Context') + '.Provider'
    case 18:
      return 'DehydratedFragment'
    case 11:
      return (
        (e = t.render),
        (e = e.displayName || e.name || ''),
        t.displayName || (e !== '' ? 'ForwardRef(' + e + ')' : 'ForwardRef')
      )
    case 7:
      return 'Fragment'
    case 5:
      return t
    case 4:
      return 'Portal'
    case 3:
      return 'Root'
    case 6:
      return 'Text'
    case 16:
      return cl(t)
    case 8:
      return t === Du ? 'StrictMode' : 'Mode'
    case 22:
      return 'Offscreen'
    case 12:
      return 'Profiler'
    case 21:
      return 'Scope'
    case 13:
      return 'Suspense'
    case 19:
      return 'SuspenseList'
    case 25:
      return 'TracingMarker'
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof t == 'function') return t.displayName || t.name || null
      if (typeof t == 'string') return t
  }
  return null
}
function pn(e) {
  switch (typeof e) {
    case 'boolean':
    case 'number':
    case 'string':
    case 'undefined':
      return e
    case 'object':
      return e
    default:
      return ''
  }
}
function Up(e) {
  var t = e.type
  return (e = e.nodeName) && e.toLowerCase() === 'input' && (t === 'checkbox' || t === 'radio')
}
function zv(e) {
  var t = Up(e) ? 'checked' : 'value',
    n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
    r = '' + e[t]
  if (
    !e.hasOwnProperty(t) &&
    typeof n < 'u' &&
    typeof n.get == 'function' &&
    typeof n.set == 'function'
  ) {
    var i = n.get,
      s = n.set
    return (
      Object.defineProperty(e, t, {
        configurable: !0,
        get: function () {
          return i.call(this)
        },
        set: function (o) {
          ;((r = '' + o), s.call(this, o))
        },
      }),
      Object.defineProperty(e, t, { enumerable: n.enumerable }),
      {
        getValue: function () {
          return r
        },
        setValue: function (o) {
          r = '' + o
        },
        stopTracking: function () {
          ;((e._valueTracker = null), delete e[t])
        },
      }
    )
  }
}
function cs(e) {
  e._valueTracker || (e._valueTracker = zv(e))
}
function $p(e) {
  if (!e) return !1
  var t = e._valueTracker
  if (!t) return !0
  var n = t.getValue(),
    r = ''
  return (
    e && (r = Up(e) ? (e.checked ? 'true' : 'false') : e.value),
    (e = r),
    e !== n ? (t.setValue(e), !0) : !1
  )
}
function Ys(e) {
  if (((e = e || (typeof document < 'u' ? document : void 0)), typeof e > 'u')) return null
  try {
    return e.activeElement || e.body
  } catch {
    return e.body
  }
}
function fl(e, t) {
  var n = t.checked
  return te({}, t, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: n ?? e._wrapperState.initialChecked,
  })
}
function Rf(e, t) {
  var n = t.defaultValue == null ? '' : t.defaultValue,
    r = t.checked != null ? t.checked : t.defaultChecked
  ;((n = pn(t.value != null ? t.value : n)),
    (e._wrapperState = {
      initialChecked: r,
      initialValue: n,
      controlled: t.type === 'checkbox' || t.type === 'radio' ? t.checked != null : t.value != null,
    }))
}
function Wp(e, t) {
  ;((t = t.checked), t != null && Nu(e, 'checked', t, !1))
}
function dl(e, t) {
  Wp(e, t)
  var n = pn(t.value),
    r = t.type
  if (n != null)
    r === 'number'
      ? ((n === 0 && e.value === '') || e.value != n) && (e.value = '' + n)
      : e.value !== '' + n && (e.value = '' + n)
  else if (r === 'submit' || r === 'reset') {
    e.removeAttribute('value')
    return
  }
  ;(t.hasOwnProperty('value')
    ? hl(e, t.type, n)
    : t.hasOwnProperty('defaultValue') && hl(e, t.type, pn(t.defaultValue)),
    t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked))
}
function Af(e, t, n) {
  if (t.hasOwnProperty('value') || t.hasOwnProperty('defaultValue')) {
    var r = t.type
    if (!((r !== 'submit' && r !== 'reset') || (t.value !== void 0 && t.value !== null))) return
    ;((t = '' + e._wrapperState.initialValue),
      n || t === e.value || (e.value = t),
      (e.defaultValue = t))
  }
  ;((n = e.name),
    n !== '' && (e.name = ''),
    (e.defaultChecked = !!e._wrapperState.initialChecked),
    n !== '' && (e.name = n))
}
function hl(e, t, n) {
  ;(t !== 'number' || Ys(e.ownerDocument) !== e) &&
    (n == null
      ? (e.defaultValue = '' + e._wrapperState.initialValue)
      : e.defaultValue !== '' + n && (e.defaultValue = '' + n))
}
var ri = Array.isArray
function vr(e, t, n, r) {
  if (((e = e.options), t)) {
    t = {}
    for (var i = 0; i < n.length; i++) t['$' + n[i]] = !0
    for (n = 0; n < e.length; n++)
      ((i = t.hasOwnProperty('$' + e[n].value)),
        e[n].selected !== i && (e[n].selected = i),
        i && r && (e[n].defaultSelected = !0))
  } else {
    for (n = '' + pn(n), t = null, i = 0; i < e.length; i++) {
      if (e[i].value === n) {
        ;((e[i].selected = !0), r && (e[i].defaultSelected = !0))
        return
      }
      t !== null || e[i].disabled || (t = e[i])
    }
    t !== null && (t.selected = !0)
  }
}
function pl(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(R(91))
  return te({}, t, {
    value: void 0,
    defaultValue: void 0,
    children: '' + e._wrapperState.initialValue,
  })
}
function _f(e, t) {
  var n = t.value
  if (n == null) {
    if (((n = t.children), (t = t.defaultValue), n != null)) {
      if (t != null) throw Error(R(92))
      if (ri(n)) {
        if (1 < n.length) throw Error(R(93))
        n = n[0]
      }
      t = n
    }
    ;(t == null && (t = ''), (n = t))
  }
  e._wrapperState = { initialValue: pn(n) }
}
function Hp(e, t) {
  var n = pn(t.value),
    r = pn(t.defaultValue)
  ;(n != null &&
    ((n = '' + n),
    n !== e.value && (e.value = n),
    t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
    r != null && (e.defaultValue = '' + r))
}
function jf(e) {
  var t = e.textContent
  t === e._wrapperState.initialValue && t !== '' && t !== null && (e.value = t)
}
function Kp(e) {
  switch (e) {
    case 'svg':
      return 'http://www.w3.org/2000/svg'
    case 'math':
      return 'http://www.w3.org/1998/Math/MathML'
    default:
      return 'http://www.w3.org/1999/xhtml'
  }
}
function ml(e, t) {
  return e == null || e === 'http://www.w3.org/1999/xhtml'
    ? Kp(t)
    : e === 'http://www.w3.org/2000/svg' && t === 'foreignObject'
      ? 'http://www.w3.org/1999/xhtml'
      : e
}
var fs,
  qp = (function (e) {
    return typeof MSApp < 'u' && MSApp.execUnsafeLocalFunction
      ? function (t, n, r, i) {
          MSApp.execUnsafeLocalFunction(function () {
            return e(t, n, r, i)
          })
        }
      : e
  })(function (e, t) {
    if (e.namespaceURI !== 'http://www.w3.org/2000/svg' || 'innerHTML' in e) e.innerHTML = t
    else {
      for (
        fs = fs || document.createElement('div'),
          fs.innerHTML = '<svg>' + t.valueOf().toString() + '</svg>',
          t = fs.firstChild;
        e.firstChild;
      )
        e.removeChild(e.firstChild)
      for (; t.firstChild;) e.appendChild(t.firstChild)
    }
  })
function Pi(e, t) {
  if (t) {
    var n = e.firstChild
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t
      return
    }
  }
  e.textContent = t
}
var ui = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0,
  },
  Uv = ['Webkit', 'ms', 'Moz', 'O']
Object.keys(ui).forEach(function (e) {
  Uv.forEach(function (t) {
    ;((t = t + e.charAt(0).toUpperCase() + e.substring(1)), (ui[t] = ui[e]))
  })
})
function Gp(e, t, n) {
  return t == null || typeof t == 'boolean' || t === ''
    ? ''
    : n || typeof t != 'number' || t === 0 || (ui.hasOwnProperty(e) && ui[e])
      ? ('' + t).trim()
      : t + 'px'
}
function Xp(e, t) {
  e = e.style
  for (var n in t)
    if (t.hasOwnProperty(n)) {
      var r = n.indexOf('--') === 0,
        i = Gp(n, t[n], r)
      ;(n === 'float' && (n = 'cssFloat'), r ? e.setProperty(n, i) : (e[n] = i))
    }
}
var $v = te(
  { menuitem: !0 },
  {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0,
  },
)
function gl(e, t) {
  if (t) {
    if ($v[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(R(137, e))
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(R(60))
      if (typeof t.dangerouslySetInnerHTML != 'object' || !('__html' in t.dangerouslySetInnerHTML))
        throw Error(R(61))
    }
    if (t.style != null && typeof t.style != 'object') throw Error(R(62))
  }
}
function yl(e, t) {
  if (e.indexOf('-') === -1) return typeof t.is == 'string'
  switch (e) {
    case 'annotation-xml':
    case 'color-profile':
    case 'font-face':
    case 'font-face-src':
    case 'font-face-uri':
    case 'font-face-format':
    case 'font-face-name':
    case 'missing-glyph':
      return !1
    default:
      return !0
  }
}
var vl = null
function Fu(e) {
  return (
    (e = e.target || e.srcElement || window),
    e.correspondingUseElement && (e = e.correspondingUseElement),
    e.nodeType === 3 ? e.parentNode : e
  )
}
var xl = null,
  xr = null,
  wr = null
function Of(e) {
  if ((e = Qi(e))) {
    if (typeof xl != 'function') throw Error(R(280))
    var t = e.stateNode
    t && ((t = zo(t)), xl(e.stateNode, e.type, t))
  }
}
function Qp(e) {
  xr ? (wr ? wr.push(e) : (wr = [e])) : (xr = e)
}
function Yp() {
  if (xr) {
    var e = xr,
      t = wr
    if (((wr = xr = null), Of(e), t)) for (e = 0; e < t.length; e++) Of(t[e])
  }
}
function Jp(e, t) {
  return e(t)
}
function Zp() {}
var ma = !1
function em(e, t, n) {
  if (ma) return e(t, n)
  ma = !0
  try {
    return Jp(e, t, n)
  } finally {
    ;((ma = !1), (xr !== null || wr !== null) && (Zp(), Yp()))
  }
}
function Ci(e, t) {
  var n = e.stateNode
  if (n === null) return null
  var r = zo(n)
  if (r === null) return null
  n = r[t]
  e: switch (t) {
    case 'onClick':
    case 'onClickCapture':
    case 'onDoubleClick':
    case 'onDoubleClickCapture':
    case 'onMouseDown':
    case 'onMouseDownCapture':
    case 'onMouseMove':
    case 'onMouseMoveCapture':
    case 'onMouseUp':
    case 'onMouseUpCapture':
    case 'onMouseEnter':
      ;((r = !r.disabled) ||
        ((e = e.type),
        (r = !(e === 'button' || e === 'input' || e === 'select' || e === 'textarea'))),
        (e = !r))
      break e
    default:
      e = !1
  }
  if (e) return null
  if (n && typeof n != 'function') throw Error(R(231, t, typeof n))
  return n
}
var wl = !1
if (Vt)
  try {
    var qr = {}
    ;(Object.defineProperty(qr, 'passive', {
      get: function () {
        wl = !0
      },
    }),
      window.addEventListener('test', qr, qr),
      window.removeEventListener('test', qr, qr))
  } catch {
    wl = !1
  }
function Wv(e, t, n, r, i, s, o, a, l) {
  var u = Array.prototype.slice.call(arguments, 3)
  try {
    t.apply(n, u)
  } catch (c) {
    this.onError(c)
  }
}
var ci = !1,
  Js = null,
  Zs = !1,
  Sl = null,
  Hv = {
    onError: function (e) {
      ;((ci = !0), (Js = e))
    },
  }
function Kv(e, t, n, r, i, s, o, a, l) {
  ;((ci = !1), (Js = null), Wv.apply(Hv, arguments))
}
function qv(e, t, n, r, i, s, o, a, l) {
  if ((Kv.apply(this, arguments), ci)) {
    if (ci) {
      var u = Js
      ;((ci = !1), (Js = null))
    } else throw Error(R(198))
    Zs || ((Zs = !0), (Sl = u))
  }
}
function Qn(e) {
  var t = e,
    n = e
  if (e.alternate) for (; t.return;) t = t.return
  else {
    e = t
    do ((t = e), t.flags & 4098 && (n = t.return), (e = t.return))
    while (e)
  }
  return t.tag === 3 ? n : null
}
function tm(e) {
  if (e.tag === 13) {
    var t = e.memoizedState
    if ((t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)), t !== null))
      return t.dehydrated
  }
  return null
}
function Lf(e) {
  if (Qn(e) !== e) throw Error(R(188))
}
function Gv(e) {
  var t = e.alternate
  if (!t) {
    if (((t = Qn(e)), t === null)) throw Error(R(188))
    return t !== e ? null : e
  }
  for (var n = e, r = t; ;) {
    var i = n.return
    if (i === null) break
    var s = i.alternate
    if (s === null) {
      if (((r = i.return), r !== null)) {
        n = r
        continue
      }
      break
    }
    if (i.child === s.child) {
      for (s = i.child; s;) {
        if (s === n) return (Lf(i), e)
        if (s === r) return (Lf(i), t)
        s = s.sibling
      }
      throw Error(R(188))
    }
    if (n.return !== r.return) ((n = i), (r = s))
    else {
      for (var o = !1, a = i.child; a;) {
        if (a === n) {
          ;((o = !0), (n = i), (r = s))
          break
        }
        if (a === r) {
          ;((o = !0), (r = i), (n = s))
          break
        }
        a = a.sibling
      }
      if (!o) {
        for (a = s.child; a;) {
          if (a === n) {
            ;((o = !0), (n = s), (r = i))
            break
          }
          if (a === r) {
            ;((o = !0), (r = s), (n = i))
            break
          }
          a = a.sibling
        }
        if (!o) throw Error(R(189))
      }
    }
    if (n.alternate !== r) throw Error(R(190))
  }
  if (n.tag !== 3) throw Error(R(188))
  return n.stateNode.current === n ? e : t
}
function nm(e) {
  return ((e = Gv(e)), e !== null ? rm(e) : null)
}
function rm(e) {
  if (e.tag === 5 || e.tag === 6) return e
  for (e = e.child; e !== null;) {
    var t = rm(e)
    if (t !== null) return t
    e = e.sibling
  }
  return null
}
var im = Ge.unstable_scheduleCallback,
  Nf = Ge.unstable_cancelCallback,
  Xv = Ge.unstable_shouldYield,
  Qv = Ge.unstable_requestPaint,
  oe = Ge.unstable_now,
  Yv = Ge.unstable_getCurrentPriorityLevel,
  Vu = Ge.unstable_ImmediatePriority,
  sm = Ge.unstable_UserBlockingPriority,
  eo = Ge.unstable_NormalPriority,
  Jv = Ge.unstable_LowPriority,
  om = Ge.unstable_IdlePriority,
  Fo = null,
  Ct = null
function Zv(e) {
  if (Ct && typeof Ct.onCommitFiberRoot == 'function')
    try {
      Ct.onCommitFiberRoot(Fo, e, void 0, (e.current.flags & 128) === 128)
    } catch {}
}
var ht = Math.clz32 ? Math.clz32 : n1,
  e1 = Math.log,
  t1 = Math.LN2
function n1(e) {
  return ((e >>>= 0), e === 0 ? 32 : (31 - ((e1(e) / t1) | 0)) | 0)
}
var ds = 64,
  hs = 4194304
function ii(e) {
  switch (e & -e) {
    case 1:
      return 1
    case 2:
      return 2
    case 4:
      return 4
    case 8:
      return 8
    case 16:
      return 16
    case 32:
      return 32
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e & 4194240
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return e & 130023424
    case 134217728:
      return 134217728
    case 268435456:
      return 268435456
    case 536870912:
      return 536870912
    case 1073741824:
      return 1073741824
    default:
      return e
  }
}
function to(e, t) {
  var n = e.pendingLanes
  if (n === 0) return 0
  var r = 0,
    i = e.suspendedLanes,
    s = e.pingedLanes,
    o = n & 268435455
  if (o !== 0) {
    var a = o & ~i
    a !== 0 ? (r = ii(a)) : ((s &= o), s !== 0 && (r = ii(s)))
  } else ((o = n & ~i), o !== 0 ? (r = ii(o)) : s !== 0 && (r = ii(s)))
  if (r === 0) return 0
  if (
    t !== 0 &&
    t !== r &&
    !(t & i) &&
    ((i = r & -r), (s = t & -t), i >= s || (i === 16 && (s & 4194240) !== 0))
  )
    return t
  if ((r & 4 && (r |= n & 16), (t = e.entangledLanes), t !== 0))
    for (e = e.entanglements, t &= r; 0 < t;)
      ((n = 31 - ht(t)), (i = 1 << n), (r |= e[n]), (t &= ~i))
  return r
}
function r1(e, t) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return t + 250
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t + 5e3
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1
    default:
      return -1
  }
}
function i1(e, t) {
  for (
    var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, s = e.pendingLanes;
    0 < s;
  ) {
    var o = 31 - ht(s),
      a = 1 << o,
      l = i[o]
    ;(l === -1 ? (!(a & n) || a & r) && (i[o] = r1(a, t)) : l <= t && (e.expiredLanes |= a),
      (s &= ~a))
  }
}
function El(e) {
  return ((e = e.pendingLanes & -1073741825), e !== 0 ? e : e & 1073741824 ? 1073741824 : 0)
}
function am() {
  var e = ds
  return ((ds <<= 1), !(ds & 4194240) && (ds = 64), e)
}
function ga(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e)
  return t
}
function Gi(e, t, n) {
  ;((e.pendingLanes |= t),
    t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
    (e = e.eventTimes),
    (t = 31 - ht(t)),
    (e[t] = n))
}
function s1(e, t) {
  var n = e.pendingLanes & ~t
  ;((e.pendingLanes = t),
    (e.suspendedLanes = 0),
    (e.pingedLanes = 0),
    (e.expiredLanes &= t),
    (e.mutableReadLanes &= t),
    (e.entangledLanes &= t),
    (t = e.entanglements))
  var r = e.eventTimes
  for (e = e.expirationTimes; 0 < n;) {
    var i = 31 - ht(n),
      s = 1 << i
    ;((t[i] = 0), (r[i] = -1), (e[i] = -1), (n &= ~s))
  }
}
function Iu(e, t) {
  var n = (e.entangledLanes |= t)
  for (e = e.entanglements; n;) {
    var r = 31 - ht(n),
      i = 1 << r
    ;((i & t) | (e[r] & t) && (e[r] |= t), (n &= ~i))
  }
}
var $ = 0
function lm(e) {
  return ((e &= -e), 1 < e ? (4 < e ? (e & 268435455 ? 16 : 536870912) : 4) : 1)
}
var um,
  Bu,
  cm,
  fm,
  dm,
  Pl = !1,
  ps = [],
  sn = null,
  on = null,
  an = null,
  ki = new Map(),
  Ti = new Map(),
  Jt = [],
  o1 =
    'mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit'.split(
      ' ',
    )
function Df(e, t) {
  switch (e) {
    case 'focusin':
    case 'focusout':
      sn = null
      break
    case 'dragenter':
    case 'dragleave':
      on = null
      break
    case 'mouseover':
    case 'mouseout':
      an = null
      break
    case 'pointerover':
    case 'pointerout':
      ki.delete(t.pointerId)
      break
    case 'gotpointercapture':
    case 'lostpointercapture':
      Ti.delete(t.pointerId)
  }
}
function Gr(e, t, n, r, i, s) {
  return e === null || e.nativeEvent !== s
    ? ((e = {
        blockedOn: t,
        domEventName: n,
        eventSystemFlags: r,
        nativeEvent: s,
        targetContainers: [i],
      }),
      t !== null && ((t = Qi(t)), t !== null && Bu(t)),
      e)
    : ((e.eventSystemFlags |= r),
      (t = e.targetContainers),
      i !== null && t.indexOf(i) === -1 && t.push(i),
      e)
}
function a1(e, t, n, r, i) {
  switch (t) {
    case 'focusin':
      return ((sn = Gr(sn, e, t, n, r, i)), !0)
    case 'dragenter':
      return ((on = Gr(on, e, t, n, r, i)), !0)
    case 'mouseover':
      return ((an = Gr(an, e, t, n, r, i)), !0)
    case 'pointerover':
      var s = i.pointerId
      return (ki.set(s, Gr(ki.get(s) || null, e, t, n, r, i)), !0)
    case 'gotpointercapture':
      return ((s = i.pointerId), Ti.set(s, Gr(Ti.get(s) || null, e, t, n, r, i)), !0)
  }
  return !1
}
function hm(e) {
  var t = Ln(e.target)
  if (t !== null) {
    var n = Qn(t)
    if (n !== null) {
      if (((t = n.tag), t === 13)) {
        if (((t = tm(n)), t !== null)) {
          ;((e.blockedOn = t),
            dm(e.priority, function () {
              cm(n)
            }))
          return
        }
      } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null
        return
      }
    }
  }
  e.blockedOn = null
}
function Ds(e) {
  if (e.blockedOn !== null) return !1
  for (var t = e.targetContainers; 0 < t.length;) {
    var n = Cl(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent)
    if (n === null) {
      n = e.nativeEvent
      var r = new n.constructor(n.type, n)
      ;((vl = r), n.target.dispatchEvent(r), (vl = null))
    } else return ((t = Qi(n)), t !== null && Bu(t), (e.blockedOn = n), !1)
    t.shift()
  }
  return !0
}
function Mf(e, t, n) {
  Ds(e) && n.delete(t)
}
function l1() {
  ;((Pl = !1),
    sn !== null && Ds(sn) && (sn = null),
    on !== null && Ds(on) && (on = null),
    an !== null && Ds(an) && (an = null),
    ki.forEach(Mf),
    Ti.forEach(Mf))
}
function Xr(e, t) {
  e.blockedOn === t &&
    ((e.blockedOn = null),
    Pl || ((Pl = !0), Ge.unstable_scheduleCallback(Ge.unstable_NormalPriority, l1)))
}
function Ri(e) {
  function t(i) {
    return Xr(i, e)
  }
  if (0 < ps.length) {
    Xr(ps[0], e)
    for (var n = 1; n < ps.length; n++) {
      var r = ps[n]
      r.blockedOn === e && (r.blockedOn = null)
    }
  }
  for (
    sn !== null && Xr(sn, e),
      on !== null && Xr(on, e),
      an !== null && Xr(an, e),
      ki.forEach(t),
      Ti.forEach(t),
      n = 0;
    n < Jt.length;
    n++
  )
    ((r = Jt[n]), r.blockedOn === e && (r.blockedOn = null))
  for (; 0 < Jt.length && ((n = Jt[0]), n.blockedOn === null);)
    (hm(n), n.blockedOn === null && Jt.shift())
}
var Sr = Wt.ReactCurrentBatchConfig,
  no = !0
function u1(e, t, n, r) {
  var i = $,
    s = Sr.transition
  Sr.transition = null
  try {
    ;(($ = 1), zu(e, t, n, r))
  } finally {
    ;(($ = i), (Sr.transition = s))
  }
}
function c1(e, t, n, r) {
  var i = $,
    s = Sr.transition
  Sr.transition = null
  try {
    ;(($ = 4), zu(e, t, n, r))
  } finally {
    ;(($ = i), (Sr.transition = s))
  }
}
function zu(e, t, n, r) {
  if (no) {
    var i = Cl(e, t, n, r)
    if (i === null) (Ta(e, t, r, ro, n), Df(e, r))
    else if (a1(i, e, t, n, r)) r.stopPropagation()
    else if ((Df(e, r), t & 4 && -1 < o1.indexOf(e))) {
      for (; i !== null;) {
        var s = Qi(i)
        if ((s !== null && um(s), (s = Cl(e, t, n, r)), s === null && Ta(e, t, r, ro, n), s === i))
          break
        i = s
      }
      i !== null && r.stopPropagation()
    } else Ta(e, t, r, null, n)
  }
}
var ro = null
function Cl(e, t, n, r) {
  if (((ro = null), (e = Fu(r)), (e = Ln(e)), e !== null))
    if (((t = Qn(e)), t === null)) e = null
    else if (((n = t.tag), n === 13)) {
      if (((e = tm(t)), e !== null)) return e
      e = null
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated)
        return t.tag === 3 ? t.stateNode.containerInfo : null
      e = null
    } else t !== e && (e = null)
  return ((ro = e), null)
}
function pm(e) {
  switch (e) {
    case 'cancel':
    case 'click':
    case 'close':
    case 'contextmenu':
    case 'copy':
    case 'cut':
    case 'auxclick':
    case 'dblclick':
    case 'dragend':
    case 'dragstart':
    case 'drop':
    case 'focusin':
    case 'focusout':
    case 'input':
    case 'invalid':
    case 'keydown':
    case 'keypress':
    case 'keyup':
    case 'mousedown':
    case 'mouseup':
    case 'paste':
    case 'pause':
    case 'play':
    case 'pointercancel':
    case 'pointerdown':
    case 'pointerup':
    case 'ratechange':
    case 'reset':
    case 'resize':
    case 'seeked':
    case 'submit':
    case 'touchcancel':
    case 'touchend':
    case 'touchstart':
    case 'volumechange':
    case 'change':
    case 'selectionchange':
    case 'textInput':
    case 'compositionstart':
    case 'compositionend':
    case 'compositionupdate':
    case 'beforeblur':
    case 'afterblur':
    case 'beforeinput':
    case 'blur':
    case 'fullscreenchange':
    case 'focus':
    case 'hashchange':
    case 'popstate':
    case 'select':
    case 'selectstart':
      return 1
    case 'drag':
    case 'dragenter':
    case 'dragexit':
    case 'dragleave':
    case 'dragover':
    case 'mousemove':
    case 'mouseout':
    case 'mouseover':
    case 'pointermove':
    case 'pointerout':
    case 'pointerover':
    case 'scroll':
    case 'toggle':
    case 'touchmove':
    case 'wheel':
    case 'mouseenter':
    case 'mouseleave':
    case 'pointerenter':
    case 'pointerleave':
      return 4
    case 'message':
      switch (Yv()) {
        case Vu:
          return 1
        case sm:
          return 4
        case eo:
        case Jv:
          return 16
        case om:
          return 536870912
        default:
          return 16
      }
    default:
      return 16
  }
}
var tn = null,
  Uu = null,
  Ms = null
function mm() {
  if (Ms) return Ms
  var e,
    t = Uu,
    n = t.length,
    r,
    i = 'value' in tn ? tn.value : tn.textContent,
    s = i.length
  for (e = 0; e < n && t[e] === i[e]; e++);
  var o = n - e
  for (r = 1; r <= o && t[n - r] === i[s - r]; r++);
  return (Ms = i.slice(e, 1 < r ? 1 - r : void 0))
}
function bs(e) {
  var t = e.keyCode
  return (
    'charCode' in e ? ((e = e.charCode), e === 0 && t === 13 && (e = 13)) : (e = t),
    e === 10 && (e = 13),
    32 <= e || e === 13 ? e : 0
  )
}
function ms() {
  return !0
}
function bf() {
  return !1
}
function Ye(e) {
  function t(n, r, i, s, o) {
    ;((this._reactName = n),
      (this._targetInst = i),
      (this.type = r),
      (this.nativeEvent = s),
      (this.target = o),
      (this.currentTarget = null))
    for (var a in e) e.hasOwnProperty(a) && ((n = e[a]), (this[a] = n ? n(s) : s[a]))
    return (
      (this.isDefaultPrevented = (
        s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1
      )
        ? ms
        : bf),
      (this.isPropagationStopped = bf),
      this
    )
  }
  return (
    te(t.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0
        var n = this.nativeEvent
        n &&
          (n.preventDefault
            ? n.preventDefault()
            : typeof n.returnValue != 'unknown' && (n.returnValue = !1),
          (this.isDefaultPrevented = ms))
      },
      stopPropagation: function () {
        var n = this.nativeEvent
        n &&
          (n.stopPropagation
            ? n.stopPropagation()
            : typeof n.cancelBubble != 'unknown' && (n.cancelBubble = !0),
          (this.isPropagationStopped = ms))
      },
      persist: function () {},
      isPersistent: ms,
    }),
    t
  )
}
var Fr = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now()
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  $u = Ye(Fr),
  Xi = te({}, Fr, { view: 0, detail: 0 }),
  f1 = Ye(Xi),
  ya,
  va,
  Qr,
  Vo = te({}, Xi, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Wu,
    button: 0,
    buttons: 0,
    relatedTarget: function (e) {
      return e.relatedTarget === void 0
        ? e.fromElement === e.srcElement
          ? e.toElement
          : e.fromElement
        : e.relatedTarget
    },
    movementX: function (e) {
      return 'movementX' in e
        ? e.movementX
        : (e !== Qr &&
            (Qr && e.type === 'mousemove'
              ? ((ya = e.screenX - Qr.screenX), (va = e.screenY - Qr.screenY))
              : (va = ya = 0),
            (Qr = e)),
          ya)
    },
    movementY: function (e) {
      return 'movementY' in e ? e.movementY : va
    },
  }),
  Ff = Ye(Vo),
  d1 = te({}, Vo, { dataTransfer: 0 }),
  h1 = Ye(d1),
  p1 = te({}, Xi, { relatedTarget: 0 }),
  xa = Ye(p1),
  m1 = te({}, Fr, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  g1 = Ye(m1),
  y1 = te({}, Fr, {
    clipboardData: function (e) {
      return 'clipboardData' in e ? e.clipboardData : window.clipboardData
    },
  }),
  v1 = Ye(y1),
  x1 = te({}, Fr, { data: 0 }),
  Vf = Ye(x1),
  w1 = {
    Esc: 'Escape',
    Spacebar: ' ',
    Left: 'ArrowLeft',
    Up: 'ArrowUp',
    Right: 'ArrowRight',
    Down: 'ArrowDown',
    Del: 'Delete',
    Win: 'OS',
    Menu: 'ContextMenu',
    Apps: 'ContextMenu',
    Scroll: 'ScrollLock',
    MozPrintableKey: 'Unidentified',
  },
  S1 = {
    8: 'Backspace',
    9: 'Tab',
    12: 'Clear',
    13: 'Enter',
    16: 'Shift',
    17: 'Control',
    18: 'Alt',
    19: 'Pause',
    20: 'CapsLock',
    27: 'Escape',
    32: ' ',
    33: 'PageUp',
    34: 'PageDown',
    35: 'End',
    36: 'Home',
    37: 'ArrowLeft',
    38: 'ArrowUp',
    39: 'ArrowRight',
    40: 'ArrowDown',
    45: 'Insert',
    46: 'Delete',
    112: 'F1',
    113: 'F2',
    114: 'F3',
    115: 'F4',
    116: 'F5',
    117: 'F6',
    118: 'F7',
    119: 'F8',
    120: 'F9',
    121: 'F10',
    122: 'F11',
    123: 'F12',
    144: 'NumLock',
    145: 'ScrollLock',
    224: 'Meta',
  },
  E1 = { Alt: 'altKey', Control: 'ctrlKey', Meta: 'metaKey', Shift: 'shiftKey' }
function P1(e) {
  var t = this.nativeEvent
  return t.getModifierState ? t.getModifierState(e) : (e = E1[e]) ? !!t[e] : !1
}
function Wu() {
  return P1
}
var C1 = te({}, Xi, {
    key: function (e) {
      if (e.key) {
        var t = w1[e.key] || e.key
        if (t !== 'Unidentified') return t
      }
      return e.type === 'keypress'
        ? ((e = bs(e)), e === 13 ? 'Enter' : String.fromCharCode(e))
        : e.type === 'keydown' || e.type === 'keyup'
          ? S1[e.keyCode] || 'Unidentified'
          : ''
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Wu,
    charCode: function (e) {
      return e.type === 'keypress' ? bs(e) : 0
    },
    keyCode: function (e) {
      return e.type === 'keydown' || e.type === 'keyup' ? e.keyCode : 0
    },
    which: function (e) {
      return e.type === 'keypress'
        ? bs(e)
        : e.type === 'keydown' || e.type === 'keyup'
          ? e.keyCode
          : 0
    },
  }),
  k1 = Ye(C1),
  T1 = te({}, Vo, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0,
  }),
  If = Ye(T1),
  R1 = te({}, Xi, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Wu,
  }),
  A1 = Ye(R1),
  _1 = te({}, Fr, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  j1 = Ye(_1),
  O1 = te({}, Vo, {
    deltaX: function (e) {
      return 'deltaX' in e ? e.deltaX : 'wheelDeltaX' in e ? -e.wheelDeltaX : 0
    },
    deltaY: function (e) {
      return 'deltaY' in e
        ? e.deltaY
        : 'wheelDeltaY' in e
          ? -e.wheelDeltaY
          : 'wheelDelta' in e
            ? -e.wheelDelta
            : 0
    },
    deltaZ: 0,
    deltaMode: 0,
  }),
  L1 = Ye(O1),
  N1 = [9, 13, 27, 32],
  Hu = Vt && 'CompositionEvent' in window,
  fi = null
Vt && 'documentMode' in document && (fi = document.documentMode)
var D1 = Vt && 'TextEvent' in window && !fi,
  gm = Vt && (!Hu || (fi && 8 < fi && 11 >= fi)),
  Bf = ' ',
  zf = !1
function ym(e, t) {
  switch (e) {
    case 'keyup':
      return N1.indexOf(t.keyCode) !== -1
    case 'keydown':
      return t.keyCode !== 229
    case 'keypress':
    case 'mousedown':
    case 'focusout':
      return !0
    default:
      return !1
  }
}
function vm(e) {
  return ((e = e.detail), typeof e == 'object' && 'data' in e ? e.data : null)
}
var rr = !1
function M1(e, t) {
  switch (e) {
    case 'compositionend':
      return vm(t)
    case 'keypress':
      return t.which !== 32 ? null : ((zf = !0), Bf)
    case 'textInput':
      return ((e = t.data), e === Bf && zf ? null : e)
    default:
      return null
  }
}
function b1(e, t) {
  if (rr)
    return e === 'compositionend' || (!Hu && ym(e, t))
      ? ((e = mm()), (Ms = Uu = tn = null), (rr = !1), e)
      : null
  switch (e) {
    case 'paste':
      return null
    case 'keypress':
      if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
        if (t.char && 1 < t.char.length) return t.char
        if (t.which) return String.fromCharCode(t.which)
      }
      return null
    case 'compositionend':
      return gm && t.locale !== 'ko' ? null : t.data
    default:
      return null
  }
}
var F1 = {
  color: !0,
  date: !0,
  datetime: !0,
  'datetime-local': !0,
  email: !0,
  month: !0,
  number: !0,
  password: !0,
  range: !0,
  search: !0,
  tel: !0,
  text: !0,
  time: !0,
  url: !0,
  week: !0,
}
function Uf(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase()
  return t === 'input' ? !!F1[e.type] : t === 'textarea'
}
function xm(e, t, n, r) {
  ;(Qp(r),
    (t = io(t, 'onChange')),
    0 < t.length &&
      ((n = new $u('onChange', 'change', null, n, r)), e.push({ event: n, listeners: t })))
}
var di = null,
  Ai = null
function V1(e) {
  jm(e, 0)
}
function Io(e) {
  var t = or(e)
  if ($p(t)) return e
}
function I1(e, t) {
  if (e === 'change') return t
}
var wm = !1
if (Vt) {
  var wa
  if (Vt) {
    var Sa = 'oninput' in document
    if (!Sa) {
      var $f = document.createElement('div')
      ;($f.setAttribute('oninput', 'return;'), (Sa = typeof $f.oninput == 'function'))
    }
    wa = Sa
  } else wa = !1
  wm = wa && (!document.documentMode || 9 < document.documentMode)
}
function Wf() {
  di && (di.detachEvent('onpropertychange', Sm), (Ai = di = null))
}
function Sm(e) {
  if (e.propertyName === 'value' && Io(Ai)) {
    var t = []
    ;(xm(t, Ai, e, Fu(e)), em(V1, t))
  }
}
function B1(e, t, n) {
  e === 'focusin'
    ? (Wf(), (di = t), (Ai = n), di.attachEvent('onpropertychange', Sm))
    : e === 'focusout' && Wf()
}
function z1(e) {
  if (e === 'selectionchange' || e === 'keyup' || e === 'keydown') return Io(Ai)
}
function U1(e, t) {
  if (e === 'click') return Io(t)
}
function $1(e, t) {
  if (e === 'input' || e === 'change') return Io(t)
}
function W1(e, t) {
  return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t)
}
var mt = typeof Object.is == 'function' ? Object.is : W1
function _i(e, t) {
  if (mt(e, t)) return !0
  if (typeof e != 'object' || e === null || typeof t != 'object' || t === null) return !1
  var n = Object.keys(e),
    r = Object.keys(t)
  if (n.length !== r.length) return !1
  for (r = 0; r < n.length; r++) {
    var i = n[r]
    if (!ol.call(t, i) || !mt(e[i], t[i])) return !1
  }
  return !0
}
function Hf(e) {
  for (; e && e.firstChild;) e = e.firstChild
  return e
}
function Kf(e, t) {
  var n = Hf(e)
  e = 0
  for (var r; n;) {
    if (n.nodeType === 3) {
      if (((r = e + n.textContent.length), e <= t && r >= t)) return { node: n, offset: t - e }
      e = r
    }
    e: {
      for (; n;) {
        if (n.nextSibling) {
          n = n.nextSibling
          break e
        }
        n = n.parentNode
      }
      n = void 0
    }
    n = Hf(n)
  }
}
function Em(e, t) {
  return e && t
    ? e === t
      ? !0
      : e && e.nodeType === 3
        ? !1
        : t && t.nodeType === 3
          ? Em(e, t.parentNode)
          : 'contains' in e
            ? e.contains(t)
            : e.compareDocumentPosition
              ? !!(e.compareDocumentPosition(t) & 16)
              : !1
    : !1
}
function Pm() {
  for (var e = window, t = Ys(); t instanceof e.HTMLIFrameElement;) {
    try {
      var n = typeof t.contentWindow.location.href == 'string'
    } catch {
      n = !1
    }
    if (n) e = t.contentWindow
    else break
    t = Ys(e.document)
  }
  return t
}
function Ku(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase()
  return (
    t &&
    ((t === 'input' &&
      (e.type === 'text' ||
        e.type === 'search' ||
        e.type === 'tel' ||
        e.type === 'url' ||
        e.type === 'password')) ||
      t === 'textarea' ||
      e.contentEditable === 'true')
  )
}
function H1(e) {
  var t = Pm(),
    n = e.focusedElem,
    r = e.selectionRange
  if (t !== n && n && n.ownerDocument && Em(n.ownerDocument.documentElement, n)) {
    if (r !== null && Ku(n)) {
      if (((t = r.start), (e = r.end), e === void 0 && (e = t), 'selectionStart' in n))
        ((n.selectionStart = t), (n.selectionEnd = Math.min(e, n.value.length)))
      else if (
        ((e = ((t = n.ownerDocument || document) && t.defaultView) || window), e.getSelection)
      ) {
        e = e.getSelection()
        var i = n.textContent.length,
          s = Math.min(r.start, i)
        ;((r = r.end === void 0 ? s : Math.min(r.end, i)),
          !e.extend && s > r && ((i = r), (r = s), (s = i)),
          (i = Kf(n, s)))
        var o = Kf(n, r)
        i &&
          o &&
          (e.rangeCount !== 1 ||
            e.anchorNode !== i.node ||
            e.anchorOffset !== i.offset ||
            e.focusNode !== o.node ||
            e.focusOffset !== o.offset) &&
          ((t = t.createRange()),
          t.setStart(i.node, i.offset),
          e.removeAllRanges(),
          s > r
            ? (e.addRange(t), e.extend(o.node, o.offset))
            : (t.setEnd(o.node, o.offset), e.addRange(t)))
      }
    }
    for (t = [], e = n; (e = e.parentNode);)
      e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop })
    for (typeof n.focus == 'function' && n.focus(), n = 0; n < t.length; n++)
      ((e = t[n]), (e.element.scrollLeft = e.left), (e.element.scrollTop = e.top))
  }
}
var K1 = Vt && 'documentMode' in document && 11 >= document.documentMode,
  ir = null,
  kl = null,
  hi = null,
  Tl = !1
function qf(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument
  Tl ||
    ir == null ||
    ir !== Ys(r) ||
    ((r = ir),
    'selectionStart' in r && Ku(r)
      ? (r = { start: r.selectionStart, end: r.selectionEnd })
      : ((r = ((r.ownerDocument && r.ownerDocument.defaultView) || window).getSelection()),
        (r = {
          anchorNode: r.anchorNode,
          anchorOffset: r.anchorOffset,
          focusNode: r.focusNode,
          focusOffset: r.focusOffset,
        })),
    (hi && _i(hi, r)) ||
      ((hi = r),
      (r = io(kl, 'onSelect')),
      0 < r.length &&
        ((t = new $u('onSelect', 'select', null, t, n)),
        e.push({ event: t, listeners: r }),
        (t.target = ir))))
}
function gs(e, t) {
  var n = {}
  return (
    (n[e.toLowerCase()] = t.toLowerCase()),
    (n['Webkit' + e] = 'webkit' + t),
    (n['Moz' + e] = 'moz' + t),
    n
  )
}
var sr = {
    animationend: gs('Animation', 'AnimationEnd'),
    animationiteration: gs('Animation', 'AnimationIteration'),
    animationstart: gs('Animation', 'AnimationStart'),
    transitionend: gs('Transition', 'TransitionEnd'),
  },
  Ea = {},
  Cm = {}
Vt &&
  ((Cm = document.createElement('div').style),
  'AnimationEvent' in window ||
    (delete sr.animationend.animation,
    delete sr.animationiteration.animation,
    delete sr.animationstart.animation),
  'TransitionEvent' in window || delete sr.transitionend.transition)
function Bo(e) {
  if (Ea[e]) return Ea[e]
  if (!sr[e]) return e
  var t = sr[e],
    n
  for (n in t) if (t.hasOwnProperty(n) && n in Cm) return (Ea[e] = t[n])
  return e
}
var km = Bo('animationend'),
  Tm = Bo('animationiteration'),
  Rm = Bo('animationstart'),
  Am = Bo('transitionend'),
  _m = new Map(),
  Gf =
    'abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel'.split(
      ' ',
    )
function vn(e, t) {
  ;(_m.set(e, t), Xn(t, [e]))
}
for (var Pa = 0; Pa < Gf.length; Pa++) {
  var Ca = Gf[Pa],
    q1 = Ca.toLowerCase(),
    G1 = Ca[0].toUpperCase() + Ca.slice(1)
  vn(q1, 'on' + G1)
}
vn(km, 'onAnimationEnd')
vn(Tm, 'onAnimationIteration')
vn(Rm, 'onAnimationStart')
vn('dblclick', 'onDoubleClick')
vn('focusin', 'onFocus')
vn('focusout', 'onBlur')
vn(Am, 'onTransitionEnd')
Cr('onMouseEnter', ['mouseout', 'mouseover'])
Cr('onMouseLeave', ['mouseout', 'mouseover'])
Cr('onPointerEnter', ['pointerout', 'pointerover'])
Cr('onPointerLeave', ['pointerout', 'pointerover'])
Xn('onChange', 'change click focusin focusout input keydown keyup selectionchange'.split(' '))
Xn(
  'onSelect',
  'focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange'.split(' '),
)
Xn('onBeforeInput', ['compositionend', 'keypress', 'textInput', 'paste'])
Xn('onCompositionEnd', 'compositionend focusout keydown keypress keyup mousedown'.split(' '))
Xn('onCompositionStart', 'compositionstart focusout keydown keypress keyup mousedown'.split(' '))
Xn('onCompositionUpdate', 'compositionupdate focusout keydown keypress keyup mousedown'.split(' '))
var si =
    'abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting'.split(
      ' ',
    ),
  X1 = new Set('cancel close invalid load scroll toggle'.split(' ').concat(si))
function Xf(e, t, n) {
  var r = e.type || 'unknown-event'
  ;((e.currentTarget = n), qv(r, t, void 0, e), (e.currentTarget = null))
}
function jm(e, t) {
  t = (t & 4) !== 0
  for (var n = 0; n < e.length; n++) {
    var r = e[n],
      i = r.event
    r = r.listeners
    e: {
      var s = void 0
      if (t)
        for (var o = r.length - 1; 0 <= o; o--) {
          var a = r[o],
            l = a.instance,
            u = a.currentTarget
          if (((a = a.listener), l !== s && i.isPropagationStopped())) break e
          ;(Xf(i, a, u), (s = l))
        }
      else
        for (o = 0; o < r.length; o++) {
          if (
            ((a = r[o]),
            (l = a.instance),
            (u = a.currentTarget),
            (a = a.listener),
            l !== s && i.isPropagationStopped())
          )
            break e
          ;(Xf(i, a, u), (s = l))
        }
    }
  }
  if (Zs) throw ((e = Sl), (Zs = !1), (Sl = null), e)
}
function q(e, t) {
  var n = t[Ol]
  n === void 0 && (n = t[Ol] = new Set())
  var r = e + '__bubble'
  n.has(r) || (Om(t, e, 2, !1), n.add(r))
}
function ka(e, t, n) {
  var r = 0
  ;(t && (r |= 4), Om(n, e, r, t))
}
var ys = '_reactListening' + Math.random().toString(36).slice(2)
function ji(e) {
  if (!e[ys]) {
    ;((e[ys] = !0),
      Vp.forEach(function (n) {
        n !== 'selectionchange' && (X1.has(n) || ka(n, !1, e), ka(n, !0, e))
      }))
    var t = e.nodeType === 9 ? e : e.ownerDocument
    t === null || t[ys] || ((t[ys] = !0), ka('selectionchange', !1, t))
  }
}
function Om(e, t, n, r) {
  switch (pm(t)) {
    case 1:
      var i = u1
      break
    case 4:
      i = c1
      break
    default:
      i = zu
  }
  ;((n = i.bind(null, t, n, e)),
    (i = void 0),
    !wl || (t !== 'touchstart' && t !== 'touchmove' && t !== 'wheel') || (i = !0),
    r
      ? i !== void 0
        ? e.addEventListener(t, n, { capture: !0, passive: i })
        : e.addEventListener(t, n, !0)
      : i !== void 0
        ? e.addEventListener(t, n, { passive: i })
        : e.addEventListener(t, n, !1))
}
function Ta(e, t, n, r, i) {
  var s = r
  if (!(t & 1) && !(t & 2) && r !== null)
    e: for (;;) {
      if (r === null) return
      var o = r.tag
      if (o === 3 || o === 4) {
        var a = r.stateNode.containerInfo
        if (a === i || (a.nodeType === 8 && a.parentNode === i)) break
        if (o === 4)
          for (o = r.return; o !== null;) {
            var l = o.tag
            if (
              (l === 3 || l === 4) &&
              ((l = o.stateNode.containerInfo), l === i || (l.nodeType === 8 && l.parentNode === i))
            )
              return
            o = o.return
          }
        for (; a !== null;) {
          if (((o = Ln(a)), o === null)) return
          if (((l = o.tag), l === 5 || l === 6)) {
            r = s = o
            continue e
          }
          a = a.parentNode
        }
      }
      r = r.return
    }
  em(function () {
    var u = s,
      c = Fu(n),
      f = []
    e: {
      var d = _m.get(e)
      if (d !== void 0) {
        var g = $u,
          v = e
        switch (e) {
          case 'keypress':
            if (bs(n) === 0) break e
          case 'keydown':
          case 'keyup':
            g = k1
            break
          case 'focusin':
            ;((v = 'focus'), (g = xa))
            break
          case 'focusout':
            ;((v = 'blur'), (g = xa))
            break
          case 'beforeblur':
          case 'afterblur':
            g = xa
            break
          case 'click':
            if (n.button === 2) break e
          case 'auxclick':
          case 'dblclick':
          case 'mousedown':
          case 'mousemove':
          case 'mouseup':
          case 'mouseout':
          case 'mouseover':
          case 'contextmenu':
            g = Ff
            break
          case 'drag':
          case 'dragend':
          case 'dragenter':
          case 'dragexit':
          case 'dragleave':
          case 'dragover':
          case 'dragstart':
          case 'drop':
            g = h1
            break
          case 'touchcancel':
          case 'touchend':
          case 'touchmove':
          case 'touchstart':
            g = A1
            break
          case km:
          case Tm:
          case Rm:
            g = g1
            break
          case Am:
            g = j1
            break
          case 'scroll':
            g = f1
            break
          case 'wheel':
            g = L1
            break
          case 'copy':
          case 'cut':
          case 'paste':
            g = v1
            break
          case 'gotpointercapture':
          case 'lostpointercapture':
          case 'pointercancel':
          case 'pointerdown':
          case 'pointermove':
          case 'pointerout':
          case 'pointerover':
          case 'pointerup':
            g = If
        }
        var x = (t & 4) !== 0,
          S = !x && e === 'scroll',
          h = x ? (d !== null ? d + 'Capture' : null) : d
        x = []
        for (var p = u, m; p !== null;) {
          m = p
          var P = m.stateNode
          if (
            (m.tag === 5 &&
              P !== null &&
              ((m = P), h !== null && ((P = Ci(p, h)), P != null && x.push(Oi(p, P, m)))),
            S)
          )
            break
          p = p.return
        }
        0 < x.length && ((d = new g(d, v, null, n, c)), f.push({ event: d, listeners: x }))
      }
    }
    if (!(t & 7)) {
      e: {
        if (
          ((d = e === 'mouseover' || e === 'pointerover'),
          (g = e === 'mouseout' || e === 'pointerout'),
          d && n !== vl && (v = n.relatedTarget || n.fromElement) && (Ln(v) || v[It]))
        )
          break e
        if (
          (g || d) &&
          ((d =
            c.window === c ? c : (d = c.ownerDocument) ? d.defaultView || d.parentWindow : window),
          g
            ? ((v = n.relatedTarget || n.toElement),
              (g = u),
              (v = v ? Ln(v) : null),
              v !== null && ((S = Qn(v)), v !== S || (v.tag !== 5 && v.tag !== 6)) && (v = null))
            : ((g = null), (v = u)),
          g !== v)
        ) {
          if (
            ((x = Ff),
            (P = 'onMouseLeave'),
            (h = 'onMouseEnter'),
            (p = 'mouse'),
            (e === 'pointerout' || e === 'pointerover') &&
              ((x = If), (P = 'onPointerLeave'), (h = 'onPointerEnter'), (p = 'pointer')),
            (S = g == null ? d : or(g)),
            (m = v == null ? d : or(v)),
            (d = new x(P, p + 'leave', g, n, c)),
            (d.target = S),
            (d.relatedTarget = m),
            (P = null),
            Ln(c) === u &&
              ((x = new x(h, p + 'enter', v, n, c)),
              (x.target = m),
              (x.relatedTarget = S),
              (P = x)),
            (S = P),
            g && v)
          )
            t: {
              for (x = g, h = v, p = 0, m = x; m; m = Zn(m)) p++
              for (m = 0, P = h; P; P = Zn(P)) m++
              for (; 0 < p - m;) ((x = Zn(x)), p--)
              for (; 0 < m - p;) ((h = Zn(h)), m--)
              for (; p--;) {
                if (x === h || (h !== null && x === h.alternate)) break t
                ;((x = Zn(x)), (h = Zn(h)))
              }
              x = null
            }
          else x = null
          ;(g !== null && Qf(f, d, g, x, !1), v !== null && S !== null && Qf(f, S, v, x, !0))
        }
      }
      e: {
        if (
          ((d = u ? or(u) : window),
          (g = d.nodeName && d.nodeName.toLowerCase()),
          g === 'select' || (g === 'input' && d.type === 'file'))
        )
          var C = I1
        else if (Uf(d))
          if (wm) C = $1
          else {
            C = z1
            var k = B1
          }
        else
          (g = d.nodeName) &&
            g.toLowerCase() === 'input' &&
            (d.type === 'checkbox' || d.type === 'radio') &&
            (C = U1)
        if (C && (C = C(e, u))) {
          xm(f, C, n, c)
          break e
        }
        ;(k && k(e, d, u),
          e === 'focusout' &&
            (k = d._wrapperState) &&
            k.controlled &&
            d.type === 'number' &&
            hl(d, 'number', d.value))
      }
      switch (((k = u ? or(u) : window), e)) {
        case 'focusin':
          ;(Uf(k) || k.contentEditable === 'true') && ((ir = k), (kl = u), (hi = null))
          break
        case 'focusout':
          hi = kl = ir = null
          break
        case 'mousedown':
          Tl = !0
          break
        case 'contextmenu':
        case 'mouseup':
        case 'dragend':
          ;((Tl = !1), qf(f, n, c))
          break
        case 'selectionchange':
          if (K1) break
        case 'keydown':
        case 'keyup':
          qf(f, n, c)
      }
      var A
      if (Hu)
        e: {
          switch (e) {
            case 'compositionstart':
              var T = 'onCompositionStart'
              break e
            case 'compositionend':
              T = 'onCompositionEnd'
              break e
            case 'compositionupdate':
              T = 'onCompositionUpdate'
              break e
          }
          T = void 0
        }
      else
        rr
          ? ym(e, n) && (T = 'onCompositionEnd')
          : e === 'keydown' && n.keyCode === 229 && (T = 'onCompositionStart')
      ;(T &&
        (gm &&
          n.locale !== 'ko' &&
          (rr || T !== 'onCompositionStart'
            ? T === 'onCompositionEnd' && rr && (A = mm())
            : ((tn = c), (Uu = 'value' in tn ? tn.value : tn.textContent), (rr = !0))),
        (k = io(u, T)),
        0 < k.length &&
          ((T = new Vf(T, e, null, n, c)),
          f.push({ event: T, listeners: k }),
          A ? (T.data = A) : ((A = vm(n)), A !== null && (T.data = A)))),
        (A = D1 ? M1(e, n) : b1(e, n)) &&
          ((u = io(u, 'onBeforeInput')),
          0 < u.length &&
            ((c = new Vf('onBeforeInput', 'beforeinput', null, n, c)),
            f.push({ event: c, listeners: u }),
            (c.data = A))))
    }
    jm(f, t)
  })
}
function Oi(e, t, n) {
  return { instance: e, listener: t, currentTarget: n }
}
function io(e, t) {
  for (var n = t + 'Capture', r = []; e !== null;) {
    var i = e,
      s = i.stateNode
    ;(i.tag === 5 &&
      s !== null &&
      ((i = s),
      (s = Ci(e, n)),
      s != null && r.unshift(Oi(e, s, i)),
      (s = Ci(e, t)),
      s != null && r.push(Oi(e, s, i))),
      (e = e.return))
  }
  return r
}
function Zn(e) {
  if (e === null) return null
  do e = e.return
  while (e && e.tag !== 5)
  return e || null
}
function Qf(e, t, n, r, i) {
  for (var s = t._reactName, o = []; n !== null && n !== r;) {
    var a = n,
      l = a.alternate,
      u = a.stateNode
    if (l !== null && l === r) break
    ;(a.tag === 5 &&
      u !== null &&
      ((a = u),
      i
        ? ((l = Ci(n, s)), l != null && o.unshift(Oi(n, l, a)))
        : i || ((l = Ci(n, s)), l != null && o.push(Oi(n, l, a)))),
      (n = n.return))
  }
  o.length !== 0 && e.push({ event: t, listeners: o })
}
var Q1 = /\r\n?/g,
  Y1 = /\u0000|\uFFFD/g
function Yf(e) {
  return (typeof e == 'string' ? e : '' + e)
    .replace(
      Q1,
      `
`,
    )
    .replace(Y1, '')
}
function vs(e, t, n) {
  if (((t = Yf(t)), Yf(e) !== t && n)) throw Error(R(425))
}
function so() {}
var Rl = null,
  Al = null
function _l(e, t) {
  return (
    e === 'textarea' ||
    e === 'noscript' ||
    typeof t.children == 'string' ||
    typeof t.children == 'number' ||
    (typeof t.dangerouslySetInnerHTML == 'object' &&
      t.dangerouslySetInnerHTML !== null &&
      t.dangerouslySetInnerHTML.__html != null)
  )
}
var jl = typeof setTimeout == 'function' ? setTimeout : void 0,
  J1 = typeof clearTimeout == 'function' ? clearTimeout : void 0,
  Jf = typeof Promise == 'function' ? Promise : void 0,
  Z1 =
    typeof queueMicrotask == 'function'
      ? queueMicrotask
      : typeof Jf < 'u'
        ? function (e) {
            return Jf.resolve(null).then(e).catch(ex)
          }
        : jl
function ex(e) {
  setTimeout(function () {
    throw e
  })
}
function Ra(e, t) {
  var n = t,
    r = 0
  do {
    var i = n.nextSibling
    if ((e.removeChild(n), i && i.nodeType === 8))
      if (((n = i.data), n === '/$')) {
        if (r === 0) {
          ;(e.removeChild(i), Ri(t))
          return
        }
        r--
      } else (n !== '$' && n !== '$?' && n !== '$!') || r++
    n = i
  } while (n)
  Ri(t)
}
function ln(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType
    if (t === 1 || t === 3) break
    if (t === 8) {
      if (((t = e.data), t === '$' || t === '$!' || t === '$?')) break
      if (t === '/$') return null
    }
  }
  return e
}
function Zf(e) {
  e = e.previousSibling
  for (var t = 0; e;) {
    if (e.nodeType === 8) {
      var n = e.data
      if (n === '$' || n === '$!' || n === '$?') {
        if (t === 0) return e
        t--
      } else n === '/$' && t++
    }
    e = e.previousSibling
  }
  return null
}
var Vr = Math.random().toString(36).slice(2),
  Et = '__reactFiber$' + Vr,
  Li = '__reactProps$' + Vr,
  It = '__reactContainer$' + Vr,
  Ol = '__reactEvents$' + Vr,
  tx = '__reactListeners$' + Vr,
  nx = '__reactHandles$' + Vr
function Ln(e) {
  var t = e[Et]
  if (t) return t
  for (var n = e.parentNode; n;) {
    if ((t = n[It] || n[Et])) {
      if (((n = t.alternate), t.child !== null || (n !== null && n.child !== null)))
        for (e = Zf(e); e !== null;) {
          if ((n = e[Et])) return n
          e = Zf(e)
        }
      return t
    }
    ;((e = n), (n = e.parentNode))
  }
  return null
}
function Qi(e) {
  return (
    (e = e[Et] || e[It]),
    !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e
  )
}
function or(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode
  throw Error(R(33))
}
function zo(e) {
  return e[Li] || null
}
var Ll = [],
  ar = -1
function xn(e) {
  return { current: e }
}
function G(e) {
  0 > ar || ((e.current = Ll[ar]), (Ll[ar] = null), ar--)
}
function K(e, t) {
  ;(ar++, (Ll[ar] = e.current), (e.current = t))
}
var mn = {},
  je = xn(mn),
  Fe = xn(!1),
  Un = mn
function kr(e, t) {
  var n = e.type.contextTypes
  if (!n) return mn
  var r = e.stateNode
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t)
    return r.__reactInternalMemoizedMaskedChildContext
  var i = {},
    s
  for (s in n) i[s] = t[s]
  return (
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = t),
      (e.__reactInternalMemoizedMaskedChildContext = i)),
    i
  )
}
function Ve(e) {
  return ((e = e.childContextTypes), e != null)
}
function oo() {
  ;(G(Fe), G(je))
}
function ed(e, t, n) {
  if (je.current !== mn) throw Error(R(168))
  ;(K(je, t), K(Fe, n))
}
function Lm(e, t, n) {
  var r = e.stateNode
  if (((t = t.childContextTypes), typeof r.getChildContext != 'function')) return n
  r = r.getChildContext()
  for (var i in r) if (!(i in t)) throw Error(R(108, Bv(e) || 'Unknown', i))
  return te({}, n, r)
}
function ao(e) {
  return (
    (e = ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || mn),
    (Un = je.current),
    K(je, e),
    K(Fe, Fe.current),
    !0
  )
}
function td(e, t, n) {
  var r = e.stateNode
  if (!r) throw Error(R(169))
  ;(n
    ? ((e = Lm(e, t, Un)),
      (r.__reactInternalMemoizedMergedChildContext = e),
      G(Fe),
      G(je),
      K(je, e))
    : G(Fe),
    K(Fe, n))
}
var Ot = null,
  Uo = !1,
  Aa = !1
function Nm(e) {
  Ot === null ? (Ot = [e]) : Ot.push(e)
}
function rx(e) {
  ;((Uo = !0), Nm(e))
}
function wn() {
  if (!Aa && Ot !== null) {
    Aa = !0
    var e = 0,
      t = $
    try {
      var n = Ot
      for ($ = 1; e < n.length; e++) {
        var r = n[e]
        do r = r(!0)
        while (r !== null)
      }
      ;((Ot = null), (Uo = !1))
    } catch (i) {
      throw (Ot !== null && (Ot = Ot.slice(e + 1)), im(Vu, wn), i)
    } finally {
      ;(($ = t), (Aa = !1))
    }
  }
  return null
}
var lr = [],
  ur = 0,
  lo = null,
  uo = 0,
  tt = [],
  nt = 0,
  $n = null,
  Lt = 1,
  Nt = ''
function An(e, t) {
  ;((lr[ur++] = uo), (lr[ur++] = lo), (lo = e), (uo = t))
}
function Dm(e, t, n) {
  ;((tt[nt++] = Lt), (tt[nt++] = Nt), (tt[nt++] = $n), ($n = e))
  var r = Lt
  e = Nt
  var i = 32 - ht(r) - 1
  ;((r &= ~(1 << i)), (n += 1))
  var s = 32 - ht(t) + i
  if (30 < s) {
    var o = i - (i % 5)
    ;((s = (r & ((1 << o) - 1)).toString(32)),
      (r >>= o),
      (i -= o),
      (Lt = (1 << (32 - ht(t) + i)) | (n << i) | r),
      (Nt = s + e))
  } else ((Lt = (1 << s) | (n << i) | r), (Nt = e))
}
function qu(e) {
  e.return !== null && (An(e, 1), Dm(e, 1, 0))
}
function Gu(e) {
  for (; e === lo;) ((lo = lr[--ur]), (lr[ur] = null), (uo = lr[--ur]), (lr[ur] = null))
  for (; e === $n;)
    (($n = tt[--nt]),
      (tt[nt] = null),
      (Nt = tt[--nt]),
      (tt[nt] = null),
      (Lt = tt[--nt]),
      (tt[nt] = null))
}
var Ke = null,
  He = null,
  Q = !1,
  dt = null
function Mm(e, t) {
  var n = rt(5, null, null, 0)
  ;((n.elementType = 'DELETED'),
    (n.stateNode = t),
    (n.return = e),
    (t = e.deletions),
    t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n))
}
function nd(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type
      return (
        (t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t),
        t !== null ? ((e.stateNode = t), (Ke = e), (He = ln(t.firstChild)), !0) : !1
      )
    case 6:
      return (
        (t = e.pendingProps === '' || t.nodeType !== 3 ? null : t),
        t !== null ? ((e.stateNode = t), (Ke = e), (He = null), !0) : !1
      )
    case 13:
      return (
        (t = t.nodeType !== 8 ? null : t),
        t !== null
          ? ((n = $n !== null ? { id: Lt, overflow: Nt } : null),
            (e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }),
            (n = rt(18, null, null, 0)),
            (n.stateNode = t),
            (n.return = e),
            (e.child = n),
            (Ke = e),
            (He = null),
            !0)
          : !1
      )
    default:
      return !1
  }
}
function Nl(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0
}
function Dl(e) {
  if (Q) {
    var t = He
    if (t) {
      var n = t
      if (!nd(e, t)) {
        if (Nl(e)) throw Error(R(418))
        t = ln(n.nextSibling)
        var r = Ke
        t && nd(e, t) ? Mm(r, n) : ((e.flags = (e.flags & -4097) | 2), (Q = !1), (Ke = e))
      }
    } else {
      if (Nl(e)) throw Error(R(418))
      ;((e.flags = (e.flags & -4097) | 2), (Q = !1), (Ke = e))
    }
  }
}
function rd(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13;) e = e.return
  Ke = e
}
function xs(e) {
  if (e !== Ke) return !1
  if (!Q) return (rd(e), (Q = !0), !1)
  var t
  if (
    ((t = e.tag !== 3) &&
      !(t = e.tag !== 5) &&
      ((t = e.type), (t = t !== 'head' && t !== 'body' && !_l(e.type, e.memoizedProps))),
    t && (t = He))
  ) {
    if (Nl(e)) throw (bm(), Error(R(418)))
    for (; t;) (Mm(e, t), (t = ln(t.nextSibling)))
  }
  if ((rd(e), e.tag === 13)) {
    if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e)) throw Error(R(317))
    e: {
      for (e = e.nextSibling, t = 0; e;) {
        if (e.nodeType === 8) {
          var n = e.data
          if (n === '/$') {
            if (t === 0) {
              He = ln(e.nextSibling)
              break e
            }
            t--
          } else (n !== '$' && n !== '$!' && n !== '$?') || t++
        }
        e = e.nextSibling
      }
      He = null
    }
  } else He = Ke ? ln(e.stateNode.nextSibling) : null
  return !0
}
function bm() {
  for (var e = He; e;) e = ln(e.nextSibling)
}
function Tr() {
  ;((He = Ke = null), (Q = !1))
}
function Xu(e) {
  dt === null ? (dt = [e]) : dt.push(e)
}
var ix = Wt.ReactCurrentBatchConfig
function Yr(e, t, n) {
  if (((e = n.ref), e !== null && typeof e != 'function' && typeof e != 'object')) {
    if (n._owner) {
      if (((n = n._owner), n)) {
        if (n.tag !== 1) throw Error(R(309))
        var r = n.stateNode
      }
      if (!r) throw Error(R(147, e))
      var i = r,
        s = '' + e
      return t !== null && t.ref !== null && typeof t.ref == 'function' && t.ref._stringRef === s
        ? t.ref
        : ((t = function (o) {
            var a = i.refs
            o === null ? delete a[s] : (a[s] = o)
          }),
          (t._stringRef = s),
          t)
    }
    if (typeof e != 'string') throw Error(R(284))
    if (!n._owner) throw Error(R(290, e))
  }
  return e
}
function ws(e, t) {
  throw (
    (e = Object.prototype.toString.call(t)),
    Error(
      R(31, e === '[object Object]' ? 'object with keys {' + Object.keys(t).join(', ') + '}' : e),
    )
  )
}
function id(e) {
  var t = e._init
  return t(e._payload)
}
function Fm(e) {
  function t(h, p) {
    if (e) {
      var m = h.deletions
      m === null ? ((h.deletions = [p]), (h.flags |= 16)) : m.push(p)
    }
  }
  function n(h, p) {
    if (!e) return null
    for (; p !== null;) (t(h, p), (p = p.sibling))
    return null
  }
  function r(h, p) {
    for (h = new Map(); p !== null;)
      (p.key !== null ? h.set(p.key, p) : h.set(p.index, p), (p = p.sibling))
    return h
  }
  function i(h, p) {
    return ((h = dn(h, p)), (h.index = 0), (h.sibling = null), h)
  }
  function s(h, p, m) {
    return (
      (h.index = m),
      e
        ? ((m = h.alternate),
          m !== null ? ((m = m.index), m < p ? ((h.flags |= 2), p) : m) : ((h.flags |= 2), p))
        : ((h.flags |= 1048576), p)
    )
  }
  function o(h) {
    return (e && h.alternate === null && (h.flags |= 2), h)
  }
  function a(h, p, m, P) {
    return p === null || p.tag !== 6
      ? ((p = Ma(m, h.mode, P)), (p.return = h), p)
      : ((p = i(p, m)), (p.return = h), p)
  }
  function l(h, p, m, P) {
    var C = m.type
    return C === nr
      ? c(h, p, m.props.children, P, m.key)
      : p !== null &&
          (p.elementType === C ||
            (typeof C == 'object' && C !== null && C.$$typeof === Qt && id(C) === p.type))
        ? ((P = i(p, m.props)), (P.ref = Yr(h, p, m)), (P.return = h), P)
        : ((P = $s(m.type, m.key, m.props, null, h.mode, P)),
          (P.ref = Yr(h, p, m)),
          (P.return = h),
          P)
  }
  function u(h, p, m, P) {
    return p === null ||
      p.tag !== 4 ||
      p.stateNode.containerInfo !== m.containerInfo ||
      p.stateNode.implementation !== m.implementation
      ? ((p = ba(m, h.mode, P)), (p.return = h), p)
      : ((p = i(p, m.children || [])), (p.return = h), p)
  }
  function c(h, p, m, P, C) {
    return p === null || p.tag !== 7
      ? ((p = Vn(m, h.mode, P, C)), (p.return = h), p)
      : ((p = i(p, m)), (p.return = h), p)
  }
  function f(h, p, m) {
    if ((typeof p == 'string' && p !== '') || typeof p == 'number')
      return ((p = Ma('' + p, h.mode, m)), (p.return = h), p)
    if (typeof p == 'object' && p !== null) {
      switch (p.$$typeof) {
        case us:
          return (
            (m = $s(p.type, p.key, p.props, null, h.mode, m)),
            (m.ref = Yr(h, null, p)),
            (m.return = h),
            m
          )
        case tr:
          return ((p = ba(p, h.mode, m)), (p.return = h), p)
        case Qt:
          var P = p._init
          return f(h, P(p._payload), m)
      }
      if (ri(p) || Kr(p)) return ((p = Vn(p, h.mode, m, null)), (p.return = h), p)
      ws(h, p)
    }
    return null
  }
  function d(h, p, m, P) {
    var C = p !== null ? p.key : null
    if ((typeof m == 'string' && m !== '') || typeof m == 'number')
      return C !== null ? null : a(h, p, '' + m, P)
    if (typeof m == 'object' && m !== null) {
      switch (m.$$typeof) {
        case us:
          return m.key === C ? l(h, p, m, P) : null
        case tr:
          return m.key === C ? u(h, p, m, P) : null
        case Qt:
          return ((C = m._init), d(h, p, C(m._payload), P))
      }
      if (ri(m) || Kr(m)) return C !== null ? null : c(h, p, m, P, null)
      ws(h, m)
    }
    return null
  }
  function g(h, p, m, P, C) {
    if ((typeof P == 'string' && P !== '') || typeof P == 'number')
      return ((h = h.get(m) || null), a(p, h, '' + P, C))
    if (typeof P == 'object' && P !== null) {
      switch (P.$$typeof) {
        case us:
          return ((h = h.get(P.key === null ? m : P.key) || null), l(p, h, P, C))
        case tr:
          return ((h = h.get(P.key === null ? m : P.key) || null), u(p, h, P, C))
        case Qt:
          var k = P._init
          return g(h, p, m, k(P._payload), C)
      }
      if (ri(P) || Kr(P)) return ((h = h.get(m) || null), c(p, h, P, C, null))
      ws(p, P)
    }
    return null
  }
  function v(h, p, m, P) {
    for (var C = null, k = null, A = p, T = (p = 0), b = null; A !== null && T < m.length; T++) {
      A.index > T ? ((b = A), (A = null)) : (b = A.sibling)
      var L = d(h, A, m[T], P)
      if (L === null) {
        A === null && (A = b)
        break
      }
      ;(e && A && L.alternate === null && t(h, A),
        (p = s(L, p, T)),
        k === null ? (C = L) : (k.sibling = L),
        (k = L),
        (A = b))
    }
    if (T === m.length) return (n(h, A), Q && An(h, T), C)
    if (A === null) {
      for (; T < m.length; T++)
        ((A = f(h, m[T], P)),
          A !== null && ((p = s(A, p, T)), k === null ? (C = A) : (k.sibling = A), (k = A)))
      return (Q && An(h, T), C)
    }
    for (A = r(h, A); T < m.length; T++)
      ((b = g(A, h, T, m[T], P)),
        b !== null &&
          (e && b.alternate !== null && A.delete(b.key === null ? T : b.key),
          (p = s(b, p, T)),
          k === null ? (C = b) : (k.sibling = b),
          (k = b)))
    return (
      e &&
        A.forEach(function (W) {
          return t(h, W)
        }),
      Q && An(h, T),
      C
    )
  }
  function x(h, p, m, P) {
    var C = Kr(m)
    if (typeof C != 'function') throw Error(R(150))
    if (((m = C.call(m)), m == null)) throw Error(R(151))
    for (
      var k = (C = null), A = p, T = (p = 0), b = null, L = m.next();
      A !== null && !L.done;
      T++, L = m.next()
    ) {
      A.index > T ? ((b = A), (A = null)) : (b = A.sibling)
      var W = d(h, A, L.value, P)
      if (W === null) {
        A === null && (A = b)
        break
      }
      ;(e && A && W.alternate === null && t(h, A),
        (p = s(W, p, T)),
        k === null ? (C = W) : (k.sibling = W),
        (k = W),
        (A = b))
    }
    if (L.done) return (n(h, A), Q && An(h, T), C)
    if (A === null) {
      for (; !L.done; T++, L = m.next())
        ((L = f(h, L.value, P)),
          L !== null && ((p = s(L, p, T)), k === null ? (C = L) : (k.sibling = L), (k = L)))
      return (Q && An(h, T), C)
    }
    for (A = r(h, A); !L.done; T++, L = m.next())
      ((L = g(A, h, T, L.value, P)),
        L !== null &&
          (e && L.alternate !== null && A.delete(L.key === null ? T : L.key),
          (p = s(L, p, T)),
          k === null ? (C = L) : (k.sibling = L),
          (k = L)))
    return (
      e &&
        A.forEach(function (ze) {
          return t(h, ze)
        }),
      Q && An(h, T),
      C
    )
  }
  function S(h, p, m, P) {
    if (
      (typeof m == 'object' &&
        m !== null &&
        m.type === nr &&
        m.key === null &&
        (m = m.props.children),
      typeof m == 'object' && m !== null)
    ) {
      switch (m.$$typeof) {
        case us:
          e: {
            for (var C = m.key, k = p; k !== null;) {
              if (k.key === C) {
                if (((C = m.type), C === nr)) {
                  if (k.tag === 7) {
                    ;(n(h, k.sibling), (p = i(k, m.props.children)), (p.return = h), (h = p))
                    break e
                  }
                } else if (
                  k.elementType === C ||
                  (typeof C == 'object' && C !== null && C.$$typeof === Qt && id(C) === k.type)
                ) {
                  ;(n(h, k.sibling),
                    (p = i(k, m.props)),
                    (p.ref = Yr(h, k, m)),
                    (p.return = h),
                    (h = p))
                  break e
                }
                n(h, k)
                break
              } else t(h, k)
              k = k.sibling
            }
            m.type === nr
              ? ((p = Vn(m.props.children, h.mode, P, m.key)), (p.return = h), (h = p))
              : ((P = $s(m.type, m.key, m.props, null, h.mode, P)),
                (P.ref = Yr(h, p, m)),
                (P.return = h),
                (h = P))
          }
          return o(h)
        case tr:
          e: {
            for (k = m.key; p !== null;) {
              if (p.key === k)
                if (
                  p.tag === 4 &&
                  p.stateNode.containerInfo === m.containerInfo &&
                  p.stateNode.implementation === m.implementation
                ) {
                  ;(n(h, p.sibling), (p = i(p, m.children || [])), (p.return = h), (h = p))
                  break e
                } else {
                  n(h, p)
                  break
                }
              else t(h, p)
              p = p.sibling
            }
            ;((p = ba(m, h.mode, P)), (p.return = h), (h = p))
          }
          return o(h)
        case Qt:
          return ((k = m._init), S(h, p, k(m._payload), P))
      }
      if (ri(m)) return v(h, p, m, P)
      if (Kr(m)) return x(h, p, m, P)
      ws(h, m)
    }
    return (typeof m == 'string' && m !== '') || typeof m == 'number'
      ? ((m = '' + m),
        p !== null && p.tag === 6
          ? (n(h, p.sibling), (p = i(p, m)), (p.return = h), (h = p))
          : (n(h, p), (p = Ma(m, h.mode, P)), (p.return = h), (h = p)),
        o(h))
      : n(h, p)
  }
  return S
}
var Rr = Fm(!0),
  Vm = Fm(!1),
  co = xn(null),
  fo = null,
  cr = null,
  Qu = null
function Yu() {
  Qu = cr = fo = null
}
function Ju(e) {
  var t = co.current
  ;(G(co), (e._currentValue = t))
}
function Ml(e, t, n) {
  for (; e !== null;) {
    var r = e.alternate
    if (
      ((e.childLanes & t) !== t
        ? ((e.childLanes |= t), r !== null && (r.childLanes |= t))
        : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t),
      e === n)
    )
      break
    e = e.return
  }
}
function Er(e, t) {
  ;((fo = e),
    (Qu = cr = null),
    (e = e.dependencies),
    e !== null && e.firstContext !== null && (e.lanes & t && (be = !0), (e.firstContext = null)))
}
function st(e) {
  var t = e._currentValue
  if (Qu !== e)
    if (((e = { context: e, memoizedValue: t, next: null }), cr === null)) {
      if (fo === null) throw Error(R(308))
      ;((cr = e), (fo.dependencies = { lanes: 0, firstContext: e }))
    } else cr = cr.next = e
  return t
}
var Nn = null
function Zu(e) {
  Nn === null ? (Nn = [e]) : Nn.push(e)
}
function Im(e, t, n, r) {
  var i = t.interleaved
  return (
    i === null ? ((n.next = n), Zu(t)) : ((n.next = i.next), (i.next = n)),
    (t.interleaved = n),
    Bt(e, r)
  )
}
function Bt(e, t) {
  e.lanes |= t
  var n = e.alternate
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null;)
    ((e.childLanes |= t),
      (n = e.alternate),
      n !== null && (n.childLanes |= t),
      (n = e),
      (e = e.return))
  return n.tag === 3 ? n.stateNode : null
}
var Yt = !1
function ec(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, interleaved: null, lanes: 0 },
    effects: null,
  }
}
function Bm(e, t) {
  ;((e = e.updateQueue),
    t.updateQueue === e &&
      (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        effects: e.effects,
      }))
}
function Mt(e, t) {
  return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null }
}
function un(e, t, n) {
  var r = e.updateQueue
  if (r === null) return null
  if (((r = r.shared), z & 2)) {
    var i = r.pending
    return (
      i === null ? (t.next = t) : ((t.next = i.next), (i.next = t)),
      (r.pending = t),
      Bt(e, n)
    )
  }
  return (
    (i = r.interleaved),
    i === null ? ((t.next = t), Zu(r)) : ((t.next = i.next), (i.next = t)),
    (r.interleaved = t),
    Bt(e, n)
  )
}
function Fs(e, t, n) {
  if (((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194240) !== 0))) {
    var r = t.lanes
    ;((r &= e.pendingLanes), (n |= r), (t.lanes = n), Iu(e, n))
  }
}
function sd(e, t) {
  var n = e.updateQueue,
    r = e.alternate
  if (r !== null && ((r = r.updateQueue), n === r)) {
    var i = null,
      s = null
    if (((n = n.firstBaseUpdate), n !== null)) {
      do {
        var o = {
          eventTime: n.eventTime,
          lane: n.lane,
          tag: n.tag,
          payload: n.payload,
          callback: n.callback,
          next: null,
        }
        ;(s === null ? (i = s = o) : (s = s.next = o), (n = n.next))
      } while (n !== null)
      s === null ? (i = s = t) : (s = s.next = t)
    } else i = s = t
    ;((n = {
      baseState: r.baseState,
      firstBaseUpdate: i,
      lastBaseUpdate: s,
      shared: r.shared,
      effects: r.effects,
    }),
      (e.updateQueue = n))
    return
  }
  ;((e = n.lastBaseUpdate),
    e === null ? (n.firstBaseUpdate = t) : (e.next = t),
    (n.lastBaseUpdate = t))
}
function ho(e, t, n, r) {
  var i = e.updateQueue
  Yt = !1
  var s = i.firstBaseUpdate,
    o = i.lastBaseUpdate,
    a = i.shared.pending
  if (a !== null) {
    i.shared.pending = null
    var l = a,
      u = l.next
    ;((l.next = null), o === null ? (s = u) : (o.next = u), (o = l))
    var c = e.alternate
    c !== null &&
      ((c = c.updateQueue),
      (a = c.lastBaseUpdate),
      a !== o && (a === null ? (c.firstBaseUpdate = u) : (a.next = u), (c.lastBaseUpdate = l)))
  }
  if (s !== null) {
    var f = i.baseState
    ;((o = 0), (c = u = l = null), (a = s))
    do {
      var d = a.lane,
        g = a.eventTime
      if ((r & d) === d) {
        c !== null &&
          (c = c.next =
            {
              eventTime: g,
              lane: 0,
              tag: a.tag,
              payload: a.payload,
              callback: a.callback,
              next: null,
            })
        e: {
          var v = e,
            x = a
          switch (((d = t), (g = n), x.tag)) {
            case 1:
              if (((v = x.payload), typeof v == 'function')) {
                f = v.call(g, f, d)
                break e
              }
              f = v
              break e
            case 3:
              v.flags = (v.flags & -65537) | 128
            case 0:
              if (((v = x.payload), (d = typeof v == 'function' ? v.call(g, f, d) : v), d == null))
                break e
              f = te({}, f, d)
              break e
            case 2:
              Yt = !0
          }
        }
        a.callback !== null &&
          a.lane !== 0 &&
          ((e.flags |= 64), (d = i.effects), d === null ? (i.effects = [a]) : d.push(a))
      } else
        ((g = {
          eventTime: g,
          lane: d,
          tag: a.tag,
          payload: a.payload,
          callback: a.callback,
          next: null,
        }),
          c === null ? ((u = c = g), (l = f)) : (c = c.next = g),
          (o |= d))
      if (((a = a.next), a === null)) {
        if (((a = i.shared.pending), a === null)) break
        ;((d = a), (a = d.next), (d.next = null), (i.lastBaseUpdate = d), (i.shared.pending = null))
      }
    } while (!0)
    if (
      (c === null && (l = f),
      (i.baseState = l),
      (i.firstBaseUpdate = u),
      (i.lastBaseUpdate = c),
      (t = i.shared.interleaved),
      t !== null)
    ) {
      i = t
      do ((o |= i.lane), (i = i.next))
      while (i !== t)
    } else s === null && (i.shared.lanes = 0)
    ;((Hn |= o), (e.lanes = o), (e.memoizedState = f))
  }
}
function od(e, t, n) {
  if (((e = t.effects), (t.effects = null), e !== null))
    for (t = 0; t < e.length; t++) {
      var r = e[t],
        i = r.callback
      if (i !== null) {
        if (((r.callback = null), (r = n), typeof i != 'function')) throw Error(R(191, i))
        i.call(r)
      }
    }
}
var Yi = {},
  kt = xn(Yi),
  Ni = xn(Yi),
  Di = xn(Yi)
function Dn(e) {
  if (e === Yi) throw Error(R(174))
  return e
}
function tc(e, t) {
  switch ((K(Di, t), K(Ni, e), K(kt, Yi), (e = t.nodeType), e)) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : ml(null, '')
      break
    default:
      ;((e = e === 8 ? t.parentNode : t),
        (t = e.namespaceURI || null),
        (e = e.tagName),
        (t = ml(t, e)))
  }
  ;(G(kt), K(kt, t))
}
function Ar() {
  ;(G(kt), G(Ni), G(Di))
}
function zm(e) {
  Dn(Di.current)
  var t = Dn(kt.current),
    n = ml(t, e.type)
  t !== n && (K(Ni, e), K(kt, n))
}
function nc(e) {
  Ni.current === e && (G(kt), G(Ni))
}
var J = xn(0)
function po(e) {
  for (var t = e; t !== null;) {
    if (t.tag === 13) {
      var n = t.memoizedState
      if (n !== null && ((n = n.dehydrated), n === null || n.data === '$?' || n.data === '$!'))
        return t
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if (t.flags & 128) return t
    } else if (t.child !== null) {
      ;((t.child.return = t), (t = t.child))
      continue
    }
    if (t === e) break
    for (; t.sibling === null;) {
      if (t.return === null || t.return === e) return null
      t = t.return
    }
    ;((t.sibling.return = t.return), (t = t.sibling))
  }
  return null
}
var _a = []
function rc() {
  for (var e = 0; e < _a.length; e++) _a[e]._workInProgressVersionPrimary = null
  _a.length = 0
}
var Vs = Wt.ReactCurrentDispatcher,
  ja = Wt.ReactCurrentBatchConfig,
  Wn = 0,
  ee = null,
  ue = null,
  de = null,
  mo = !1,
  pi = !1,
  Mi = 0,
  sx = 0
function Pe() {
  throw Error(R(321))
}
function ic(e, t) {
  if (t === null) return !1
  for (var n = 0; n < t.length && n < e.length; n++) if (!mt(e[n], t[n])) return !1
  return !0
}
function sc(e, t, n, r, i, s) {
  if (
    ((Wn = s),
    (ee = t),
    (t.memoizedState = null),
    (t.updateQueue = null),
    (t.lanes = 0),
    (Vs.current = e === null || e.memoizedState === null ? ux : cx),
    (e = n(r, i)),
    pi)
  ) {
    s = 0
    do {
      if (((pi = !1), (Mi = 0), 25 <= s)) throw Error(R(301))
      ;((s += 1), (de = ue = null), (t.updateQueue = null), (Vs.current = fx), (e = n(r, i)))
    } while (pi)
  }
  if (
    ((Vs.current = go),
    (t = ue !== null && ue.next !== null),
    (Wn = 0),
    (de = ue = ee = null),
    (mo = !1),
    t)
  )
    throw Error(R(300))
  return e
}
function oc() {
  var e = Mi !== 0
  return ((Mi = 0), e)
}
function wt() {
  var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null }
  return (de === null ? (ee.memoizedState = de = e) : (de = de.next = e), de)
}
function ot() {
  if (ue === null) {
    var e = ee.alternate
    e = e !== null ? e.memoizedState : null
  } else e = ue.next
  var t = de === null ? ee.memoizedState : de.next
  if (t !== null) ((de = t), (ue = e))
  else {
    if (e === null) throw Error(R(310))
    ;((ue = e),
      (e = {
        memoizedState: ue.memoizedState,
        baseState: ue.baseState,
        baseQueue: ue.baseQueue,
        queue: ue.queue,
        next: null,
      }),
      de === null ? (ee.memoizedState = de = e) : (de = de.next = e))
  }
  return de
}
function bi(e, t) {
  return typeof t == 'function' ? t(e) : t
}
function Oa(e) {
  var t = ot(),
    n = t.queue
  if (n === null) throw Error(R(311))
  n.lastRenderedReducer = e
  var r = ue,
    i = r.baseQueue,
    s = n.pending
  if (s !== null) {
    if (i !== null) {
      var o = i.next
      ;((i.next = s.next), (s.next = o))
    }
    ;((r.baseQueue = i = s), (n.pending = null))
  }
  if (i !== null) {
    ;((s = i.next), (r = r.baseState))
    var a = (o = null),
      l = null,
      u = s
    do {
      var c = u.lane
      if ((Wn & c) === c)
        (l !== null &&
          (l = l.next =
            {
              lane: 0,
              action: u.action,
              hasEagerState: u.hasEagerState,
              eagerState: u.eagerState,
              next: null,
            }),
          (r = u.hasEagerState ? u.eagerState : e(r, u.action)))
      else {
        var f = {
          lane: c,
          action: u.action,
          hasEagerState: u.hasEagerState,
          eagerState: u.eagerState,
          next: null,
        }
        ;(l === null ? ((a = l = f), (o = r)) : (l = l.next = f), (ee.lanes |= c), (Hn |= c))
      }
      u = u.next
    } while (u !== null && u !== s)
    ;(l === null ? (o = r) : (l.next = a),
      mt(r, t.memoizedState) || (be = !0),
      (t.memoizedState = r),
      (t.baseState = o),
      (t.baseQueue = l),
      (n.lastRenderedState = r))
  }
  if (((e = n.interleaved), e !== null)) {
    i = e
    do ((s = i.lane), (ee.lanes |= s), (Hn |= s), (i = i.next))
    while (i !== e)
  } else i === null && (n.lanes = 0)
  return [t.memoizedState, n.dispatch]
}
function La(e) {
  var t = ot(),
    n = t.queue
  if (n === null) throw Error(R(311))
  n.lastRenderedReducer = e
  var r = n.dispatch,
    i = n.pending,
    s = t.memoizedState
  if (i !== null) {
    n.pending = null
    var o = (i = i.next)
    do ((s = e(s, o.action)), (o = o.next))
    while (o !== i)
    ;(mt(s, t.memoizedState) || (be = !0),
      (t.memoizedState = s),
      t.baseQueue === null && (t.baseState = s),
      (n.lastRenderedState = s))
  }
  return [s, r]
}
function Um() {}
function $m(e, t) {
  var n = ee,
    r = ot(),
    i = t(),
    s = !mt(r.memoizedState, i)
  if (
    (s && ((r.memoizedState = i), (be = !0)),
    (r = r.queue),
    ac(Km.bind(null, n, r, e), [e]),
    r.getSnapshot !== t || s || (de !== null && de.memoizedState.tag & 1))
  ) {
    if (((n.flags |= 2048), Fi(9, Hm.bind(null, n, r, i, t), void 0, null), he === null))
      throw Error(R(349))
    Wn & 30 || Wm(n, t, i)
  }
  return i
}
function Wm(e, t, n) {
  ;((e.flags |= 16384),
    (e = { getSnapshot: t, value: n }),
    (t = ee.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }), (ee.updateQueue = t), (t.stores = [e]))
      : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e)))
}
function Hm(e, t, n, r) {
  ;((t.value = n), (t.getSnapshot = r), qm(t) && Gm(e))
}
function Km(e, t, n) {
  return n(function () {
    qm(t) && Gm(e)
  })
}
function qm(e) {
  var t = e.getSnapshot
  e = e.value
  try {
    var n = t()
    return !mt(e, n)
  } catch {
    return !0
  }
}
function Gm(e) {
  var t = Bt(e, 1)
  t !== null && pt(t, e, 1, -1)
}
function ad(e) {
  var t = wt()
  return (
    typeof e == 'function' && (e = e()),
    (t.memoizedState = t.baseState = e),
    (e = {
      pending: null,
      interleaved: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: bi,
      lastRenderedState: e,
    }),
    (t.queue = e),
    (e = e.dispatch = lx.bind(null, ee, e)),
    [t.memoizedState, e]
  )
}
function Fi(e, t, n, r) {
  return (
    (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
    (t = ee.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (ee.updateQueue = t),
        (t.lastEffect = e.next = e))
      : ((n = t.lastEffect),
        n === null
          ? (t.lastEffect = e.next = e)
          : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e))),
    e
  )
}
function Xm() {
  return ot().memoizedState
}
function Is(e, t, n, r) {
  var i = wt()
  ;((ee.flags |= e), (i.memoizedState = Fi(1 | t, n, void 0, r === void 0 ? null : r)))
}
function $o(e, t, n, r) {
  var i = ot()
  r = r === void 0 ? null : r
  var s = void 0
  if (ue !== null) {
    var o = ue.memoizedState
    if (((s = o.destroy), r !== null && ic(r, o.deps))) {
      i.memoizedState = Fi(t, n, s, r)
      return
    }
  }
  ;((ee.flags |= e), (i.memoizedState = Fi(1 | t, n, s, r)))
}
function ld(e, t) {
  return Is(8390656, 8, e, t)
}
function ac(e, t) {
  return $o(2048, 8, e, t)
}
function Qm(e, t) {
  return $o(4, 2, e, t)
}
function Ym(e, t) {
  return $o(4, 4, e, t)
}
function Jm(e, t) {
  if (typeof t == 'function')
    return (
      (e = e()),
      t(e),
      function () {
        t(null)
      }
    )
  if (t != null)
    return (
      (e = e()),
      (t.current = e),
      function () {
        t.current = null
      }
    )
}
function Zm(e, t, n) {
  return ((n = n != null ? n.concat([e]) : null), $o(4, 4, Jm.bind(null, t, e), n))
}
function lc() {}
function eg(e, t) {
  var n = ot()
  t = t === void 0 ? null : t
  var r = n.memoizedState
  return r !== null && t !== null && ic(t, r[1]) ? r[0] : ((n.memoizedState = [e, t]), e)
}
function tg(e, t) {
  var n = ot()
  t = t === void 0 ? null : t
  var r = n.memoizedState
  return r !== null && t !== null && ic(t, r[1]) ? r[0] : ((e = e()), (n.memoizedState = [e, t]), e)
}
function ng(e, t, n) {
  return Wn & 21
    ? (mt(n, t) || ((n = am()), (ee.lanes |= n), (Hn |= n), (e.baseState = !0)), t)
    : (e.baseState && ((e.baseState = !1), (be = !0)), (e.memoizedState = n))
}
function ox(e, t) {
  var n = $
  ;(($ = n !== 0 && 4 > n ? n : 4), e(!0))
  var r = ja.transition
  ja.transition = {}
  try {
    ;(e(!1), t())
  } finally {
    ;(($ = n), (ja.transition = r))
  }
}
function rg() {
  return ot().memoizedState
}
function ax(e, t, n) {
  var r = fn(e)
  if (((n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }), ig(e)))
    sg(t, n)
  else if (((n = Im(e, t, n, r)), n !== null)) {
    var i = Le()
    ;(pt(n, e, r, i), og(n, t, r))
  }
}
function lx(e, t, n) {
  var r = fn(e),
    i = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }
  if (ig(e)) sg(t, i)
  else {
    var s = e.alternate
    if (e.lanes === 0 && (s === null || s.lanes === 0) && ((s = t.lastRenderedReducer), s !== null))
      try {
        var o = t.lastRenderedState,
          a = s(o, n)
        if (((i.hasEagerState = !0), (i.eagerState = a), mt(a, o))) {
          var l = t.interleaved
          ;(l === null ? ((i.next = i), Zu(t)) : ((i.next = l.next), (l.next = i)),
            (t.interleaved = i))
          return
        }
      } catch {
      } finally {
      }
    ;((n = Im(e, t, i, r)), n !== null && ((i = Le()), pt(n, e, r, i), og(n, t, r)))
  }
}
function ig(e) {
  var t = e.alternate
  return e === ee || (t !== null && t === ee)
}
function sg(e, t) {
  pi = mo = !0
  var n = e.pending
  ;(n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)), (e.pending = t))
}
function og(e, t, n) {
  if (n & 4194240) {
    var r = t.lanes
    ;((r &= e.pendingLanes), (n |= r), (t.lanes = n), Iu(e, n))
  }
}
var go = {
    readContext: st,
    useCallback: Pe,
    useContext: Pe,
    useEffect: Pe,
    useImperativeHandle: Pe,
    useInsertionEffect: Pe,
    useLayoutEffect: Pe,
    useMemo: Pe,
    useReducer: Pe,
    useRef: Pe,
    useState: Pe,
    useDebugValue: Pe,
    useDeferredValue: Pe,
    useTransition: Pe,
    useMutableSource: Pe,
    useSyncExternalStore: Pe,
    useId: Pe,
    unstable_isNewReconciler: !1,
  },
  ux = {
    readContext: st,
    useCallback: function (e, t) {
      return ((wt().memoizedState = [e, t === void 0 ? null : t]), e)
    },
    useContext: st,
    useEffect: ld,
    useImperativeHandle: function (e, t, n) {
      return ((n = n != null ? n.concat([e]) : null), Is(4194308, 4, Jm.bind(null, t, e), n))
    },
    useLayoutEffect: function (e, t) {
      return Is(4194308, 4, e, t)
    },
    useInsertionEffect: function (e, t) {
      return Is(4, 2, e, t)
    },
    useMemo: function (e, t) {
      var n = wt()
      return ((t = t === void 0 ? null : t), (e = e()), (n.memoizedState = [e, t]), e)
    },
    useReducer: function (e, t, n) {
      var r = wt()
      return (
        (t = n !== void 0 ? n(t) : t),
        (r.memoizedState = r.baseState = t),
        (e = {
          pending: null,
          interleaved: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: t,
        }),
        (r.queue = e),
        (e = e.dispatch = ax.bind(null, ee, e)),
        [r.memoizedState, e]
      )
    },
    useRef: function (e) {
      var t = wt()
      return ((e = { current: e }), (t.memoizedState = e))
    },
    useState: ad,
    useDebugValue: lc,
    useDeferredValue: function (e) {
      return (wt().memoizedState = e)
    },
    useTransition: function () {
      var e = ad(!1),
        t = e[0]
      return ((e = ox.bind(null, e[1])), (wt().memoizedState = e), [t, e])
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (e, t, n) {
      var r = ee,
        i = wt()
      if (Q) {
        if (n === void 0) throw Error(R(407))
        n = n()
      } else {
        if (((n = t()), he === null)) throw Error(R(349))
        Wn & 30 || Wm(r, t, n)
      }
      i.memoizedState = n
      var s = { value: n, getSnapshot: t }
      return (
        (i.queue = s),
        ld(Km.bind(null, r, s, e), [e]),
        (r.flags |= 2048),
        Fi(9, Hm.bind(null, r, s, n, t), void 0, null),
        n
      )
    },
    useId: function () {
      var e = wt(),
        t = he.identifierPrefix
      if (Q) {
        var n = Nt,
          r = Lt
        ;((n = (r & ~(1 << (32 - ht(r) - 1))).toString(32) + n),
          (t = ':' + t + 'R' + n),
          (n = Mi++),
          0 < n && (t += 'H' + n.toString(32)),
          (t += ':'))
      } else ((n = sx++), (t = ':' + t + 'r' + n.toString(32) + ':'))
      return (e.memoizedState = t)
    },
    unstable_isNewReconciler: !1,
  },
  cx = {
    readContext: st,
    useCallback: eg,
    useContext: st,
    useEffect: ac,
    useImperativeHandle: Zm,
    useInsertionEffect: Qm,
    useLayoutEffect: Ym,
    useMemo: tg,
    useReducer: Oa,
    useRef: Xm,
    useState: function () {
      return Oa(bi)
    },
    useDebugValue: lc,
    useDeferredValue: function (e) {
      var t = ot()
      return ng(t, ue.memoizedState, e)
    },
    useTransition: function () {
      var e = Oa(bi)[0],
        t = ot().memoizedState
      return [e, t]
    },
    useMutableSource: Um,
    useSyncExternalStore: $m,
    useId: rg,
    unstable_isNewReconciler: !1,
  },
  fx = {
    readContext: st,
    useCallback: eg,
    useContext: st,
    useEffect: ac,
    useImperativeHandle: Zm,
    useInsertionEffect: Qm,
    useLayoutEffect: Ym,
    useMemo: tg,
    useReducer: La,
    useRef: Xm,
    useState: function () {
      return La(bi)
    },
    useDebugValue: lc,
    useDeferredValue: function (e) {
      var t = ot()
      return ue === null ? (t.memoizedState = e) : ng(t, ue.memoizedState, e)
    },
    useTransition: function () {
      var e = La(bi)[0],
        t = ot().memoizedState
      return [e, t]
    },
    useMutableSource: Um,
    useSyncExternalStore: $m,
    useId: rg,
    unstable_isNewReconciler: !1,
  }
function ct(e, t) {
  if (e && e.defaultProps) {
    ;((t = te({}, t)), (e = e.defaultProps))
    for (var n in e) t[n] === void 0 && (t[n] = e[n])
    return t
  }
  return t
}
function bl(e, t, n, r) {
  ;((t = e.memoizedState),
    (n = n(r, t)),
    (n = n == null ? t : te({}, t, n)),
    (e.memoizedState = n),
    e.lanes === 0 && (e.updateQueue.baseState = n))
}
var Wo = {
  isMounted: function (e) {
    return (e = e._reactInternals) ? Qn(e) === e : !1
  },
  enqueueSetState: function (e, t, n) {
    e = e._reactInternals
    var r = Le(),
      i = fn(e),
      s = Mt(r, i)
    ;((s.payload = t),
      n != null && (s.callback = n),
      (t = un(e, s, i)),
      t !== null && (pt(t, e, i, r), Fs(t, e, i)))
  },
  enqueueReplaceState: function (e, t, n) {
    e = e._reactInternals
    var r = Le(),
      i = fn(e),
      s = Mt(r, i)
    ;((s.tag = 1),
      (s.payload = t),
      n != null && (s.callback = n),
      (t = un(e, s, i)),
      t !== null && (pt(t, e, i, r), Fs(t, e, i)))
  },
  enqueueForceUpdate: function (e, t) {
    e = e._reactInternals
    var n = Le(),
      r = fn(e),
      i = Mt(n, r)
    ;((i.tag = 2),
      t != null && (i.callback = t),
      (t = un(e, i, r)),
      t !== null && (pt(t, e, r, n), Fs(t, e, r)))
  },
}
function ud(e, t, n, r, i, s, o) {
  return (
    (e = e.stateNode),
    typeof e.shouldComponentUpdate == 'function'
      ? e.shouldComponentUpdate(r, s, o)
      : t.prototype && t.prototype.isPureReactComponent
        ? !_i(n, r) || !_i(i, s)
        : !0
  )
}
function ag(e, t, n) {
  var r = !1,
    i = mn,
    s = t.contextType
  return (
    typeof s == 'object' && s !== null
      ? (s = st(s))
      : ((i = Ve(t) ? Un : je.current),
        (r = t.contextTypes),
        (s = (r = r != null) ? kr(e, i) : mn)),
    (t = new t(n, s)),
    (e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null),
    (t.updater = Wo),
    (e.stateNode = t),
    (t._reactInternals = e),
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = i),
      (e.__reactInternalMemoizedMaskedChildContext = s)),
    t
  )
}
function cd(e, t, n, r) {
  ;((e = t.state),
    typeof t.componentWillReceiveProps == 'function' && t.componentWillReceiveProps(n, r),
    typeof t.UNSAFE_componentWillReceiveProps == 'function' &&
      t.UNSAFE_componentWillReceiveProps(n, r),
    t.state !== e && Wo.enqueueReplaceState(t, t.state, null))
}
function Fl(e, t, n, r) {
  var i = e.stateNode
  ;((i.props = n), (i.state = e.memoizedState), (i.refs = {}), ec(e))
  var s = t.contextType
  ;(typeof s == 'object' && s !== null
    ? (i.context = st(s))
    : ((s = Ve(t) ? Un : je.current), (i.context = kr(e, s))),
    (i.state = e.memoizedState),
    (s = t.getDerivedStateFromProps),
    typeof s == 'function' && (bl(e, t, s, n), (i.state = e.memoizedState)),
    typeof t.getDerivedStateFromProps == 'function' ||
      typeof i.getSnapshotBeforeUpdate == 'function' ||
      (typeof i.UNSAFE_componentWillMount != 'function' &&
        typeof i.componentWillMount != 'function') ||
      ((t = i.state),
      typeof i.componentWillMount == 'function' && i.componentWillMount(),
      typeof i.UNSAFE_componentWillMount == 'function' && i.UNSAFE_componentWillMount(),
      t !== i.state && Wo.enqueueReplaceState(i, i.state, null),
      ho(e, n, i, r),
      (i.state = e.memoizedState)),
    typeof i.componentDidMount == 'function' && (e.flags |= 4194308))
}
function _r(e, t) {
  try {
    var n = '',
      r = t
    do ((n += Iv(r)), (r = r.return))
    while (r)
    var i = n
  } catch (s) {
    i =
      `
Error generating stack: ` +
      s.message +
      `
` +
      s.stack
  }
  return { value: e, source: t, stack: i, digest: null }
}
function Na(e, t, n) {
  return { value: e, source: null, stack: n ?? null, digest: t ?? null }
}
function Vl(e, t) {
  try {
    console.error(t.value)
  } catch (n) {
    setTimeout(function () {
      throw n
    })
  }
}
var dx = typeof WeakMap == 'function' ? WeakMap : Map
function lg(e, t, n) {
  ;((n = Mt(-1, n)), (n.tag = 3), (n.payload = { element: null }))
  var r = t.value
  return (
    (n.callback = function () {
      ;(vo || ((vo = !0), (Gl = r)), Vl(e, t))
    }),
    n
  )
}
function ug(e, t, n) {
  ;((n = Mt(-1, n)), (n.tag = 3))
  var r = e.type.getDerivedStateFromError
  if (typeof r == 'function') {
    var i = t.value
    ;((n.payload = function () {
      return r(i)
    }),
      (n.callback = function () {
        Vl(e, t)
      }))
  }
  var s = e.stateNode
  return (
    s !== null &&
      typeof s.componentDidCatch == 'function' &&
      (n.callback = function () {
        ;(Vl(e, t), typeof r != 'function' && (cn === null ? (cn = new Set([this])) : cn.add(this)))
        var o = t.stack
        this.componentDidCatch(t.value, { componentStack: o !== null ? o : '' })
      }),
    n
  )
}
function fd(e, t, n) {
  var r = e.pingCache
  if (r === null) {
    r = e.pingCache = new dx()
    var i = new Set()
    r.set(t, i)
  } else ((i = r.get(t)), i === void 0 && ((i = new Set()), r.set(t, i)))
  i.has(n) || (i.add(n), (e = Tx.bind(null, e, t, n)), t.then(e, e))
}
function dd(e) {
  do {
    var t
    if (
      ((t = e.tag === 13) && ((t = e.memoizedState), (t = t !== null ? t.dehydrated !== null : !0)),
      t)
    )
      return e
    e = e.return
  } while (e !== null)
  return null
}
function hd(e, t, n, r, i) {
  return e.mode & 1
    ? ((e.flags |= 65536), (e.lanes = i), e)
    : (e === t
        ? (e.flags |= 65536)
        : ((e.flags |= 128),
          (n.flags |= 131072),
          (n.flags &= -52805),
          n.tag === 1 &&
            (n.alternate === null ? (n.tag = 17) : ((t = Mt(-1, 1)), (t.tag = 2), un(n, t, 1))),
          (n.lanes |= 1)),
      e)
}
var hx = Wt.ReactCurrentOwner,
  be = !1
function Oe(e, t, n, r) {
  t.child = e === null ? Vm(t, null, n, r) : Rr(t, e.child, n, r)
}
function pd(e, t, n, r, i) {
  n = n.render
  var s = t.ref
  return (
    Er(t, i),
    (r = sc(e, t, n, r, s, i)),
    (n = oc()),
    e !== null && !be
      ? ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~i), zt(e, t, i))
      : (Q && n && qu(t), (t.flags |= 1), Oe(e, t, r, i), t.child)
  )
}
function md(e, t, n, r, i) {
  if (e === null) {
    var s = n.type
    return typeof s == 'function' &&
      !gc(s) &&
      s.defaultProps === void 0 &&
      n.compare === null &&
      n.defaultProps === void 0
      ? ((t.tag = 15), (t.type = s), cg(e, t, s, r, i))
      : ((e = $s(n.type, null, r, t, t.mode, i)), (e.ref = t.ref), (e.return = t), (t.child = e))
  }
  if (((s = e.child), !(e.lanes & i))) {
    var o = s.memoizedProps
    if (((n = n.compare), (n = n !== null ? n : _i), n(o, r) && e.ref === t.ref)) return zt(e, t, i)
  }
  return ((t.flags |= 1), (e = dn(s, r)), (e.ref = t.ref), (e.return = t), (t.child = e))
}
function cg(e, t, n, r, i) {
  if (e !== null) {
    var s = e.memoizedProps
    if (_i(s, r) && e.ref === t.ref)
      if (((be = !1), (t.pendingProps = r = s), (e.lanes & i) !== 0)) e.flags & 131072 && (be = !0)
      else return ((t.lanes = e.lanes), zt(e, t, i))
  }
  return Il(e, t, n, r, i)
}
function fg(e, t, n) {
  var r = t.pendingProps,
    i = r.children,
    s = e !== null ? e.memoizedState : null
  if (r.mode === 'hidden')
    if (!(t.mode & 1))
      ((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        K(dr, We),
        (We |= n))
    else {
      if (!(n & 1073741824))
        return (
          (e = s !== null ? s.baseLanes | n : n),
          (t.lanes = t.childLanes = 1073741824),
          (t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }),
          (t.updateQueue = null),
          K(dr, We),
          (We |= e),
          null
        )
      ;((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        (r = s !== null ? s.baseLanes : n),
        K(dr, We),
        (We |= r))
    }
  else
    (s !== null ? ((r = s.baseLanes | n), (t.memoizedState = null)) : (r = n), K(dr, We), (We |= r))
  return (Oe(e, t, i, n), t.child)
}
function dg(e, t) {
  var n = t.ref
  ;((e === null && n !== null) || (e !== null && e.ref !== n)) &&
    ((t.flags |= 512), (t.flags |= 2097152))
}
function Il(e, t, n, r, i) {
  var s = Ve(n) ? Un : je.current
  return (
    (s = kr(t, s)),
    Er(t, i),
    (n = sc(e, t, n, r, s, i)),
    (r = oc()),
    e !== null && !be
      ? ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~i), zt(e, t, i))
      : (Q && r && qu(t), (t.flags |= 1), Oe(e, t, n, i), t.child)
  )
}
function gd(e, t, n, r, i) {
  if (Ve(n)) {
    var s = !0
    ao(t)
  } else s = !1
  if ((Er(t, i), t.stateNode === null)) (Bs(e, t), ag(t, n, r), Fl(t, n, r, i), (r = !0))
  else if (e === null) {
    var o = t.stateNode,
      a = t.memoizedProps
    o.props = a
    var l = o.context,
      u = n.contextType
    typeof u == 'object' && u !== null
      ? (u = st(u))
      : ((u = Ve(n) ? Un : je.current), (u = kr(t, u)))
    var c = n.getDerivedStateFromProps,
      f = typeof c == 'function' || typeof o.getSnapshotBeforeUpdate == 'function'
    ;(f ||
      (typeof o.UNSAFE_componentWillReceiveProps != 'function' &&
        typeof o.componentWillReceiveProps != 'function') ||
      ((a !== r || l !== u) && cd(t, o, r, u)),
      (Yt = !1))
    var d = t.memoizedState
    ;((o.state = d),
      ho(t, r, o, i),
      (l = t.memoizedState),
      a !== r || d !== l || Fe.current || Yt
        ? (typeof c == 'function' && (bl(t, n, c, r), (l = t.memoizedState)),
          (a = Yt || ud(t, n, a, r, d, l, u))
            ? (f ||
                (typeof o.UNSAFE_componentWillMount != 'function' &&
                  typeof o.componentWillMount != 'function') ||
                (typeof o.componentWillMount == 'function' && o.componentWillMount(),
                typeof o.UNSAFE_componentWillMount == 'function' && o.UNSAFE_componentWillMount()),
              typeof o.componentDidMount == 'function' && (t.flags |= 4194308))
            : (typeof o.componentDidMount == 'function' && (t.flags |= 4194308),
              (t.memoizedProps = r),
              (t.memoizedState = l)),
          (o.props = r),
          (o.state = l),
          (o.context = u),
          (r = a))
        : (typeof o.componentDidMount == 'function' && (t.flags |= 4194308), (r = !1)))
  } else {
    ;((o = t.stateNode),
      Bm(e, t),
      (a = t.memoizedProps),
      (u = t.type === t.elementType ? a : ct(t.type, a)),
      (o.props = u),
      (f = t.pendingProps),
      (d = o.context),
      (l = n.contextType),
      typeof l == 'object' && l !== null
        ? (l = st(l))
        : ((l = Ve(n) ? Un : je.current), (l = kr(t, l))))
    var g = n.getDerivedStateFromProps
    ;((c = typeof g == 'function' || typeof o.getSnapshotBeforeUpdate == 'function') ||
      (typeof o.UNSAFE_componentWillReceiveProps != 'function' &&
        typeof o.componentWillReceiveProps != 'function') ||
      ((a !== f || d !== l) && cd(t, o, r, l)),
      (Yt = !1),
      (d = t.memoizedState),
      (o.state = d),
      ho(t, r, o, i))
    var v = t.memoizedState
    a !== f || d !== v || Fe.current || Yt
      ? (typeof g == 'function' && (bl(t, n, g, r), (v = t.memoizedState)),
        (u = Yt || ud(t, n, u, r, d, v, l) || !1)
          ? (c ||
              (typeof o.UNSAFE_componentWillUpdate != 'function' &&
                typeof o.componentWillUpdate != 'function') ||
              (typeof o.componentWillUpdate == 'function' && o.componentWillUpdate(r, v, l),
              typeof o.UNSAFE_componentWillUpdate == 'function' &&
                o.UNSAFE_componentWillUpdate(r, v, l)),
            typeof o.componentDidUpdate == 'function' && (t.flags |= 4),
            typeof o.getSnapshotBeforeUpdate == 'function' && (t.flags |= 1024))
          : (typeof o.componentDidUpdate != 'function' ||
              (a === e.memoizedProps && d === e.memoizedState) ||
              (t.flags |= 4),
            typeof o.getSnapshotBeforeUpdate != 'function' ||
              (a === e.memoizedProps && d === e.memoizedState) ||
              (t.flags |= 1024),
            (t.memoizedProps = r),
            (t.memoizedState = v)),
        (o.props = r),
        (o.state = v),
        (o.context = l),
        (r = u))
      : (typeof o.componentDidUpdate != 'function' ||
          (a === e.memoizedProps && d === e.memoizedState) ||
          (t.flags |= 4),
        typeof o.getSnapshotBeforeUpdate != 'function' ||
          (a === e.memoizedProps && d === e.memoizedState) ||
          (t.flags |= 1024),
        (r = !1))
  }
  return Bl(e, t, n, r, s, i)
}
function Bl(e, t, n, r, i, s) {
  dg(e, t)
  var o = (t.flags & 128) !== 0
  if (!r && !o) return (i && td(t, n, !1), zt(e, t, s))
  ;((r = t.stateNode), (hx.current = t))
  var a = o && typeof n.getDerivedStateFromError != 'function' ? null : r.render()
  return (
    (t.flags |= 1),
    e !== null && o
      ? ((t.child = Rr(t, e.child, null, s)), (t.child = Rr(t, null, a, s)))
      : Oe(e, t, a, s),
    (t.memoizedState = r.state),
    i && td(t, n, !0),
    t.child
  )
}
function hg(e) {
  var t = e.stateNode
  ;(t.pendingContext
    ? ed(e, t.pendingContext, t.pendingContext !== t.context)
    : t.context && ed(e, t.context, !1),
    tc(e, t.containerInfo))
}
function yd(e, t, n, r, i) {
  return (Tr(), Xu(i), (t.flags |= 256), Oe(e, t, n, r), t.child)
}
var zl = { dehydrated: null, treeContext: null, retryLane: 0 }
function Ul(e) {
  return { baseLanes: e, cachePool: null, transitions: null }
}
function pg(e, t, n) {
  var r = t.pendingProps,
    i = J.current,
    s = !1,
    o = (t.flags & 128) !== 0,
    a
  if (
    ((a = o) || (a = e !== null && e.memoizedState === null ? !1 : (i & 2) !== 0),
    a ? ((s = !0), (t.flags &= -129)) : (e === null || e.memoizedState !== null) && (i |= 1),
    K(J, i & 1),
    e === null)
  )
    return (
      Dl(t),
      (e = t.memoizedState),
      e !== null && ((e = e.dehydrated), e !== null)
        ? (t.mode & 1 ? (e.data === '$!' ? (t.lanes = 8) : (t.lanes = 1073741824)) : (t.lanes = 1),
          null)
        : ((o = r.children),
          (e = r.fallback),
          s
            ? ((r = t.mode),
              (s = t.child),
              (o = { mode: 'hidden', children: o }),
              !(r & 1) && s !== null
                ? ((s.childLanes = 0), (s.pendingProps = o))
                : (s = qo(o, r, 0, null)),
              (e = Vn(e, r, n, null)),
              (s.return = t),
              (e.return = t),
              (s.sibling = e),
              (t.child = s),
              (t.child.memoizedState = Ul(n)),
              (t.memoizedState = zl),
              e)
            : uc(t, o))
    )
  if (((i = e.memoizedState), i !== null && ((a = i.dehydrated), a !== null)))
    return px(e, t, o, r, a, i, n)
  if (s) {
    ;((s = r.fallback), (o = t.mode), (i = e.child), (a = i.sibling))
    var l = { mode: 'hidden', children: r.children }
    return (
      !(o & 1) && t.child !== i
        ? ((r = t.child), (r.childLanes = 0), (r.pendingProps = l), (t.deletions = null))
        : ((r = dn(i, l)), (r.subtreeFlags = i.subtreeFlags & 14680064)),
      a !== null ? (s = dn(a, s)) : ((s = Vn(s, o, n, null)), (s.flags |= 2)),
      (s.return = t),
      (r.return = t),
      (r.sibling = s),
      (t.child = r),
      (r = s),
      (s = t.child),
      (o = e.child.memoizedState),
      (o =
        o === null
          ? Ul(n)
          : { baseLanes: o.baseLanes | n, cachePool: null, transitions: o.transitions }),
      (s.memoizedState = o),
      (s.childLanes = e.childLanes & ~n),
      (t.memoizedState = zl),
      r
    )
  }
  return (
    (s = e.child),
    (e = s.sibling),
    (r = dn(s, { mode: 'visible', children: r.children })),
    !(t.mode & 1) && (r.lanes = n),
    (r.return = t),
    (r.sibling = null),
    e !== null &&
      ((n = t.deletions), n === null ? ((t.deletions = [e]), (t.flags |= 16)) : n.push(e)),
    (t.child = r),
    (t.memoizedState = null),
    r
  )
}
function uc(e, t) {
  return (
    (t = qo({ mode: 'visible', children: t }, e.mode, 0, null)),
    (t.return = e),
    (e.child = t)
  )
}
function Ss(e, t, n, r) {
  return (
    r !== null && Xu(r),
    Rr(t, e.child, null, n),
    (e = uc(t, t.pendingProps.children)),
    (e.flags |= 2),
    (t.memoizedState = null),
    e
  )
}
function px(e, t, n, r, i, s, o) {
  if (n)
    return t.flags & 256
      ? ((t.flags &= -257), (r = Na(Error(R(422)))), Ss(e, t, o, r))
      : t.memoizedState !== null
        ? ((t.child = e.child), (t.flags |= 128), null)
        : ((s = r.fallback),
          (i = t.mode),
          (r = qo({ mode: 'visible', children: r.children }, i, 0, null)),
          (s = Vn(s, i, o, null)),
          (s.flags |= 2),
          (r.return = t),
          (s.return = t),
          (r.sibling = s),
          (t.child = r),
          t.mode & 1 && Rr(t, e.child, null, o),
          (t.child.memoizedState = Ul(o)),
          (t.memoizedState = zl),
          s)
  if (!(t.mode & 1)) return Ss(e, t, o, null)
  if (i.data === '$!') {
    if (((r = i.nextSibling && i.nextSibling.dataset), r)) var a = r.dgst
    return ((r = a), (s = Error(R(419))), (r = Na(s, r, void 0)), Ss(e, t, o, r))
  }
  if (((a = (o & e.childLanes) !== 0), be || a)) {
    if (((r = he), r !== null)) {
      switch (o & -o) {
        case 4:
          i = 2
          break
        case 16:
          i = 8
          break
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          i = 32
          break
        case 536870912:
          i = 268435456
          break
        default:
          i = 0
      }
      ;((i = i & (r.suspendedLanes | o) ? 0 : i),
        i !== 0 && i !== s.retryLane && ((s.retryLane = i), Bt(e, i), pt(r, e, i, -1)))
    }
    return (mc(), (r = Na(Error(R(421)))), Ss(e, t, o, r))
  }
  return i.data === '$?'
    ? ((t.flags |= 128), (t.child = e.child), (t = Rx.bind(null, e)), (i._reactRetry = t), null)
    : ((e = s.treeContext),
      (He = ln(i.nextSibling)),
      (Ke = t),
      (Q = !0),
      (dt = null),
      e !== null &&
        ((tt[nt++] = Lt),
        (tt[nt++] = Nt),
        (tt[nt++] = $n),
        (Lt = e.id),
        (Nt = e.overflow),
        ($n = t)),
      (t = uc(t, r.children)),
      (t.flags |= 4096),
      t)
}
function vd(e, t, n) {
  e.lanes |= t
  var r = e.alternate
  ;(r !== null && (r.lanes |= t), Ml(e.return, t, n))
}
function Da(e, t, n, r, i) {
  var s = e.memoizedState
  s === null
    ? (e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: r,
        tail: n,
        tailMode: i,
      })
    : ((s.isBackwards = t),
      (s.rendering = null),
      (s.renderingStartTime = 0),
      (s.last = r),
      (s.tail = n),
      (s.tailMode = i))
}
function mg(e, t, n) {
  var r = t.pendingProps,
    i = r.revealOrder,
    s = r.tail
  if ((Oe(e, t, r.children, n), (r = J.current), r & 2)) ((r = (r & 1) | 2), (t.flags |= 128))
  else {
    if (e !== null && e.flags & 128)
      e: for (e = t.child; e !== null;) {
        if (e.tag === 13) e.memoizedState !== null && vd(e, n, t)
        else if (e.tag === 19) vd(e, n, t)
        else if (e.child !== null) {
          ;((e.child.return = e), (e = e.child))
          continue
        }
        if (e === t) break e
        for (; e.sibling === null;) {
          if (e.return === null || e.return === t) break e
          e = e.return
        }
        ;((e.sibling.return = e.return), (e = e.sibling))
      }
    r &= 1
  }
  if ((K(J, r), !(t.mode & 1))) t.memoizedState = null
  else
    switch (i) {
      case 'forwards':
        for (n = t.child, i = null; n !== null;)
          ((e = n.alternate), e !== null && po(e) === null && (i = n), (n = n.sibling))
        ;((n = i),
          n === null ? ((i = t.child), (t.child = null)) : ((i = n.sibling), (n.sibling = null)),
          Da(t, !1, i, n, s))
        break
      case 'backwards':
        for (n = null, i = t.child, t.child = null; i !== null;) {
          if (((e = i.alternate), e !== null && po(e) === null)) {
            t.child = i
            break
          }
          ;((e = i.sibling), (i.sibling = n), (n = i), (i = e))
        }
        Da(t, !0, n, null, s)
        break
      case 'together':
        Da(t, !1, null, null, void 0)
        break
      default:
        t.memoizedState = null
    }
  return t.child
}
function Bs(e, t) {
  !(t.mode & 1) && e !== null && ((e.alternate = null), (t.alternate = null), (t.flags |= 2))
}
function zt(e, t, n) {
  if ((e !== null && (t.dependencies = e.dependencies), (Hn |= t.lanes), !(n & t.childLanes)))
    return null
  if (e !== null && t.child !== e.child) throw Error(R(153))
  if (t.child !== null) {
    for (e = t.child, n = dn(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;)
      ((e = e.sibling), (n = n.sibling = dn(e, e.pendingProps)), (n.return = t))
    n.sibling = null
  }
  return t.child
}
function mx(e, t, n) {
  switch (t.tag) {
    case 3:
      ;(hg(t), Tr())
      break
    case 5:
      zm(t)
      break
    case 1:
      Ve(t.type) && ao(t)
      break
    case 4:
      tc(t, t.stateNode.containerInfo)
      break
    case 10:
      var r = t.type._context,
        i = t.memoizedProps.value
      ;(K(co, r._currentValue), (r._currentValue = i))
      break
    case 13:
      if (((r = t.memoizedState), r !== null))
        return r.dehydrated !== null
          ? (K(J, J.current & 1), (t.flags |= 128), null)
          : n & t.child.childLanes
            ? pg(e, t, n)
            : (K(J, J.current & 1), (e = zt(e, t, n)), e !== null ? e.sibling : null)
      K(J, J.current & 1)
      break
    case 19:
      if (((r = (n & t.childLanes) !== 0), e.flags & 128)) {
        if (r) return mg(e, t, n)
        t.flags |= 128
      }
      if (
        ((i = t.memoizedState),
        i !== null && ((i.rendering = null), (i.tail = null), (i.lastEffect = null)),
        K(J, J.current),
        r)
      )
        break
      return null
    case 22:
    case 23:
      return ((t.lanes = 0), fg(e, t, n))
  }
  return zt(e, t, n)
}
var gg, $l, yg, vg
gg = function (e, t) {
  for (var n = t.child; n !== null;) {
    if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode)
    else if (n.tag !== 4 && n.child !== null) {
      ;((n.child.return = n), (n = n.child))
      continue
    }
    if (n === t) break
    for (; n.sibling === null;) {
      if (n.return === null || n.return === t) return
      n = n.return
    }
    ;((n.sibling.return = n.return), (n = n.sibling))
  }
}
$l = function () {}
yg = function (e, t, n, r) {
  var i = e.memoizedProps
  if (i !== r) {
    ;((e = t.stateNode), Dn(kt.current))
    var s = null
    switch (n) {
      case 'input':
        ;((i = fl(e, i)), (r = fl(e, r)), (s = []))
        break
      case 'select':
        ;((i = te({}, i, { value: void 0 })), (r = te({}, r, { value: void 0 })), (s = []))
        break
      case 'textarea':
        ;((i = pl(e, i)), (r = pl(e, r)), (s = []))
        break
      default:
        typeof i.onClick != 'function' && typeof r.onClick == 'function' && (e.onclick = so)
    }
    gl(n, r)
    var o
    n = null
    for (u in i)
      if (!r.hasOwnProperty(u) && i.hasOwnProperty(u) && i[u] != null)
        if (u === 'style') {
          var a = i[u]
          for (o in a) a.hasOwnProperty(o) && (n || (n = {}), (n[o] = ''))
        } else
          u !== 'dangerouslySetInnerHTML' &&
            u !== 'children' &&
            u !== 'suppressContentEditableWarning' &&
            u !== 'suppressHydrationWarning' &&
            u !== 'autoFocus' &&
            (Ei.hasOwnProperty(u) ? s || (s = []) : (s = s || []).push(u, null))
    for (u in r) {
      var l = r[u]
      if (
        ((a = i != null ? i[u] : void 0),
        r.hasOwnProperty(u) && l !== a && (l != null || a != null))
      )
        if (u === 'style')
          if (a) {
            for (o in a)
              !a.hasOwnProperty(o) || (l && l.hasOwnProperty(o)) || (n || (n = {}), (n[o] = ''))
            for (o in l) l.hasOwnProperty(o) && a[o] !== l[o] && (n || (n = {}), (n[o] = l[o]))
          } else (n || (s || (s = []), s.push(u, n)), (n = l))
        else
          u === 'dangerouslySetInnerHTML'
            ? ((l = l ? l.__html : void 0),
              (a = a ? a.__html : void 0),
              l != null && a !== l && (s = s || []).push(u, l))
            : u === 'children'
              ? (typeof l != 'string' && typeof l != 'number') || (s = s || []).push(u, '' + l)
              : u !== 'suppressContentEditableWarning' &&
                u !== 'suppressHydrationWarning' &&
                (Ei.hasOwnProperty(u)
                  ? (l != null && u === 'onScroll' && q('scroll', e), s || a === l || (s = []))
                  : (s = s || []).push(u, l))
    }
    n && (s = s || []).push('style', n)
    var u = s
    ;(t.updateQueue = u) && (t.flags |= 4)
  }
}
vg = function (e, t, n, r) {
  n !== r && (t.flags |= 4)
}
function Jr(e, t) {
  if (!Q)
    switch (e.tailMode) {
      case 'hidden':
        t = e.tail
        for (var n = null; t !== null;) (t.alternate !== null && (n = t), (t = t.sibling))
        n === null ? (e.tail = null) : (n.sibling = null)
        break
      case 'collapsed':
        n = e.tail
        for (var r = null; n !== null;) (n.alternate !== null && (r = n), (n = n.sibling))
        r === null
          ? t || e.tail === null
            ? (e.tail = null)
            : (e.tail.sibling = null)
          : (r.sibling = null)
    }
}
function Ce(e) {
  var t = e.alternate !== null && e.alternate.child === e.child,
    n = 0,
    r = 0
  if (t)
    for (var i = e.child; i !== null;)
      ((n |= i.lanes | i.childLanes),
        (r |= i.subtreeFlags & 14680064),
        (r |= i.flags & 14680064),
        (i.return = e),
        (i = i.sibling))
  else
    for (i = e.child; i !== null;)
      ((n |= i.lanes | i.childLanes),
        (r |= i.subtreeFlags),
        (r |= i.flags),
        (i.return = e),
        (i = i.sibling))
  return ((e.subtreeFlags |= r), (e.childLanes = n), t)
}
function gx(e, t, n) {
  var r = t.pendingProps
  switch ((Gu(t), t.tag)) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return (Ce(t), null)
    case 1:
      return (Ve(t.type) && oo(), Ce(t), null)
    case 3:
      return (
        (r = t.stateNode),
        Ar(),
        G(Fe),
        G(je),
        rc(),
        r.pendingContext && ((r.context = r.pendingContext), (r.pendingContext = null)),
        (e === null || e.child === null) &&
          (xs(t)
            ? (t.flags |= 4)
            : e === null ||
              (e.memoizedState.isDehydrated && !(t.flags & 256)) ||
              ((t.flags |= 1024), dt !== null && (Yl(dt), (dt = null)))),
        $l(e, t),
        Ce(t),
        null
      )
    case 5:
      nc(t)
      var i = Dn(Di.current)
      if (((n = t.type), e !== null && t.stateNode != null))
        (yg(e, t, n, r, i), e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152)))
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(R(166))
          return (Ce(t), null)
        }
        if (((e = Dn(kt.current)), xs(t))) {
          ;((r = t.stateNode), (n = t.type))
          var s = t.memoizedProps
          switch (((r[Et] = t), (r[Li] = s), (e = (t.mode & 1) !== 0), n)) {
            case 'dialog':
              ;(q('cancel', r), q('close', r))
              break
            case 'iframe':
            case 'object':
            case 'embed':
              q('load', r)
              break
            case 'video':
            case 'audio':
              for (i = 0; i < si.length; i++) q(si[i], r)
              break
            case 'source':
              q('error', r)
              break
            case 'img':
            case 'image':
            case 'link':
              ;(q('error', r), q('load', r))
              break
            case 'details':
              q('toggle', r)
              break
            case 'input':
              ;(Rf(r, s), q('invalid', r))
              break
            case 'select':
              ;((r._wrapperState = { wasMultiple: !!s.multiple }), q('invalid', r))
              break
            case 'textarea':
              ;(_f(r, s), q('invalid', r))
          }
          ;(gl(n, s), (i = null))
          for (var o in s)
            if (s.hasOwnProperty(o)) {
              var a = s[o]
              o === 'children'
                ? typeof a == 'string'
                  ? r.textContent !== a &&
                    (s.suppressHydrationWarning !== !0 && vs(r.textContent, a, e),
                    (i = ['children', a]))
                  : typeof a == 'number' &&
                    r.textContent !== '' + a &&
                    (s.suppressHydrationWarning !== !0 && vs(r.textContent, a, e),
                    (i = ['children', '' + a]))
                : Ei.hasOwnProperty(o) && a != null && o === 'onScroll' && q('scroll', r)
            }
          switch (n) {
            case 'input':
              ;(cs(r), Af(r, s, !0))
              break
            case 'textarea':
              ;(cs(r), jf(r))
              break
            case 'select':
            case 'option':
              break
            default:
              typeof s.onClick == 'function' && (r.onclick = so)
          }
          ;((r = i), (t.updateQueue = r), r !== null && (t.flags |= 4))
        } else {
          ;((o = i.nodeType === 9 ? i : i.ownerDocument),
            e === 'http://www.w3.org/1999/xhtml' && (e = Kp(n)),
            e === 'http://www.w3.org/1999/xhtml'
              ? n === 'script'
                ? ((e = o.createElement('div')),
                  (e.innerHTML = '<script><\/script>'),
                  (e = e.removeChild(e.firstChild)))
                : typeof r.is == 'string'
                  ? (e = o.createElement(n, { is: r.is }))
                  : ((e = o.createElement(n)),
                    n === 'select' &&
                      ((o = e), r.multiple ? (o.multiple = !0) : r.size && (o.size = r.size)))
              : (e = o.createElementNS(e, n)),
            (e[Et] = t),
            (e[Li] = r),
            gg(e, t, !1, !1),
            (t.stateNode = e))
          e: {
            switch (((o = yl(n, r)), n)) {
              case 'dialog':
                ;(q('cancel', e), q('close', e), (i = r))
                break
              case 'iframe':
              case 'object':
              case 'embed':
                ;(q('load', e), (i = r))
                break
              case 'video':
              case 'audio':
                for (i = 0; i < si.length; i++) q(si[i], e)
                i = r
                break
              case 'source':
                ;(q('error', e), (i = r))
                break
              case 'img':
              case 'image':
              case 'link':
                ;(q('error', e), q('load', e), (i = r))
                break
              case 'details':
                ;(q('toggle', e), (i = r))
                break
              case 'input':
                ;(Rf(e, r), (i = fl(e, r)), q('invalid', e))
                break
              case 'option':
                i = r
                break
              case 'select':
                ;((e._wrapperState = { wasMultiple: !!r.multiple }),
                  (i = te({}, r, { value: void 0 })),
                  q('invalid', e))
                break
              case 'textarea':
                ;(_f(e, r), (i = pl(e, r)), q('invalid', e))
                break
              default:
                i = r
            }
            ;(gl(n, i), (a = i))
            for (s in a)
              if (a.hasOwnProperty(s)) {
                var l = a[s]
                s === 'style'
                  ? Xp(e, l)
                  : s === 'dangerouslySetInnerHTML'
                    ? ((l = l ? l.__html : void 0), l != null && qp(e, l))
                    : s === 'children'
                      ? typeof l == 'string'
                        ? (n !== 'textarea' || l !== '') && Pi(e, l)
                        : typeof l == 'number' && Pi(e, '' + l)
                      : s !== 'suppressContentEditableWarning' &&
                        s !== 'suppressHydrationWarning' &&
                        s !== 'autoFocus' &&
                        (Ei.hasOwnProperty(s)
                          ? l != null && s === 'onScroll' && q('scroll', e)
                          : l != null && Nu(e, s, l, o))
              }
            switch (n) {
              case 'input':
                ;(cs(e), Af(e, r, !1))
                break
              case 'textarea':
                ;(cs(e), jf(e))
                break
              case 'option':
                r.value != null && e.setAttribute('value', '' + pn(r.value))
                break
              case 'select':
                ;((e.multiple = !!r.multiple),
                  (s = r.value),
                  s != null
                    ? vr(e, !!r.multiple, s, !1)
                    : r.defaultValue != null && vr(e, !!r.multiple, r.defaultValue, !0))
                break
              default:
                typeof i.onClick == 'function' && (e.onclick = so)
            }
            switch (n) {
              case 'button':
              case 'input':
              case 'select':
              case 'textarea':
                r = !!r.autoFocus
                break e
              case 'img':
                r = !0
                break e
              default:
                r = !1
            }
          }
          r && (t.flags |= 4)
        }
        t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152))
      }
      return (Ce(t), null)
    case 6:
      if (e && t.stateNode != null) vg(e, t, e.memoizedProps, r)
      else {
        if (typeof r != 'string' && t.stateNode === null) throw Error(R(166))
        if (((n = Dn(Di.current)), Dn(kt.current), xs(t))) {
          if (
            ((r = t.stateNode),
            (n = t.memoizedProps),
            (r[Et] = t),
            (s = r.nodeValue !== n) && ((e = Ke), e !== null))
          )
            switch (e.tag) {
              case 3:
                vs(r.nodeValue, n, (e.mode & 1) !== 0)
                break
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 &&
                  vs(r.nodeValue, n, (e.mode & 1) !== 0)
            }
          s && (t.flags |= 4)
        } else
          ((r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r)),
            (r[Et] = t),
            (t.stateNode = r))
      }
      return (Ce(t), null)
    case 13:
      if (
        (G(J),
        (r = t.memoizedState),
        e === null || (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
      ) {
        if (Q && He !== null && t.mode & 1 && !(t.flags & 128))
          (bm(), Tr(), (t.flags |= 98560), (s = !1))
        else if (((s = xs(t)), r !== null && r.dehydrated !== null)) {
          if (e === null) {
            if (!s) throw Error(R(318))
            if (((s = t.memoizedState), (s = s !== null ? s.dehydrated : null), !s))
              throw Error(R(317))
            s[Et] = t
          } else (Tr(), !(t.flags & 128) && (t.memoizedState = null), (t.flags |= 4))
          ;(Ce(t), (s = !1))
        } else (dt !== null && (Yl(dt), (dt = null)), (s = !0))
        if (!s) return t.flags & 65536 ? t : null
      }
      return t.flags & 128
        ? ((t.lanes = n), t)
        : ((r = r !== null),
          r !== (e !== null && e.memoizedState !== null) &&
            r &&
            ((t.child.flags |= 8192),
            t.mode & 1 && (e === null || J.current & 1 ? fe === 0 && (fe = 3) : mc())),
          t.updateQueue !== null && (t.flags |= 4),
          Ce(t),
          null)
    case 4:
      return (Ar(), $l(e, t), e === null && ji(t.stateNode.containerInfo), Ce(t), null)
    case 10:
      return (Ju(t.type._context), Ce(t), null)
    case 17:
      return (Ve(t.type) && oo(), Ce(t), null)
    case 19:
      if ((G(J), (s = t.memoizedState), s === null)) return (Ce(t), null)
      if (((r = (t.flags & 128) !== 0), (o = s.rendering), o === null))
        if (r) Jr(s, !1)
        else {
          if (fe !== 0 || (e !== null && e.flags & 128))
            for (e = t.child; e !== null;) {
              if (((o = po(e)), o !== null)) {
                for (
                  t.flags |= 128,
                    Jr(s, !1),
                    r = o.updateQueue,
                    r !== null && ((t.updateQueue = r), (t.flags |= 4)),
                    t.subtreeFlags = 0,
                    r = n,
                    n = t.child;
                  n !== null;
                )
                  ((s = n),
                    (e = r),
                    (s.flags &= 14680066),
                    (o = s.alternate),
                    o === null
                      ? ((s.childLanes = 0),
                        (s.lanes = e),
                        (s.child = null),
                        (s.subtreeFlags = 0),
                        (s.memoizedProps = null),
                        (s.memoizedState = null),
                        (s.updateQueue = null),
                        (s.dependencies = null),
                        (s.stateNode = null))
                      : ((s.childLanes = o.childLanes),
                        (s.lanes = o.lanes),
                        (s.child = o.child),
                        (s.subtreeFlags = 0),
                        (s.deletions = null),
                        (s.memoizedProps = o.memoizedProps),
                        (s.memoizedState = o.memoizedState),
                        (s.updateQueue = o.updateQueue),
                        (s.type = o.type),
                        (e = o.dependencies),
                        (s.dependencies =
                          e === null ? null : { lanes: e.lanes, firstContext: e.firstContext })),
                    (n = n.sibling))
                return (K(J, (J.current & 1) | 2), t.child)
              }
              e = e.sibling
            }
          s.tail !== null &&
            oe() > jr &&
            ((t.flags |= 128), (r = !0), Jr(s, !1), (t.lanes = 4194304))
        }
      else {
        if (!r)
          if (((e = po(o)), e !== null)) {
            if (
              ((t.flags |= 128),
              (r = !0),
              (n = e.updateQueue),
              n !== null && ((t.updateQueue = n), (t.flags |= 4)),
              Jr(s, !0),
              s.tail === null && s.tailMode === 'hidden' && !o.alternate && !Q)
            )
              return (Ce(t), null)
          } else
            2 * oe() - s.renderingStartTime > jr &&
              n !== 1073741824 &&
              ((t.flags |= 128), (r = !0), Jr(s, !1), (t.lanes = 4194304))
        s.isBackwards
          ? ((o.sibling = t.child), (t.child = o))
          : ((n = s.last), n !== null ? (n.sibling = o) : (t.child = o), (s.last = o))
      }
      return s.tail !== null
        ? ((t = s.tail),
          (s.rendering = t),
          (s.tail = t.sibling),
          (s.renderingStartTime = oe()),
          (t.sibling = null),
          (n = J.current),
          K(J, r ? (n & 1) | 2 : n & 1),
          t)
        : (Ce(t), null)
    case 22:
    case 23:
      return (
        pc(),
        (r = t.memoizedState !== null),
        e !== null && (e.memoizedState !== null) !== r && (t.flags |= 8192),
        r && t.mode & 1
          ? We & 1073741824 && (Ce(t), t.subtreeFlags & 6 && (t.flags |= 8192))
          : Ce(t),
        null
      )
    case 24:
      return null
    case 25:
      return null
  }
  throw Error(R(156, t.tag))
}
function yx(e, t) {
  switch ((Gu(t), t.tag)) {
    case 1:
      return (
        Ve(t.type) && oo(),
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      )
    case 3:
      return (
        Ar(),
        G(Fe),
        G(je),
        rc(),
        (e = t.flags),
        e & 65536 && !(e & 128) ? ((t.flags = (e & -65537) | 128), t) : null
      )
    case 5:
      return (nc(t), null)
    case 13:
      if ((G(J), (e = t.memoizedState), e !== null && e.dehydrated !== null)) {
        if (t.alternate === null) throw Error(R(340))
        Tr()
      }
      return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null)
    case 19:
      return (G(J), null)
    case 4:
      return (Ar(), null)
    case 10:
      return (Ju(t.type._context), null)
    case 22:
    case 23:
      return (pc(), null)
    case 24:
      return null
    default:
      return null
  }
}
var Es = !1,
  Re = !1,
  vx = typeof WeakSet == 'function' ? WeakSet : Set,
  O = null
function fr(e, t) {
  var n = e.ref
  if (n !== null)
    if (typeof n == 'function')
      try {
        n(null)
      } catch (r) {
        re(e, t, r)
      }
    else n.current = null
}
function Wl(e, t, n) {
  try {
    n()
  } catch (r) {
    re(e, t, r)
  }
}
var xd = !1
function xx(e, t) {
  if (((Rl = no), (e = Pm()), Ku(e))) {
    if ('selectionStart' in e) var n = { start: e.selectionStart, end: e.selectionEnd }
    else
      e: {
        n = ((n = e.ownerDocument) && n.defaultView) || window
        var r = n.getSelection && n.getSelection()
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode
          var i = r.anchorOffset,
            s = r.focusNode
          r = r.focusOffset
          try {
            ;(n.nodeType, s.nodeType)
          } catch {
            n = null
            break e
          }
          var o = 0,
            a = -1,
            l = -1,
            u = 0,
            c = 0,
            f = e,
            d = null
          t: for (;;) {
            for (
              var g;
              f !== n || (i !== 0 && f.nodeType !== 3) || (a = o + i),
                f !== s || (r !== 0 && f.nodeType !== 3) || (l = o + r),
                f.nodeType === 3 && (o += f.nodeValue.length),
                (g = f.firstChild) !== null;
            )
              ((d = f), (f = g))
            for (;;) {
              if (f === e) break t
              if (
                (d === n && ++u === i && (a = o),
                d === s && ++c === r && (l = o),
                (g = f.nextSibling) !== null)
              )
                break
              ;((f = d), (d = f.parentNode))
            }
            f = g
          }
          n = a === -1 || l === -1 ? null : { start: a, end: l }
        } else n = null
      }
    n = n || { start: 0, end: 0 }
  } else n = null
  for (Al = { focusedElem: e, selectionRange: n }, no = !1, O = t; O !== null;)
    if (((t = O), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
      ((e.return = t), (O = e))
    else
      for (; O !== null;) {
        t = O
        try {
          var v = t.alternate
          if (t.flags & 1024)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                break
              case 1:
                if (v !== null) {
                  var x = v.memoizedProps,
                    S = v.memoizedState,
                    h = t.stateNode,
                    p = h.getSnapshotBeforeUpdate(t.elementType === t.type ? x : ct(t.type, x), S)
                  h.__reactInternalSnapshotBeforeUpdate = p
                }
                break
              case 3:
                var m = t.stateNode.containerInfo
                m.nodeType === 1
                  ? (m.textContent = '')
                  : m.nodeType === 9 && m.documentElement && m.removeChild(m.documentElement)
                break
              case 5:
              case 6:
              case 4:
              case 17:
                break
              default:
                throw Error(R(163))
            }
        } catch (P) {
          re(t, t.return, P)
        }
        if (((e = t.sibling), e !== null)) {
          ;((e.return = t.return), (O = e))
          break
        }
        O = t.return
      }
  return ((v = xd), (xd = !1), v)
}
function mi(e, t, n) {
  var r = t.updateQueue
  if (((r = r !== null ? r.lastEffect : null), r !== null)) {
    var i = (r = r.next)
    do {
      if ((i.tag & e) === e) {
        var s = i.destroy
        ;((i.destroy = void 0), s !== void 0 && Wl(t, n, s))
      }
      i = i.next
    } while (i !== r)
  }
}
function Ho(e, t) {
  if (((t = t.updateQueue), (t = t !== null ? t.lastEffect : null), t !== null)) {
    var n = (t = t.next)
    do {
      if ((n.tag & e) === e) {
        var r = n.create
        n.destroy = r()
      }
      n = n.next
    } while (n !== t)
  }
}
function Hl(e) {
  var t = e.ref
  if (t !== null) {
    var n = e.stateNode
    switch (e.tag) {
      case 5:
        e = n
        break
      default:
        e = n
    }
    typeof t == 'function' ? t(e) : (t.current = e)
  }
}
function xg(e) {
  var t = e.alternate
  ;(t !== null && ((e.alternate = null), xg(t)),
    (e.child = null),
    (e.deletions = null),
    (e.sibling = null),
    e.tag === 5 &&
      ((t = e.stateNode),
      t !== null && (delete t[Et], delete t[Li], delete t[Ol], delete t[tx], delete t[nx])),
    (e.stateNode = null),
    (e.return = null),
    (e.dependencies = null),
    (e.memoizedProps = null),
    (e.memoizedState = null),
    (e.pendingProps = null),
    (e.stateNode = null),
    (e.updateQueue = null))
}
function wg(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4
}
function wd(e) {
  e: for (;;) {
    for (; e.sibling === null;) {
      if (e.return === null || wg(e.return)) return null
      e = e.return
    }
    for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
      if (e.flags & 2 || e.child === null || e.tag === 4) continue e
      ;((e.child.return = e), (e = e.child))
    }
    if (!(e.flags & 2)) return e.stateNode
  }
}
function Kl(e, t, n) {
  var r = e.tag
  if (r === 5 || r === 6)
    ((e = e.stateNode),
      t
        ? n.nodeType === 8
          ? n.parentNode.insertBefore(e, t)
          : n.insertBefore(e, t)
        : (n.nodeType === 8
            ? ((t = n.parentNode), t.insertBefore(e, n))
            : ((t = n), t.appendChild(e)),
          (n = n._reactRootContainer),
          n != null || t.onclick !== null || (t.onclick = so)))
  else if (r !== 4 && ((e = e.child), e !== null))
    for (Kl(e, t, n), e = e.sibling; e !== null;) (Kl(e, t, n), (e = e.sibling))
}
function ql(e, t, n) {
  var r = e.tag
  if (r === 5 || r === 6) ((e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e))
  else if (r !== 4 && ((e = e.child), e !== null))
    for (ql(e, t, n), e = e.sibling; e !== null;) (ql(e, t, n), (e = e.sibling))
}
var ge = null,
  ft = !1
function qt(e, t, n) {
  for (n = n.child; n !== null;) (Sg(e, t, n), (n = n.sibling))
}
function Sg(e, t, n) {
  if (Ct && typeof Ct.onCommitFiberUnmount == 'function')
    try {
      Ct.onCommitFiberUnmount(Fo, n)
    } catch {}
  switch (n.tag) {
    case 5:
      Re || fr(n, t)
    case 6:
      var r = ge,
        i = ft
      ;((ge = null),
        qt(e, t, n),
        (ge = r),
        (ft = i),
        ge !== null &&
          (ft
            ? ((e = ge),
              (n = n.stateNode),
              e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n))
            : ge.removeChild(n.stateNode)))
      break
    case 18:
      ge !== null &&
        (ft
          ? ((e = ge),
            (n = n.stateNode),
            e.nodeType === 8 ? Ra(e.parentNode, n) : e.nodeType === 1 && Ra(e, n),
            Ri(e))
          : Ra(ge, n.stateNode))
      break
    case 4:
      ;((r = ge),
        (i = ft),
        (ge = n.stateNode.containerInfo),
        (ft = !0),
        qt(e, t, n),
        (ge = r),
        (ft = i))
      break
    case 0:
    case 11:
    case 14:
    case 15:
      if (!Re && ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))) {
        i = r = r.next
        do {
          var s = i,
            o = s.destroy
          ;((s = s.tag), o !== void 0 && (s & 2 || s & 4) && Wl(n, t, o), (i = i.next))
        } while (i !== r)
      }
      qt(e, t, n)
      break
    case 1:
      if (!Re && (fr(n, t), (r = n.stateNode), typeof r.componentWillUnmount == 'function'))
        try {
          ;((r.props = n.memoizedProps), (r.state = n.memoizedState), r.componentWillUnmount())
        } catch (a) {
          re(n, t, a)
        }
      qt(e, t, n)
      break
    case 21:
      qt(e, t, n)
      break
    case 22:
      n.mode & 1
        ? ((Re = (r = Re) || n.memoizedState !== null), qt(e, t, n), (Re = r))
        : qt(e, t, n)
      break
    default:
      qt(e, t, n)
  }
}
function Sd(e) {
  var t = e.updateQueue
  if (t !== null) {
    e.updateQueue = null
    var n = e.stateNode
    ;(n === null && (n = e.stateNode = new vx()),
      t.forEach(function (r) {
        var i = Ax.bind(null, e, r)
        n.has(r) || (n.add(r), r.then(i, i))
      }))
  }
}
function lt(e, t) {
  var n = t.deletions
  if (n !== null)
    for (var r = 0; r < n.length; r++) {
      var i = n[r]
      try {
        var s = e,
          o = t,
          a = o
        e: for (; a !== null;) {
          switch (a.tag) {
            case 5:
              ;((ge = a.stateNode), (ft = !1))
              break e
            case 3:
              ;((ge = a.stateNode.containerInfo), (ft = !0))
              break e
            case 4:
              ;((ge = a.stateNode.containerInfo), (ft = !0))
              break e
          }
          a = a.return
        }
        if (ge === null) throw Error(R(160))
        ;(Sg(s, o, i), (ge = null), (ft = !1))
        var l = i.alternate
        ;(l !== null && (l.return = null), (i.return = null))
      } catch (u) {
        re(i, t, u)
      }
    }
  if (t.subtreeFlags & 12854) for (t = t.child; t !== null;) (Eg(t, e), (t = t.sibling))
}
function Eg(e, t) {
  var n = e.alternate,
    r = e.flags
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ((lt(t, e), xt(e), r & 4)) {
        try {
          ;(mi(3, e, e.return), Ho(3, e))
        } catch (x) {
          re(e, e.return, x)
        }
        try {
          mi(5, e, e.return)
        } catch (x) {
          re(e, e.return, x)
        }
      }
      break
    case 1:
      ;(lt(t, e), xt(e), r & 512 && n !== null && fr(n, n.return))
      break
    case 5:
      if ((lt(t, e), xt(e), r & 512 && n !== null && fr(n, n.return), e.flags & 32)) {
        var i = e.stateNode
        try {
          Pi(i, '')
        } catch (x) {
          re(e, e.return, x)
        }
      }
      if (r & 4 && ((i = e.stateNode), i != null)) {
        var s = e.memoizedProps,
          o = n !== null ? n.memoizedProps : s,
          a = e.type,
          l = e.updateQueue
        if (((e.updateQueue = null), l !== null))
          try {
            ;(a === 'input' && s.type === 'radio' && s.name != null && Wp(i, s), yl(a, o))
            var u = yl(a, s)
            for (o = 0; o < l.length; o += 2) {
              var c = l[o],
                f = l[o + 1]
              c === 'style'
                ? Xp(i, f)
                : c === 'dangerouslySetInnerHTML'
                  ? qp(i, f)
                  : c === 'children'
                    ? Pi(i, f)
                    : Nu(i, c, f, u)
            }
            switch (a) {
              case 'input':
                dl(i, s)
                break
              case 'textarea':
                Hp(i, s)
                break
              case 'select':
                var d = i._wrapperState.wasMultiple
                i._wrapperState.wasMultiple = !!s.multiple
                var g = s.value
                g != null
                  ? vr(i, !!s.multiple, g, !1)
                  : d !== !!s.multiple &&
                    (s.defaultValue != null
                      ? vr(i, !!s.multiple, s.defaultValue, !0)
                      : vr(i, !!s.multiple, s.multiple ? [] : '', !1))
            }
            i[Li] = s
          } catch (x) {
            re(e, e.return, x)
          }
      }
      break
    case 6:
      if ((lt(t, e), xt(e), r & 4)) {
        if (e.stateNode === null) throw Error(R(162))
        ;((i = e.stateNode), (s = e.memoizedProps))
        try {
          i.nodeValue = s
        } catch (x) {
          re(e, e.return, x)
        }
      }
      break
    case 3:
      if ((lt(t, e), xt(e), r & 4 && n !== null && n.memoizedState.isDehydrated))
        try {
          Ri(t.containerInfo)
        } catch (x) {
          re(e, e.return, x)
        }
      break
    case 4:
      ;(lt(t, e), xt(e))
      break
    case 13:
      ;(lt(t, e),
        xt(e),
        (i = e.child),
        i.flags & 8192 &&
          ((s = i.memoizedState !== null),
          (i.stateNode.isHidden = s),
          !s || (i.alternate !== null && i.alternate.memoizedState !== null) || (dc = oe())),
        r & 4 && Sd(e))
      break
    case 22:
      if (
        ((c = n !== null && n.memoizedState !== null),
        e.mode & 1 ? ((Re = (u = Re) || c), lt(t, e), (Re = u)) : lt(t, e),
        xt(e),
        r & 8192)
      ) {
        if (((u = e.memoizedState !== null), (e.stateNode.isHidden = u) && !c && e.mode & 1))
          for (O = e, c = e.child; c !== null;) {
            for (f = O = c; O !== null;) {
              switch (((d = O), (g = d.child), d.tag)) {
                case 0:
                case 11:
                case 14:
                case 15:
                  mi(4, d, d.return)
                  break
                case 1:
                  fr(d, d.return)
                  var v = d.stateNode
                  if (typeof v.componentWillUnmount == 'function') {
                    ;((r = d), (n = d.return))
                    try {
                      ;((t = r),
                        (v.props = t.memoizedProps),
                        (v.state = t.memoizedState),
                        v.componentWillUnmount())
                    } catch (x) {
                      re(r, n, x)
                    }
                  }
                  break
                case 5:
                  fr(d, d.return)
                  break
                case 22:
                  if (d.memoizedState !== null) {
                    Pd(f)
                    continue
                  }
              }
              g !== null ? ((g.return = d), (O = g)) : Pd(f)
            }
            c = c.sibling
          }
        e: for (c = null, f = e; ;) {
          if (f.tag === 5) {
            if (c === null) {
              c = f
              try {
                ;((i = f.stateNode),
                  u
                    ? ((s = i.style),
                      typeof s.setProperty == 'function'
                        ? s.setProperty('display', 'none', 'important')
                        : (s.display = 'none'))
                    : ((a = f.stateNode),
                      (l = f.memoizedProps.style),
                      (o = l != null && l.hasOwnProperty('display') ? l.display : null),
                      (a.style.display = Gp('display', o))))
              } catch (x) {
                re(e, e.return, x)
              }
            }
          } else if (f.tag === 6) {
            if (c === null)
              try {
                f.stateNode.nodeValue = u ? '' : f.memoizedProps
              } catch (x) {
                re(e, e.return, x)
              }
          } else if (
            ((f.tag !== 22 && f.tag !== 23) || f.memoizedState === null || f === e) &&
            f.child !== null
          ) {
            ;((f.child.return = f), (f = f.child))
            continue
          }
          if (f === e) break e
          for (; f.sibling === null;) {
            if (f.return === null || f.return === e) break e
            ;(c === f && (c = null), (f = f.return))
          }
          ;(c === f && (c = null), (f.sibling.return = f.return), (f = f.sibling))
        }
      }
      break
    case 19:
      ;(lt(t, e), xt(e), r & 4 && Sd(e))
      break
    case 21:
      break
    default:
      ;(lt(t, e), xt(e))
  }
}
function xt(e) {
  var t = e.flags
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null;) {
          if (wg(n)) {
            var r = n
            break e
          }
          n = n.return
        }
        throw Error(R(160))
      }
      switch (r.tag) {
        case 5:
          var i = r.stateNode
          r.flags & 32 && (Pi(i, ''), (r.flags &= -33))
          var s = wd(e)
          ql(e, s, i)
          break
        case 3:
        case 4:
          var o = r.stateNode.containerInfo,
            a = wd(e)
          Kl(e, a, o)
          break
        default:
          throw Error(R(161))
      }
    } catch (l) {
      re(e, e.return, l)
    }
    e.flags &= -3
  }
  t & 4096 && (e.flags &= -4097)
}
function wx(e, t, n) {
  ;((O = e), Pg(e))
}
function Pg(e, t, n) {
  for (var r = (e.mode & 1) !== 0; O !== null;) {
    var i = O,
      s = i.child
    if (i.tag === 22 && r) {
      var o = i.memoizedState !== null || Es
      if (!o) {
        var a = i.alternate,
          l = (a !== null && a.memoizedState !== null) || Re
        a = Es
        var u = Re
        if (((Es = o), (Re = l) && !u))
          for (O = i; O !== null;)
            ((o = O),
              (l = o.child),
              o.tag === 22 && o.memoizedState !== null
                ? Cd(i)
                : l !== null
                  ? ((l.return = o), (O = l))
                  : Cd(i))
        for (; s !== null;) ((O = s), Pg(s), (s = s.sibling))
        ;((O = i), (Es = a), (Re = u))
      }
      Ed(e)
    } else i.subtreeFlags & 8772 && s !== null ? ((s.return = i), (O = s)) : Ed(e)
  }
}
function Ed(e) {
  for (; O !== null;) {
    var t = O
    if (t.flags & 8772) {
      var n = t.alternate
      try {
        if (t.flags & 8772)
          switch (t.tag) {
            case 0:
            case 11:
            case 15:
              Re || Ho(5, t)
              break
            case 1:
              var r = t.stateNode
              if (t.flags & 4 && !Re)
                if (n === null) r.componentDidMount()
                else {
                  var i = t.elementType === t.type ? n.memoizedProps : ct(t.type, n.memoizedProps)
                  r.componentDidUpdate(i, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate)
                }
              var s = t.updateQueue
              s !== null && od(t, s, r)
              break
            case 3:
              var o = t.updateQueue
              if (o !== null) {
                if (((n = null), t.child !== null))
                  switch (t.child.tag) {
                    case 5:
                      n = t.child.stateNode
                      break
                    case 1:
                      n = t.child.stateNode
                  }
                od(t, o, n)
              }
              break
            case 5:
              var a = t.stateNode
              if (n === null && t.flags & 4) {
                n = a
                var l = t.memoizedProps
                switch (t.type) {
                  case 'button':
                  case 'input':
                  case 'select':
                  case 'textarea':
                    l.autoFocus && n.focus()
                    break
                  case 'img':
                    l.src && (n.src = l.src)
                }
              }
              break
            case 6:
              break
            case 4:
              break
            case 12:
              break
            case 13:
              if (t.memoizedState === null) {
                var u = t.alternate
                if (u !== null) {
                  var c = u.memoizedState
                  if (c !== null) {
                    var f = c.dehydrated
                    f !== null && Ri(f)
                  }
                }
              }
              break
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break
            default:
              throw Error(R(163))
          }
        Re || (t.flags & 512 && Hl(t))
      } catch (d) {
        re(t, t.return, d)
      }
    }
    if (t === e) {
      O = null
      break
    }
    if (((n = t.sibling), n !== null)) {
      ;((n.return = t.return), (O = n))
      break
    }
    O = t.return
  }
}
function Pd(e) {
  for (; O !== null;) {
    var t = O
    if (t === e) {
      O = null
      break
    }
    var n = t.sibling
    if (n !== null) {
      ;((n.return = t.return), (O = n))
      break
    }
    O = t.return
  }
}
function Cd(e) {
  for (; O !== null;) {
    var t = O
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return
          try {
            Ho(4, t)
          } catch (l) {
            re(t, n, l)
          }
          break
        case 1:
          var r = t.stateNode
          if (typeof r.componentDidMount == 'function') {
            var i = t.return
            try {
              r.componentDidMount()
            } catch (l) {
              re(t, i, l)
            }
          }
          var s = t.return
          try {
            Hl(t)
          } catch (l) {
            re(t, s, l)
          }
          break
        case 5:
          var o = t.return
          try {
            Hl(t)
          } catch (l) {
            re(t, o, l)
          }
      }
    } catch (l) {
      re(t, t.return, l)
    }
    if (t === e) {
      O = null
      break
    }
    var a = t.sibling
    if (a !== null) {
      ;((a.return = t.return), (O = a))
      break
    }
    O = t.return
  }
}
var Sx = Math.ceil,
  yo = Wt.ReactCurrentDispatcher,
  cc = Wt.ReactCurrentOwner,
  it = Wt.ReactCurrentBatchConfig,
  z = 0,
  he = null,
  le = null,
  we = 0,
  We = 0,
  dr = xn(0),
  fe = 0,
  Vi = null,
  Hn = 0,
  Ko = 0,
  fc = 0,
  gi = null,
  Me = null,
  dc = 0,
  jr = 1 / 0,
  jt = null,
  vo = !1,
  Gl = null,
  cn = null,
  Ps = !1,
  nn = null,
  xo = 0,
  yi = 0,
  Xl = null,
  zs = -1,
  Us = 0
function Le() {
  return z & 6 ? oe() : zs !== -1 ? zs : (zs = oe())
}
function fn(e) {
  return e.mode & 1
    ? z & 2 && we !== 0
      ? we & -we
      : ix.transition !== null
        ? (Us === 0 && (Us = am()), Us)
        : ((e = $), e !== 0 || ((e = window.event), (e = e === void 0 ? 16 : pm(e.type))), e)
    : 1
}
function pt(e, t, n, r) {
  if (50 < yi) throw ((yi = 0), (Xl = null), Error(R(185)))
  ;(Gi(e, n, r),
    (!(z & 2) || e !== he) &&
      (e === he && (!(z & 2) && (Ko |= n), fe === 4 && Zt(e, we)),
      Ie(e, r),
      n === 1 && z === 0 && !(t.mode & 1) && ((jr = oe() + 500), Uo && wn())))
}
function Ie(e, t) {
  var n = e.callbackNode
  i1(e, t)
  var r = to(e, e === he ? we : 0)
  if (r === 0) (n !== null && Nf(n), (e.callbackNode = null), (e.callbackPriority = 0))
  else if (((t = r & -r), e.callbackPriority !== t)) {
    if ((n != null && Nf(n), t === 1))
      (e.tag === 0 ? rx(kd.bind(null, e)) : Nm(kd.bind(null, e)),
        Z1(function () {
          !(z & 6) && wn()
        }),
        (n = null))
    else {
      switch (lm(r)) {
        case 1:
          n = Vu
          break
        case 4:
          n = sm
          break
        case 16:
          n = eo
          break
        case 536870912:
          n = om
          break
        default:
          n = eo
      }
      n = Og(n, Cg.bind(null, e))
    }
    ;((e.callbackPriority = t), (e.callbackNode = n))
  }
}
function Cg(e, t) {
  if (((zs = -1), (Us = 0), z & 6)) throw Error(R(327))
  var n = e.callbackNode
  if (Pr() && e.callbackNode !== n) return null
  var r = to(e, e === he ? we : 0)
  if (r === 0) return null
  if (r & 30 || r & e.expiredLanes || t) t = wo(e, r)
  else {
    t = r
    var i = z
    z |= 2
    var s = Tg()
    ;(he !== e || we !== t) && ((jt = null), (jr = oe() + 500), Fn(e, t))
    do
      try {
        Cx()
        break
      } catch (a) {
        kg(e, a)
      }
    while (!0)
    ;(Yu(), (yo.current = s), (z = i), le !== null ? (t = 0) : ((he = null), (we = 0), (t = fe)))
  }
  if (t !== 0) {
    if ((t === 2 && ((i = El(e)), i !== 0 && ((r = i), (t = Ql(e, i)))), t === 1))
      throw ((n = Vi), Fn(e, 0), Zt(e, r), Ie(e, oe()), n)
    if (t === 6) Zt(e, r)
    else {
      if (
        ((i = e.current.alternate),
        !(r & 30) &&
          !Ex(i) &&
          ((t = wo(e, r)), t === 2 && ((s = El(e)), s !== 0 && ((r = s), (t = Ql(e, s)))), t === 1))
      )
        throw ((n = Vi), Fn(e, 0), Zt(e, r), Ie(e, oe()), n)
      switch (((e.finishedWork = i), (e.finishedLanes = r), t)) {
        case 0:
        case 1:
          throw Error(R(345))
        case 2:
          _n(e, Me, jt)
          break
        case 3:
          if ((Zt(e, r), (r & 130023424) === r && ((t = dc + 500 - oe()), 10 < t))) {
            if (to(e, 0) !== 0) break
            if (((i = e.suspendedLanes), (i & r) !== r)) {
              ;(Le(), (e.pingedLanes |= e.suspendedLanes & i))
              break
            }
            e.timeoutHandle = jl(_n.bind(null, e, Me, jt), t)
            break
          }
          _n(e, Me, jt)
          break
        case 4:
          if ((Zt(e, r), (r & 4194240) === r)) break
          for (t = e.eventTimes, i = -1; 0 < r;) {
            var o = 31 - ht(r)
            ;((s = 1 << o), (o = t[o]), o > i && (i = o), (r &= ~s))
          }
          if (
            ((r = i),
            (r = oe() - r),
            (r =
              (120 > r
                ? 120
                : 480 > r
                  ? 480
                  : 1080 > r
                    ? 1080
                    : 1920 > r
                      ? 1920
                      : 3e3 > r
                        ? 3e3
                        : 4320 > r
                          ? 4320
                          : 1960 * Sx(r / 1960)) - r),
            10 < r)
          ) {
            e.timeoutHandle = jl(_n.bind(null, e, Me, jt), r)
            break
          }
          _n(e, Me, jt)
          break
        case 5:
          _n(e, Me, jt)
          break
        default:
          throw Error(R(329))
      }
    }
  }
  return (Ie(e, oe()), e.callbackNode === n ? Cg.bind(null, e) : null)
}
function Ql(e, t) {
  var n = gi
  return (
    e.current.memoizedState.isDehydrated && (Fn(e, t).flags |= 256),
    (e = wo(e, t)),
    e !== 2 && ((t = Me), (Me = n), t !== null && Yl(t)),
    e
  )
}
function Yl(e) {
  Me === null ? (Me = e) : Me.push.apply(Me, e)
}
function Ex(e) {
  for (var t = e; ;) {
    if (t.flags & 16384) {
      var n = t.updateQueue
      if (n !== null && ((n = n.stores), n !== null))
        for (var r = 0; r < n.length; r++) {
          var i = n[r],
            s = i.getSnapshot
          i = i.value
          try {
            if (!mt(s(), i)) return !1
          } catch {
            return !1
          }
        }
    }
    if (((n = t.child), t.subtreeFlags & 16384 && n !== null)) ((n.return = t), (t = n))
    else {
      if (t === e) break
      for (; t.sibling === null;) {
        if (t.return === null || t.return === e) return !0
        t = t.return
      }
      ;((t.sibling.return = t.return), (t = t.sibling))
    }
  }
  return !0
}
function Zt(e, t) {
  for (
    t &= ~fc, t &= ~Ko, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes;
    0 < t;
  ) {
    var n = 31 - ht(t),
      r = 1 << n
    ;((e[n] = -1), (t &= ~r))
  }
}
function kd(e) {
  if (z & 6) throw Error(R(327))
  Pr()
  var t = to(e, 0)
  if (!(t & 1)) return (Ie(e, oe()), null)
  var n = wo(e, t)
  if (e.tag !== 0 && n === 2) {
    var r = El(e)
    r !== 0 && ((t = r), (n = Ql(e, r)))
  }
  if (n === 1) throw ((n = Vi), Fn(e, 0), Zt(e, t), Ie(e, oe()), n)
  if (n === 6) throw Error(R(345))
  return (
    (e.finishedWork = e.current.alternate),
    (e.finishedLanes = t),
    _n(e, Me, jt),
    Ie(e, oe()),
    null
  )
}
function hc(e, t) {
  var n = z
  z |= 1
  try {
    return e(t)
  } finally {
    ;((z = n), z === 0 && ((jr = oe() + 500), Uo && wn()))
  }
}
function Kn(e) {
  nn !== null && nn.tag === 0 && !(z & 6) && Pr()
  var t = z
  z |= 1
  var n = it.transition,
    r = $
  try {
    if (((it.transition = null), ($ = 1), e)) return e()
  } finally {
    ;(($ = r), (it.transition = n), (z = t), !(z & 6) && wn())
  }
}
function pc() {
  ;((We = dr.current), G(dr))
}
function Fn(e, t) {
  ;((e.finishedWork = null), (e.finishedLanes = 0))
  var n = e.timeoutHandle
  if ((n !== -1 && ((e.timeoutHandle = -1), J1(n)), le !== null))
    for (n = le.return; n !== null;) {
      var r = n
      switch ((Gu(r), r.tag)) {
        case 1:
          ;((r = r.type.childContextTypes), r != null && oo())
          break
        case 3:
          ;(Ar(), G(Fe), G(je), rc())
          break
        case 5:
          nc(r)
          break
        case 4:
          Ar()
          break
        case 13:
          G(J)
          break
        case 19:
          G(J)
          break
        case 10:
          Ju(r.type._context)
          break
        case 22:
        case 23:
          pc()
      }
      n = n.return
    }
  if (
    ((he = e),
    (le = e = dn(e.current, null)),
    (we = We = t),
    (fe = 0),
    (Vi = null),
    (fc = Ko = Hn = 0),
    (Me = gi = null),
    Nn !== null)
  ) {
    for (t = 0; t < Nn.length; t++)
      if (((n = Nn[t]), (r = n.interleaved), r !== null)) {
        n.interleaved = null
        var i = r.next,
          s = n.pending
        if (s !== null) {
          var o = s.next
          ;((s.next = i), (r.next = o))
        }
        n.pending = r
      }
    Nn = null
  }
  return e
}
function kg(e, t) {
  do {
    var n = le
    try {
      if ((Yu(), (Vs.current = go), mo)) {
        for (var r = ee.memoizedState; r !== null;) {
          var i = r.queue
          ;(i !== null && (i.pending = null), (r = r.next))
        }
        mo = !1
      }
      if (
        ((Wn = 0),
        (de = ue = ee = null),
        (pi = !1),
        (Mi = 0),
        (cc.current = null),
        n === null || n.return === null)
      ) {
        ;((fe = 1), (Vi = t), (le = null))
        break
      }
      e: {
        var s = e,
          o = n.return,
          a = n,
          l = t
        if (
          ((t = we),
          (a.flags |= 32768),
          l !== null && typeof l == 'object' && typeof l.then == 'function')
        ) {
          var u = l,
            c = a,
            f = c.tag
          if (!(c.mode & 1) && (f === 0 || f === 11 || f === 15)) {
            var d = c.alternate
            d
              ? ((c.updateQueue = d.updateQueue),
                (c.memoizedState = d.memoizedState),
                (c.lanes = d.lanes))
              : ((c.updateQueue = null), (c.memoizedState = null))
          }
          var g = dd(o)
          if (g !== null) {
            ;((g.flags &= -257), hd(g, o, a, s, t), g.mode & 1 && fd(s, u, t), (t = g), (l = u))
            var v = t.updateQueue
            if (v === null) {
              var x = new Set()
              ;(x.add(l), (t.updateQueue = x))
            } else v.add(l)
            break e
          } else {
            if (!(t & 1)) {
              ;(fd(s, u, t), mc())
              break e
            }
            l = Error(R(426))
          }
        } else if (Q && a.mode & 1) {
          var S = dd(o)
          if (S !== null) {
            ;(!(S.flags & 65536) && (S.flags |= 256), hd(S, o, a, s, t), Xu(_r(l, a)))
            break e
          }
        }
        ;((s = l = _r(l, a)), fe !== 4 && (fe = 2), gi === null ? (gi = [s]) : gi.push(s), (s = o))
        do {
          switch (s.tag) {
            case 3:
              ;((s.flags |= 65536), (t &= -t), (s.lanes |= t))
              var h = lg(s, l, t)
              sd(s, h)
              break e
            case 1:
              a = l
              var p = s.type,
                m = s.stateNode
              if (
                !(s.flags & 128) &&
                (typeof p.getDerivedStateFromError == 'function' ||
                  (m !== null &&
                    typeof m.componentDidCatch == 'function' &&
                    (cn === null || !cn.has(m))))
              ) {
                ;((s.flags |= 65536), (t &= -t), (s.lanes |= t))
                var P = ug(s, a, t)
                sd(s, P)
                break e
              }
          }
          s = s.return
        } while (s !== null)
      }
      Ag(n)
    } catch (C) {
      ;((t = C), le === n && n !== null && (le = n = n.return))
      continue
    }
    break
  } while (!0)
}
function Tg() {
  var e = yo.current
  return ((yo.current = go), e === null ? go : e)
}
function mc() {
  ;((fe === 0 || fe === 3 || fe === 2) && (fe = 4),
    he === null || (!(Hn & 268435455) && !(Ko & 268435455)) || Zt(he, we))
}
function wo(e, t) {
  var n = z
  z |= 2
  var r = Tg()
  ;(he !== e || we !== t) && ((jt = null), Fn(e, t))
  do
    try {
      Px()
      break
    } catch (i) {
      kg(e, i)
    }
  while (!0)
  if ((Yu(), (z = n), (yo.current = r), le !== null)) throw Error(R(261))
  return ((he = null), (we = 0), fe)
}
function Px() {
  for (; le !== null;) Rg(le)
}
function Cx() {
  for (; le !== null && !Xv();) Rg(le)
}
function Rg(e) {
  var t = jg(e.alternate, e, We)
  ;((e.memoizedProps = e.pendingProps), t === null ? Ag(e) : (le = t), (cc.current = null))
}
function Ag(e) {
  var t = e
  do {
    var n = t.alternate
    if (((e = t.return), t.flags & 32768)) {
      if (((n = yx(n, t)), n !== null)) {
        ;((n.flags &= 32767), (le = n))
        return
      }
      if (e !== null) ((e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null))
      else {
        ;((fe = 6), (le = null))
        return
      }
    } else if (((n = gx(n, t, We)), n !== null)) {
      le = n
      return
    }
    if (((t = t.sibling), t !== null)) {
      le = t
      return
    }
    le = t = e
  } while (t !== null)
  fe === 0 && (fe = 5)
}
function _n(e, t, n) {
  var r = $,
    i = it.transition
  try {
    ;((it.transition = null), ($ = 1), kx(e, t, n, r))
  } finally {
    ;((it.transition = i), ($ = r))
  }
  return null
}
function kx(e, t, n, r) {
  do Pr()
  while (nn !== null)
  if (z & 6) throw Error(R(327))
  n = e.finishedWork
  var i = e.finishedLanes
  if (n === null) return null
  if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current)) throw Error(R(177))
  ;((e.callbackNode = null), (e.callbackPriority = 0))
  var s = n.lanes | n.childLanes
  if (
    (s1(e, s),
    e === he && ((le = he = null), (we = 0)),
    (!(n.subtreeFlags & 2064) && !(n.flags & 2064)) ||
      Ps ||
      ((Ps = !0),
      Og(eo, function () {
        return (Pr(), null)
      })),
    (s = (n.flags & 15990) !== 0),
    n.subtreeFlags & 15990 || s)
  ) {
    ;((s = it.transition), (it.transition = null))
    var o = $
    $ = 1
    var a = z
    ;((z |= 4),
      (cc.current = null),
      xx(e, n),
      Eg(n, e),
      H1(Al),
      (no = !!Rl),
      (Al = Rl = null),
      (e.current = n),
      wx(n),
      Qv(),
      (z = a),
      ($ = o),
      (it.transition = s))
  } else e.current = n
  if (
    (Ps && ((Ps = !1), (nn = e), (xo = i)),
    (s = e.pendingLanes),
    s === 0 && (cn = null),
    Zv(n.stateNode),
    Ie(e, oe()),
    t !== null)
  )
    for (r = e.onRecoverableError, n = 0; n < t.length; n++)
      ((i = t[n]), r(i.value, { componentStack: i.stack, digest: i.digest }))
  if (vo) throw ((vo = !1), (e = Gl), (Gl = null), e)
  return (
    xo & 1 && e.tag !== 0 && Pr(),
    (s = e.pendingLanes),
    s & 1 ? (e === Xl ? yi++ : ((yi = 0), (Xl = e))) : (yi = 0),
    wn(),
    null
  )
}
function Pr() {
  if (nn !== null) {
    var e = lm(xo),
      t = it.transition,
      n = $
    try {
      if (((it.transition = null), ($ = 16 > e ? 16 : e), nn === null)) var r = !1
      else {
        if (((e = nn), (nn = null), (xo = 0), z & 6)) throw Error(R(331))
        var i = z
        for (z |= 4, O = e.current; O !== null;) {
          var s = O,
            o = s.child
          if (O.flags & 16) {
            var a = s.deletions
            if (a !== null) {
              for (var l = 0; l < a.length; l++) {
                var u = a[l]
                for (O = u; O !== null;) {
                  var c = O
                  switch (c.tag) {
                    case 0:
                    case 11:
                    case 15:
                      mi(8, c, s)
                  }
                  var f = c.child
                  if (f !== null) ((f.return = c), (O = f))
                  else
                    for (; O !== null;) {
                      c = O
                      var d = c.sibling,
                        g = c.return
                      if ((xg(c), c === u)) {
                        O = null
                        break
                      }
                      if (d !== null) {
                        ;((d.return = g), (O = d))
                        break
                      }
                      O = g
                    }
                }
              }
              var v = s.alternate
              if (v !== null) {
                var x = v.child
                if (x !== null) {
                  v.child = null
                  do {
                    var S = x.sibling
                    ;((x.sibling = null), (x = S))
                  } while (x !== null)
                }
              }
              O = s
            }
          }
          if (s.subtreeFlags & 2064 && o !== null) ((o.return = s), (O = o))
          else
            e: for (; O !== null;) {
              if (((s = O), s.flags & 2048))
                switch (s.tag) {
                  case 0:
                  case 11:
                  case 15:
                    mi(9, s, s.return)
                }
              var h = s.sibling
              if (h !== null) {
                ;((h.return = s.return), (O = h))
                break e
              }
              O = s.return
            }
        }
        var p = e.current
        for (O = p; O !== null;) {
          o = O
          var m = o.child
          if (o.subtreeFlags & 2064 && m !== null) ((m.return = o), (O = m))
          else
            e: for (o = p; O !== null;) {
              if (((a = O), a.flags & 2048))
                try {
                  switch (a.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Ho(9, a)
                  }
                } catch (C) {
                  re(a, a.return, C)
                }
              if (a === o) {
                O = null
                break e
              }
              var P = a.sibling
              if (P !== null) {
                ;((P.return = a.return), (O = P))
                break e
              }
              O = a.return
            }
        }
        if (((z = i), wn(), Ct && typeof Ct.onPostCommitFiberRoot == 'function'))
          try {
            Ct.onPostCommitFiberRoot(Fo, e)
          } catch {}
        r = !0
      }
      return r
    } finally {
      ;(($ = n), (it.transition = t))
    }
  }
  return !1
}
function Td(e, t, n) {
  ;((t = _r(n, t)),
    (t = lg(e, t, 1)),
    (e = un(e, t, 1)),
    (t = Le()),
    e !== null && (Gi(e, 1, t), Ie(e, t)))
}
function re(e, t, n) {
  if (e.tag === 3) Td(e, e, n)
  else
    for (; t !== null;) {
      if (t.tag === 3) {
        Td(t, e, n)
        break
      } else if (t.tag === 1) {
        var r = t.stateNode
        if (
          typeof t.type.getDerivedStateFromError == 'function' ||
          (typeof r.componentDidCatch == 'function' && (cn === null || !cn.has(r)))
        ) {
          ;((e = _r(n, e)),
            (e = ug(t, e, 1)),
            (t = un(t, e, 1)),
            (e = Le()),
            t !== null && (Gi(t, 1, e), Ie(t, e)))
          break
        }
      }
      t = t.return
    }
}
function Tx(e, t, n) {
  var r = e.pingCache
  ;(r !== null && r.delete(t),
    (t = Le()),
    (e.pingedLanes |= e.suspendedLanes & n),
    he === e &&
      (we & n) === n &&
      (fe === 4 || (fe === 3 && (we & 130023424) === we && 500 > oe() - dc) ? Fn(e, 0) : (fc |= n)),
    Ie(e, t))
}
function _g(e, t) {
  t === 0 && (e.mode & 1 ? ((t = hs), (hs <<= 1), !(hs & 130023424) && (hs = 4194304)) : (t = 1))
  var n = Le()
  ;((e = Bt(e, t)), e !== null && (Gi(e, t, n), Ie(e, n)))
}
function Rx(e) {
  var t = e.memoizedState,
    n = 0
  ;(t !== null && (n = t.retryLane), _g(e, n))
}
function Ax(e, t) {
  var n = 0
  switch (e.tag) {
    case 13:
      var r = e.stateNode,
        i = e.memoizedState
      i !== null && (n = i.retryLane)
      break
    case 19:
      r = e.stateNode
      break
    default:
      throw Error(R(314))
  }
  ;(r !== null && r.delete(t), _g(e, n))
}
var jg
jg = function (e, t, n) {
  if (e !== null)
    if (e.memoizedProps !== t.pendingProps || Fe.current) be = !0
    else {
      if (!(e.lanes & n) && !(t.flags & 128)) return ((be = !1), mx(e, t, n))
      be = !!(e.flags & 131072)
    }
  else ((be = !1), Q && t.flags & 1048576 && Dm(t, uo, t.index))
  switch (((t.lanes = 0), t.tag)) {
    case 2:
      var r = t.type
      ;(Bs(e, t), (e = t.pendingProps))
      var i = kr(t, je.current)
      ;(Er(t, n), (i = sc(null, t, r, e, i, n)))
      var s = oc()
      return (
        (t.flags |= 1),
        typeof i == 'object' && i !== null && typeof i.render == 'function' && i.$$typeof === void 0
          ? ((t.tag = 1),
            (t.memoizedState = null),
            (t.updateQueue = null),
            Ve(r) ? ((s = !0), ao(t)) : (s = !1),
            (t.memoizedState = i.state !== null && i.state !== void 0 ? i.state : null),
            ec(t),
            (i.updater = Wo),
            (t.stateNode = i),
            (i._reactInternals = t),
            Fl(t, r, e, n),
            (t = Bl(null, t, r, !0, s, n)))
          : ((t.tag = 0), Q && s && qu(t), Oe(null, t, i, n), (t = t.child)),
        t
      )
    case 16:
      r = t.elementType
      e: {
        switch (
          (Bs(e, t),
          (e = t.pendingProps),
          (i = r._init),
          (r = i(r._payload)),
          (t.type = r),
          (i = t.tag = jx(r)),
          (e = ct(r, e)),
          i)
        ) {
          case 0:
            t = Il(null, t, r, e, n)
            break e
          case 1:
            t = gd(null, t, r, e, n)
            break e
          case 11:
            t = pd(null, t, r, e, n)
            break e
          case 14:
            t = md(null, t, r, ct(r.type, e), n)
            break e
        }
        throw Error(R(306, r, ''))
      }
      return t
    case 0:
      return (
        (r = t.type),
        (i = t.pendingProps),
        (i = t.elementType === r ? i : ct(r, i)),
        Il(e, t, r, i, n)
      )
    case 1:
      return (
        (r = t.type),
        (i = t.pendingProps),
        (i = t.elementType === r ? i : ct(r, i)),
        gd(e, t, r, i, n)
      )
    case 3:
      e: {
        if ((hg(t), e === null)) throw Error(R(387))
        ;((r = t.pendingProps), (s = t.memoizedState), (i = s.element), Bm(e, t), ho(t, r, null, n))
        var o = t.memoizedState
        if (((r = o.element), s.isDehydrated))
          if (
            ((s = {
              element: r,
              isDehydrated: !1,
              cache: o.cache,
              pendingSuspenseBoundaries: o.pendingSuspenseBoundaries,
              transitions: o.transitions,
            }),
            (t.updateQueue.baseState = s),
            (t.memoizedState = s),
            t.flags & 256)
          ) {
            ;((i = _r(Error(R(423)), t)), (t = yd(e, t, r, n, i)))
            break e
          } else if (r !== i) {
            ;((i = _r(Error(R(424)), t)), (t = yd(e, t, r, n, i)))
            break e
          } else
            for (
              He = ln(t.stateNode.containerInfo.firstChild),
                Ke = t,
                Q = !0,
                dt = null,
                n = Vm(t, null, r, n),
                t.child = n;
              n;
            )
              ((n.flags = (n.flags & -3) | 4096), (n = n.sibling))
        else {
          if ((Tr(), r === i)) {
            t = zt(e, t, n)
            break e
          }
          Oe(e, t, r, n)
        }
        t = t.child
      }
      return t
    case 5:
      return (
        zm(t),
        e === null && Dl(t),
        (r = t.type),
        (i = t.pendingProps),
        (s = e !== null ? e.memoizedProps : null),
        (o = i.children),
        _l(r, i) ? (o = null) : s !== null && _l(r, s) && (t.flags |= 32),
        dg(e, t),
        Oe(e, t, o, n),
        t.child
      )
    case 6:
      return (e === null && Dl(t), null)
    case 13:
      return pg(e, t, n)
    case 4:
      return (
        tc(t, t.stateNode.containerInfo),
        (r = t.pendingProps),
        e === null ? (t.child = Rr(t, null, r, n)) : Oe(e, t, r, n),
        t.child
      )
    case 11:
      return (
        (r = t.type),
        (i = t.pendingProps),
        (i = t.elementType === r ? i : ct(r, i)),
        pd(e, t, r, i, n)
      )
    case 7:
      return (Oe(e, t, t.pendingProps, n), t.child)
    case 8:
      return (Oe(e, t, t.pendingProps.children, n), t.child)
    case 12:
      return (Oe(e, t, t.pendingProps.children, n), t.child)
    case 10:
      e: {
        if (
          ((r = t.type._context),
          (i = t.pendingProps),
          (s = t.memoizedProps),
          (o = i.value),
          K(co, r._currentValue),
          (r._currentValue = o),
          s !== null)
        )
          if (mt(s.value, o)) {
            if (s.children === i.children && !Fe.current) {
              t = zt(e, t, n)
              break e
            }
          } else
            for (s = t.child, s !== null && (s.return = t); s !== null;) {
              var a = s.dependencies
              if (a !== null) {
                o = s.child
                for (var l = a.firstContext; l !== null;) {
                  if (l.context === r) {
                    if (s.tag === 1) {
                      ;((l = Mt(-1, n & -n)), (l.tag = 2))
                      var u = s.updateQueue
                      if (u !== null) {
                        u = u.shared
                        var c = u.pending
                        ;(c === null ? (l.next = l) : ((l.next = c.next), (c.next = l)),
                          (u.pending = l))
                      }
                    }
                    ;((s.lanes |= n),
                      (l = s.alternate),
                      l !== null && (l.lanes |= n),
                      Ml(s.return, n, t),
                      (a.lanes |= n))
                    break
                  }
                  l = l.next
                }
              } else if (s.tag === 10) o = s.type === t.type ? null : s.child
              else if (s.tag === 18) {
                if (((o = s.return), o === null)) throw Error(R(341))
                ;((o.lanes |= n),
                  (a = o.alternate),
                  a !== null && (a.lanes |= n),
                  Ml(o, n, t),
                  (o = s.sibling))
              } else o = s.child
              if (o !== null) o.return = s
              else
                for (o = s; o !== null;) {
                  if (o === t) {
                    o = null
                    break
                  }
                  if (((s = o.sibling), s !== null)) {
                    ;((s.return = o.return), (o = s))
                    break
                  }
                  o = o.return
                }
              s = o
            }
        ;(Oe(e, t, i.children, n), (t = t.child))
      }
      return t
    case 9:
      return (
        (i = t.type),
        (r = t.pendingProps.children),
        Er(t, n),
        (i = st(i)),
        (r = r(i)),
        (t.flags |= 1),
        Oe(e, t, r, n),
        t.child
      )
    case 14:
      return ((r = t.type), (i = ct(r, t.pendingProps)), (i = ct(r.type, i)), md(e, t, r, i, n))
    case 15:
      return cg(e, t, t.type, t.pendingProps, n)
    case 17:
      return (
        (r = t.type),
        (i = t.pendingProps),
        (i = t.elementType === r ? i : ct(r, i)),
        Bs(e, t),
        (t.tag = 1),
        Ve(r) ? ((e = !0), ao(t)) : (e = !1),
        Er(t, n),
        ag(t, r, i),
        Fl(t, r, i, n),
        Bl(null, t, r, !0, e, n)
      )
    case 19:
      return mg(e, t, n)
    case 22:
      return fg(e, t, n)
  }
  throw Error(R(156, t.tag))
}
function Og(e, t) {
  return im(e, t)
}
function _x(e, t, n, r) {
  ;((this.tag = e),
    (this.key = n),
    (this.sibling =
      this.child =
      this.return =
      this.stateNode =
      this.type =
      this.elementType =
        null),
    (this.index = 0),
    (this.ref = null),
    (this.pendingProps = t),
    (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
    (this.mode = r),
    (this.subtreeFlags = this.flags = 0),
    (this.deletions = null),
    (this.childLanes = this.lanes = 0),
    (this.alternate = null))
}
function rt(e, t, n, r) {
  return new _x(e, t, n, r)
}
function gc(e) {
  return ((e = e.prototype), !(!e || !e.isReactComponent))
}
function jx(e) {
  if (typeof e == 'function') return gc(e) ? 1 : 0
  if (e != null) {
    if (((e = e.$$typeof), e === Mu)) return 11
    if (e === bu) return 14
  }
  return 2
}
function dn(e, t) {
  var n = e.alternate
  return (
    n === null
      ? ((n = rt(e.tag, t, e.key, e.mode)),
        (n.elementType = e.elementType),
        (n.type = e.type),
        (n.stateNode = e.stateNode),
        (n.alternate = e),
        (e.alternate = n))
      : ((n.pendingProps = t),
        (n.type = e.type),
        (n.flags = 0),
        (n.subtreeFlags = 0),
        (n.deletions = null)),
    (n.flags = e.flags & 14680064),
    (n.childLanes = e.childLanes),
    (n.lanes = e.lanes),
    (n.child = e.child),
    (n.memoizedProps = e.memoizedProps),
    (n.memoizedState = e.memoizedState),
    (n.updateQueue = e.updateQueue),
    (t = e.dependencies),
    (n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
    (n.sibling = e.sibling),
    (n.index = e.index),
    (n.ref = e.ref),
    n
  )
}
function $s(e, t, n, r, i, s) {
  var o = 2
  if (((r = e), typeof e == 'function')) gc(e) && (o = 1)
  else if (typeof e == 'string') o = 5
  else
    e: switch (e) {
      case nr:
        return Vn(n.children, i, s, t)
      case Du:
        ;((o = 8), (i |= 8))
        break
      case al:
        return ((e = rt(12, n, t, i | 2)), (e.elementType = al), (e.lanes = s), e)
      case ll:
        return ((e = rt(13, n, t, i)), (e.elementType = ll), (e.lanes = s), e)
      case ul:
        return ((e = rt(19, n, t, i)), (e.elementType = ul), (e.lanes = s), e)
      case zp:
        return qo(n, i, s, t)
      default:
        if (typeof e == 'object' && e !== null)
          switch (e.$$typeof) {
            case Ip:
              o = 10
              break e
            case Bp:
              o = 9
              break e
            case Mu:
              o = 11
              break e
            case bu:
              o = 14
              break e
            case Qt:
              ;((o = 16), (r = null))
              break e
          }
        throw Error(R(130, e == null ? e : typeof e, ''))
    }
  return ((t = rt(o, n, t, i)), (t.elementType = e), (t.type = r), (t.lanes = s), t)
}
function Vn(e, t, n, r) {
  return ((e = rt(7, e, r, t)), (e.lanes = n), e)
}
function qo(e, t, n, r) {
  return (
    (e = rt(22, e, r, t)),
    (e.elementType = zp),
    (e.lanes = n),
    (e.stateNode = { isHidden: !1 }),
    e
  )
}
function Ma(e, t, n) {
  return ((e = rt(6, e, null, t)), (e.lanes = n), e)
}
function ba(e, t, n) {
  return (
    (t = rt(4, e.children !== null ? e.children : [], e.key, t)),
    (t.lanes = n),
    (t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation,
    }),
    t
  )
}
function Ox(e, t, n, r, i) {
  ;((this.tag = t),
    (this.containerInfo = e),
    (this.finishedWork = this.pingCache = this.current = this.pendingChildren = null),
    (this.timeoutHandle = -1),
    (this.callbackNode = this.pendingContext = this.context = null),
    (this.callbackPriority = 0),
    (this.eventTimes = ga(0)),
    (this.expirationTimes = ga(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = ga(0)),
    (this.identifierPrefix = r),
    (this.onRecoverableError = i),
    (this.mutableSourceEagerHydrationData = null))
}
function yc(e, t, n, r, i, s, o, a, l) {
  return (
    (e = new Ox(e, t, n, a, l)),
    t === 1 ? ((t = 1), s === !0 && (t |= 8)) : (t = 0),
    (s = rt(3, null, null, t)),
    (e.current = s),
    (s.stateNode = e),
    (s.memoizedState = {
      element: r,
      isDehydrated: n,
      cache: null,
      transitions: null,
      pendingSuspenseBoundaries: null,
    }),
    ec(s),
    e
  )
}
function Lx(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null
  return {
    $$typeof: tr,
    key: r == null ? null : '' + r,
    children: e,
    containerInfo: t,
    implementation: n,
  }
}
function Lg(e) {
  if (!e) return mn
  e = e._reactInternals
  e: {
    if (Qn(e) !== e || e.tag !== 1) throw Error(R(170))
    var t = e
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context
          break e
        case 1:
          if (Ve(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext
            break e
          }
      }
      t = t.return
    } while (t !== null)
    throw Error(R(171))
  }
  if (e.tag === 1) {
    var n = e.type
    if (Ve(n)) return Lm(e, n, t)
  }
  return t
}
function Ng(e, t, n, r, i, s, o, a, l) {
  return (
    (e = yc(n, r, !0, e, i, s, o, a, l)),
    (e.context = Lg(null)),
    (n = e.current),
    (r = Le()),
    (i = fn(n)),
    (s = Mt(r, i)),
    (s.callback = t ?? null),
    un(n, s, i),
    (e.current.lanes = i),
    Gi(e, i, r),
    Ie(e, r),
    e
  )
}
function Go(e, t, n, r) {
  var i = t.current,
    s = Le(),
    o = fn(i)
  return (
    (n = Lg(n)),
    t.context === null ? (t.context = n) : (t.pendingContext = n),
    (t = Mt(s, o)),
    (t.payload = { element: e }),
    (r = r === void 0 ? null : r),
    r !== null && (t.callback = r),
    (e = un(i, t, o)),
    e !== null && (pt(e, i, o, s), Fs(e, i, o)),
    o
  )
}
function So(e) {
  if (((e = e.current), !e.child)) return null
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode
    default:
      return e.child.stateNode
  }
}
function Rd(e, t) {
  if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
    var n = e.retryLane
    e.retryLane = n !== 0 && n < t ? n : t
  }
}
function vc(e, t) {
  ;(Rd(e, t), (e = e.alternate) && Rd(e, t))
}
function Nx() {
  return null
}
var Dg =
  typeof reportError == 'function'
    ? reportError
    : function (e) {
        console.error(e)
      }
function xc(e) {
  this._internalRoot = e
}
Xo.prototype.render = xc.prototype.render = function (e) {
  var t = this._internalRoot
  if (t === null) throw Error(R(409))
  Go(e, t, null, null)
}
Xo.prototype.unmount = xc.prototype.unmount = function () {
  var e = this._internalRoot
  if (e !== null) {
    this._internalRoot = null
    var t = e.containerInfo
    ;(Kn(function () {
      Go(null, e, null, null)
    }),
      (t[It] = null))
  }
}
function Xo(e) {
  this._internalRoot = e
}
Xo.prototype.unstable_scheduleHydration = function (e) {
  if (e) {
    var t = fm()
    e = { blockedOn: null, target: e, priority: t }
    for (var n = 0; n < Jt.length && t !== 0 && t < Jt[n].priority; n++);
    ;(Jt.splice(n, 0, e), n === 0 && hm(e))
  }
}
function wc(e) {
  return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11))
}
function Qo(e) {
  return !(
    !e ||
    (e.nodeType !== 1 &&
      e.nodeType !== 9 &&
      e.nodeType !== 11 &&
      (e.nodeType !== 8 || e.nodeValue !== ' react-mount-point-unstable '))
  )
}
function Ad() {}
function Dx(e, t, n, r, i) {
  if (i) {
    if (typeof r == 'function') {
      var s = r
      r = function () {
        var u = So(o)
        s.call(u)
      }
    }
    var o = Ng(t, r, e, 0, null, !1, !1, '', Ad)
    return (
      (e._reactRootContainer = o),
      (e[It] = o.current),
      ji(e.nodeType === 8 ? e.parentNode : e),
      Kn(),
      o
    )
  }
  for (; (i = e.lastChild);) e.removeChild(i)
  if (typeof r == 'function') {
    var a = r
    r = function () {
      var u = So(l)
      a.call(u)
    }
  }
  var l = yc(e, 0, !1, null, null, !1, !1, '', Ad)
  return (
    (e._reactRootContainer = l),
    (e[It] = l.current),
    ji(e.nodeType === 8 ? e.parentNode : e),
    Kn(function () {
      Go(t, l, n, r)
    }),
    l
  )
}
function Yo(e, t, n, r, i) {
  var s = n._reactRootContainer
  if (s) {
    var o = s
    if (typeof i == 'function') {
      var a = i
      i = function () {
        var l = So(o)
        a.call(l)
      }
    }
    Go(t, o, e, i)
  } else o = Dx(n, t, e, i, r)
  return So(o)
}
um = function (e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode
      if (t.current.memoizedState.isDehydrated) {
        var n = ii(t.pendingLanes)
        n !== 0 && (Iu(t, n | 1), Ie(t, oe()), !(z & 6) && ((jr = oe() + 500), wn()))
      }
      break
    case 13:
      ;(Kn(function () {
        var r = Bt(e, 1)
        if (r !== null) {
          var i = Le()
          pt(r, e, 1, i)
        }
      }),
        vc(e, 1))
  }
}
Bu = function (e) {
  if (e.tag === 13) {
    var t = Bt(e, 134217728)
    if (t !== null) {
      var n = Le()
      pt(t, e, 134217728, n)
    }
    vc(e, 134217728)
  }
}
cm = function (e) {
  if (e.tag === 13) {
    var t = fn(e),
      n = Bt(e, t)
    if (n !== null) {
      var r = Le()
      pt(n, e, t, r)
    }
    vc(e, t)
  }
}
fm = function () {
  return $
}
dm = function (e, t) {
  var n = $
  try {
    return (($ = e), t())
  } finally {
    $ = n
  }
}
xl = function (e, t, n) {
  switch (t) {
    case 'input':
      if ((dl(e, n), (t = n.name), n.type === 'radio' && t != null)) {
        for (n = e; n.parentNode;) n = n.parentNode
        for (
          n = n.querySelectorAll('input[name=' + JSON.stringify('' + t) + '][type="radio"]'), t = 0;
          t < n.length;
          t++
        ) {
          var r = n[t]
          if (r !== e && r.form === e.form) {
            var i = zo(r)
            if (!i) throw Error(R(90))
            ;($p(r), dl(r, i))
          }
        }
      }
      break
    case 'textarea':
      Hp(e, n)
      break
    case 'select':
      ;((t = n.value), t != null && vr(e, !!n.multiple, t, !1))
  }
}
Jp = hc
Zp = Kn
var Mx = { usingClientEntryPoint: !1, Events: [Qi, or, zo, Qp, Yp, hc] },
  Zr = {
    findFiberByHostInstance: Ln,
    bundleType: 0,
    version: '18.3.1',
    rendererPackageName: 'react-dom',
  },
  bx = {
    bundleType: Zr.bundleType,
    version: Zr.version,
    rendererPackageName: Zr.rendererPackageName,
    rendererConfig: Zr.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: Wt.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return ((e = nm(e)), e === null ? null : e.stateNode)
    },
    findFiberByHostInstance: Zr.findFiberByHostInstance || Nx,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: '18.3.1-next-f1338f8080-20240426',
  }
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < 'u') {
  var Cs = __REACT_DEVTOOLS_GLOBAL_HOOK__
  if (!Cs.isDisabled && Cs.supportsFiber)
    try {
      ;((Fo = Cs.inject(bx)), (Ct = Cs))
    } catch {}
}
Qe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Mx
Qe.createPortal = function (e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null
  if (!wc(t)) throw Error(R(200))
  return Lx(e, t, null, n)
}
Qe.createRoot = function (e, t) {
  if (!wc(e)) throw Error(R(299))
  var n = !1,
    r = '',
    i = Dg
  return (
    t != null &&
      (t.unstable_strictMode === !0 && (n = !0),
      t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
      t.onRecoverableError !== void 0 && (i = t.onRecoverableError)),
    (t = yc(e, 1, !1, null, null, n, !1, r, i)),
    (e[It] = t.current),
    ji(e.nodeType === 8 ? e.parentNode : e),
    new xc(t)
  )
}
Qe.findDOMNode = function (e) {
  if (e == null) return null
  if (e.nodeType === 1) return e
  var t = e._reactInternals
  if (t === void 0)
    throw typeof e.render == 'function'
      ? Error(R(188))
      : ((e = Object.keys(e).join(',')), Error(R(268, e)))
  return ((e = nm(t)), (e = e === null ? null : e.stateNode), e)
}
Qe.flushSync = function (e) {
  return Kn(e)
}
Qe.hydrate = function (e, t, n) {
  if (!Qo(t)) throw Error(R(200))
  return Yo(null, e, t, !0, n)
}
Qe.hydrateRoot = function (e, t, n) {
  if (!wc(e)) throw Error(R(405))
  var r = (n != null && n.hydratedSources) || null,
    i = !1,
    s = '',
    o = Dg
  if (
    (n != null &&
      (n.unstable_strictMode === !0 && (i = !0),
      n.identifierPrefix !== void 0 && (s = n.identifierPrefix),
      n.onRecoverableError !== void 0 && (o = n.onRecoverableError)),
    (t = Ng(t, null, e, 1, n ?? null, i, !1, s, o)),
    (e[It] = t.current),
    ji(e),
    r)
  )
    for (e = 0; e < r.length; e++)
      ((n = r[e]),
        (i = n._getVersion),
        (i = i(n._source)),
        t.mutableSourceEagerHydrationData == null
          ? (t.mutableSourceEagerHydrationData = [n, i])
          : t.mutableSourceEagerHydrationData.push(n, i))
  return new Xo(t)
}
Qe.render = function (e, t, n) {
  if (!Qo(t)) throw Error(R(200))
  return Yo(null, e, t, !1, n)
}
Qe.unmountComponentAtNode = function (e) {
  if (!Qo(e)) throw Error(R(40))
  return e._reactRootContainer
    ? (Kn(function () {
        Yo(null, null, e, !1, function () {
          ;((e._reactRootContainer = null), (e[It] = null))
        })
      }),
      !0)
    : !1
}
Qe.unstable_batchedUpdates = hc
Qe.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
  if (!Qo(n)) throw Error(R(200))
  if (e == null || e._reactInternals === void 0) throw Error(R(38))
  return Yo(e, t, n, !1, r)
}
Qe.version = '18.3.1-next-f1338f8080-20240426'
function Mg() {
  if (!(
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
  ))
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Mg)
    } catch (e) {
      console.error(e)
    }
}
;(Mg(), (Mp.exports = Qe))
var Fx = Mp.exports,
  _d = Fx
;((sl.createRoot = _d.createRoot), (sl.hydrateRoot = _d.hydrateRoot))
/**
 * @remix-run/router v1.23.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function Ii() {
  return (
    (Ii = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    Ii.apply(null, arguments)
  )
}
var rn
;(function (e) {
  ;((e.Pop = 'POP'), (e.Push = 'PUSH'), (e.Replace = 'REPLACE'))
})(rn || (rn = {}))
const jd = 'popstate'
function Vx(e) {
  e === void 0 && (e = {})
  function t(r, i) {
    let { pathname: s, search: o, hash: a } = r.location
    return Jl(
      '',
      { pathname: s, search: o, hash: a },
      (i.state && i.state.usr) || null,
      (i.state && i.state.key) || 'default',
    )
  }
  function n(r, i) {
    return typeof i == 'string' ? i : Eo(i)
  }
  return Bx(t, n, null, e)
}
function ae(e, t) {
  if (e === !1 || e === null || typeof e > 'u') throw new Error(t)
}
function Sc(e, t) {
  if (!e) {
    typeof console < 'u' && console.warn(t)
    try {
      throw new Error(t)
    } catch {}
  }
}
function Ix() {
  return Math.random().toString(36).substr(2, 8)
}
function Od(e, t) {
  return { usr: e.state, key: e.key, idx: t }
}
function Jl(e, t, n, r) {
  return (
    n === void 0 && (n = null),
    Ii(
      { pathname: typeof e == 'string' ? e : e.pathname, search: '', hash: '' },
      typeof t == 'string' ? Ir(t) : t,
      { state: n, key: (t && t.key) || r || Ix() },
    )
  )
}
function Eo(e) {
  let { pathname: t = '/', search: n = '', hash: r = '' } = e
  return (
    n && n !== '?' && (t += n.charAt(0) === '?' ? n : '?' + n),
    r && r !== '#' && (t += r.charAt(0) === '#' ? r : '#' + r),
    t
  )
}
function Ir(e) {
  let t = {}
  if (e) {
    let n = e.indexOf('#')
    n >= 0 && ((t.hash = e.substr(n)), (e = e.substr(0, n)))
    let r = e.indexOf('?')
    ;(r >= 0 && ((t.search = e.substr(r)), (e = e.substr(0, r))), e && (t.pathname = e))
  }
  return t
}
function Bx(e, t, n, r) {
  r === void 0 && (r = {})
  let { window: i = document.defaultView, v5Compat: s = !1 } = r,
    o = i.history,
    a = rn.Pop,
    l = null,
    u = c()
  u == null && ((u = 0), o.replaceState(Ii({}, o.state, { idx: u }), ''))
  function c() {
    return (o.state || { idx: null }).idx
  }
  function f() {
    a = rn.Pop
    let S = c(),
      h = S == null ? null : S - u
    ;((u = S), l && l({ action: a, location: x.location, delta: h }))
  }
  function d(S, h) {
    a = rn.Push
    let p = Jl(x.location, S, h)
    u = c() + 1
    let m = Od(p, u),
      P = x.createHref(p)
    try {
      o.pushState(m, '', P)
    } catch (C) {
      if (C instanceof DOMException && C.name === 'DataCloneError') throw C
      i.location.assign(P)
    }
    s && l && l({ action: a, location: x.location, delta: 1 })
  }
  function g(S, h) {
    a = rn.Replace
    let p = Jl(x.location, S, h)
    u = c()
    let m = Od(p, u),
      P = x.createHref(p)
    ;(o.replaceState(m, '', P), s && l && l({ action: a, location: x.location, delta: 0 }))
  }
  function v(S) {
    let h = i.location.origin !== 'null' ? i.location.origin : i.location.href,
      p = typeof S == 'string' ? S : Eo(S)
    return (
      (p = p.replace(/ $/, '%20')),
      ae(h, 'No window.location.(origin|href) available to create URL for href: ' + p),
      new URL(p, h)
    )
  }
  let x = {
    get action() {
      return a
    },
    get location() {
      return e(i, o)
    },
    listen(S) {
      if (l) throw new Error('A history only accepts one active listener')
      return (
        i.addEventListener(jd, f),
        (l = S),
        () => {
          ;(i.removeEventListener(jd, f), (l = null))
        }
      )
    },
    createHref(S) {
      return t(i, S)
    },
    createURL: v,
    encodeLocation(S) {
      let h = v(S)
      return { pathname: h.pathname, search: h.search, hash: h.hash }
    },
    push: d,
    replace: g,
    go(S) {
      return o.go(S)
    },
  }
  return x
}
var Ld
;(function (e) {
  ;((e.data = 'data'), (e.deferred = 'deferred'), (e.redirect = 'redirect'), (e.error = 'error'))
})(Ld || (Ld = {}))
function zx(e, t, n) {
  return (n === void 0 && (n = '/'), Ux(e, t, n))
}
function Ux(e, t, n, r) {
  let i = typeof t == 'string' ? Ir(t) : t,
    s = Ec(i.pathname || '/', n)
  if (s == null) return null
  let o = bg(e)
  $x(o)
  let a = null,
    l = tw(s)
  for (let u = 0; a == null && u < o.length; ++u) a = Jx(o[u], l)
  return a
}
function bg(e, t, n, r) {
  ;(t === void 0 && (t = []), n === void 0 && (n = []), r === void 0 && (r = ''))
  let i = (s, o, a) => {
    let l = {
      relativePath: a === void 0 ? s.path || '' : a,
      caseSensitive: s.caseSensitive === !0,
      childrenIndex: o,
      route: s,
    }
    l.relativePath.startsWith('/') &&
      (ae(
        l.relativePath.startsWith(r),
        'Absolute route path "' +
          l.relativePath +
          '" nested under path ' +
          ('"' + r + '" is not valid. An absolute child route path ') +
          'must start with the combined path of all its parent routes.',
      ),
      (l.relativePath = l.relativePath.slice(r.length)))
    let u = hn([r, l.relativePath]),
      c = n.concat(l)
    ;(s.children &&
      s.children.length > 0 &&
      (ae(
        s.index !== !0,
        'Index routes must not have child routes. Please remove ' +
          ('all child routes from route path "' + u + '".'),
      ),
      bg(s.children, t, c, u)),
      !(s.path == null && !s.index) && t.push({ path: u, score: Qx(u, s.index), routesMeta: c }))
  }
  return (
    e.forEach((s, o) => {
      var a
      if (s.path === '' || !((a = s.path) != null && a.includes('?'))) i(s, o)
      else for (let l of Fg(s.path)) i(s, o, l)
    }),
    t
  )
}
function Fg(e) {
  let t = e.split('/')
  if (t.length === 0) return []
  let [n, ...r] = t,
    i = n.endsWith('?'),
    s = n.replace(/\?$/, '')
  if (r.length === 0) return i ? [s, ''] : [s]
  let o = Fg(r.join('/')),
    a = []
  return (
    a.push(...o.map((l) => (l === '' ? s : [s, l].join('/')))),
    i && a.push(...o),
    a.map((l) => (e.startsWith('/') && l === '' ? '/' : l))
  )
}
function $x(e) {
  e.sort((t, n) =>
    t.score !== n.score
      ? n.score - t.score
      : Yx(
          t.routesMeta.map((r) => r.childrenIndex),
          n.routesMeta.map((r) => r.childrenIndex),
        ),
  )
}
const Wx = /^:[\w-]+$/,
  Hx = 3,
  Kx = 2,
  qx = 1,
  Gx = 10,
  Xx = -2,
  Nd = (e) => e === '*'
function Qx(e, t) {
  let n = e.split('/'),
    r = n.length
  return (
    n.some(Nd) && (r += Xx),
    t && (r += Kx),
    n.filter((i) => !Nd(i)).reduce((i, s) => i + (Wx.test(s) ? Hx : s === '' ? qx : Gx), r)
  )
}
function Yx(e, t) {
  return e.length === t.length && e.slice(0, -1).every((r, i) => r === t[i])
    ? e[e.length - 1] - t[t.length - 1]
    : 0
}
function Jx(e, t, n) {
  let { routesMeta: r } = e,
    i = {},
    s = '/',
    o = []
  for (let a = 0; a < r.length; ++a) {
    let l = r[a],
      u = a === r.length - 1,
      c = s === '/' ? t : t.slice(s.length) || '/',
      f = Zx({ path: l.relativePath, caseSensitive: l.caseSensitive, end: u }, c),
      d = l.route
    if (!f) return null
    ;(Object.assign(i, f.params),
      o.push({
        params: i,
        pathname: hn([s, f.pathname]),
        pathnameBase: ow(hn([s, f.pathnameBase])),
        route: d,
      }),
      f.pathnameBase !== '/' && (s = hn([s, f.pathnameBase])))
  }
  return o
}
function Zx(e, t) {
  typeof e == 'string' && (e = { path: e, caseSensitive: !1, end: !0 })
  let [n, r] = ew(e.path, e.caseSensitive, e.end),
    i = t.match(n)
  if (!i) return null
  let s = i[0],
    o = s.replace(/(.)\/+$/, '$1'),
    a = i.slice(1)
  return {
    params: r.reduce((u, c, f) => {
      let { paramName: d, isOptional: g } = c
      if (d === '*') {
        let x = a[f] || ''
        o = s.slice(0, s.length - x.length).replace(/(.)\/+$/, '$1')
      }
      const v = a[f]
      return (g && !v ? (u[d] = void 0) : (u[d] = (v || '').replace(/%2F/g, '/')), u)
    }, {}),
    pathname: s,
    pathnameBase: o,
    pattern: e,
  }
}
function ew(e, t, n) {
  ;(t === void 0 && (t = !1),
    n === void 0 && (n = !0),
    Sc(
      e === '*' || !e.endsWith('*') || e.endsWith('/*'),
      'Route path "' +
        e +
        '" will be treated as if it were ' +
        ('"' + e.replace(/\*$/, '/*') + '" because the `*` character must ') +
        'always follow a `/` in the pattern. To get rid of this warning, ' +
        ('please change the route path to "' + e.replace(/\*$/, '/*') + '".'),
    ))
  let r = [],
    i =
      '^' +
      e
        .replace(/\/*\*?$/, '')
        .replace(/^\/*/, '/')
        .replace(/[\\.*+^${}|()[\]]/g, '\\$&')
        .replace(
          /\/:([\w-]+)(\?)?/g,
          (o, a, l) => (
            r.push({ paramName: a, isOptional: l != null }),
            l ? '/?([^\\/]+)?' : '/([^\\/]+)'
          ),
        )
  return (
    e.endsWith('*')
      ? (r.push({ paramName: '*' }), (i += e === '*' || e === '/*' ? '(.*)$' : '(?:\\/(.+)|\\/*)$'))
      : n
        ? (i += '\\/*$')
        : e !== '' && e !== '/' && (i += '(?:(?=\\/|$))'),
    [new RegExp(i, t ? void 0 : 'i'), r]
  )
}
function tw(e) {
  try {
    return e
      .split('/')
      .map((t) => decodeURIComponent(t).replace(/\//g, '%2F'))
      .join('/')
  } catch (t) {
    return (
      Sc(
        !1,
        'The URL path "' +
          e +
          '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' +
          ('encoding (' + t + ').'),
      ),
      e
    )
  }
}
function Ec(e, t) {
  if (t === '/') return e
  if (!e.toLowerCase().startsWith(t.toLowerCase())) return null
  let n = t.endsWith('/') ? t.length - 1 : t.length,
    r = e.charAt(n)
  return r && r !== '/' ? null : e.slice(n) || '/'
}
const nw = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  rw = (e) => nw.test(e)
function iw(e, t) {
  t === void 0 && (t = '/')
  let { pathname: n, search: r = '', hash: i = '' } = typeof e == 'string' ? Ir(e) : e,
    s
  if (n)
    if (rw(n)) s = n
    else {
      if (n.includes('//')) {
        let o = n
        ;((n = Vg(n)),
          Sc(!1, 'Pathnames cannot have embedded double slashes - normalizing ' + (o + ' -> ' + n)))
      }
      n.startsWith('/') ? (s = Dd(n.substring(1), '/')) : (s = Dd(n, t))
    }
  else s = t
  return { pathname: s, search: aw(r), hash: lw(i) }
}
function Dd(e, t) {
  let n = t.replace(/\/+$/, '').split('/')
  return (
    e.split('/').forEach((i) => {
      i === '..' ? n.length > 1 && n.pop() : i !== '.' && n.push(i)
    }),
    n.length > 1 ? n.join('/') : '/'
  )
}
function Fa(e, t, n, r) {
  return (
    "Cannot include a '" +
    e +
    "' character in a manually specified " +
    ('`to.' + t + '` field [' + JSON.stringify(r) + '].  Please separate it out to the ') +
    ('`to.' + n + '` field. Alternatively you may provide the full path as ') +
    'a string in <Link to="..."> and the router will parse it for you.'
  )
}
function sw(e) {
  return e.filter((t, n) => n === 0 || (t.route.path && t.route.path.length > 0))
}
function Pc(e, t) {
  let n = sw(e)
  return t
    ? n.map((r, i) => (i === n.length - 1 ? r.pathname : r.pathnameBase))
    : n.map((r) => r.pathnameBase)
}
function Cc(e, t, n, r) {
  r === void 0 && (r = !1)
  let i
  typeof e == 'string'
    ? (i = Ir(e))
    : ((i = Ii({}, e)),
      ae(!i.pathname || !i.pathname.includes('?'), Fa('?', 'pathname', 'search', i)),
      ae(!i.pathname || !i.pathname.includes('#'), Fa('#', 'pathname', 'hash', i)),
      ae(!i.search || !i.search.includes('#'), Fa('#', 'search', 'hash', i)))
  let s = e === '' || i.pathname === '',
    o = s ? '/' : i.pathname,
    a
  if (o == null) a = n
  else {
    let f = t.length - 1
    if (!r && o.startsWith('..')) {
      let d = o.split('/')
      for (; d[0] === '..';) (d.shift(), (f -= 1))
      i.pathname = d.join('/')
    }
    a = f >= 0 ? t[f] : '/'
  }
  let l = iw(i, a),
    u = o && o !== '/' && o.endsWith('/'),
    c = (s || o === '.') && n.endsWith('/')
  return (!l.pathname.endsWith('/') && (u || c) && (l.pathname += '/'), l)
}
const Vg = (e) => e.replace(/\/\/+/g, '/'),
  hn = (e) => Vg(e.join('/')),
  ow = (e) => e.replace(/\/+$/, '').replace(/^\/*/, '/'),
  aw = (e) => (!e || e === '?' ? '' : e.startsWith('?') ? e : '?' + e),
  lw = (e) => (!e || e === '#' ? '' : e.startsWith('#') ? e : '#' + e)
function uw(e) {
  return (
    e != null &&
    typeof e.status == 'number' &&
    typeof e.statusText == 'string' &&
    typeof e.internal == 'boolean' &&
    'data' in e
  )
}
const Ig = ['post', 'put', 'patch', 'delete']
new Set(Ig)
const cw = ['get', ...Ig]
new Set(cw)
/**
 * React Router v6.30.4
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function Bi() {
  return (
    (Bi = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    Bi.apply(null, arguments)
  )
}
const kc = w.createContext(null),
  fw = w.createContext(null),
  Sn = w.createContext(null),
  Jo = w.createContext(null),
  Ht = w.createContext({ outlet: null, matches: [], isDataRoute: !1 }),
  Bg = w.createContext(null)
function dw(e, t) {
  let { relative: n } = t === void 0 ? {} : t
  Br() || ae(!1)
  let { basename: r, navigator: i } = w.useContext(Sn),
    { hash: s, pathname: o, search: a } = Ug(e, { relative: n }),
    l = o
  return (
    r !== '/' && (l = o === '/' ? r : hn([r, o])),
    i.createHref({ pathname: l, search: a, hash: s })
  )
}
function Br() {
  return w.useContext(Jo) != null
}
function En() {
  return (Br() || ae(!1), w.useContext(Jo).location)
}
function zg(e) {
  w.useContext(Sn).static || w.useLayoutEffect(e)
}
function Tc() {
  let { isDataRoute: e } = w.useContext(Ht)
  return e ? Rw() : hw()
}
function hw() {
  Br() || ae(!1)
  let e = w.useContext(kc),
    { basename: t, future: n, navigator: r } = w.useContext(Sn),
    { matches: i } = w.useContext(Ht),
    { pathname: s } = En(),
    o = JSON.stringify(Pc(i, n.v7_relativeSplatPath)),
    a = w.useRef(!1)
  return (
    zg(() => {
      a.current = !0
    }),
    w.useCallback(
      function (u, c) {
        if ((c === void 0 && (c = {}), !a.current)) return
        if (typeof u == 'number') {
          r.go(u)
          return
        }
        let f = Cc(u, JSON.parse(o), s, c.relative === 'path')
        ;(e == null && t !== '/' && (f.pathname = f.pathname === '/' ? t : hn([t, f.pathname])),
          (c.replace ? r.replace : r.push)(f, c.state, c))
      },
      [t, r, o, s, e],
    )
  )
}
const pw = w.createContext(null)
function mw(e) {
  let t = w.useContext(Ht).outlet
  return t && w.createElement(pw.Provider, { value: e }, t)
}
function Ug(e, t) {
  let { relative: n } = t === void 0 ? {} : t,
    { future: r } = w.useContext(Sn),
    { matches: i } = w.useContext(Ht),
    { pathname: s } = En(),
    o = JSON.stringify(Pc(i, r.v7_relativeSplatPath))
  return w.useMemo(() => Cc(e, JSON.parse(o), s, n === 'path'), [e, o, s, n])
}
function gw(e, t) {
  return yw(e, t)
}
function yw(e, t, n, r) {
  Br() || ae(!1)
  let { navigator: i } = w.useContext(Sn),
    { matches: s } = w.useContext(Ht),
    o = s[s.length - 1],
    a = o ? o.params : {}
  o && o.pathname
  let l = o ? o.pathnameBase : '/'
  o && o.route
  let u = En(),
    c
  if (t) {
    var f
    let S = typeof t == 'string' ? Ir(t) : t
    ;(l === '/' || ((f = S.pathname) != null && f.startsWith(l)) || ae(!1), (c = S))
  } else c = u
  let d = c.pathname || '/',
    g = d
  if (l !== '/') {
    let S = l.replace(/^\//, '').split('/')
    g = '/' + d.replace(/^\//, '').split('/').slice(S.length).join('/')
  }
  let v = zx(e, { pathname: g }),
    x = Ew(
      v &&
        v.map((S) =>
          Object.assign({}, S, {
            params: Object.assign({}, a, S.params),
            pathname: hn([
              l,
              i.encodeLocation ? i.encodeLocation(S.pathname).pathname : S.pathname,
            ]),
            pathnameBase:
              S.pathnameBase === '/'
                ? l
                : hn([
                    l,
                    i.encodeLocation ? i.encodeLocation(S.pathnameBase).pathname : S.pathnameBase,
                  ]),
          }),
        ),
      s,
      n,
      r,
    )
  return t && x
    ? w.createElement(
        Jo.Provider,
        {
          value: {
            location: Bi({ pathname: '/', search: '', hash: '', state: null, key: 'default' }, c),
            navigationType: rn.Pop,
          },
        },
        x,
      )
    : x
}
function vw() {
  let e = Tw(),
    t = uw(e) ? e.status + ' ' + e.statusText : e instanceof Error ? e.message : JSON.stringify(e),
    n = e instanceof Error ? e.stack : null,
    i = { padding: '0.5rem', backgroundColor: 'rgba(200,200,200, 0.5)' }
  return w.createElement(
    w.Fragment,
    null,
    w.createElement('h2', null, 'Unexpected Application Error!'),
    w.createElement('h3', { style: { fontStyle: 'italic' } }, t),
    n ? w.createElement('pre', { style: i }, n) : null,
    null,
  )
}
const xw = w.createElement(vw, null)
class ww extends w.Component {
  constructor(t) {
    ;(super(t),
      (this.state = { location: t.location, revalidation: t.revalidation, error: t.error }))
  }
  static getDerivedStateFromError(t) {
    return { error: t }
  }
  static getDerivedStateFromProps(t, n) {
    return n.location !== t.location || (n.revalidation !== 'idle' && t.revalidation === 'idle')
      ? { error: t.error, location: t.location, revalidation: t.revalidation }
      : {
          error: t.error !== void 0 ? t.error : n.error,
          location: n.location,
          revalidation: t.revalidation || n.revalidation,
        }
  }
  componentDidCatch(t, n) {
    console.error('React Router caught the following error during render', t, n)
  }
  render() {
    return this.state.error !== void 0
      ? w.createElement(
          Ht.Provider,
          { value: this.props.routeContext },
          w.createElement(Bg.Provider, { value: this.state.error, children: this.props.component }),
        )
      : this.props.children
  }
}
function Sw(e) {
  let { routeContext: t, match: n, children: r } = e,
    i = w.useContext(kc)
  return (
    i &&
      i.static &&
      i.staticContext &&
      (n.route.errorElement || n.route.ErrorBoundary) &&
      (i.staticContext._deepestRenderedBoundaryId = n.route.id),
    w.createElement(Ht.Provider, { value: t }, r)
  )
}
function Ew(e, t, n, r) {
  var i
  if (
    (t === void 0 && (t = []), n === void 0 && (n = null), r === void 0 && (r = null), e == null)
  ) {
    var s
    if (!n) return null
    if (n.errors) e = n.matches
    else if (
      (s = r) != null &&
      s.v7_partialHydration &&
      t.length === 0 &&
      !n.initialized &&
      n.matches.length > 0
    )
      e = n.matches
    else return null
  }
  let o = e,
    a = (i = n) == null ? void 0 : i.errors
  if (a != null) {
    let c = o.findIndex((f) => f.route.id && (a == null ? void 0 : a[f.route.id]) !== void 0)
    ;(c >= 0 || ae(!1), (o = o.slice(0, Math.min(o.length, c + 1))))
  }
  let l = !1,
    u = -1
  if (n && r && r.v7_partialHydration)
    for (let c = 0; c < o.length; c++) {
      let f = o[c]
      if (((f.route.HydrateFallback || f.route.hydrateFallbackElement) && (u = c), f.route.id)) {
        let { loaderData: d, errors: g } = n,
          v = f.route.loader && d[f.route.id] === void 0 && (!g || g[f.route.id] === void 0)
        if (f.route.lazy || v) {
          ;((l = !0), u >= 0 ? (o = o.slice(0, u + 1)) : (o = [o[0]]))
          break
        }
      }
    }
  return o.reduceRight((c, f, d) => {
    let g,
      v = !1,
      x = null,
      S = null
    n &&
      ((g = a && f.route.id ? a[f.route.id] : void 0),
      (x = f.route.errorElement || xw),
      l &&
        (u < 0 && d === 0
          ? (Aw('route-fallback'), (v = !0), (S = null))
          : u === d && ((v = !0), (S = f.route.hydrateFallbackElement || null))))
    let h = t.concat(o.slice(0, d + 1)),
      p = () => {
        let m
        return (
          g
            ? (m = x)
            : v
              ? (m = S)
              : f.route.Component
                ? (m = w.createElement(f.route.Component, null))
                : f.route.element
                  ? (m = f.route.element)
                  : (m = c),
          w.createElement(Sw, {
            match: f,
            routeContext: { outlet: c, matches: h, isDataRoute: n != null },
            children: m,
          })
        )
      }
    return n && (f.route.ErrorBoundary || f.route.errorElement || d === 0)
      ? w.createElement(ww, {
          location: n.location,
          revalidation: n.revalidation,
          component: x,
          error: g,
          children: p(),
          routeContext: { outlet: null, matches: h, isDataRoute: !0 },
        })
      : p()
  }, null)
}
var $g = (function (e) {
    return (
      (e.UseBlocker = 'useBlocker'),
      (e.UseRevalidator = 'useRevalidator'),
      (e.UseNavigateStable = 'useNavigate'),
      e
    )
  })($g || {}),
  Wg = (function (e) {
    return (
      (e.UseBlocker = 'useBlocker'),
      (e.UseLoaderData = 'useLoaderData'),
      (e.UseActionData = 'useActionData'),
      (e.UseRouteError = 'useRouteError'),
      (e.UseNavigation = 'useNavigation'),
      (e.UseRouteLoaderData = 'useRouteLoaderData'),
      (e.UseMatches = 'useMatches'),
      (e.UseRevalidator = 'useRevalidator'),
      (e.UseNavigateStable = 'useNavigate'),
      (e.UseRouteId = 'useRouteId'),
      e
    )
  })(Wg || {})
function Pw(e) {
  let t = w.useContext(kc)
  return (t || ae(!1), t)
}
function Cw(e) {
  let t = w.useContext(fw)
  return (t || ae(!1), t)
}
function kw(e) {
  let t = w.useContext(Ht)
  return (t || ae(!1), t)
}
function Hg(e) {
  let t = kw(),
    n = t.matches[t.matches.length - 1]
  return (n.route.id || ae(!1), n.route.id)
}
function Tw() {
  var e
  let t = w.useContext(Bg),
    n = Cw(),
    r = Hg()
  return t !== void 0 ? t : (e = n.errors) == null ? void 0 : e[r]
}
function Rw() {
  let { router: e } = Pw($g.UseNavigateStable),
    t = Hg(Wg.UseNavigateStable),
    n = w.useRef(!1)
  return (
    zg(() => {
      n.current = !0
    }),
    w.useCallback(
      function (i, s) {
        ;(s === void 0 && (s = {}),
          n.current &&
            (typeof i == 'number' ? e.navigate(i) : e.navigate(i, Bi({ fromRouteId: t }, s))))
      },
      [e, t],
    )
  )
}
const Md = {}
function Aw(e, t, n) {
  Md[e] || (Md[e] = !0)
}
function _w(e, t) {
  ;(e == null || e.v7_startTransition, e == null || e.v7_relativeSplatPath)
}
function bd(e) {
  let { to: t, replace: n, state: r, relative: i } = e
  Br() || ae(!1)
  let { future: s, static: o } = w.useContext(Sn),
    { matches: a } = w.useContext(Ht),
    { pathname: l } = En(),
    u = Tc(),
    c = Cc(t, Pc(a, s.v7_relativeSplatPath), l, i === 'path'),
    f = JSON.stringify(c)
  return (
    w.useEffect(() => u(JSON.parse(f), { replace: n, state: r, relative: i }), [u, f, i, n, r]),
    null
  )
}
function Kg(e) {
  return mw(e.context)
}
function me(e) {
  ae(!1)
}
function jw(e) {
  let {
    basename: t = '/',
    children: n = null,
    location: r,
    navigationType: i = rn.Pop,
    navigator: s,
    static: o = !1,
    future: a,
  } = e
  Br() && ae(!1)
  let l = t.replace(/^\/*/, '/'),
    u = w.useMemo(
      () => ({ basename: l, navigator: s, static: o, future: Bi({ v7_relativeSplatPath: !1 }, a) }),
      [l, a, s, o],
    )
  typeof r == 'string' && (r = Ir(r))
  let { pathname: c = '/', search: f = '', hash: d = '', state: g = null, key: v = 'default' } = r,
    x = w.useMemo(() => {
      let S = Ec(c, l)
      return S == null
        ? null
        : { location: { pathname: S, search: f, hash: d, state: g, key: v }, navigationType: i }
    }, [l, c, f, d, g, v, i])
  return x == null
    ? null
    : w.createElement(
        Sn.Provider,
        { value: u },
        w.createElement(Jo.Provider, { children: n, value: x }),
      )
}
function Ow(e) {
  let { children: t, location: n } = e
  return gw(Zl(t), n)
}
new Promise(() => {})
function Zl(e, t) {
  t === void 0 && (t = [])
  let n = []
  return (
    w.Children.forEach(e, (r, i) => {
      if (!w.isValidElement(r)) return
      let s = [...t, i]
      if (r.type === w.Fragment) {
        n.push.apply(n, Zl(r.props.children, s))
        return
      }
      ;(r.type !== me && ae(!1), !r.props.index || !r.props.children || ae(!1))
      let o = {
        id: r.props.id || s.join('-'),
        caseSensitive: r.props.caseSensitive,
        element: r.props.element,
        Component: r.props.Component,
        index: r.props.index,
        path: r.props.path,
        loader: r.props.loader,
        action: r.props.action,
        errorElement: r.props.errorElement,
        ErrorBoundary: r.props.ErrorBoundary,
        hasErrorBoundary: r.props.ErrorBoundary != null || r.props.errorElement != null,
        shouldRevalidate: r.props.shouldRevalidate,
        handle: r.props.handle,
        lazy: r.props.lazy,
      }
      ;(r.props.children && (o.children = Zl(r.props.children, s)), n.push(o))
    }),
    n
  )
}
/**
 * React Router DOM v6.30.4
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function eu() {
  return (
    (eu = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    eu.apply(null, arguments)
  )
}
function Lw(e, t) {
  if (e == null) return {}
  var n = {}
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r)) {
      if (t.indexOf(r) !== -1) continue
      n[r] = e[r]
    }
  return n
}
function Nw(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
}
function Dw(e, t) {
  return e.button === 0 && (!t || t === '_self') && !Nw(e)
}
function tu(e) {
  return (
    e === void 0 && (e = ''),
    new URLSearchParams(
      typeof e == 'string' || Array.isArray(e) || e instanceof URLSearchParams
        ? e
        : Object.keys(e).reduce((t, n) => {
            let r = e[n]
            return t.concat(Array.isArray(r) ? r.map((i) => [n, i]) : [[n, r]])
          }, []),
    )
  )
}
function Mw(e, t) {
  let n = tu(e)
  return (
    t &&
      t.forEach((r, i) => {
        n.has(i) ||
          t.getAll(i).forEach((s) => {
            n.append(i, s)
          })
      }),
    n
  )
}
const bw = [
    'onClick',
    'relative',
    'reloadDocument',
    'replace',
    'state',
    'target',
    'to',
    'preventScrollReset',
    'viewTransition',
  ],
  Fw = '6'
try {
  window.__reactRouterVersion = Fw
} catch {}
const Vw = 'startTransition',
  Fd = Tv[Vw]
function Iw(e) {
  let { basename: t, children: n, future: r, window: i } = e,
    s = w.useRef()
  s.current == null && (s.current = Vx({ window: i, v5Compat: !0 }))
  let o = s.current,
    [a, l] = w.useState({ action: o.action, location: o.location }),
    { v7_startTransition: u } = r || {},
    c = w.useCallback(
      (f) => {
        u && Fd ? Fd(() => l(f)) : l(f)
      },
      [l, u],
    )
  return (
    w.useLayoutEffect(() => o.listen(c), [o, c]),
    w.useEffect(() => _w(r), [r]),
    w.createElement(jw, {
      basename: t,
      children: n,
      location: a.location,
      navigationType: a.action,
      navigator: o,
      future: r,
    })
  )
}
const Bw =
    typeof window < 'u' &&
    typeof window.document < 'u' &&
    typeof window.document.createElement < 'u',
  zw = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  ve = w.forwardRef(function (t, n) {
    let {
        onClick: r,
        relative: i,
        reloadDocument: s,
        replace: o,
        state: a,
        target: l,
        to: u,
        preventScrollReset: c,
        viewTransition: f,
      } = t,
      d = Lw(t, bw),
      { basename: g } = w.useContext(Sn),
      v,
      x = !1
    if (typeof u == 'string' && zw.test(u) && ((v = u), Bw))
      try {
        let m = new URL(window.location.href),
          P = u.startsWith('//') ? new URL(m.protocol + u) : new URL(u),
          C = Ec(P.pathname, g)
        P.origin === m.origin && C != null ? (u = C + P.search + P.hash) : (x = !0)
      } catch {}
    let S = dw(u, { relative: i }),
      h = Uw(u, {
        replace: o,
        state: a,
        target: l,
        preventScrollReset: c,
        relative: i,
        viewTransition: f,
      })
    function p(m) {
      ;(r && r(m), m.defaultPrevented || h(m))
    }
    return w.createElement(
      'a',
      eu({}, d, { href: v || S, onClick: x || s ? r : p, ref: n, target: l }),
    )
  })
var Vd
;(function (e) {
  ;((e.UseScrollRestoration = 'useScrollRestoration'),
    (e.UseSubmit = 'useSubmit'),
    (e.UseSubmitFetcher = 'useSubmitFetcher'),
    (e.UseFetcher = 'useFetcher'),
    (e.useViewTransitionState = 'useViewTransitionState'))
})(Vd || (Vd = {}))
var Id
;(function (e) {
  ;((e.UseFetcher = 'useFetcher'),
    (e.UseFetchers = 'useFetchers'),
    (e.UseScrollRestoration = 'useScrollRestoration'))
})(Id || (Id = {}))
function Uw(e, t) {
  let {
      target: n,
      replace: r,
      state: i,
      preventScrollReset: s,
      relative: o,
      viewTransition: a,
    } = t === void 0 ? {} : t,
    l = Tc(),
    u = En(),
    c = Ug(e, { relative: o })
  return w.useCallback(
    (f) => {
      if (Dw(f, n)) {
        f.preventDefault()
        let d = r !== void 0 ? r : Eo(u) === Eo(c)
        l(e, { replace: d, state: i, preventScrollReset: s, relative: o, viewTransition: a })
      }
    },
    [u, l, c, r, i, n, e, s, o, a],
  )
}
function tA(e) {
  let t = w.useRef(tu(e)),
    n = w.useRef(!1),
    r = En(),
    i = w.useMemo(() => Mw(r.search, n.current ? null : t.current), [r.search]),
    s = Tc(),
    o = w.useCallback(
      (a, l) => {
        const u = tu(typeof a == 'function' ? a(i) : a)
        ;((n.current = !0), s('?' + u, l))
      },
      [s, i],
    )
  return [i, o]
}
const $w = 'modulepreload',
  Ww = function (e) {
    return '/' + e
  },
  Bd = {},
  Je = function (t, n, r) {
    let i = Promise.resolve()
    if (n && n.length > 0) {
      document.getElementsByTagName('link')
      const o = document.querySelector('meta[property=csp-nonce]'),
        a = (o == null ? void 0 : o.nonce) || (o == null ? void 0 : o.getAttribute('nonce'))
      i = Promise.allSettled(
        n.map((l) => {
          if (((l = Ww(l)), l in Bd)) return
          Bd[l] = !0
          const u = l.endsWith('.css'),
            c = u ? '[rel="stylesheet"]' : ''
          if (document.querySelector(`link[href="${l}"]${c}`)) return
          const f = document.createElement('link')
          if (
            ((f.rel = u ? 'stylesheet' : $w),
            u || (f.as = 'script'),
            (f.crossOrigin = ''),
            (f.href = l),
            a && f.setAttribute('nonce', a),
            document.head.appendChild(f),
            u)
          )
            return new Promise((d, g) => {
              ;(f.addEventListener('load', d),
                f.addEventListener('error', () => g(new Error(`Unable to preload CSS for ${l}`))))
            })
        }),
      )
    }
    function s(o) {
      const a = new Event('vite:preloadError', { cancelable: !0 })
      if (((a.payload = o), window.dispatchEvent(a), !a.defaultPrevented)) throw o
    }
    return i.then((o) => {
      for (const a of o || []) a.status === 'rejected' && s(a.reason)
      return t().catch(s)
    })
  }
let Hw = { data: '' },
  Kw = (e) => {
    if (typeof window == 'object') {
      let t =
        (e ? e.querySelector('#_goober') : window._goober) ||
        Object.assign(document.createElement('style'), { innerHTML: ' ', id: '_goober' })
      return (
        (t.nonce = window.__nonce__),
        t.parentNode || (e || document.head).appendChild(t),
        t.firstChild
      )
    }
    return e || Hw
  },
  qw = /(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,
  Gw = /\/\*[^]*?\*\/|  +/g,
  zd = /\n+/g,
  en = (e, t) => {
    let n = '',
      r = '',
      i = ''
    for (let s in e) {
      let o = e[s]
      s[0] == '@'
        ? s[1] == 'i'
          ? (n = s + ' ' + o + ';')
          : (r += s[1] == 'f' ? en(o, s) : s + '{' + en(o, s[1] == 'k' ? '' : t) + '}')
        : typeof o == 'object'
          ? (r += en(
              o,
              t
                ? t.replace(/([^,])+/g, (a) =>
                    s.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g, (l) =>
                      /&/.test(l) ? l.replace(/&/g, a) : a ? a + ' ' + l : l,
                    ),
                  )
                : s,
            ))
          : o != null &&
            ((s = s[1] == '-' ? s : s.replace(/[A-Z]/g, '-$&').toLowerCase()),
            (i += en.p ? en.p(s, o) : s + ':' + o + ';'))
    }
    return n + (t && i ? t + '{' + i + '}' : i) + r
  },
  Gt = {},
  qg = (e) => {
    if (typeof e == 'object') {
      let t = ''
      for (let n in e) t += n + qg(e[n])
      return t
    }
    return e
  },
  Xw = (e, t, n, r, i) => {
    let s = qg(e),
      o =
        Gt[s] ||
        (Gt[s] = ((l) => {
          let u = 0,
            c = 11
          for (; u < l.length;) c = (101 * c + l.charCodeAt(u++)) >>> 0
          return 'go' + c
        })(s))
    if (!Gt[o]) {
      let l =
        s !== e
          ? e
          : ((u) => {
              let c,
                f,
                d = [{}]
              for (; (c = qw.exec(u.replace(Gw, '')));)
                c[4]
                  ? d.shift()
                  : c[3]
                    ? ((f = c[3].replace(zd, ' ').trim()), d.unshift((d[0][f] = d[0][f] || {})))
                    : (d[0][c[1]] = c[2].replace(zd, ' ').trim())
              return d[0]
            })(e)
      Gt[o] = en(i ? { ['@keyframes ' + o]: l } : l, n ? '' : '.' + o)
    }
    let a = n && Gt.g
    return (
      n && (Gt.g = Gt[o]),
      ((l, u, c, f) => {
        f
          ? (u.data = u.data.replace(f, l))
          : u.data.indexOf(l) === -1 && (u.data = c ? l + u.data : u.data + l)
      })(Gt[o], t, r, a),
      o
    )
  },
  Qw = (e, t, n) =>
    e.reduce((r, i, s) => {
      let o = t[s]
      if (o && o.call) {
        let a = o(n),
          l = (a && a.props && a.props.className) || (/^go/.test(a) && a)
        o = l ? '.' + l : a && typeof a == 'object' ? (a.props ? '' : en(a, '')) : a === !1 ? '' : a
      }
      return r + i + (o ?? '')
    }, '')
function Zo(e) {
  let t = this || {},
    n = e.call ? e(t.p) : e
  return Xw(
    n.unshift
      ? n.raw
        ? Qw(n, [].slice.call(arguments, 1), t.p)
        : n.reduce((r, i) => Object.assign(r, i && i.call ? i(t.p) : i), {})
      : n,
    Kw(t.target),
    t.g,
    t.o,
    t.k,
  )
}
let Gg, nu, ru
Zo.bind({ g: 1 })
let Ut = Zo.bind({ k: 1 })
function Yw(e, t, n, r) {
  ;((en.p = t), (Gg = e), (nu = n), (ru = r))
}
function Pn(e, t) {
  let n = this || {}
  return function () {
    let r = arguments
    function i(s, o) {
      let a = Object.assign({}, s),
        l = a.className || i.className
      ;((n.p = Object.assign({ theme: nu && nu() }, a)),
        (n.o = /go\d/.test(l)),
        (a.className = Zo.apply(n, r) + (l ? ' ' + l : '')))
      let u = e
      return (e[0] && ((u = a.as || e), delete a.as), ru && u[0] && ru(a), Gg(u, a))
    }
    return i
  }
}
var Jw = (e) => typeof e == 'function',
  Po = (e, t) => (Jw(e) ? e(t) : e),
  Zw = (() => {
    let e = 0
    return () => (++e).toString()
  })(),
  Xg = (() => {
    let e
    return () => {
      if (e === void 0 && typeof window < 'u') {
        let t = matchMedia('(prefers-reduced-motion: reduce)')
        e = !t || t.matches
      }
      return e
    }
  })(),
  eS = 20,
  Rc = 'default',
  Qg = (e, t) => {
    let { toastLimit: n } = e.settings
    switch (t.type) {
      case 0:
        return { ...e, toasts: [t.toast, ...e.toasts].slice(0, n) }
      case 1:
        return {
          ...e,
          toasts: e.toasts.map((o) => (o.id === t.toast.id ? { ...o, ...t.toast } : o)),
        }
      case 2:
        let { toast: r } = t
        return Qg(e, { type: e.toasts.find((o) => o.id === r.id) ? 1 : 0, toast: r })
      case 3:
        let { toastId: i } = t
        return {
          ...e,
          toasts: e.toasts.map((o) =>
            o.id === i || i === void 0 ? { ...o, dismissed: !0, visible: !1 } : o,
          ),
        }
      case 4:
        return t.toastId === void 0
          ? { ...e, toasts: [] }
          : { ...e, toasts: e.toasts.filter((o) => o.id !== t.toastId) }
      case 5:
        return { ...e, pausedAt: t.time }
      case 6:
        let s = t.time - (e.pausedAt || 0)
        return {
          ...e,
          pausedAt: void 0,
          toasts: e.toasts.map((o) => ({ ...o, pauseDuration: o.pauseDuration + s })),
        }
    }
  },
  Ws = [],
  Yg = { toasts: [], pausedAt: void 0, settings: { toastLimit: eS } },
  Pt = {},
  Jg = (e, t = Rc) => {
    ;((Pt[t] = Qg(Pt[t] || Yg, e)),
      Ws.forEach(([n, r]) => {
        n === t && r(Pt[t])
      }))
  },
  Zg = (e) => Object.keys(Pt).forEach((t) => Jg(e, t)),
  tS = (e) => Object.keys(Pt).find((t) => Pt[t].toasts.some((n) => n.id === e)),
  ea =
    (e = Rc) =>
    (t) => {
      Jg(t, e)
    },
  nS = { blank: 4e3, error: 4e3, success: 2e3, loading: 1 / 0, custom: 4e3 },
  rS = (e = {}, t = Rc) => {
    let [n, r] = w.useState(Pt[t] || Yg),
      i = w.useRef(Pt[t])
    w.useEffect(
      () => (
        i.current !== Pt[t] && r(Pt[t]),
        Ws.push([t, r]),
        () => {
          let o = Ws.findIndex(([a]) => a === t)
          o > -1 && Ws.splice(o, 1)
        }
      ),
      [t],
    )
    let s = n.toasts.map((o) => {
      var a, l, u
      return {
        ...e,
        ...e[o.type],
        ...o,
        removeDelay:
          o.removeDelay ||
          ((a = e[o.type]) == null ? void 0 : a.removeDelay) ||
          (e == null ? void 0 : e.removeDelay),
        duration:
          o.duration ||
          ((l = e[o.type]) == null ? void 0 : l.duration) ||
          (e == null ? void 0 : e.duration) ||
          nS[o.type],
        style: { ...e.style, ...((u = e[o.type]) == null ? void 0 : u.style), ...o.style },
      }
    })
    return { ...n, toasts: s }
  },
  iS = (e, t = 'blank', n) => ({
    createdAt: Date.now(),
    visible: !0,
    dismissed: !1,
    type: t,
    ariaProps: { role: 'status', 'aria-live': 'polite' },
    message: e,
    pauseDuration: 0,
    ...n,
    id: (n == null ? void 0 : n.id) || Zw(),
  }),
  Ji = (e) => (t, n) => {
    let r = iS(t, e, n)
    return (ea(r.toasterId || tS(r.id))({ type: 2, toast: r }), r.id)
  },
  ce = (e, t) => Ji('blank')(e, t)
ce.error = Ji('error')
ce.success = Ji('success')
ce.loading = Ji('loading')
ce.custom = Ji('custom')
ce.dismiss = (e, t) => {
  let n = { type: 3, toastId: e }
  t ? ea(t)(n) : Zg(n)
}
ce.dismissAll = (e) => ce.dismiss(void 0, e)
ce.remove = (e, t) => {
  let n = { type: 4, toastId: e }
  t ? ea(t)(n) : Zg(n)
}
ce.removeAll = (e) => ce.remove(void 0, e)
ce.promise = (e, t, n) => {
  let r = ce.loading(t.loading, { ...n, ...(n == null ? void 0 : n.loading) })
  return (
    typeof e == 'function' && (e = e()),
    e
      .then((i) => {
        let s = t.success ? Po(t.success, i) : void 0
        return (
          s ? ce.success(s, { id: r, ...n, ...(n == null ? void 0 : n.success) }) : ce.dismiss(r),
          i
        )
      })
      .catch((i) => {
        let s = t.error ? Po(t.error, i) : void 0
        s ? ce.error(s, { id: r, ...n, ...(n == null ? void 0 : n.error) }) : ce.dismiss(r)
      }),
    e
  )
}
var sS = 1e3,
  oS = (e, t = 'default') => {
    let { toasts: n, pausedAt: r } = rS(e, t),
      i = w.useRef(new Map()).current,
      s = w.useCallback((f, d = sS) => {
        if (i.has(f)) return
        let g = setTimeout(() => {
          ;(i.delete(f), o({ type: 4, toastId: f }))
        }, d)
        i.set(f, g)
      }, [])
    w.useEffect(() => {
      if (r) return
      let f = Date.now(),
        d = n.map((g) => {
          if (g.duration === 1 / 0) return
          let v = (g.duration || 0) + g.pauseDuration - (f - g.createdAt)
          if (v < 0) {
            g.visible && ce.dismiss(g.id)
            return
          }
          return setTimeout(() => ce.dismiss(g.id, t), v)
        })
      return () => {
        d.forEach((g) => g && clearTimeout(g))
      }
    }, [n, r, t])
    let o = w.useCallback(ea(t), [t]),
      a = w.useCallback(() => {
        o({ type: 5, time: Date.now() })
      }, [o]),
      l = w.useCallback(
        (f, d) => {
          o({ type: 1, toast: { id: f, height: d } })
        },
        [o],
      ),
      u = w.useCallback(() => {
        r && o({ type: 6, time: Date.now() })
      }, [r, o]),
      c = w.useCallback(
        (f, d) => {
          let { reverseOrder: g = !1, gutter: v = 8, defaultPosition: x } = d || {},
            S = n.filter((m) => (m.position || x) === (f.position || x) && m.height),
            h = S.findIndex((m) => m.id === f.id),
            p = S.filter((m, P) => P < h && m.visible).length
          return S.filter((m) => m.visible)
            .slice(...(g ? [p + 1] : [0, p]))
            .reduce((m, P) => m + (P.height || 0) + v, 0)
        },
        [n],
      )
    return (
      w.useEffect(() => {
        n.forEach((f) => {
          if (f.dismissed) s(f.id, f.removeDelay)
          else {
            let d = i.get(f.id)
            d && (clearTimeout(d), i.delete(f.id))
          }
        })
      }, [n, s]),
      { toasts: n, handlers: { updateHeight: l, startPause: a, endPause: u, calculateOffset: c } }
    )
  },
  aS = Ut`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,
  lS = Ut`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,
  uS = Ut`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,
  cS = Pn('div')`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${(e) => e.primary || '#ff4b4b'};
  position: relative;
  transform: rotate(45deg);

  animation: ${aS} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${lS} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${(e) => e.secondary || '#fff'};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${uS} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,
  fS = Ut`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,
  dS = Pn('div')`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${(e) => e.secondary || '#e0e0e0'};
  border-right-color: ${(e) => e.primary || '#616161'};
  animation: ${fS} 1s linear infinite;
`,
  hS = Ut`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,
  pS = Ut`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,
  mS = Pn('div')`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${(e) => e.primary || '#61d345'};
  position: relative;
  transform: rotate(45deg);

  animation: ${hS} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${pS} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${(e) => e.secondary || '#fff'};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,
  gS = Pn('div')`
  position: absolute;
`,
  yS = Pn('div')`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,
  vS = Ut`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,
  xS = Pn('div')`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${vS} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,
  wS = ({ toast: e }) => {
    let { icon: t, type: n, iconTheme: r } = e
    return t !== void 0
      ? typeof t == 'string'
        ? w.createElement(xS, null, t)
        : t
      : n === 'blank'
        ? null
        : w.createElement(
            yS,
            null,
            w.createElement(dS, { ...r }),
            n !== 'loading' &&
              w.createElement(
                gS,
                null,
                n === 'error' ? w.createElement(cS, { ...r }) : w.createElement(mS, { ...r }),
              ),
          )
  },
  SS = (e) => `
0% {transform: translate3d(0,${e * -200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,
  ES = (e) => `
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e * -150}%,-1px) scale(.6); opacity:0;}
`,
  PS = '0%{opacity:0;} 100%{opacity:1;}',
  CS = '0%{opacity:1;} 100%{opacity:0;}',
  kS = Pn('div')`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,
  TS = Pn('div')`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,
  RS = (e, t) => {
    let n = e.includes('top') ? 1 : -1,
      [r, i] = Xg() ? [PS, CS] : [SS(n), ES(n)]
    return {
      animation: t
        ? `${Ut(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`
        : `${Ut(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`,
    }
  },
  AS = w.memo(({ toast: e, position: t, style: n, children: r }) => {
    let i = e.height ? RS(e.position || t || 'top-center', e.visible) : { opacity: 0 },
      s = w.createElement(wS, { toast: e }),
      o = w.createElement(TS, { ...e.ariaProps }, Po(e.message, e))
    return w.createElement(
      kS,
      { className: e.className, style: { ...i, ...n, ...e.style } },
      typeof r == 'function' ? r({ icon: s, message: o }) : w.createElement(w.Fragment, null, s, o),
    )
  })
Yw(w.createElement)
var _S = ({ id: e, className: t, style: n, onHeightUpdate: r, children: i }) => {
    let s = w.useCallback(
      (o) => {
        if (o) {
          let a = () => {
            let l = o.getBoundingClientRect().height
            r(e, l)
          }
          ;(a(),
            new MutationObserver(a).observe(o, { subtree: !0, childList: !0, characterData: !0 }))
        }
      },
      [e, r],
    )
    return w.createElement('div', { ref: s, className: t, style: n }, i)
  },
  jS = (e, t) => {
    let n = e.includes('top'),
      r = n ? { top: 0 } : { bottom: 0 },
      i = e.includes('center')
        ? { justifyContent: 'center' }
        : e.includes('right')
          ? { justifyContent: 'flex-end' }
          : {}
    return {
      left: 0,
      right: 0,
      display: 'flex',
      position: 'absolute',
      transition: Xg() ? void 0 : 'all 230ms cubic-bezier(.21,1.02,.73,1)',
      transform: `translateY(${t * (n ? 1 : -1)}px)`,
      ...r,
      ...i,
    }
  },
  OS = Zo`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,
  ks = 16,
  LS = ({
    reverseOrder: e,
    position: t = 'top-center',
    toastOptions: n,
    gutter: r,
    children: i,
    toasterId: s,
    containerStyle: o,
    containerClassName: a,
  }) => {
    let { toasts: l, handlers: u } = oS(n, s)
    return w.createElement(
      'div',
      {
        'data-rht-toaster': s || '',
        style: {
          position: 'fixed',
          zIndex: 9999,
          top: ks,
          left: ks,
          right: ks,
          bottom: ks,
          pointerEvents: 'none',
          ...o,
        },
        className: a,
        onMouseEnter: u.startPause,
        onMouseLeave: u.endPause,
      },
      l.map((c) => {
        let f = c.position || t,
          d = u.calculateOffset(c, { reverseOrder: e, gutter: r, defaultPosition: t }),
          g = jS(f, d)
        return w.createElement(
          _S,
          {
            id: c.id,
            key: c.id,
            onHeightUpdate: u.updateHeight,
            className: c.visible ? OS : '',
            style: g,
          },
          c.type === 'custom'
            ? Po(c.message, c)
            : i
              ? i(c)
              : w.createElement(AS, { toast: c, position: f }),
        )
      }),
    )
  },
  NS = ce,
  ey = { color: void 0, size: void 0, className: void 0, style: void 0, attr: void 0 },
  Ud = Dt.createContext && Dt.createContext(ey),
  DS = ['attr', 'size', 'title']
function MS(e, t) {
  if (e == null) return {}
  var n,
    r,
    i = bS(e, t)
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(e)
    for (r = 0; r < s.length; r++)
      ((n = s[r]), t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]))
  }
  return i
}
function bS(e, t) {
  if (e == null) return {}
  var n = {}
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r)) {
      if (t.indexOf(r) !== -1) continue
      n[r] = e[r]
    }
  return n
}
function Co() {
  return (
    (Co = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    Co.apply(null, arguments)
  )
}
function $d(e, t) {
  var n = Object.keys(e)
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e)
    ;(t &&
      (r = r.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable
      })),
      n.push.apply(n, r))
  }
  return n
}
function ko(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {}
    t % 2
      ? $d(Object(n), !0).forEach(function (r) {
          FS(e, r, n[r])
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
        : $d(Object(n)).forEach(function (r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r))
          })
  }
  return e
}
function FS(e, t, n) {
  return (
    (t = VS(t)) in e
      ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = n),
    e
  )
}
function VS(e) {
  var t = IS(e, 'string')
  return typeof t == 'symbol' ? t : t + ''
}
function IS(e, t) {
  if (typeof e != 'object' || !e) return e
  var n = e[Symbol.toPrimitive]
  if (n !== void 0) {
    var r = n.call(e, t)
    if (typeof r != 'object') return r
    throw new TypeError('@@toPrimitive must return a primitive value.')
  }
  return (t === 'string' ? String : Number)(e)
}
function ty(e) {
  return e && e.map((t, n) => Dt.createElement(t.tag, ko({ key: n }, t.attr), ty(t.child)))
}
function U(e) {
  return (t) => Dt.createElement(BS, Co({ attr: ko({}, e.attr) }, t), ty(e.child))
}
function BS(e) {
  var t = (n) => {
    var r = e.attr,
      i = e.size,
      s = e.title,
      o = MS(e, DS),
      a = i || n.size || '1em',
      l
    return (
      n.className && (l = n.className),
      e.className && (l = (l ? l + ' ' : '') + e.className),
      Dt.createElement(
        'svg',
        Co({ stroke: 'currentColor', fill: 'currentColor', strokeWidth: '0' }, n.attr, r, o, {
          className: l,
          style: ko(ko({ color: e.color || n.color }, n.style), e.style),
          height: a,
          width: a,
          xmlns: 'http://www.w3.org/2000/svg',
        }),
        s && Dt.createElement('title', null, s),
        e.children,
      )
    )
  }
  return Ud !== void 0 ? Dt.createElement(Ud.Consumer, null, (n) => t(n)) : t(ey)
}
function ny(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      { tag: 'line', attr: { x1: '18', y1: '6', x2: '6', y2: '18' }, child: [] },
      { tag: 'line', attr: { x1: '6', y1: '6', x2: '18', y2: '18' }, child: [] },
    ],
  })(e)
}
function zS(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      { tag: 'path', attr: { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' }, child: [] },
      { tag: 'circle', attr: { cx: '9', cy: '7', r: '4' }, child: [] },
      { tag: 'path', attr: { d: 'M23 21v-2a4 4 0 0 0-3-3.87' }, child: [] },
      { tag: 'path', attr: { d: 'M16 3.13a4 4 0 0 1 0 7.75' }, child: [] },
    ],
  })(e)
}
function US(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      { tag: 'path', attr: { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }, child: [] },
      { tag: 'circle', attr: { cx: '12', cy: '7', r: '4' }, child: [] },
    ],
  })(e)
}
function nA(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      {
        tag: 'rect',
        attr: { x: '3', y: '11', width: '18', height: '11', rx: '2', ry: '2' },
        child: [],
      },
      { tag: 'path', attr: { d: 'M7 11V7a5 5 0 0 1 9.9-1' }, child: [] },
    ],
  })(e)
}
function rA(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      { tag: 'rect', attr: { x: '1', y: '3', width: '15', height: '13' }, child: [] },
      { tag: 'polygon', attr: { points: '16 8 20 8 23 11 23 16 16 16 16 8' }, child: [] },
      { tag: 'circle', attr: { cx: '5.5', cy: '18.5', r: '2.5' }, child: [] },
      { tag: 'circle', attr: { cx: '18.5', cy: '18.5', r: '2.5' }, child: [] },
    ],
  })(e)
}
function iA(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      { tag: 'polyline', attr: { points: '3 6 5 6 21 6' }, child: [] },
      {
        tag: 'path',
        attr: {
          d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
        },
        child: [],
      },
      { tag: 'line', attr: { x1: '10', y1: '11', x2: '10', y2: '17' }, child: [] },
      { tag: 'line', attr: { x1: '14', y1: '11', x2: '14', y2: '17' }, child: [] },
    ],
  })(e)
}
function iu(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      { tag: 'circle', attr: { cx: '9', cy: '21', r: '1' }, child: [] },
      { tag: 'circle', attr: { cx: '20', cy: '21', r: '1' }, child: [] },
      {
        tag: 'path',
        attr: { d: 'M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6' },
        child: [],
      },
    ],
  })(e)
}
function sA(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      { tag: 'path', attr: { d: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' }, child: [] },
      { tag: 'line', attr: { x1: '3', y1: '6', x2: '21', y2: '6' }, child: [] },
      { tag: 'path', attr: { d: 'M16 10a4 4 0 0 1-8 0' }, child: [] },
    ],
  })(e)
}
function oA(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      { tag: 'polyline', attr: { points: '23 4 23 10 17 10' }, child: [] },
      { tag: 'polyline', attr: { points: '1 20 1 14 7 14' }, child: [] },
      {
        tag: 'path',
        attr: { d: 'M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15' },
        child: [],
      },
    ],
  })(e)
}
function aA(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      { tag: 'line', attr: { x1: '12', y1: '5', x2: '12', y2: '19' }, child: [] },
      { tag: 'line', attr: { x1: '5', y1: '12', x2: '19', y2: '12' }, child: [] },
    ],
  })(e)
}
function $S(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      {
        tag: 'path',
        attr: {
          d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
        },
        child: [],
      },
    ],
  })(e)
}
function lA(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [{ tag: 'line', attr: { x1: '5', y1: '12', x2: '19', y2: '12' }, child: [] }],
  })(e)
}
function uA(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      {
        tag: 'path',
        attr: {
          d: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
        },
        child: [],
      },
    ],
  })(e)
}
function ry(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      { tag: 'line', attr: { x1: '3', y1: '12', x2: '21', y2: '12' }, child: [] },
      { tag: 'line', attr: { x1: '3', y1: '6', x2: '21', y2: '6' }, child: [] },
      { tag: 'line', attr: { x1: '3', y1: '18', x2: '21', y2: '18' }, child: [] },
    ],
  })(e)
}
function cA(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      { tag: 'path', attr: { d: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' }, child: [] },
      { tag: 'circle', attr: { cx: '12', cy: '10', r: '3' }, child: [] },
    ],
  })(e)
}
function iy(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      { tag: 'path', attr: { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }, child: [] },
      { tag: 'polyline', attr: { points: '16 17 21 12 16 7' }, child: [] },
      { tag: 'line', attr: { x1: '21', y1: '12', x2: '9', y2: '12' }, child: [] },
    ],
  })(e)
}
function fA(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      {
        tag: 'rect',
        attr: { x: '3', y: '11', width: '18', height: '11', rx: '2', ry: '2' },
        child: [],
      },
      { tag: 'path', attr: { d: 'M7 11V7a5 5 0 0 1 10 0v4' }, child: [] },
    ],
  })(e)
}
function WS(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      {
        tag: 'rect',
        attr: { x: '2', y: '2', width: '20', height: '20', rx: '5', ry: '5' },
        child: [],
      },
      { tag: 'path', attr: { d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' }, child: [] },
      { tag: 'line', attr: { x1: '17.5', y1: '6.5', x2: '17.51', y2: '6.5' }, child: [] },
    ],
  })(e)
}
function HS(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      { tag: 'path', attr: { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }, child: [] },
      { tag: 'polyline', attr: { points: '9 22 9 12 15 12 15 22' }, child: [] },
    ],
  })(e)
}
function KS(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      { tag: 'rect', attr: { x: '3', y: '3', width: '7', height: '7' }, child: [] },
      { tag: 'rect', attr: { x: '14', y: '3', width: '7', height: '7' }, child: [] },
      { tag: 'rect', attr: { x: '14', y: '14', width: '7', height: '7' }, child: [] },
      { tag: 'rect', attr: { x: '3', y: '14', width: '7', height: '7' }, child: [] },
    ],
  })(e)
}
function qS(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      {
        tag: 'path',
        attr: { d: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
        child: [],
      },
    ],
  })(e)
}
function GS(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      {
        tag: 'path',
        attr: { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' },
        child: [],
      },
      { tag: 'polyline', attr: { points: '15 3 21 3 21 9' }, child: [] },
      { tag: 'line', attr: { x1: '10', y1: '14', x2: '21', y2: '3' }, child: [] },
    ],
  })(e)
}
function dA(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      {
        tag: 'path',
        attr: { d: 'M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z' },
        child: [],
      },
    ],
  })(e)
}
function hA(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      { tag: 'line', attr: { x1: '12', y1: '1', x2: '12', y2: '23' }, child: [] },
      { tag: 'path', attr: { d: 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' }, child: [] },
    ],
  })(e)
}
function pA(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      {
        tag: 'rect',
        attr: { x: '9', y: '9', width: '13', height: '13', rx: '2', ry: '2' },
        child: [],
      },
      {
        tag: 'path',
        attr: { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' },
        child: [],
      },
    ],
  })(e)
}
function XS(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      { tag: 'path', attr: { d: 'M18 8h1a4 4 0 0 1 0 8h-1' }, child: [] },
      { tag: 'path', attr: { d: 'M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z' }, child: [] },
      { tag: 'line', attr: { x1: '6', y1: '1', x2: '6', y2: '4' }, child: [] },
      { tag: 'line', attr: { x1: '10', y1: '1', x2: '10', y2: '4' }, child: [] },
      { tag: 'line', attr: { x1: '14', y1: '1', x2: '14', y2: '4' }, child: [] },
    ],
  })(e)
}
function mA(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      { tag: 'circle', attr: { cx: '12', cy: '12', r: '10' }, child: [] },
      { tag: 'polyline', attr: { points: '12 6 12 12 16 14' }, child: [] },
    ],
  })(e)
}
function QS(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      {
        tag: 'path',
        attr: { d: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2' },
        child: [],
      },
      {
        tag: 'rect',
        attr: { x: '8', y: '2', width: '8', height: '4', rx: '1', ry: '1' },
        child: [],
      },
    ],
  })(e)
}
function gA(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [{ tag: 'polyline', attr: { points: '20 6 9 17 4 12' }, child: [] }],
  })(e)
}
function Wd(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      {
        tag: 'rect',
        attr: { x: '3', y: '4', width: '18', height: '18', rx: '2', ry: '2' },
        child: [],
      },
      { tag: 'line', attr: { x1: '16', y1: '2', x2: '16', y2: '6' }, child: [] },
      { tag: 'line', attr: { x1: '8', y1: '2', x2: '8', y2: '6' }, child: [] },
      { tag: 'line', attr: { x1: '3', y1: '10', x2: '21', y2: '10' }, child: [] },
    ],
  })(e)
}
function YS(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      { tag: 'line', attr: { x1: '18', y1: '20', x2: '18', y2: '10' }, child: [] },
      { tag: 'line', attr: { x1: '12', y1: '20', x2: '12', y2: '4' }, child: [] },
      { tag: 'line', attr: { x1: '6', y1: '20', x2: '6', y2: '14' }, child: [] },
    ],
  })(e)
}
function JS(e) {
  return U({
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    child: [
      { tag: 'line', attr: { x1: '5', y1: '12', x2: '19', y2: '12' }, child: [] },
      { tag: 'polyline', attr: { points: '12 5 19 12 12 19' }, child: [] },
    ],
  })(e)
}
const sy = w.createContext(null),
  ZS = { centro: 3e3, periurbano: 5e3, lejano: 8e3 }
function eE({ children: e }) {
  const [t, n] = w.useState(() => {
      const p = localStorage.getItem('hostal-cofee-cart')
      return p ? JSON.parse(p) : []
    }),
    [r, i] = w.useState(() => localStorage.getItem('hostal-cofee-orderType') || 'tienda'),
    [s, o] = w.useState(() => localStorage.getItem('hostal-cofee-deliveryZone') || null),
    a = w.useCallback((p) => {
      ;(o(p),
        p
          ? localStorage.setItem('hostal-cofee-deliveryZone', p)
          : localStorage.removeItem('hostal-cofee-deliveryZone'))
    }, []),
    l = w.useCallback((p) => {
      ;(n(p), localStorage.setItem('hostal-cofee-cart', JSON.stringify(p)))
    }, []),
    u = w.useCallback((p) => {
      ;(n((m) => {
        const P = m.find((k) => k.menuItem.id === p.id)
        let C
        return (
          P
            ? (C = m.map((k) => (k.menuItem.id === p.id ? { ...k, quantity: k.quantity + 1 } : k)))
            : (C = [...m, { menuItem: p, quantity: 1 }]),
          localStorage.setItem('hostal-cofee-cart', JSON.stringify(C)),
          C
        )
      }),
        NS.success(`${p.name} añadido al carrito`))
    }, []),
    c = w.useCallback((p) => {
      n((m) => {
        const P = m.filter((C) => C.menuItem.id !== p)
        return (localStorage.setItem('hostal-cofee-cart', JSON.stringify(P)), P)
      })
    }, []),
    f = w.useCallback(
      (p, m) => {
        if (m <= 0) {
          c(p)
          return
        }
        n((P) => {
          const C = P.map((k) => (k.menuItem.id === p ? { ...k, quantity: m } : k))
          return (localStorage.setItem('hostal-cofee-cart', JSON.stringify(C)), C)
        })
      },
      [c],
    ),
    d = w.useCallback(() => {
      ;(l([]),
        localStorage.removeItem('hostal-cofee-orderType'),
        localStorage.removeItem('hostal-cofee-deliveryZone'),
        i('tienda'),
        o(null))
    }, [l]),
    g = t.reduce((p, m) => p + m.menuItem.price * m.quantity, 0),
    v = t.reduce((p, m) => p + m.quantity, 0),
    x = r === 'domicilio' && s ? ZS[s] : 0,
    S = parseFloat((g + x).toFixed(2)),
    h = w.useCallback((p) => {
      ;(i(p), localStorage.setItem('hostal-cofee-orderType', p))
    }, [])
  return y.jsx(sy.Provider, {
    value: {
      items: t,
      addItem: u,
      removeItem: c,
      updateQuantity: f,
      clearCart: d,
      total: g,
      itemCount: v,
      orderType: r,
      setOrderType: h,
      deliveryZone: s,
      setDeliveryZone: a,
      deliveryFee: x,
      grandTotal: S,
    },
    children: e,
  })
}
function tE() {
  const e = w.useContext(sy)
  if (!e) throw new Error('useCart must be used within CartProvider')
  return e
}
function oy(e, t) {
  return function () {
    return e.apply(t, arguments)
  }
}
const { toString: nE } = Object.prototype,
  { getPrototypeOf: Or } = Object,
  { iterator: Zi, toStringTag: ay } = Symbol,
  To = (
    ({ hasOwnProperty: e }) =>
    (t, n) =>
      e.call(t, n)
  )(Object.prototype),
  zi = (e, t) => {
    let n = e
    const r = []
    for (; n != null && n !== Object.prototype;) {
      if (r.indexOf(n) !== -1) return !1
      if ((r.push(n), To(n, t))) return !0
      n = Or(n)
    }
    return !1
  },
  rE = (e, t) => (e != null && zi(e, t) ? e[t] : void 0),
  Ac = ((e) => (t) => {
    const n = nE.call(t)
    return e[n] || (e[n] = n.slice(8, -1).toLowerCase())
  })(Object.create(null)),
  gt = (e) => ((e = e.toLowerCase()), (t) => Ac(t) === e),
  ta = (e) => (t) => typeof t === e,
  { isArray: qn } = Array,
  Lr = ta('undefined')
function zr(e) {
  return (
    e !== null &&
    !Lr(e) &&
    e.constructor !== null &&
    !Lr(e.constructor) &&
    Be(e.constructor.isBuffer) &&
    e.constructor.isBuffer(e)
  )
}
const ly = gt('ArrayBuffer')
function iE(e) {
  let t
  return (
    typeof ArrayBuffer < 'u' && ArrayBuffer.isView
      ? (t = ArrayBuffer.isView(e))
      : (t = e && e.buffer && ly(e.buffer)),
    t
  )
}
const sE = ta('string'),
  Be = ta('function'),
  uy = ta('number'),
  Ur = (e) => e !== null && typeof e == 'object',
  oE = (e) => e === !0 || e === !1,
  Hs = (e) => {
    if (!Ur(e)) return !1
    const t = Or(e)
    return (t === null || t === Object.prototype || Or(t) === null) && !zi(e, ay) && !zi(e, Zi)
  },
  aE = (e) => {
    if (!Ur(e) || zr(e)) return !1
    try {
      return Object.keys(e).length === 0 && Object.getPrototypeOf(e) === Object.prototype
    } catch {
      return !1
    }
  },
  lE = gt('Date'),
  uE = gt('File'),
  cE = (e) => !!(e && typeof e.uri < 'u'),
  fE = (e) => e && typeof e.getParts < 'u',
  dE = gt('Blob'),
  hE = gt('FileList'),
  pE = (e) => Ur(e) && Be(e.pipe)
function mE() {
  return typeof globalThis < 'u'
    ? globalThis
    : typeof self < 'u'
      ? self
      : typeof window < 'u'
        ? window
        : typeof global < 'u'
          ? global
          : {}
}
const Hd = mE(),
  Kd = typeof Hd.FormData < 'u' ? Hd.FormData : void 0,
  gE = (e) => {
    if (!e) return !1
    if (Kd && e instanceof Kd) return !0
    const t = Or(e)
    if (!t || t === Object.prototype || !Be(e.append)) return !1
    const n = Ac(e)
    return (
      n === 'formdata' || (n === 'object' && Be(e.toString) && e.toString() === '[object FormData]')
    )
  },
  yE = gt('URLSearchParams'),
  [vE, xE, wE, SE] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(gt),
  EE = (e) => (e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''))
function es(e, t, { allOwnKeys: n = !1 } = {}) {
  if (e === null || typeof e > 'u') return
  let r, i
  if ((typeof e != 'object' && (e = [e]), qn(e)))
    for (r = 0, i = e.length; r < i; r++) t.call(null, e[r], r, e)
  else {
    if (zr(e)) return
    const s = n ? Object.getOwnPropertyNames(e) : Object.keys(e),
      o = s.length
    let a
    for (r = 0; r < o; r++) ((a = s[r]), t.call(null, e[a], a, e))
  }
}
function cy(e, t) {
  if (zr(e)) return null
  t = t.toLowerCase()
  const n = Object.keys(e)
  let r = n.length,
    i
  for (; r-- > 0;) if (((i = n[r]), t === i.toLowerCase())) return i
  return null
}
const Mn =
    typeof globalThis < 'u'
      ? globalThis
      : typeof self < 'u'
        ? self
        : typeof window < 'u'
          ? window
          : global,
  fy = (e) => !Lr(e) && e !== Mn
function su(...e) {
  const { caseless: t, skipUndefined: n } = (fy(this) && this) || {},
    r = {},
    i = (s, o) => {
      if (o === '__proto__' || o === 'constructor' || o === 'prototype') return
      const a = (t && typeof o == 'string' && cy(r, o)) || o,
        l = To(r, a) ? r[a] : void 0
      Hs(l) && Hs(s)
        ? (r[a] = su(l, s))
        : Hs(s)
          ? (r[a] = su({}, s))
          : qn(s)
            ? (r[a] = s.slice())
            : (!n || !Lr(s)) && (r[a] = s)
    }
  for (let s = 0, o = e.length; s < o; s++) {
    const a = e[s]
    if (!a || zr(a) || (es(a, i), typeof a != 'object' || qn(a))) continue
    const l = Object.getOwnPropertySymbols(a)
    for (let u = 0; u < l.length; u++) {
      const c = l[u]
      DE.call(a, c) && i(a[c], c)
    }
  }
  return r
}
const PE = (e, t, n, { allOwnKeys: r } = {}) => (
    es(
      t,
      (i, s) => {
        n && Be(i)
          ? Object.defineProperty(e, s, {
              __proto__: null,
              value: oy(i, n),
              writable: !0,
              enumerable: !0,
              configurable: !0,
            })
          : Object.defineProperty(e, s, {
              __proto__: null,
              value: i,
              writable: !0,
              enumerable: !0,
              configurable: !0,
            })
      },
      { allOwnKeys: r },
    ),
    e
  ),
  CE = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e),
  kE = (e, t, n, r) => {
    ;((e.prototype = Object.create(t.prototype, r)),
      Object.defineProperty(e.prototype, 'constructor', {
        __proto__: null,
        value: e,
        writable: !0,
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e, 'super', { __proto__: null, value: t.prototype }),
      n && Object.assign(e.prototype, n))
  },
  TE = (e, t, n, r) => {
    let i, s, o
    const a = {}
    if (((t = t || {}), e == null)) return t
    do {
      for (i = Object.getOwnPropertyNames(e), s = i.length; s-- > 0;)
        ((o = i[s]), (!r || r(o, e, t)) && !a[o] && ((t[o] = e[o]), (a[o] = !0)))
      e = n !== !1 && Or(e)
    } while (e && (!n || n(e, t)) && e !== Object.prototype)
    return t
  },
  RE = (e, t, n) => {
    ;((e = String(e)), (n === void 0 || n > e.length) && (n = e.length), (n -= t.length))
    const r = e.indexOf(t, n)
    return r !== -1 && r === n
  },
  AE = (e) => {
    if (!e) return null
    if (qn(e)) return e
    let t = e.length
    if (!uy(t)) return null
    const n = new Array(t)
    for (; t-- > 0;) n[t] = e[t]
    return n
  },
  _E = (
    (e) => (t) =>
      e && t instanceof e
  )(typeof Uint8Array < 'u' && Or(Uint8Array)),
  jE = (e, t) => {
    const r = (e && e[Zi]).call(e)
    let i
    for (; (i = r.next()) && !i.done;) {
      const s = i.value
      t.call(e, s[0], s[1])
    }
  },
  OE = (e, t) => {
    let n
    const r = []
    for (; (n = e.exec(t)) !== null;) r.push(n)
    return r
  },
  LE = gt('HTMLFormElement'),
  NE = (e) =>
    e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function (n, r, i) {
      return r.toUpperCase() + i
    }),
  { propertyIsEnumerable: DE } = Object.prototype,
  ME = gt('RegExp'),
  dy = (e, t) => {
    const n = Object.getOwnPropertyDescriptors(e),
      r = {}
    ;(es(n, (i, s) => {
      let o
      ;(o = t(i, s, e)) !== !1 && (r[s] = o || i)
    }),
      Object.defineProperties(e, r))
  },
  bE = (e) => {
    dy(e, (t, n) => {
      if (Be(e) && ['arguments', 'caller', 'callee'].includes(n)) return !1
      const r = e[n]
      if (Be(r)) {
        if (((t.enumerable = !1), 'writable' in t)) {
          t.writable = !1
          return
        }
        t.set ||
          (t.set = () => {
            throw Error("Can not rewrite read-only method '" + n + "'")
          })
      }
    })
  },
  FE = (e, t) => {
    const n = {},
      r = (i) => {
        i.forEach((s) => {
          n[s] = !0
        })
      }
    return (qn(e) ? r(e) : r(String(e).split(t)), n)
  },
  VE = () => {},
  IE = (e, t) => (e != null && Number.isFinite((e = +e)) ? e : t)
function BE(e) {
  return !!(e && Be(e.append) && e[ay] === 'FormData' && e[Zi])
}
const zE = (e) => {
    const t = new WeakSet(),
      n = (r) => {
        if (Ur(r)) {
          if (t.has(r)) return
          if (zr(r)) return r
          if (!('toJSON' in r)) {
            t.add(r)
            const i = qn(r) ? [] : {}
            return (
              es(r, (s, o) => {
                const a = n(s)
                !Lr(a) && (i[o] = a)
              }),
              t.delete(r),
              i
            )
          }
        }
        return r
      }
    return n(e)
  },
  UE = gt('AsyncFunction'),
  $E = (e) => e && (Ur(e) || Be(e)) && Be(e.then) && Be(e.catch),
  hy = ((e, t) =>
    e
      ? setImmediate
      : t
        ? ((n, r) => (
            Mn.addEventListener(
              'message',
              ({ source: i, data: s }) => {
                i === Mn && s === n && r.length && r.shift()()
              },
              !1,
            ),
            (i) => {
              ;(r.push(i), Mn.postMessage(n, '*'))
            }
          ))(`axios@${Math.random()}`, [])
        : (n) => setTimeout(n))(typeof setImmediate == 'function', Be(Mn.postMessage)),
  WE =
    typeof queueMicrotask < 'u'
      ? queueMicrotask.bind(Mn)
      : (typeof process < 'u' && process.nextTick) || hy,
  py = (e) => e != null && Be(e[Zi]),
  HE = (e) => e != null && zi(e, Zi) && py(e),
  E = {
    isArray: qn,
    isArrayBuffer: ly,
    isBuffer: zr,
    isFormData: gE,
    isArrayBufferView: iE,
    isString: sE,
    isNumber: uy,
    isBoolean: oE,
    isObject: Ur,
    isPlainObject: Hs,
    isEmptyObject: aE,
    isReadableStream: vE,
    isRequest: xE,
    isResponse: wE,
    isHeaders: SE,
    isUndefined: Lr,
    isDate: lE,
    isFile: uE,
    isReactNativeBlob: cE,
    isReactNative: fE,
    isBlob: dE,
    isRegExp: ME,
    isFunction: Be,
    isStream: pE,
    isURLSearchParams: yE,
    isTypedArray: _E,
    isFileList: hE,
    forEach: es,
    merge: su,
    extend: PE,
    trim: EE,
    stripBOM: CE,
    inherits: kE,
    toFlatObject: TE,
    kindOf: Ac,
    kindOfTest: gt,
    endsWith: RE,
    toArray: AE,
    forEachEntry: jE,
    matchAll: OE,
    isHTMLForm: LE,
    hasOwnProperty: To,
    hasOwnProp: To,
    hasOwnInPrototypeChain: zi,
    getSafeProp: rE,
    reduceDescriptors: dy,
    freezeMethods: bE,
    toObjectSet: FE,
    toCamelCase: NE,
    noop: VE,
    toFiniteNumber: IE,
    findKey: cy,
    global: Mn,
    isContextDefined: fy,
    isSpecCompliantForm: BE,
    toJSONObject: zE,
    isAsyncFn: UE,
    isThenable: $E,
    setImmediate: hy,
    asap: WE,
    isIterable: py,
    isSafeIterable: HE,
  },
  KE = E.toObjectSet([
    'age',
    'authorization',
    'content-length',
    'content-type',
    'etag',
    'expires',
    'from',
    'host',
    'if-modified-since',
    'if-unmodified-since',
    'last-modified',
    'location',
    'max-forwards',
    'proxy-authorization',
    'referer',
    'retry-after',
    'user-agent',
  ]),
  qE = (e) => {
    const t = {}
    let n, r, i
    return (
      e &&
        e
          .split(
            `
`,
          )
          .forEach(function (o) {
            ;((i = o.indexOf(':')),
              (n = o.substring(0, i).trim().toLowerCase()),
              (r = o.substring(i + 1).trim()),
              !(!n || (t[n] && KE[n])) &&
                (n === 'set-cookie'
                  ? t[n]
                    ? t[n].push(r)
                    : (t[n] = [r])
                  : (t[n] = t[n] ? t[n] + ', ' + r : r)))
          }),
      t
    )
  }
function GE(e) {
  let t = 0,
    n = e.length
  for (; t < n;) {
    const r = e.charCodeAt(t)
    if (r !== 9 && r !== 32) break
    t += 1
  }
  for (; n > t;) {
    const r = e.charCodeAt(n - 1)
    if (r !== 9 && r !== 32) break
    n -= 1
  }
  return t === 0 && n === e.length ? e : e.slice(t, n)
}
const XE = new RegExp('[\\u0000-\\u0008\\u000a-\\u001f\\u007f]+', 'g'),
  QE = new RegExp('[^\\u0009\\u0020-\\u007e\\u0080-\\u00ff]+', 'g')
function _c(e, t) {
  return E.isArray(e) ? e.map((n) => _c(n, t)) : GE(String(e).replace(t, ''))
}
const YE = (e) => _c(e, XE),
  JE = (e) => _c(e, QE)
function my(e) {
  const t = Object.create(null)
  return (
    E.forEach(e.toJSON(), (n, r) => {
      t[r] = JE(n)
    }),
    t
  )
}
const qd = Symbol('internals')
function ei(e) {
  return e && String(e).trim().toLowerCase()
}
function Ks(e) {
  return e === !1 || e == null ? e : E.isArray(e) ? e.map(Ks) : YE(String(e))
}
function ZE(e) {
  const t = Object.create(null),
    n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g
  let r
  for (; (r = n.exec(e));) t[r[1]] = r[2]
  return t
}
const e2 = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim())
function Va(e, t, n, r, i) {
  if (E.isFunction(r)) return r.call(this, t, n)
  if ((i && (t = n), !!E.isString(t))) {
    if (E.isString(r)) return t.indexOf(r) !== -1
    if (E.isRegExp(r)) return r.test(t)
  }
}
function t2(e) {
  return e
    .trim()
    .toLowerCase()
    .replace(/([a-z\d])(\w*)/g, (t, n, r) => n.toUpperCase() + r)
}
function n2(e, t) {
  const n = E.toCamelCase(' ' + t)
  ;['get', 'set', 'has'].forEach((r) => {
    Object.defineProperty(e, r + n, {
      __proto__: null,
      value: function (i, s, o) {
        return this[r].call(this, t, i, s, o)
      },
      configurable: !0,
    })
  })
}
let _e = class {
  constructor(t) {
    t && this.set(t)
  }
  set(t, n, r) {
    const i = this
    function s(a, l, u) {
      const c = ei(l)
      if (!c) return
      const f = E.findKey(i, c)
      ;(!f || i[f] === void 0 || u === !0 || (u === void 0 && i[f] !== !1)) && (i[f || l] = Ks(a))
    }
    const o = (a, l) => E.forEach(a, (u, c) => s(u, c, l))
    if (E.isPlainObject(t) || t instanceof this.constructor) o(t, n)
    else if (E.isString(t) && (t = t.trim()) && !e2(t)) o(qE(t), n)
    else if (E.isObject(t) && E.isSafeIterable(t)) {
      let a = Object.create(null),
        l,
        u
      for (const c of t) {
        if (!E.isArray(c)) throw new TypeError('Object iterator must return a key-value pair')
        ;((u = c[0]),
          E.hasOwnProp(a, u)
            ? ((l = a[u]), (a[u] = E.isArray(l) ? [...l, c[1]] : [l, c[1]]))
            : (a[u] = c[1]))
      }
      o(a, n)
    } else t != null && s(n, t, r)
    return this
  }
  get(t, n) {
    if (((t = ei(t)), t)) {
      const r = E.findKey(this, t)
      if (r) {
        const i = this[r]
        if (!n) return i
        if (n === !0) return ZE(i)
        if (E.isFunction(n)) return n.call(this, i, r)
        if (E.isRegExp(n)) return n.exec(i)
        throw new TypeError('parser must be boolean|regexp|function')
      }
    }
  }
  has(t, n) {
    if (((t = ei(t)), t)) {
      const r = E.findKey(this, t)
      return !!(r && this[r] !== void 0 && (!n || Va(this, this[r], r, n)))
    }
    return !1
  }
  delete(t, n) {
    const r = this
    let i = !1
    function s(o) {
      if (((o = ei(o)), o)) {
        const a = E.findKey(r, o)
        a && (!n || Va(r, r[a], a, n)) && (delete r[a], (i = !0))
      }
    }
    return (E.isArray(t) ? t.forEach(s) : s(t), i)
  }
  clear(t) {
    const n = Object.keys(this)
    let r = n.length,
      i = !1
    for (; r--;) {
      const s = n[r]
      ;(!t || Va(this, this[s], s, t, !0)) && (delete this[s], (i = !0))
    }
    return i
  }
  normalize(t) {
    const n = this,
      r = {}
    return (
      E.forEach(this, (i, s) => {
        const o = E.findKey(r, s)
        if (o) {
          ;((n[o] = Ks(i)), delete n[s])
          return
        }
        const a = t ? t2(s) : String(s).trim()
        ;(a !== s && delete n[s], (n[a] = Ks(i)), (r[a] = !0))
      }),
      this
    )
  }
  concat(...t) {
    return this.constructor.concat(this, ...t)
  }
  toJSON(t) {
    const n = Object.create(null)
    return (
      E.forEach(this, (r, i) => {
        r != null && r !== !1 && (n[i] = t && E.isArray(r) ? r.join(', ') : r)
      }),
      n
    )
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]()
  }
  toString() {
    return Object.entries(this.toJSON()).map(([t, n]) => t + ': ' + n).join(`
`)
  }
  getSetCookie() {
    return this.get('set-cookie') || []
  }
  get [Symbol.toStringTag]() {
    return 'AxiosHeaders'
  }
  static from(t) {
    return t instanceof this ? t : new this(t)
  }
  static concat(t, ...n) {
    const r = new this(t)
    return (n.forEach((i) => r.set(i)), r)
  }
  static accessor(t) {
    const r = (this[qd] = this[qd] = { accessors: {} }).accessors,
      i = this.prototype
    function s(o) {
      const a = ei(o)
      r[a] || (n2(i, o), (r[a] = !0))
    }
    return (E.isArray(t) ? t.forEach(s) : s(t), this)
  }
}
_e.accessor([
  'Content-Type',
  'Content-Length',
  'Accept',
  'Accept-Encoding',
  'User-Agent',
  'Authorization',
])
E.reduceDescriptors(_e.prototype, ({ value: e }, t) => {
  let n = t[0].toUpperCase() + t.slice(1)
  return {
    get: () => e,
    set(r) {
      this[n] = r
    },
  }
})
E.freezeMethods(_e)
const r2 = '[REDACTED ****]'
function i2(e) {
  if (E.hasOwnProp(e, 'toJSON')) return !0
  let t = Object.getPrototypeOf(e)
  for (; t && t !== Object.prototype;) {
    if (E.hasOwnProp(t, 'toJSON')) return !0
    t = Object.getPrototypeOf(t)
  }
  return !1
}
function s2(e, t) {
  const n = new Set(t.map((s) => String(s).toLowerCase())),
    r = [],
    i = (s) => {
      if (s === null || typeof s != 'object' || E.isBuffer(s)) return s
      if (r.indexOf(s) !== -1) return
      ;(s instanceof _e && (s = s.toJSON()), r.push(s))
      let o
      if (E.isArray(s))
        ((o = []),
          s.forEach((a, l) => {
            const u = i(a)
            E.isUndefined(u) || (o[l] = u)
          }))
      else {
        if (!E.isPlainObject(s) && i2(s)) return (r.pop(), s)
        o = Object.create(null)
        for (const [a, l] of Object.entries(s)) {
          const u = n.has(a.toLowerCase()) ? r2 : i(l)
          E.isUndefined(u) || (o[a] = u)
        }
      }
      return (r.pop(), o)
    }
  return i(e)
}
let j = class gy extends Error {
  static from(t, n, r, i, s, o) {
    const a = new gy(t.message, n || t.code, r, i, s)
    return (
      Object.defineProperty(a, 'cause', {
        __proto__: null,
        value: t,
        writable: !0,
        enumerable: !1,
        configurable: !0,
      }),
      (a.name = t.name),
      t.status != null && a.status == null && (a.status = t.status),
      o && Object.assign(a, o),
      a
    )
  }
  constructor(t, n, r, i, s) {
    ;(super(t),
      Object.defineProperty(this, 'message', {
        __proto__: null,
        value: t,
        enumerable: !0,
        writable: !0,
        configurable: !0,
      }),
      (this.name = 'AxiosError'),
      (this.isAxiosError = !0),
      n && (this.code = n),
      r && (this.config = r),
      i && (this.request = i),
      s && ((this.response = s), (this.status = s.status)))
  }
  toJSON() {
    const t = this.config,
      n = t && E.hasOwnProp(t, 'redact') ? t.redact : void 0,
      r = E.isArray(n) && n.length > 0 ? s2(t, n) : E.toJSONObject(t)
    return {
      message: this.message,
      name: this.name,
      description: this.description,
      number: this.number,
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      config: r,
      code: this.code,
      status: this.status,
    }
  }
}
j.ERR_BAD_OPTION_VALUE = 'ERR_BAD_OPTION_VALUE'
j.ERR_BAD_OPTION = 'ERR_BAD_OPTION'
j.ECONNABORTED = 'ECONNABORTED'
j.ETIMEDOUT = 'ETIMEDOUT'
j.ECONNREFUSED = 'ECONNREFUSED'
j.ERR_NETWORK = 'ERR_NETWORK'
j.ERR_FR_TOO_MANY_REDIRECTS = 'ERR_FR_TOO_MANY_REDIRECTS'
j.ERR_DEPRECATED = 'ERR_DEPRECATED'
j.ERR_BAD_RESPONSE = 'ERR_BAD_RESPONSE'
j.ERR_BAD_REQUEST = 'ERR_BAD_REQUEST'
j.ERR_CANCELED = 'ERR_CANCELED'
j.ERR_NOT_SUPPORT = 'ERR_NOT_SUPPORT'
j.ERR_INVALID_URL = 'ERR_INVALID_URL'
j.ERR_FORM_DATA_DEPTH_EXCEEDED = 'ERR_FORM_DATA_DEPTH_EXCEEDED'
const o2 = null,
  yy = 100
function ou(e) {
  return E.isPlainObject(e) || E.isArray(e)
}
function vy(e) {
  return E.endsWith(e, '[]') ? e.slice(0, -2) : e
}
function Ia(e, t, n) {
  return e
    ? e
        .concat(t)
        .map(function (i, s) {
          return ((i = vy(i)), !n && s ? '[' + i + ']' : i)
        })
        .join(n ? '.' : '')
    : t
}
function a2(e) {
  return E.isArray(e) && !e.some(ou)
}
const l2 = E.toFlatObject(E, {}, null, function (t) {
  return /^is[A-Z]/.test(t)
})
function na(e, t, n) {
  if (!E.isObject(e)) throw new TypeError('target must be an object')
  ;((t = t || new FormData()),
    (n = E.toFlatObject(n, { metaTokens: !0, dots: !1, indexes: !1 }, !1, function (p, m) {
      return !E.isUndefined(m[p])
    })))
  const r = n.metaTokens,
    i = n.visitor || v,
    s = n.dots,
    o = n.indexes,
    a = n.Blob || (typeof Blob < 'u' && Blob),
    l = n.maxDepth === void 0 ? yy : n.maxDepth,
    u = a && E.isSpecCompliantForm(t),
    c = []
  if (!E.isFunction(i)) throw new TypeError('visitor must be a function')
  function f(h) {
    if (h === null) return ''
    if (E.isDate(h)) return h.toISOString()
    if (E.isBoolean(h)) return h.toString()
    if (!u && E.isBlob(h)) throw new j('Blob is not supported. Use a Buffer instead.')
    if (E.isArrayBuffer(h) || E.isTypedArray(h)) {
      if (u && typeof a == 'function') return new a([h])
      if (typeof Buffer < 'u') return Buffer.from(h)
      throw new j('Blob is not supported. Use a Buffer instead.', j.ERR_NOT_SUPPORT)
    }
    return h
  }
  function d(h) {
    if (h > l)
      throw new j(
        'Object is too deeply nested (' + h + ' levels). Max depth: ' + l,
        j.ERR_FORM_DATA_DEPTH_EXCEEDED,
      )
  }
  function g(h, p) {
    if (l === 1 / 0) return JSON.stringify(h)
    const m = []
    return JSON.stringify(h, function (C, k) {
      if (!E.isObject(k)) return k
      for (; m.length && m[m.length - 1] !== this;) m.pop()
      return (m.push(k), d(p + m.length - 1), k)
    })
  }
  function v(h, p, m) {
    let P = h
    if (E.isReactNative(t) && E.isReactNativeBlob(h)) return (t.append(Ia(m, p, s), f(h)), !1)
    if (h && !m && typeof h == 'object') {
      if (E.endsWith(p, '{}')) ((p = r ? p : p.slice(0, -2)), (h = g(h, 1)))
      else if (
        (E.isArray(h) && a2(h)) ||
        ((E.isFileList(h) || E.endsWith(p, '[]')) && (P = E.toArray(h)))
      )
        return (
          (p = vy(p)),
          P.forEach(function (k, A) {
            !(E.isUndefined(k) || k === null) &&
              t.append(o === !0 ? Ia([p], A, s) : o === null ? p : p + '[]', f(k))
          }),
          !1
        )
    }
    return ou(h) ? !0 : (t.append(Ia(m, p, s), f(h)), !1)
  }
  const x = Object.assign(l2, { defaultVisitor: v, convertValue: f, isVisitable: ou })
  function S(h, p, m = 0) {
    if (!E.isUndefined(h)) {
      if ((d(m), c.indexOf(h) !== -1))
        throw new Error('Circular reference detected in ' + p.join('.'))
      ;(c.push(h),
        E.forEach(h, function (C, k) {
          ;(!(E.isUndefined(C) || C === null) &&
            i.call(t, C, E.isString(k) ? k.trim() : k, p, x)) === !0 &&
            S(C, p ? p.concat(k) : [k], m + 1)
        }),
        c.pop())
    }
  }
  if (!E.isObject(e)) throw new TypeError('data must be an object')
  return (S(e), t)
}
function Gd(e) {
  const t = { '!': '%21', "'": '%27', '(': '%28', ')': '%29', '~': '%7E', '%20': '+' }
  return encodeURIComponent(e).replace(/[!'()~]|%20/g, function (r) {
    return t[r]
  })
}
function jc(e, t) {
  ;((this._pairs = []), e && na(e, this, t))
}
const xy = jc.prototype
xy.append = function (t, n) {
  this._pairs.push([t, n])
}
xy.toString = function (t) {
  const n = t ? (r) => t.call(this, r, Gd) : Gd
  return this._pairs
    .map(function (i) {
      return n(i[0]) + '=' + n(i[1])
    }, '')
    .join('&')
}
function u2(e) {
  return encodeURIComponent(e)
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
}
function wy(e, t, n) {
  if (!t) return e
  e = e || ''
  const r = E.isFunction(n) ? { serialize: n } : n,
    i = E.getSafeProp(r, 'encode') || u2,
    s = E.getSafeProp(r, 'serialize')
  let o
  if (
    (s ? (o = s(t, r)) : (o = E.isURLSearchParams(t) ? t.toString() : new jc(t, r).toString(i)), o)
  ) {
    const a = e.indexOf('#')
    ;(a !== -1 && (e = e.slice(0, a)), (e += (e.indexOf('?') === -1 ? '?' : '&') + o))
  }
  return e
}
class Xd {
  constructor() {
    this.handlers = []
  }
  use(t, n, r) {
    return (
      this.handlers.push({
        fulfilled: t,
        rejected: n,
        synchronous: r ? r.synchronous : !1,
        runWhen: r ? r.runWhen : null,
      }),
      this.handlers.length - 1
    )
  }
  eject(t) {
    this.handlers[t] && (this.handlers[t] = null)
  }
  clear() {
    this.handlers && (this.handlers = [])
  }
  forEach(t) {
    E.forEach(this.handlers, function (r) {
      r !== null && t(r)
    })
  }
}
const Oc = {
    silentJSONParsing: !0,
    forcedJSONParsing: !0,
    clarifyTimeoutError: !1,
    legacyInterceptorReqResOrdering: !0,
    advertiseZstdAcceptEncoding: !1,
    validateStatusUndefinedResolves: !0,
  },
  c2 = typeof URLSearchParams < 'u' ? URLSearchParams : jc,
  f2 = typeof FormData < 'u' ? FormData : null,
  d2 = typeof Blob < 'u' ? Blob : null,
  h2 = {
    isBrowser: !0,
    classes: { URLSearchParams: c2, FormData: f2, Blob: d2 },
    protocols: ['http', 'https', 'file', 'blob', 'url', 'data'],
  },
  Lc = typeof window < 'u' && typeof document < 'u',
  au = (typeof navigator == 'object' && navigator) || void 0,
  p2 = Lc && (!au || ['ReactNative', 'NativeScript', 'NS'].indexOf(au.product) < 0),
  m2 =
    typeof WorkerGlobalScope < 'u' &&
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts == 'function',
  g2 = (Lc && window.location.href) || 'http://localhost',
  y2 = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        hasBrowserEnv: Lc,
        hasStandardBrowserEnv: p2,
        hasStandardBrowserWebWorkerEnv: m2,
        navigator: au,
        origin: g2,
      },
      Symbol.toStringTag,
      { value: 'Module' },
    ),
  ),
  xe = { ...y2, ...h2 }
function v2(e, t) {
  return na(e, new xe.classes.URLSearchParams(), {
    visitor: function (n, r, i, s) {
      return xe.isNode && E.isBuffer(n)
        ? (this.append(r, n.toString('base64')), !1)
        : s.defaultVisitor.apply(this, arguments)
    },
    ...t,
  })
}
const Qd = yy
function Sy(e) {
  if (e > Qd)
    throw new j(
      'FormData field is too deeply nested (' + e + ' levels). Max depth: ' + Qd,
      j.ERR_FORM_DATA_DEPTH_EXCEEDED,
    )
}
function x2(e) {
  const t = [],
    n = /\w+|\[(\w*)]/g
  let r
  for (; (r = n.exec(e)) !== null;) (Sy(t.length), t.push(r[0] === '[]' ? '' : r[1] || r[0]))
  return t
}
function w2(e) {
  const t = {},
    n = Object.keys(e)
  let r
  const i = n.length
  let s
  for (r = 0; r < i; r++) ((s = n[r]), (t[s] = e[s]))
  return t
}
function Ey(e) {
  function t(n, r, i, s) {
    Sy(s)
    let o = n[s++]
    if (o === '__proto__') return !0
    const a = Number.isFinite(+o),
      l = s >= n.length
    return (
      (o = !o && E.isArray(i) ? i.length : o),
      l
        ? (E.hasOwnProp(i, o) ? (i[o] = E.isArray(i[o]) ? i[o].concat(r) : [i[o], r]) : (i[o] = r),
          !a)
        : ((!E.hasOwnProp(i, o) || !E.isObject(i[o])) && (i[o] = []),
          t(n, r, i[o], s) && E.isArray(i[o]) && (i[o] = w2(i[o])),
          !a)
    )
  }
  if (E.isFormData(e) && E.isFunction(e.entries)) {
    const n = {}
    return (
      E.forEachEntry(e, (r, i) => {
        t(x2(r), i, n, 0)
      }),
      n
    )
  }
  return null
}
const er = (e, t) => (e != null && E.hasOwnProp(e, t) ? e[t] : void 0)
function S2(e, t, n) {
  if (E.isString(e))
    try {
      return ((t || JSON.parse)(e), E.trim(e))
    } catch (r) {
      if (r.name !== 'SyntaxError') throw r
    }
  return (n || JSON.stringify)(e)
}
const ts = {
  transitional: Oc,
  adapter: ['xhr', 'http', 'fetch'],
  transformRequest: [
    function (t, n) {
      const r = n.getContentType() || '',
        i = r.indexOf('application/json') > -1,
        s = E.isObject(t)
      if ((s && E.isHTMLForm(t) && (t = new FormData(t)), E.isFormData(t)))
        return i ? JSON.stringify(Ey(t)) : t
      if (
        E.isArrayBuffer(t) ||
        E.isBuffer(t) ||
        E.isStream(t) ||
        E.isFile(t) ||
        E.isBlob(t) ||
        E.isReadableStream(t)
      )
        return t
      if (E.isArrayBufferView(t)) return t.buffer
      if (E.isURLSearchParams(t))
        return (
          n.setContentType('application/x-www-form-urlencoded;charset=utf-8', !1),
          t.toString()
        )
      let a
      if (s) {
        const l = er(this, 'formSerializer')
        if (r.indexOf('application/x-www-form-urlencoded') > -1) return v2(t, l).toString()
        if ((a = E.isFileList(t)) || r.indexOf('multipart/form-data') > -1) {
          const u = er(this, 'env'),
            c = u && u.FormData
          return na(a ? { 'files[]': t } : t, c && new c(), l)
        }
      }
      return s || i ? (n.setContentType('application/json', !1), S2(t)) : t
    },
  ],
  transformResponse: [
    function (t) {
      const n = er(this, 'transitional') || ts.transitional,
        r = n && n.forcedJSONParsing,
        i = er(this, 'responseType'),
        s = i === 'json'
      if (E.isResponse(t) || E.isReadableStream(t)) return t
      if (t && E.isString(t) && ((r && !i) || s)) {
        const a = !(n && n.silentJSONParsing) && s
        try {
          return JSON.parse(t, er(this, 'parseReviver'))
        } catch (l) {
          if (a)
            throw l.name === 'SyntaxError'
              ? j.from(l, j.ERR_BAD_RESPONSE, this, null, er(this, 'response'))
              : l
        }
      }
      return t
    },
  ],
  timeout: 0,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  maxContentLength: -1,
  maxBodyLength: -1,
  env: { FormData: xe.classes.FormData, Blob: xe.classes.Blob },
  validateStatus: function (t) {
    return t >= 200 && t < 300
  },
  headers: { common: { Accept: 'application/json, text/plain, */*', 'Content-Type': void 0 } },
}
E.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'query'], (e) => {
  ts.headers[e] = {}
})
function Ba(e, t) {
  const n = this || ts,
    r = t || n,
    i = _e.from(r.headers)
  let s = r.data
  return (
    E.forEach(e, function (a) {
      s = a.call(n, s, i.normalize(), t ? t.status : void 0)
    }),
    i.normalize(),
    s
  )
}
function Py(e) {
  return !!(e && e.__CANCEL__)
}
let ns = class extends j {
  constructor(t, n, r) {
    ;(super(t ?? 'canceled', j.ERR_CANCELED, n, r),
      (this.name = 'CanceledError'),
      (this.__CANCEL__ = !0))
  }
}
function Cy(e, t, n) {
  const r = n.config.validateStatus
  !n.status || !r || r(n.status)
    ? e(n)
    : t(
        new j(
          'Request failed with status code ' + n.status,
          n.status >= 400 && n.status < 500 ? j.ERR_BAD_REQUEST : j.ERR_BAD_RESPONSE,
          n.config,
          n.request,
          n,
        ),
      )
}
function E2(e) {
  const t = /^([-+\w]{1,25}):(?:\/\/)?/.exec(e)
  return (t && t[1]) || ''
}
function P2(e, t) {
  e = e || 10
  const n = new Array(e),
    r = new Array(e)
  let i = 0,
    s = 0,
    o
  return (
    (t = t !== void 0 ? t : 1e3),
    function (l) {
      const u = Date.now(),
        c = r[s]
      ;(o || (o = u), (n[i] = l), (r[i] = u))
      let f = s,
        d = 0
      for (; f !== i;) ((d += n[f++]), (f = f % e))
      if (((i = (i + 1) % e), i === s && (s = (s + 1) % e), u - o < t)) return
      const g = c && u - c
      return g ? Math.round((d * 1e3) / g) : void 0
    }
  )
}
function C2(e, t) {
  let n = 0,
    r = 1e3 / t,
    i,
    s
  const o = (u, c = Date.now()) => {
    ;((n = c), (i = null), s && (clearTimeout(s), (s = null)), e(...u))
  }
  return [
    (...u) => {
      const c = Date.now(),
        f = c - n
      f >= r
        ? o(u, c)
        : ((i = u),
          s ||
            (s = setTimeout(() => {
              ;((s = null), o(i))
            }, r - f)))
    },
    () => i && o(i),
  ]
}
const Ro = (e, t, n = 3) => {
    let r = 0
    const i = P2(50, 250)
    return C2((s) => {
      if (!s || typeof s.loaded != 'number') return
      const o = s.loaded,
        a = s.lengthComputable ? s.total : void 0,
        l = a != null ? Math.min(o, a) : o,
        u = Math.max(0, l - r),
        c = i(u)
      r = Math.max(r, l)
      const f = {
        loaded: l,
        total: a,
        progress: a ? l / a : void 0,
        bytes: u,
        rate: c || void 0,
        estimated: c && a ? (a - l) / c : void 0,
        event: s,
        lengthComputable: a != null,
        [t ? 'download' : 'upload']: !0,
      }
      e(f)
    }, n)
  },
  Yd = (e, t) => {
    const n = e != null
    return [(r) => t[0]({ lengthComputable: n, total: e, loaded: r }), t[1]]
  },
  Jd =
    (e) =>
    (...t) =>
      E.asap(() => e(...t)),
  k2 = xe.hasStandardBrowserEnv
    ? ((e, t) => (n) => (
        (n = new URL(n, xe.origin)),
        e.protocol === n.protocol && e.host === n.host && (t || e.port === n.port)
      ))(new URL(xe.origin), xe.navigator && /(msie|trident)/i.test(xe.navigator.userAgent))
    : () => !0,
  T2 = xe.hasStandardBrowserEnv
    ? {
        write(e, t, n, r, i, s, o) {
          if (typeof document > 'u') return
          const a = [`${e}=${encodeURIComponent(t)}`]
          ;(E.isNumber(n) && a.push(`expires=${new Date(n).toUTCString()}`),
            E.isString(r) && a.push(`path=${r}`),
            E.isString(i) && a.push(`domain=${i}`),
            s === !0 && a.push('secure'),
            E.isString(o) && a.push(`SameSite=${o}`),
            (document.cookie = a.join('; ')))
        },
        read(e) {
          if (typeof document > 'u') return null
          const t = document.cookie.split(';')
          for (let n = 0; n < t.length; n++) {
            const r = t[n].replace(/^\s+/, ''),
              i = r.indexOf('=')
            if (i !== -1 && r.slice(0, i) === e)
              try {
                return decodeURIComponent(r.slice(i + 1))
              } catch {
                return r.slice(i + 1)
              }
          }
          return null
        },
        remove(e) {
          this.write(e, '', Date.now() - 864e5, '/')
        },
      }
    : {
        write() {},
        read() {
          return null
        },
        remove() {},
      }
function R2(e) {
  return typeof e != 'string' ? !1 : /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e)
}
function A2(e, t) {
  return t ? e.replace(/\/?\/$/, '') + '/' + t.replace(/^\/+/, '') : e
}
const _2 = /^https?:(?!\/\/)/i,
  j2 = /[\t\n\r]/g
function O2(e) {
  let t = 0
  for (; t < e.length && e.charCodeAt(t) <= 32;) t++
  return e.slice(t)
}
function L2(e) {
  return O2(e).replace(j2, '')
}
function Zd(e, t) {
  if (typeof e == 'string' && _2.test(L2(e)))
    throw new j('Invalid URL: missing "//" after protocol', j.ERR_INVALID_URL, t)
}
function ky(e, t, n, r) {
  Zd(t, r)
  let i = !R2(t)
  return e && (i || n === !1) ? (Zd(e, r), A2(e, t)) : t
}
const eh = (e) => (e instanceof _e ? { ...e } : e)
function Gn(e, t) {
  ;((e = e || {}), (t = t || {}))
  const n = Object.create(null)
  Object.defineProperty(n, 'hasOwnProperty', {
    __proto__: null,
    value: Object.prototype.hasOwnProperty,
    enumerable: !1,
    writable: !0,
    configurable: !0,
  })
  function r(c, f, d, g) {
    return E.isPlainObject(c) && E.isPlainObject(f)
      ? E.merge.call({ caseless: g }, c, f)
      : E.isPlainObject(f)
        ? E.merge({}, f)
        : E.isArray(f)
          ? f.slice()
          : f
  }
  function i(c, f, d, g) {
    if (E.isUndefined(f)) {
      if (!E.isUndefined(c)) return r(void 0, c, d, g)
    } else return r(c, f, d, g)
  }
  function s(c, f) {
    if (!E.isUndefined(f)) return r(void 0, f)
  }
  function o(c, f) {
    if (E.isUndefined(f)) {
      if (!E.isUndefined(c)) return r(void 0, c)
    } else return r(void 0, f)
  }
  function a(c) {
    const f = E.hasOwnProp(t, 'transitional') ? t.transitional : void 0
    if (!E.isUndefined(f))
      if (E.isPlainObject(f)) {
        if (E.hasOwnProp(f, c)) return f[c]
      } else return
    const d = E.hasOwnProp(e, 'transitional') ? e.transitional : void 0
    if (E.isPlainObject(d) && E.hasOwnProp(d, c)) return d[c]
  }
  function l(c, f, d) {
    if (E.hasOwnProp(t, d)) return r(c, f)
    if (E.hasOwnProp(e, d)) return r(void 0, c)
  }
  const u = {
    url: s,
    method: s,
    data: s,
    baseURL: o,
    transformRequest: o,
    transformResponse: o,
    paramsSerializer: o,
    timeout: o,
    timeoutMessage: o,
    withCredentials: o,
    withXSRFToken: o,
    adapter: o,
    responseType: o,
    xsrfCookieName: o,
    xsrfHeaderName: o,
    onUploadProgress: o,
    onDownloadProgress: o,
    decompress: o,
    maxContentLength: o,
    maxBodyLength: o,
    beforeRedirect: o,
    transport: o,
    httpAgent: o,
    httpsAgent: o,
    cancelToken: o,
    socketPath: o,
    allowedSocketPaths: o,
    responseEncoding: o,
    validateStatus: l,
    headers: (c, f, d) => i(eh(c), eh(f), d, !0),
  }
  return (
    E.forEach(Object.keys({ ...e, ...t }), function (f) {
      if (f === '__proto__' || f === 'constructor' || f === 'prototype') return
      const d = E.hasOwnProp(u, f) ? u[f] : i,
        g = E.hasOwnProp(e, f) ? e[f] : void 0,
        v = E.hasOwnProp(t, f) ? t[f] : void 0,
        x = d(g, v, f)
      ;(E.isUndefined(x) && d !== l) || (n[f] = x)
    }),
    E.hasOwnProp(t, 'validateStatus') &&
      E.isUndefined(t.validateStatus) &&
      a('validateStatusUndefinedResolves') === !1 &&
      (E.hasOwnProp(e, 'validateStatus')
        ? (n.validateStatus = r(void 0, e.validateStatus))
        : delete n.validateStatus),
    n
  )
}
const N2 = ['content-type', 'content-length']
function D2(e, t, n) {
  if (n !== 'content-only') {
    e.set(t)
    return
  }
  Object.entries(t || {}).forEach(([r, i]) => {
    N2.includes(r.toLowerCase()) && e.set(r, i)
  })
}
const M2 = (e) =>
  encodeURIComponent(e).replace(/%([0-9A-F]{2})/gi, (t, n) => String.fromCharCode(parseInt(n, 16)))
function Ty(e) {
  const t = Gn({}, e),
    n = (d) => (E.hasOwnProp(t, d) ? t[d] : void 0),
    r = n('data')
  let i = n('withXSRFToken')
  const s = n('xsrfHeaderName'),
    o = n('xsrfCookieName')
  let a = n('headers')
  const l = n('auth'),
    u = n('baseURL'),
    c = n('allowAbsoluteUrls'),
    f = n('url')
  if (
    ((t.headers = a = _e.from(a)),
    (t.url = wy(ky(u, f, c, t), n('params'), n('paramsSerializer'))),
    l)
  ) {
    const d = E.getSafeProp(l, 'username') || '',
      g = E.getSafeProp(l, 'password') || ''
    try {
      a.set('Authorization', 'Basic ' + btoa(d + ':' + (g ? M2(g) : '')))
    } catch (v) {
      throw j.from(v, j.ERR_BAD_OPTION_VALUE, e)
    }
  }
  if (
    (E.isFormData(r) &&
      (xe.hasStandardBrowserEnv || xe.hasStandardBrowserWebWorkerEnv || E.isReactNative(r)
        ? a.setContentType(void 0)
        : E.isFunction(r.getHeaders) && D2(a, r.getHeaders(), n('formDataHeaderPolicy'))),
    xe.hasStandardBrowserEnv &&
      (E.isFunction(i) && (i = i(t)), i === !0 || (i == null && k2(t.url))))
  ) {
    const g = s && o && T2.read(o)
    g && a.set(s, g)
  }
  return t
}
const b2 = typeof XMLHttpRequest < 'u',
  F2 =
    b2 &&
    function (e) {
      return new Promise(function (n, r) {
        const i = Ty(e)
        let s = i.data
        const o = _e.from(i.headers).normalize()
        let { responseType: a, onUploadProgress: l, onDownloadProgress: u } = i,
          c,
          f,
          d,
          g,
          v
        function x() {
          ;(g && g(),
            v && v(),
            i.cancelToken && i.cancelToken.unsubscribe(c),
            i.signal && i.signal.removeEventListener('abort', c))
        }
        let S = new XMLHttpRequest()
        ;(S.open(i.method.toUpperCase(), i.url, !0), (S.timeout = i.timeout))
        function h() {
          if (!S) return
          const m = _e.from('getAllResponseHeaders' in S && S.getAllResponseHeaders()),
            C = {
              data: !a || a === 'text' || a === 'json' ? S.responseText : S.response,
              status: S.status,
              statusText: S.statusText,
              headers: m,
              config: e,
              request: S,
            }
          ;(Cy(
            function (A) {
              ;(n(A), x())
            },
            function (A) {
              ;(r(A), x())
            },
            C,
          ),
            (S = null))
        }
        ;('onloadend' in S
          ? (S.onloadend = h)
          : (S.onreadystatechange = function () {
              !S ||
                S.readyState !== 4 ||
                (S.status === 0 && !(S.responseURL && S.responseURL.startsWith('file:'))) ||
                setTimeout(h)
            }),
          (S.onabort = function () {
            S && (r(new j('Request aborted', j.ECONNABORTED, e, S)), x(), (S = null))
          }),
          (S.onerror = function (P) {
            const C = P && P.message ? P.message : 'Network Error',
              k = new j(C, j.ERR_NETWORK, e, S)
            ;((k.event = P || null), r(k), x(), (S = null))
          }),
          (S.ontimeout = function () {
            let P = i.timeout ? 'timeout of ' + i.timeout + 'ms exceeded' : 'timeout exceeded'
            const C = i.transitional || Oc
            ;(i.timeoutErrorMessage && (P = i.timeoutErrorMessage),
              r(new j(P, C.clarifyTimeoutError ? j.ETIMEDOUT : j.ECONNABORTED, e, S)),
              x(),
              (S = null))
          }),
          s === void 0 && o.setContentType(null),
          'setRequestHeader' in S &&
            E.forEach(my(o), function (P, C) {
              S.setRequestHeader(C, P)
            }),
          E.isUndefined(i.withCredentials) || (S.withCredentials = !!i.withCredentials),
          a && a !== 'json' && (S.responseType = i.responseType),
          u && (([d, v] = Ro(u, !0)), S.addEventListener('progress', d)),
          l &&
            S.upload &&
            (([f, g] = Ro(l)),
            S.upload.addEventListener('progress', f),
            S.upload.addEventListener('loadend', g)),
          (i.cancelToken || i.signal) &&
            ((c = (m) => {
              S && (r(!m || m.type ? new ns(null, e, S) : m), S.abort(), x(), (S = null))
            }),
            i.cancelToken && i.cancelToken.subscribe(c),
            i.signal && (i.signal.aborted ? c() : i.signal.addEventListener('abort', c))))
        const p = E2(i.url)
        if (p && !xe.protocols.includes(p)) {
          ;(r(new j('Unsupported protocol ' + p + ':', j.ERR_BAD_REQUEST, e)), x())
          return
        }
        S.send(s || null)
      })
    },
  V2 = (e, t) => {
    if (((e = e ? e.filter(Boolean) : []), !t && !e.length)) return
    const n = new AbortController()
    let r = !1
    const i = function (l) {
      if (!r) {
        ;((r = !0), o())
        const u = l instanceof Error ? l : this.reason
        n.abort(u instanceof j ? u : new ns(u instanceof Error ? u.message : u))
      }
    }
    let s =
      t &&
      setTimeout(() => {
        ;((s = null), i(new j(`timeout of ${t}ms exceeded`, j.ETIMEDOUT)))
      }, t)
    const o = () => {
      e &&
        (s && clearTimeout(s),
        (s = null),
        e.forEach((l) => {
          l.unsubscribe ? l.unsubscribe(i) : l.removeEventListener('abort', i)
        }),
        (e = null))
    }
    e.forEach((l) => l.addEventListener('abort', i, { once: !0 }))
    const { signal: a } = n
    return ((a.unsubscribe = () => E.asap(o)), a)
  },
  I2 = function* (e, t) {
    let n = e.byteLength
    if (n < t) {
      yield e
      return
    }
    let r = 0,
      i
    for (; r < n;) ((i = r + t), yield e.slice(r, i), (r = i))
  },
  B2 = async function* (e, t) {
    for await (const n of z2(e)) yield* I2(n, t)
  },
  z2 = async function* (e) {
    if (e[Symbol.asyncIterator]) {
      yield* e
      return
    }
    const t = e.getReader()
    try {
      for (;;) {
        const { done: n, value: r } = await t.read()
        if (n) break
        yield r
      }
    } finally {
      await t.cancel()
    }
  },
  th = (e, t, n, r) => {
    const i = B2(e, t)
    let s = 0,
      o,
      a = (l) => {
        o || ((o = !0), r && r(l))
      }
    return new ReadableStream(
      {
        async pull(l) {
          try {
            const { done: u, value: c } = await i.next()
            if (u) {
              ;(a(), l.close())
              return
            }
            let f = c.byteLength
            if (n) {
              let d = (s += f)
              n(d)
            }
            l.enqueue(new Uint8Array(c))
          } catch (u) {
            throw (a(u), u)
          }
        },
        cancel(l) {
          return (a(l), i.return())
        },
      },
      { highWaterMark: 2 },
    )
  },
  Ao = (e) => (e >= 48 && e <= 57) || (e >= 65 && e <= 70) || (e >= 97 && e <= 102),
  U2 = (e, t, n) => t + 2 < n && Ao(e.charCodeAt(t + 1)) && Ao(e.charCodeAt(t + 2))
function $2(e) {
  if (!e || typeof e != 'string' || !e.startsWith('data:')) return 0
  const t = e.indexOf(',')
  if (t < 0) return 0
  const n = e.slice(5, t),
    r = e.slice(t + 1)
  if (/;base64/i.test(n)) {
    let o = r.length
    const a = r.length
    for (let g = 0; g < a; g++)
      if (r.charCodeAt(g) === 37 && g + 2 < a) {
        const v = r.charCodeAt(g + 1),
          x = r.charCodeAt(g + 2)
        Ao(v) && Ao(x) && ((o -= 2), (g += 2))
      }
    let l = 0,
      u = a - 1
    const c = (g) =>
      g >= 2 &&
      r.charCodeAt(g - 2) === 37 &&
      r.charCodeAt(g - 1) === 51 &&
      (r.charCodeAt(g) === 68 || r.charCodeAt(g) === 100)
    ;(u >= 0 && (r.charCodeAt(u) === 61 ? (l++, u--) : c(u) && (l++, (u -= 3))),
      l === 1 && u >= 0 && (r.charCodeAt(u) === 61 || c(u)) && l++)
    const d = Math.floor(o / 4) * 3 - (l || 0)
    return d > 0 ? d : 0
  }
  let s = 0
  for (let o = 0, a = r.length; o < a; o++) {
    const l = r.charCodeAt(o)
    if (l === 37 && U2(r, o, a)) ((s += 1), (o += 2))
    else if (l < 128) s += 1
    else if (l < 2048) s += 2
    else if (l >= 55296 && l <= 56319 && o + 1 < a) {
      const u = r.charCodeAt(o + 1)
      u >= 56320 && u <= 57343 ? ((s += 4), o++) : (s += 3)
    } else s += 3
  }
  return s
}
const Nc = '1.18.1',
  nh = 64 * 1024,
  { isFunction: Ts } = E,
  W2 = (e) =>
    encodeURIComponent(e).replace(/%([0-9A-F]{2})/gi, (t, n) =>
      String.fromCharCode(parseInt(n, 16)),
    ),
  rh = (e) => {
    if (!E.isString(e)) return e
    try {
      return decodeURIComponent(e)
    } catch {
      return e
    }
  },
  ih = (e, ...t) => {
    try {
      return !!e(...t)
    } catch {
      return !1
    }
  },
  H2 = (e) => {
    const t = e.indexOf('://')
    let n = e
    return (t !== -1 && (n = n.slice(t + 3)), n.includes('@') || n.includes(':'))
  },
  K2 = (e) => {
    const t = E.global !== void 0 && E.global !== null ? E.global : globalThis,
      { ReadableStream: n, TextEncoder: r } = t
    e = E.merge.call({ skipUndefined: !0 }, { Request: t.Request, Response: t.Response }, e)
    const { fetch: i, Request: s, Response: o } = e,
      a = i ? Ts(i) : typeof fetch == 'function',
      l = Ts(s),
      u = Ts(o)
    if (!a) return !1
    const c = a && Ts(n),
      f =
        a &&
        (typeof r == 'function'
          ? (
              (h) => (p) =>
                h.encode(p)
            )(new r())
          : async (h) => new Uint8Array(await new s(h).arrayBuffer())),
      d =
        l &&
        c &&
        ih(() => {
          let h = !1
          const p = new s(xe.origin, {
              body: new n(),
              method: 'POST',
              get duplex() {
                return ((h = !0), 'half')
              },
            }),
            m = p.headers.has('Content-Type')
          return (p.body != null && p.body.cancel(), h && !m)
        }),
      g = u && c && ih(() => E.isReadableStream(new o('').body)),
      v = { stream: g && ((h) => h.body) }
    a &&
      ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach((h) => {
        !v[h] &&
          (v[h] = (p, m) => {
            let P = p && p[h]
            if (P) return P.call(p)
            throw new j(`Response type '${h}' is not supported`, j.ERR_NOT_SUPPORT, m)
          })
      })
    const x = async (h) => {
        if (h == null) return 0
        if (E.isBlob(h)) return h.size
        if (E.isSpecCompliantForm(h))
          return (await new s(xe.origin, { method: 'POST', body: h }).arrayBuffer()).byteLength
        if (E.isArrayBufferView(h) || E.isArrayBuffer(h)) return h.byteLength
        if ((E.isURLSearchParams(h) && (h = h + ''), E.isString(h))) return (await f(h)).byteLength
      },
      S = async (h, p) => {
        const m = E.toFiniteNumber(h.getContentLength())
        return m ?? x(p)
      }
    return async (h) => {
      let {
        url: p,
        method: m,
        data: P,
        signal: C,
        cancelToken: k,
        timeout: A,
        onDownloadProgress: T,
        onUploadProgress: b,
        responseType: L,
        headers: W,
        withCredentials: ze = 'same-origin',
        fetchOptions: yt,
        maxContentLength: Ee,
        maxBodyLength: kn,
      } = Ty(h)
      const vt = E.isNumber(Ee) && Ee > -1,
        Y = E.isNumber(kn) && kn > -1,
        _ = (B) => (E.hasOwnProp(h, B) ? h[B] : void 0)
      let M = i || fetch
      L = L ? (L + '').toLowerCase() : 'text'
      let N = V2([C, k && k.toAbortSignal()], A),
        V = null
      const H =
        N &&
        N.unsubscribe &&
        (() => {
          N.unsubscribe()
        })
      let at,
        Ue = null
      const Jn = () =>
        new j('Request body larger than maxBodyLength limit', j.ERR_BAD_REQUEST, h, V)
      try {
        let B
        const pe = _('auth')
        if (pe) {
          const F = E.getSafeProp(pe, 'username') || '',
            $e = E.getSafeProp(pe, 'password') || ''
          B = { username: F, password: $e }
        }
        if (H2(p)) {
          const F = new URL(p, xe.origin)
          if (!B && (F.username || F.password)) {
            const $e = rh(F.username),
              Kt = rh(F.password)
            B = { username: $e, password: Kt }
          }
          ;(F.username || F.password) && ((F.username = ''), (F.password = ''), (p = F.href))
        }
        if (
          (B &&
            (W.delete('authorization'),
            W.set(
              'Authorization',
              'Basic ' + btoa(W2((B.username || '') + ':' + (B.password || ''))),
            )),
          vt && typeof p == 'string' && p.startsWith('data:') && $2(p) > Ee)
        )
          throw new j('maxContentLength size of ' + Ee + ' exceeded', j.ERR_BAD_RESPONSE, h, V)
        if (Y && m !== 'get' && m !== 'head') {
          const F = await x(P)
          if (typeof F == 'number' && isFinite(F) && ((at = F), F > kn)) throw Jn()
        }
        const as = Y && (E.isReadableStream(P) || E.isStream(P)),
          yf = (F, $e, Kt) =>
            th(
              F,
              nh,
              (Tn) => {
                if (Y && Tn > kn) throw (Ue = Jn())
                $e && $e(Tn)
              },
              Kt,
            )
        if (d && m !== 'get' && m !== 'head' && (b || as)) {
          if (((at = at ?? (await S(W, P))), at !== 0 || as)) {
            let F = new s(p, { method: 'POST', body: P, duplex: 'half' }),
              $e
            if (
              (E.isFormData(P) && ($e = F.headers.get('content-type')) && W.setContentType($e),
              F.body)
            ) {
              const [Kt, Tn] = (b && Yd(at, Ro(Jd(b)))) || []
              P = yf(F.body, Kt, Tn)
            }
          }
        } else if (as && !l && c && m !== 'get' && m !== 'head') P = yf(P)
        else if (as && l && !d && m !== 'get' && m !== 'head')
          throw new j(
            'Stream request bodies are not supported by the current fetch implementation',
            j.ERR_NOT_SUPPORT,
            h,
            V,
          )
        E.isString(ze) || (ze = ze ? 'include' : 'omit')
        const av = l && 'credentials' in s.prototype
        if (E.isFormData(P)) {
          const F = W.getContentType()
          F && /^multipart\/form-data/i.test(F) && !/boundary=/i.test(F) && W.delete('content-type')
        }
        W.set('User-Agent', 'axios/' + Nc, !1)
        const vf = {
          ...yt,
          signal: N,
          method: m.toUpperCase(),
          headers: my(W.normalize()),
          body: P,
          duplex: 'half',
          credentials: av ? ze : void 0,
        }
        V = l && new s(p, vf)
        let At = await (l ? M(V, yt) : M(p, vf))
        const xf = _e.from(At.headers)
        if (vt) {
          const F = E.toFiniteNumber(xf.getContentLength())
          if (F != null && F > Ee)
            throw new j('maxContentLength size of ' + Ee + ' exceeded', j.ERR_BAD_RESPONSE, h, V)
        }
        const ca = g && (L === 'stream' || L === 'response')
        if (g && At.body && (T || vt || (ca && H))) {
          const F = {}
          ;['status', 'statusText', 'headers'].forEach((Hr) => {
            F[Hr] = At[Hr]
          })
          const $e = E.toFiniteNumber(xf.getContentLength()),
            [Kt, Tn] = (T && Yd($e, Ro(Jd(T), !0))) || []
          let wf = 0
          const lv = (Hr) => {
            if (vt && ((wf = Hr), wf > Ee))
              throw new j('maxContentLength size of ' + Ee + ' exceeded', j.ERR_BAD_RESPONSE, h, V)
            Kt && Kt(Hr)
          }
          At = new o(
            th(At.body, nh, lv, () => {
              ;(Tn && Tn(), H && H())
            }),
            F,
          )
        }
        L = L || 'text'
        let _t = await v[E.findKey(v, L) || 'text'](At, h)
        if (vt && !g && !ca) {
          let F
          if (
            (_t != null &&
              (typeof _t.byteLength == 'number'
                ? (F = _t.byteLength)
                : typeof _t.size == 'number'
                  ? (F = _t.size)
                  : typeof _t == 'string' &&
                    (F = typeof r == 'function' ? new r().encode(_t).byteLength : _t.length)),
            typeof F == 'number' && F > Ee)
          )
            throw new j('maxContentLength size of ' + Ee + ' exceeded', j.ERR_BAD_RESPONSE, h, V)
        }
        return (
          !ca && H && H(),
          await new Promise((F, $e) => {
            Cy(F, $e, {
              data: _t,
              headers: _e.from(At.headers),
              status: At.status,
              statusText: At.statusText,
              config: h,
              request: V,
            })
          })
        )
      } catch (B) {
        if ((H && H(), N && N.aborted && N.reason instanceof j)) {
          const pe = N.reason
          throw (
            (pe.config = h),
            V && (pe.request = V),
            B !== pe &&
              Object.defineProperty(pe, 'cause', {
                __proto__: null,
                value: B,
                writable: !0,
                enumerable: !1,
                configurable: !0,
              }),
            pe
          )
        }
        if (Ue) throw (V && !Ue.request && (Ue.request = V), Ue)
        if (B instanceof j) throw (V && !B.request && (B.request = V), B)
        if (B && B.name === 'TypeError' && /Load failed|fetch/i.test(B.message)) {
          const pe = new j('Network Error', j.ERR_NETWORK, h, V, B && B.response)
          throw (
            Object.defineProperty(pe, 'cause', {
              __proto__: null,
              value: B.cause || B,
              writable: !0,
              enumerable: !1,
              configurable: !0,
            }),
            pe
          )
        }
        throw j.from(B, B && B.code, h, V, B && B.response)
      }
    }
  },
  q2 = new Map(),
  Ry = (e) => {
    let t = (e && e.env) || {}
    const { fetch: n, Request: r, Response: i } = t,
      s = [r, i, n]
    let o = s.length,
      a = o,
      l,
      u,
      c = q2
    for (; a--;)
      ((l = s[a]), (u = c.get(l)), u === void 0 && c.set(l, (u = a ? new Map() : K2(t))), (c = u))
    return u
  }
Ry()
const Dc = { http: o2, xhr: F2, fetch: { get: Ry } }
E.forEach(Dc, (e, t) => {
  if (e) {
    try {
      Object.defineProperty(e, 'name', { __proto__: null, value: t })
    } catch {}
    Object.defineProperty(e, 'adapterName', { __proto__: null, value: t })
  }
})
const sh = (e) => `- ${e}`,
  G2 = (e) => E.isFunction(e) || e === null || e === !1
function X2(e, t) {
  e = E.isArray(e) ? e : [e]
  const { length: n } = e
  let r, i
  const s = {}
  for (let o = 0; o < n; o++) {
    r = e[o]
    let a
    if (((i = r), !G2(r) && ((i = Dc[(a = String(r)).toLowerCase()]), i === void 0)))
      throw new j(`Unknown adapter '${a}'`)
    if (i && (E.isFunction(i) || (i = i.get(t)))) break
    s[a || '#' + o] = i
  }
  if (!i) {
    const o = Object.entries(s).map(
      ([l, u]) =>
        `adapter ${l} ` +
        (u === !1 ? 'is not supported by the environment' : 'is not available in the build'),
    )
    let a = n
      ? o.length > 1
        ? `since :
` +
          o.map(sh).join(`
`)
        : ' ' + sh(o[0])
      : 'as no adapter specified'
    throw new j('There is no suitable adapter to dispatch the request ' + a, j.ERR_NOT_SUPPORT)
  }
  return i
}
const Ay = { getAdapter: X2, adapters: Dc }
function za(e) {
  if ((e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted))
    throw new ns(null, e)
}
function oh(e) {
  return (
    za(e),
    (e.headers = _e.from(e.headers)),
    (e.data = Ba.call(e, e.transformRequest)),
    ['post', 'put', 'patch'].indexOf(e.method) !== -1 &&
      e.headers.setContentType('application/x-www-form-urlencoded', !1),
    Ay.getAdapter(
      e.adapter || ts.adapter,
      e,
    )(e).then(
      function (r) {
        ;(za(e), (e.response = r))
        try {
          r.data = Ba.call(e, e.transformResponse, r)
        } finally {
          delete e.response
        }
        return ((r.headers = _e.from(r.headers)), r)
      },
      function (r) {
        if (!Py(r) && (za(e), r && r.response)) {
          e.response = r.response
          try {
            r.response.data = Ba.call(e, e.transformResponse, r.response)
          } finally {
            delete e.response
          }
          r.response.headers = _e.from(r.response.headers)
        }
        return Promise.reject(r)
      },
    )
  )
}
const ra = {}
;['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((e, t) => {
  ra[e] = function (r) {
    return typeof r === e || 'a' + (t < 1 ? 'n ' : ' ') + e
  }
})
const ah = {}
ra.transitional = function (t, n, r) {
  function i(s, o) {
    return '[Axios v' + Nc + "] Transitional option '" + s + "'" + o + (r ? '. ' + r : '')
  }
  return (s, o, a) => {
    if (t === !1) throw new j(i(o, ' has been removed' + (n ? ' in ' + n : '')), j.ERR_DEPRECATED)
    return (
      n &&
        !ah[o] &&
        ((ah[o] = !0),
        console.warn(
          i(o, ' has been deprecated since v' + n + ' and will be removed in the near future'),
        )),
      t ? t(s, o, a) : !0
    )
  }
}
ra.spelling = function (t) {
  return (n, r) => (console.warn(`${r} is likely a misspelling of ${t}`), !0)
}
function Q2(e, t, n) {
  if (typeof e != 'object' || e === null)
    throw new j('options must be an object', j.ERR_BAD_OPTION_VALUE)
  const r = Object.keys(e)
  let i = r.length
  for (; i-- > 0;) {
    const s = r[i],
      o = Object.prototype.hasOwnProperty.call(t, s) ? t[s] : void 0
    if (o) {
      const a = e[s],
        l = a === void 0 || o(a, s, e)
      if (l !== !0) throw new j('option ' + s + ' must be ' + l, j.ERR_BAD_OPTION_VALUE)
      continue
    }
    if (n !== !0) throw new j('Unknown option ' + s, j.ERR_BAD_OPTION)
  }
}
const qs = { assertOptions: Q2, validators: ra },
  ke = qs.validators
let In = class {
  constructor(t) {
    ;((this.defaults = t || {}), (this.interceptors = { request: new Xd(), response: new Xd() }))
  }
  async request(t, n) {
    try {
      return await this._request(t, n)
    } catch (r) {
      if (r instanceof Error) {
        let i = {}
        Error.captureStackTrace ? Error.captureStackTrace(i) : (i = new Error())
        const s = (() => {
          if (!i.stack) return ''
          const o = i.stack.indexOf(`
`)
          return o === -1 ? '' : i.stack.slice(o + 1)
        })()
        try {
          if (!r.stack) r.stack = s
          else if (s) {
            const o = s.indexOf(`
`),
              a =
                o === -1
                  ? -1
                  : s.indexOf(
                      `
`,
                      o + 1,
                    ),
              l = a === -1 ? '' : s.slice(a + 1)
            String(r.stack).endsWith(l) ||
              (r.stack +=
                `
` + s)
          }
        } catch {}
      }
      throw r
    }
  }
  _request(t, n) {
    ;(typeof t == 'string' ? ((n = n || {}), (n.url = t)) : (n = t || {}),
      (n = Gn(this.defaults, n)))
    const { transitional: r, paramsSerializer: i, headers: s } = n
    ;(r !== void 0 &&
      qs.assertOptions(
        r,
        {
          silentJSONParsing: ke.transitional(ke.boolean),
          forcedJSONParsing: ke.transitional(ke.boolean),
          clarifyTimeoutError: ke.transitional(ke.boolean),
          legacyInterceptorReqResOrdering: ke.transitional(ke.boolean),
          advertiseZstdAcceptEncoding: ke.transitional(ke.boolean),
          validateStatusUndefinedResolves: ke.transitional(ke.boolean),
        },
        !1,
      ),
      i != null &&
        (E.isFunction(i)
          ? (n.paramsSerializer = { serialize: i })
          : qs.assertOptions(i, { encode: ke.function, serialize: ke.function }, !0)),
      n.allowAbsoluteUrls !== void 0 ||
        (this.defaults.allowAbsoluteUrls !== void 0
          ? (n.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls)
          : (n.allowAbsoluteUrls = !0)),
      qs.assertOptions(
        n,
        { baseUrl: ke.spelling('baseURL'), withXsrfToken: ke.spelling('withXSRFToken') },
        !0,
      ),
      (n.method = (n.method || this.defaults.method || 'get').toLowerCase()))
    let o = s && E.merge(s.common, s[n.method])
    ;(s &&
      E.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'query', 'common'], (v) => {
        delete s[v]
      }),
      (n.headers = _e.concat(o, s)))
    const a = []
    let l = !0
    this.interceptors.request.forEach(function (x) {
      if (typeof x.runWhen == 'function' && x.runWhen(n) === !1) return
      l = l && x.synchronous
      const S = n.transitional || Oc
      S && S.legacyInterceptorReqResOrdering
        ? a.unshift(x.fulfilled, x.rejected)
        : a.push(x.fulfilled, x.rejected)
    })
    const u = []
    this.interceptors.response.forEach(function (x) {
      u.push(x.fulfilled, x.rejected)
    })
    let c,
      f = 0,
      d
    if (!l) {
      const v = [oh.bind(this), void 0]
      for (v.unshift(...a), v.push(...u), d = v.length, c = Promise.resolve(n); f < d;)
        c = c.then(v[f++], v[f++])
      return c
    }
    d = a.length
    let g = n
    for (; f < d;) {
      const v = a[f++],
        x = a[f++]
      try {
        g = v(g)
      } catch (S) {
        x.call(this, S)
        break
      }
    }
    try {
      c = oh.call(this, g)
    } catch (v) {
      return Promise.reject(v)
    }
    for (f = 0, d = u.length; f < d;) c = c.then(u[f++], u[f++])
    return c
  }
  getUri(t) {
    t = Gn(this.defaults, t)
    const n = ky(t.baseURL, t.url, t.allowAbsoluteUrls, t)
    return wy(n, t.params, t.paramsSerializer)
  }
}
E.forEach(['delete', 'get', 'head', 'options'], function (t) {
  In.prototype[t] = function (n, r) {
    return this.request(
      Gn(r || {}, { method: t, url: n, data: r && E.hasOwnProp(r, 'data') ? r.data : void 0 }),
    )
  }
})
E.forEach(['post', 'put', 'patch', 'query'], function (t) {
  function n(r) {
    return function (s, o, a) {
      return this.request(
        Gn(a || {}, {
          method: t,
          headers: r ? { 'Content-Type': 'multipart/form-data' } : {},
          url: s,
          data: o,
        }),
      )
    }
  }
  ;((In.prototype[t] = n()), t !== 'query' && (In.prototype[t + 'Form'] = n(!0)))
})
let Y2 = class _y {
  constructor(t) {
    if (typeof t != 'function') throw new TypeError('executor must be a function.')
    let n
    this.promise = new Promise(function (s) {
      n = s
    })
    const r = this
    ;(this.promise.then((i) => {
      if (!r._listeners) return
      let s = r._listeners.length
      for (; s-- > 0;) r._listeners[s](i)
      r._listeners = null
    }),
      (this.promise.then = (i) => {
        let s
        const o = new Promise((a) => {
          ;(r.subscribe(a), (s = a))
        }).then(i)
        return (
          (o.cancel = function () {
            r.unsubscribe(s)
          }),
          o
        )
      }),
      t(function (s, o, a) {
        r.reason || ((r.reason = new ns(s, o, a)), n(r.reason))
      }))
  }
  throwIfRequested() {
    if (this.reason) throw this.reason
  }
  subscribe(t) {
    if (this.reason) {
      t(this.reason)
      return
    }
    this._listeners ? this._listeners.push(t) : (this._listeners = [t])
  }
  unsubscribe(t) {
    if (!this._listeners) return
    const n = this._listeners.indexOf(t)
    n !== -1 && this._listeners.splice(n, 1)
  }
  toAbortSignal() {
    const t = new AbortController(),
      n = (r) => {
        t.abort(r)
      }
    return (this.subscribe(n), (t.signal.unsubscribe = () => this.unsubscribe(n)), t.signal)
  }
  static source() {
    let t
    return {
      token: new _y(function (i) {
        t = i
      }),
      cancel: t,
    }
  }
}
function J2(e) {
  return function (n) {
    return e.apply(null, n)
  }
}
function Z2(e) {
  return E.isObject(e) && e.isAxiosError === !0
}
const lu = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
  WebServerIsDown: 521,
  ConnectionTimedOut: 522,
  OriginIsUnreachable: 523,
  TimeoutOccurred: 524,
  SslHandshakeFailed: 525,
  InvalidSslCertificate: 526,
}
Object.entries(lu).forEach(([e, t]) => {
  lu[t] = e
})
function jy(e) {
  const t = new In(e),
    n = oy(In.prototype.request, t)
  return (
    E.extend(n, In.prototype, t, { allOwnKeys: !0 }),
    E.extend(n, t, null, { allOwnKeys: !0 }),
    (n.create = function (i) {
      return jy(Gn(e, i))
    }),
    n
  )
}
const ie = jy(ts)
ie.Axios = In
ie.CanceledError = ns
ie.CancelToken = Y2
ie.isCancel = Py
ie.VERSION = Nc
ie.toFormData = na
ie.AxiosError = j
ie.Cancel = ie.CanceledError
ie.all = function (t) {
  return Promise.all(t)
}
ie.spread = J2
ie.isAxiosError = Z2
ie.mergeConfig = Gn
ie.AxiosHeaders = _e
ie.formToJSON = (e) => Ey(E.isHTMLForm(e) ? new FormData(e) : e)
ie.getAdapter = Ay.getAdapter
ie.HttpStatusCode = lu
ie.default = ie
const {
    Axios: wA,
    AxiosError: SA,
    CanceledError: EA,
    isCancel: PA,
    CancelToken: CA,
    VERSION: kA,
    all: TA,
    Cancel: RA,
    isAxiosError: AA,
    spread: _A,
    toFormData: jA,
    AxiosHeaders: OA,
    HttpStatusCode: LA,
    formToJSON: NA,
    getAdapter: DA,
    mergeConfig: MA,
    create: bA,
  } = ie,
  uu = 'hostal-cofee-token',
  Ua = 'hostal-cofee-refresh',
  St = ie.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } })
St.interceptors.request.use((e) => {
  const t = localStorage.getItem(uu)
  return (t && (e.headers.Authorization = `Bearer ${t}`), e)
})
let $a = !1,
  cu = []
const lh = (e, t = null) => {
  ;(cu.forEach((n) => {
    e ? n.reject(e) : n.resolve(t)
  }),
    (cu = []))
}
St.interceptors.response.use(
  (e) => e,
  async (e) => {
    var n
    const t = e.config
    if (((n = e.response) == null ? void 0 : n.status) === 401 && !t._retry) {
      const r = localStorage.getItem(Ua)
      if (!r) return Promise.reject(e)
      if ($a)
        return new Promise((i, s) => {
          cu.push({ resolve: i, reject: s })
        }).then((i) => ((t.headers.Authorization = `Bearer ${i}`), St(t)))
      ;((t._retry = !0), ($a = !0))
      try {
        const i = await ie.post('/api/auth/refresh', { refreshToken: r }),
          { accessToken: s, refreshToken: o } = i.data.data
        return (
          localStorage.setItem(uu, s),
          localStorage.setItem(Ua, o),
          lh(null, s),
          (t.headers.Authorization = `Bearer ${s}`),
          St(t)
        )
      } catch (i) {
        return (
          lh(i, null),
          localStorage.removeItem(uu),
          localStorage.removeItem(Ua),
          (window.location.href = '/login'),
          Promise.reject(i)
        )
      } finally {
        $a = !1
      }
    }
    return Promise.reject(e)
  },
)
const FA = {
    sendOrder: (e, t) => {
      const n = encodeURIComponent(`🍽️ *Nuevo Pedido - Hostal Cofee*

${t}

¡Gracias por tu pedido!`)
      window.open(`https://wa.me/${e}?text=${n}`, '_blank')
    },
    sendReservation: (e, t) => {
      const n = encodeURIComponent(`📅 *Nueva Reserva - Hostal Cofee*

${t}`)
      window.open(`https://wa.me/${e}?text=${n}`, '_blank')
    },
  },
  Oy = w.createContext(null),
  Wa = 'hostal-cofee-token',
  Rs = 'hostal-cofee-refresh'
function eP({ children: e }) {
  const [t, n] = w.useState(null),
    [r, i] = w.useState(!0),
    s = (f, d) => {
      ;(localStorage.setItem(Wa, f), localStorage.setItem(Rs, d))
    },
    o = () => {
      ;(localStorage.removeItem(Wa), localStorage.removeItem(Rs))
    },
    a = w.useCallback(async () => {
      const f = localStorage.getItem(Rs)
      if (!f) return !1
      try {
        const d = await St.post('/auth/refresh', { refreshToken: f }),
          { accessToken: g, refreshToken: v } = d.data.data
        return (s(g, v), !0)
      } catch {
        return (o(), !1)
      }
    }, [])
  w.useEffect(() => {
    if (!localStorage.getItem(Wa)) {
      i(!1)
      return
    }
    St.get('/auth/me')
      .then((d) => n(d.data.data))
      .catch(async () => {
        if (await a())
          try {
            const g = await St.get('/auth/me')
            n(g.data.data)
          } catch {
            o()
          }
        else o()
      })
      .finally(() => i(!1))
  }, [a])
  const l = async (f, d) => {
      try {
        const g = await St.post('/auth/login', { email: f, password: d }),
          { accessToken: v, refreshToken: x, user: S } = g.data.data
        return (s(v, x), n(S), !0)
      } catch {
        return !1
      }
    },
    u = async (f, d, g) => {
      try {
        const v = await St.post('/auth/register', { name: f, email: d, password: g }),
          { accessToken: x, refreshToken: S, user: h } = v.data.data
        return (s(x, S), n(h), !0)
      } catch {
        return !1
      }
    },
    c = () => {
      const f = localStorage.getItem(Rs)
      ;(f && St.post('/auth/logout', { refreshToken: f }).catch(() => {}), o(), n(null))
    }
  return y.jsx(Oy.Provider, {
    value: {
      user: t,
      login: l,
      register: u,
      logout: c,
      isAdmin: (t == null ? void 0 : t.role) === 'admin',
      loading: r,
    },
    children: e,
  })
}
function Mc() {
  const e = w.useContext(Oy)
  if (!e) throw new Error('useAuth must be used within AuthProvider')
  return e
}
function tP() {
  const [e, t] = w.useState(!1),
    [n, r] = w.useState(!1),
    { itemCount: i } = tE(),
    { user: s, logout: o, isAdmin: a } = Mc(),
    l = En()
  ;(w.useEffect(() => {
    let c = !1
    const f = () => {
      c ||
        (requestAnimationFrame(() => {
          ;(r(window.scrollY > 50), (c = !1))
        }),
        (c = !0))
    }
    return (
      window.addEventListener('scroll', f, { passive: !0 }),
      () => window.removeEventListener('scroll', f)
    )
  }, []),
    w.useEffect(() => {
      t(!1)
    }, [l]))
  const u = [
    { to: '/', label: 'Inicio' },
    { to: '/menu', label: 'Menú' },
    { to: '/reservas', label: 'Reservas' },
  ]
  return y.jsxs('nav', {
    className: `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${n ? 'bg-black/95 backdrop-blur-md shadow-xl' : 'bg-transparent'}`,
    children: [
      y.jsxs('div', {
        className: 'container-main flex items-center justify-between h-20',
        children: [
          y.jsxs(ve, {
            to: '/',
            className: 'flex items-center gap-2',
            children: [
              y.jsx('span', {
                className: 'text-3xl font-display text-primary font-bold',
                children: 'Hostal',
              }),
              y.jsx('span', {
                className: 'text-3xl font-display text-gold font-bold',
                children: 'Cofre',
              }),
            ],
          }),
          y.jsx('div', {
            className: 'hidden md:flex items-center gap-8',
            children: u.map((c) =>
              y.jsx(
                ve,
                {
                  to: c.to,
                  className: `text-white/80 hover:text-white font-semibold transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 ${l.pathname === c.to ? 'text-white after:w-full' : 'after:w-0 hover:after:w-full'}`,
                  children: c.label,
                },
                c.to,
              ),
            ),
          }),
          y.jsxs('div', {
            className: 'hidden md:flex items-center gap-4',
            children: [
              y.jsxs(ve, {
                to: '/carrito',
                className: 'relative text-white/80 hover:text-white transition-colors',
                children: [
                  y.jsx(iu, { size: 24 }),
                  i > 0 &&
                    y.jsx('span', {
                      className:
                        'absolute -top-2 -right-2 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce',
                      children: i,
                    }),
                ],
              }),
              s
                ? y.jsxs('div', {
                    className: 'flex items-center gap-3',
                    children: [
                      a &&
                        y.jsx(ve, {
                          to: '/admin',
                          className:
                            'text-white/80 hover:text-gold transition-colors text-sm font-semibold',
                          children: 'Panel Admin',
                        }),
                      y.jsx('button', {
                        onClick: o,
                        className: 'text-white/60 hover:text-white transition-colors',
                        children: y.jsx(iy, { size: 20 }),
                      }),
                    ],
                  })
                : y.jsx(ve, {
                    to: '/login',
                    className: 'text-white/80 hover:text-white transition-colors',
                    children: y.jsx(US, { size: 24 }),
                  }),
            ],
          }),
          y.jsxs('div', {
            className: 'flex md:hidden items-center gap-4',
            children: [
              y.jsxs(ve, {
                to: '/carrito',
                className: 'relative text-white/80',
                children: [
                  y.jsx(iu, { size: 22 }),
                  i > 0 &&
                    y.jsx('span', {
                      className:
                        'absolute -top-2 -right-2 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold',
                      children: i,
                    }),
                ],
              }),
              y.jsx('button', {
                onClick: () => t(!e),
                className: 'text-white',
                children: e ? y.jsx(ny, { size: 28 }) : y.jsx(ry, { size: 28 }),
              }),
            ],
          }),
        ],
      }),
      y.jsx('div', {
        className: `md:hidden overflow-hidden transition-all duration-300 ${e ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`,
        children: y.jsxs('div', {
          className:
            'bg-black/95 backdrop-blur-md border-t border-white/10 px-4 py-6 flex flex-col gap-4',
          children: [
            u.map((c) =>
              y.jsx(
                ve,
                {
                  to: c.to,
                  className: `text-white/80 hover:text-white font-semibold py-2 transition-colors ${l.pathname === c.to ? 'text-white' : ''}`,
                  children: c.label,
                },
                c.to,
              ),
            ),
            s
              ? y.jsxs(y.Fragment, {
                  children: [
                    a &&
                      y.jsx(ve, {
                        to: '/admin',
                        className: 'text-gold font-semibold py-2',
                        children: 'Panel Admin',
                      }),
                    y.jsx('button', {
                      onClick: o,
                      className: 'text-white/60 hover:text-white text-left py-2',
                      children: 'Cerrar Sesión',
                    }),
                  ],
                })
              : y.jsx(ve, {
                  to: '/login',
                  className: 'text-white/80 hover:text-white font-semibold py-2',
                  children: 'Iniciar Sesión',
                }),
          ],
        }),
      }),
    ],
  })
}
const nP = w.memo(tP)
function rP() {
  return y.jsx('footer', {
    className: 'bg-black text-white/80',
    children: y.jsxs('div', {
      className: 'container-main py-12',
      children: [
        y.jsxs('div', {
          className: 'grid grid-cols-1 md:grid-cols-3 gap-8',
          children: [
            y.jsxs('div', {
              children: [
                y.jsxs('h3', {
                  className: 'font-display text-2xl mb-4',
                  children: [
                    y.jsx('span', { className: 'text-primary', children: 'Hostal' }),
                    ' ',
                    y.jsx('span', { className: 'text-gold', children: 'Cofre' }),
                  ],
                }),
                y.jsx('p', {
                  className: 'text-white/60 leading-relaxed',
                  children:
                    'Donde el sabor se encuentra con la tradición. Experiencia gastronómica única desde 2020.',
                }),
              ],
            }),
            y.jsxs('div', {
              children: [
                y.jsx('h4', { className: 'font-display text-xl mb-4', children: 'Enlaces' }),
                y.jsx('ul', {
                  className: 'space-y-2',
                  children: [
                    { to: '/menu', label: 'Menú' },
                    { to: '/reservas', label: 'Reservas' },
                    { to: '/carrito', label: 'Carrito' },
                  ].map((e) =>
                    y.jsx(
                      'li',
                      {
                        children: y.jsx(ve, {
                          to: e.to,
                          className: 'text-white/60 hover:text-primary transition-colors',
                          children: e.label,
                        }),
                      },
                      e.to,
                    ),
                  ),
                }),
              ],
            }),
            y.jsxs('div', {
              children: [
                y.jsx('h4', { className: 'font-display text-xl mb-4', children: 'Contacto' }),
                y.jsxs('div', {
                  className: 'space-y-3 text-white/60',
                  children: [
                    y.jsxs('p', {
                      className: 'flex items-center gap-2',
                      children: [y.jsx($S, {}), ' (601) 234-5678'],
                    }),
                    y.jsx('p', { children: 'Av. Principal 123, Bogotá' }),
                    y.jsx('p', { children: 'Lun-Dom 12pm - 11pm' }),
                  ],
                }),
                y.jsxs('div', {
                  className: 'flex gap-4 mt-4',
                  children: [
                    y.jsx('a', {
                      href: '#',
                      className:
                        'w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors',
                      children: y.jsx(qS, { size: 18 }),
                    }),
                    y.jsx('a', {
                      href: '#',
                      className:
                        'w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors',
                      children: y.jsx(WS, { size: 18 }),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        y.jsx('div', {
          className: 'border-t border-white/10 mt-8 pt-8 text-center text-white/40 text-sm',
          children: y.jsxs('p', {
            children: [
              '© ',
              new Date().getFullYear(),
              ' Hostal Cofee. Todos los derechos reservados.',
            ],
          }),
        }),
      ],
    }),
  })
}
function iP() {
  return y.jsxs('div', {
    className: 'min-h-screen flex flex-col',
    children: [
      y.jsx(nP, {}),
      y.jsx('main', { className: 'flex-1', children: y.jsx(Kg, {}) }),
      y.jsx(rP, {}),
    ],
  })
}
const sP = [
  { to: '/admin', label: 'Dashboard', icon: KS, exact: !0 },
  { to: '/admin/pos', label: 'Punto de Venta', icon: iu, accent: !0 },
  { to: '/admin/pedidos', label: 'Pedidos', icon: QS },
  { to: '/admin/mesas', label: 'Mesas', icon: zS },
  { to: '/admin/menu', label: 'Menú', icon: XS },
  { to: '/admin/turnos', label: 'Turnos', icon: Wd },
  { to: '/admin/reportes', label: 'Reportes', icon: YS },
  { to: '/admin/reservas', label: 'Reservas', icon: Wd },
]
function oP({ isOpen: e, onClose: t }) {
  var o
  const n = En(),
    { user: r, logout: i } = Mc(),
    s = (a, l) => (l ? n.pathname === a : n.pathname.startsWith(a))
  return y.jsxs(y.Fragment, {
    children: [
      e && y.jsx('div', { className: 'fixed inset-0 bg-black/50 z-40 lg:hidden', onClick: t }),
      y.jsxs('aside', {
        className: `fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${e ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`,
        children: [
          y.jsxs('div', {
            className: 'flex items-center justify-between px-5 py-4 border-b border-gray-800',
            children: [
              y.jsxs(ve, {
                to: '/admin',
                className: 'flex items-center gap-2',
                onClick: t,
                children: [
                  y.jsx('span', {
                    className: 'text-2xl font-display text-primary font-bold',
                    children: 'Hostal',
                  }),
                  y.jsx('span', {
                    className: 'text-2xl font-display text-gold font-bold',
                    children: 'Cofre',
                  }),
                ],
              }),
              y.jsx('button', {
                onClick: t,
                className:
                  'lg:hidden w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors',
                children: y.jsx(ny, { size: 16 }),
              }),
            ],
          }),
          y.jsx('nav', {
            className: 'flex-1 overflow-y-auto py-4 px-3',
            children: y.jsx('div', {
              className: 'space-y-1',
              children: sP.map((a) => {
                const l = a.icon,
                  u = s(a.to, a.exact)
                return y.jsxs(
                  ve,
                  {
                    to: a.to,
                    onClick: t,
                    className: `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${u ? 'bg-primary text-white shadow-lg shadow-primary/20' : a.accent ? 'text-green-400 hover:bg-gray-800 hover:text-green-300' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`,
                    children: [y.jsx(l, { size: 18 }), a.label],
                  },
                  a.to,
                )
              }),
            }),
          }),
          y.jsxs('div', {
            className: 'border-t border-gray-800 px-3 py-3 space-y-1',
            children: [
              y.jsxs(ve, {
                to: '/',
                className:
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors',
                onClick: t,
                children: [y.jsx(GS, { size: 18 }), 'Ver Sitio Público'],
              }),
              y.jsxs(ve, {
                to: '/menu',
                className:
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors',
                onClick: t,
                children: [y.jsx(HS, { size: 18 }), 'Ver Menú'],
              }),
            ],
          }),
          y.jsxs('div', {
            className: 'border-t border-gray-800 px-3 py-3',
            children: [
              y.jsxs('div', {
                className: 'flex items-center gap-3 px-3 mb-2',
                children: [
                  y.jsx('div', {
                    className:
                      'w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold',
                    children:
                      ((o = r == null ? void 0 : r.name) == null ? void 0 : o.charAt(0)) || 'A',
                  }),
                  y.jsxs('div', {
                    className: 'flex-1 min-w-0',
                    children: [
                      y.jsx('p', {
                        className: 'text-sm font-semibold text-white truncate',
                        children: (r == null ? void 0 : r.name) || 'Admin',
                      }),
                      y.jsx('p', {
                        className: 'text-xs text-gray-500 truncate',
                        children: r == null ? void 0 : r.email,
                      }),
                    ],
                  }),
                ],
              }),
              y.jsxs('button', {
                onClick: i,
                className:
                  'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors',
                children: [y.jsx(iy, { size: 18 }), 'Cerrar Sesión'],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}
function aP() {
  const [e, t] = w.useState(!1)
  return y.jsxs('div', {
    className: 'min-h-screen bg-gray-100 flex',
    children: [
      y.jsx(oP, { isOpen: e, onClose: () => t(!1) }),
      y.jsxs('div', {
        className: 'flex-1 flex flex-col min-h-screen lg:ml-64',
        children: [
          y.jsxs('header', {
            className:
              'bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 sticky top-0 z-30',
            children: [
              y.jsx('button', {
                onClick: () => t(!0),
                className:
                  'lg:hidden w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors',
                children: y.jsx(ry, { size: 20 }),
              }),
              y.jsx('div', { className: 'flex-1' }),
              y.jsx('div', {
                className: 'text-sm text-gray-500 hidden sm:block',
                children: new Date().toLocaleDateString('es-CO', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }),
              }),
            ],
          }),
          y.jsx('main', { className: 'flex-1 p-4 md:p-6', children: y.jsx(Kg, {}) }),
        ],
      }),
    ],
  })
}
const bc = w.createContext({})
function Fc(e) {
  const t = w.useRef(null)
  return (t.current === null && (t.current = e()), t.current)
}
const ia = w.createContext(null),
  Vc = w.createContext({ transformPagePoint: (e) => e, isStatic: !1, reducedMotion: 'never' })
class lP extends w.Component {
  getSnapshotBeforeUpdate(t) {
    const n = this.props.childRef.current
    if (n && t.isPresent && !this.props.isPresent) {
      const r = this.props.sizeRef.current
      ;((r.height = n.offsetHeight || 0),
        (r.width = n.offsetWidth || 0),
        (r.top = n.offsetTop),
        (r.left = n.offsetLeft))
    }
    return null
  }
  componentDidUpdate() {}
  render() {
    return this.props.children
  }
}
function uP({ children: e, isPresent: t }) {
  const n = w.useId(),
    r = w.useRef(null),
    i = w.useRef({ width: 0, height: 0, top: 0, left: 0 }),
    { nonce: s } = w.useContext(Vc)
  return (
    w.useInsertionEffect(() => {
      const { width: o, height: a, top: l, left: u } = i.current
      if (t || !r.current || !o || !a) return
      r.current.dataset.motionPopId = n
      const c = document.createElement('style')
      return (
        s && (c.nonce = s),
        document.head.appendChild(c),
        c.sheet &&
          c.sheet.insertRule(`
          [data-motion-pop-id="${n}"] {
            position: absolute !important;
            width: ${o}px !important;
            height: ${a}px !important;
            top: ${l}px !important;
            left: ${u}px !important;
          }
        `),
        () => {
          document.head.removeChild(c)
        }
      )
    }, [t]),
    y.jsx(lP, { isPresent: t, childRef: r, sizeRef: i, children: w.cloneElement(e, { ref: r }) })
  )
}
const cP = ({
  children: e,
  initial: t,
  isPresent: n,
  onExitComplete: r,
  custom: i,
  presenceAffectsLayout: s,
  mode: o,
}) => {
  const a = Fc(fP),
    l = w.useId(),
    u = w.useCallback(
      (f) => {
        a.set(f, !0)
        for (const d of a.values()) if (!d) return
        r && r()
      },
      [a, r],
    ),
    c = w.useMemo(
      () => ({
        id: l,
        initial: t,
        isPresent: n,
        custom: i,
        onExitComplete: u,
        register: (f) => (a.set(f, !1), () => a.delete(f)),
      }),
      s ? [Math.random(), u] : [n, u],
    )
  return (
    w.useMemo(() => {
      a.forEach((f, d) => a.set(d, !1))
    }, [n]),
    w.useEffect(() => {
      !n && !a.size && r && r()
    }, [n]),
    o === 'popLayout' && (e = y.jsx(uP, { isPresent: n, children: e })),
    y.jsx(ia.Provider, { value: c, children: e })
  )
}
function fP() {
  return new Map()
}
function Ly(e = !0) {
  const t = w.useContext(ia)
  if (t === null) return [!0, null]
  const { isPresent: n, onExitComplete: r, register: i } = t,
    s = w.useId()
  w.useEffect(() => {
    e && i(s)
  }, [e])
  const o = w.useCallback(() => e && r && r(s), [s, r, e])
  return !n && r ? [!1, o] : [!0]
}
const As = (e) => e.key || ''
function uh(e) {
  const t = []
  return (
    w.Children.forEach(e, (n) => {
      w.isValidElement(n) && t.push(n)
    }),
    t
  )
}
const Ic = typeof window < 'u',
  Ny = Ic ? w.useLayoutEffect : w.useEffect,
  dP = ({
    children: e,
    custom: t,
    initial: n = !0,
    onExitComplete: r,
    presenceAffectsLayout: i = !0,
    mode: s = 'sync',
    propagate: o = !1,
  }) => {
    const [a, l] = Ly(o),
      u = w.useMemo(() => uh(e), [e]),
      c = o && !a ? [] : u.map(As),
      f = w.useRef(!0),
      d = w.useRef(u),
      g = Fc(() => new Map()),
      [v, x] = w.useState(u),
      [S, h] = w.useState(u)
    Ny(() => {
      ;((f.current = !1), (d.current = u))
      for (let P = 0; P < S.length; P++) {
        const C = As(S[P])
        c.includes(C) ? g.delete(C) : g.get(C) !== !0 && g.set(C, !1)
      }
    }, [S, c.length, c.join('-')])
    const p = []
    if (u !== v) {
      let P = [...u]
      for (let C = 0; C < S.length; C++) {
        const k = S[C],
          A = As(k)
        c.includes(A) || (P.splice(C, 0, k), p.push(k))
      }
      ;(s === 'wait' && p.length && (P = p), h(uh(P)), x(u))
      return
    }
    const { forceRender: m } = w.useContext(bc)
    return y.jsx(y.Fragment, {
      children: S.map((P) => {
        const C = As(P),
          k = o && !a ? !1 : u === S || c.includes(C),
          A = () => {
            if (g.has(C)) g.set(C, !0)
            else return
            let T = !0
            ;(g.forEach((b) => {
              b || (T = !1)
            }),
              T && (m == null || m(), h(d.current), o && (l == null || l()), r && r()))
          }
        return y.jsx(
          cP,
          {
            isPresent: k,
            initial: !f.current || n ? void 0 : !1,
            custom: k ? void 0 : t,
            presenceAffectsLayout: i,
            mode: s,
            onExitComplete: k ? void 0 : A,
            children: P,
          },
          C,
        )
      }),
    })
  },
  qe = (e) => e
let Dy = qe
function Bc(e) {
  let t
  return () => (t === void 0 && (t = e()), t)
}
const Nr = (e, t, n) => {
    const r = t - e
    return r === 0 ? 1 : (n - e) / r
  },
  bt = (e) => e * 1e3,
  Ft = (e) => e / 1e3,
  hP = { useManualTiming: !1 }
function pP(e) {
  let t = new Set(),
    n = new Set(),
    r = !1,
    i = !1
  const s = new WeakSet()
  let o = { delta: 0, timestamp: 0, isProcessing: !1 }
  function a(u) {
    ;(s.has(u) && (l.schedule(u), e()), u(o))
  }
  const l = {
    schedule: (u, c = !1, f = !1) => {
      const g = f && r ? t : n
      return (c && s.add(u), g.has(u) || g.add(u), u)
    },
    cancel: (u) => {
      ;(n.delete(u), s.delete(u))
    },
    process: (u) => {
      if (((o = u), r)) {
        i = !0
        return
      }
      ;((r = !0),
        ([t, n] = [n, t]),
        t.forEach(a),
        t.clear(),
        (r = !1),
        i && ((i = !1), l.process(u)))
    },
  }
  return l
}
const _s = ['read', 'resolveKeyframes', 'update', 'preRender', 'render', 'postRender'],
  mP = 40
function My(e, t) {
  let n = !1,
    r = !0
  const i = { delta: 0, timestamp: 0, isProcessing: !1 },
    s = () => (n = !0),
    o = _s.reduce((h, p) => ((h[p] = pP(s)), h), {}),
    { read: a, resolveKeyframes: l, update: u, preRender: c, render: f, postRender: d } = o,
    g = () => {
      const h = performance.now()
      ;((n = !1),
        (i.delta = r ? 1e3 / 60 : Math.max(Math.min(h - i.timestamp, mP), 1)),
        (i.timestamp = h),
        (i.isProcessing = !0),
        a.process(i),
        l.process(i),
        u.process(i),
        c.process(i),
        f.process(i),
        d.process(i),
        (i.isProcessing = !1),
        n && t && ((r = !1), e(g)))
    },
    v = () => {
      ;((n = !0), (r = !0), i.isProcessing || e(g))
    }
  return {
    schedule: _s.reduce((h, p) => {
      const m = o[p]
      return ((h[p] = (P, C = !1, k = !1) => (n || v(), m.schedule(P, C, k))), h)
    }, {}),
    cancel: (h) => {
      for (let p = 0; p < _s.length; p++) o[_s[p]].cancel(h)
    },
    state: i,
    steps: o,
  }
}
const {
    schedule: X,
    cancel: gn,
    state: ye,
    steps: Ha,
  } = My(typeof requestAnimationFrame < 'u' ? requestAnimationFrame : qe, !0),
  by = w.createContext({ strict: !1 }),
  ch = {
    animation: [
      'animate',
      'variants',
      'whileHover',
      'whileTap',
      'exit',
      'whileInView',
      'whileFocus',
      'whileDrag',
    ],
    exit: ['exit'],
    drag: ['drag', 'dragControls'],
    focus: ['whileFocus'],
    hover: ['whileHover', 'onHoverStart', 'onHoverEnd'],
    tap: ['whileTap', 'onTap', 'onTapStart', 'onTapCancel'],
    pan: ['onPan', 'onPanStart', 'onPanSessionStart', 'onPanEnd'],
    inView: ['whileInView', 'onViewportEnter', 'onViewportLeave'],
    layout: ['layout', 'layoutId'],
  },
  Dr = {}
for (const e in ch) Dr[e] = { isEnabled: (t) => ch[e].some((n) => !!t[n]) }
function gP(e) {
  for (const t in e) Dr[t] = { ...Dr[t], ...e[t] }
}
const yP = new Set([
  'animate',
  'exit',
  'variants',
  'initial',
  'style',
  'values',
  'variants',
  'transition',
  'transformTemplate',
  'custom',
  'inherit',
  'onBeforeLayoutMeasure',
  'onAnimationStart',
  'onAnimationComplete',
  'onUpdate',
  'onDragStart',
  'onDrag',
  'onDragEnd',
  'onMeasureDragConstraints',
  'onDirectionLock',
  'onDragTransitionEnd',
  '_dragX',
  '_dragY',
  'onHoverStart',
  'onHoverEnd',
  'onViewportEnter',
  'onViewportLeave',
  'globalTapTarget',
  'ignoreStrict',
  'viewport',
])
function _o(e) {
  return (
    e.startsWith('while') ||
    (e.startsWith('drag') && e !== 'draggable') ||
    e.startsWith('layout') ||
    e.startsWith('onTap') ||
    e.startsWith('onPan') ||
    e.startsWith('onLayout') ||
    yP.has(e)
  )
}
let Fy = (e) => !_o(e)
function vP(e) {
  e && (Fy = (t) => (t.startsWith('on') ? !_o(t) : e(t)))
}
try {
  vP(require('@emotion/is-prop-valid').default)
} catch {}
function xP(e, t, n) {
  const r = {}
  for (const i in e)
    (i === 'values' && typeof e.values == 'object') ||
      ((Fy(i) ||
        (n === !0 && _o(i)) ||
        (!t && !_o(i)) ||
        (e.draggable && i.startsWith('onDrag'))) &&
        (r[i] = e[i]))
  return r
}
function wP(e) {
  if (typeof Proxy > 'u') return e
  const t = new Map(),
    n = (...r) => e(...r)
  return new Proxy(n, {
    get: (r, i) => (i === 'create' ? e : (t.has(i) || t.set(i, e(i)), t.get(i))),
  })
}
const sa = w.createContext({})
function Ui(e) {
  return typeof e == 'string' || Array.isArray(e)
}
function oa(e) {
  return e !== null && typeof e == 'object' && typeof e.start == 'function'
}
const zc = ['animate', 'whileInView', 'whileFocus', 'whileHover', 'whileTap', 'whileDrag', 'exit'],
  Uc = ['initial', ...zc]
function aa(e) {
  return oa(e.animate) || Uc.some((t) => Ui(e[t]))
}
function Vy(e) {
  return !!(aa(e) || e.variants)
}
function SP(e, t) {
  if (aa(e)) {
    const { initial: n, animate: r } = e
    return { initial: n === !1 || Ui(n) ? n : void 0, animate: Ui(r) ? r : void 0 }
  }
  return e.inherit !== !1 ? t : {}
}
function EP(e) {
  const { initial: t, animate: n } = SP(e, w.useContext(sa))
  return w.useMemo(() => ({ initial: t, animate: n }), [fh(t), fh(n)])
}
function fh(e) {
  return Array.isArray(e) ? e.join(' ') : e
}
const PP = Symbol.for('motionComponentSymbol')
function hr(e) {
  return e && typeof e == 'object' && Object.prototype.hasOwnProperty.call(e, 'current')
}
function CP(e, t, n) {
  return w.useCallback(
    (r) => {
      ;(r && e.onMount && e.onMount(r),
        t && (r ? t.mount(r) : t.unmount()),
        n && (typeof n == 'function' ? n(r) : hr(n) && (n.current = r)))
    },
    [t],
  )
}
const $c = (e) => e.replace(/([a-z])([A-Z])/gu, '$1-$2').toLowerCase(),
  kP = 'framerAppearId',
  Iy = 'data-' + $c(kP),
  { schedule: Wc } = My(queueMicrotask, !1),
  By = w.createContext({})
function TP(e, t, n, r, i) {
  var s, o
  const { visualElement: a } = w.useContext(sa),
    l = w.useContext(by),
    u = w.useContext(ia),
    c = w.useContext(Vc).reducedMotion,
    f = w.useRef(null)
  ;((r = r || l.renderer),
    !f.current &&
      r &&
      (f.current = r(e, {
        visualState: t,
        parent: a,
        props: n,
        presenceContext: u,
        blockInitialAnimation: u ? u.initial === !1 : !1,
        reducedMotionConfig: c,
      })))
  const d = f.current,
    g = w.useContext(By)
  d && !d.projection && i && (d.type === 'html' || d.type === 'svg') && RP(f.current, n, i, g)
  const v = w.useRef(!1)
  w.useInsertionEffect(() => {
    d && v.current && d.update(n, u)
  })
  const x = n[Iy],
    S = w.useRef(
      !!x &&
        !(!((s = window.MotionHandoffIsComplete) === null || s === void 0) && s.call(window, x)) &&
        ((o = window.MotionHasOptimisedAnimation) === null || o === void 0
          ? void 0
          : o.call(window, x)),
    )
  return (
    Ny(() => {
      d &&
        ((v.current = !0),
        (window.MotionIsMounted = !0),
        d.updateFeatures(),
        Wc.render(d.render),
        S.current && d.animationState && d.animationState.animateChanges())
    }),
    w.useEffect(() => {
      d &&
        (!S.current && d.animationState && d.animationState.animateChanges(),
        S.current &&
          (queueMicrotask(() => {
            var h
            ;(h = window.MotionHandoffMarkAsComplete) === null || h === void 0 || h.call(window, x)
          }),
          (S.current = !1)))
    }),
    d
  )
}
function RP(e, t, n, r) {
  const { layoutId: i, layout: s, drag: o, dragConstraints: a, layoutScroll: l, layoutRoot: u } = t
  ;((e.projection = new n(e.latestValues, t['data-framer-portal-id'] ? void 0 : zy(e.parent))),
    e.projection.setOptions({
      layoutId: i,
      layout: s,
      alwaysMeasureLayout: !!o || (a && hr(a)),
      visualElement: e,
      animationType: typeof s == 'string' ? s : 'both',
      initialPromotionConfig: r,
      layoutScroll: l,
      layoutRoot: u,
    }))
}
function zy(e) {
  if (e) return e.options.allowProjection !== !1 ? e.projection : zy(e.parent)
}
function AP({
  preloadedFeatures: e,
  createVisualElement: t,
  useRender: n,
  useVisualState: r,
  Component: i,
}) {
  var s, o
  e && gP(e)
  function a(u, c) {
    let f
    const d = { ...w.useContext(Vc), ...u, layoutId: _P(u) },
      { isStatic: g } = d,
      v = EP(u),
      x = r(u, g)
    if (!g && Ic) {
      jP()
      const S = OP(d)
      ;((f = S.MeasureLayout), (v.visualElement = TP(i, x, d, t, S.ProjectionNode)))
    }
    return y.jsxs(sa.Provider, {
      value: v,
      children: [
        f && v.visualElement ? y.jsx(f, { visualElement: v.visualElement, ...d }) : null,
        n(i, u, CP(x, v.visualElement, c), x, g, v.visualElement),
      ],
    })
  }
  a.displayName = `motion.${typeof i == 'string' ? i : `create(${(o = (s = i.displayName) !== null && s !== void 0 ? s : i.name) !== null && o !== void 0 ? o : ''})`}`
  const l = w.forwardRef(a)
  return ((l[PP] = i), l)
}
function _P({ layoutId: e }) {
  const t = w.useContext(bc).id
  return t && e !== void 0 ? t + '-' + e : e
}
function jP(e, t) {
  w.useContext(by).strict
}
function OP(e) {
  const { drag: t, layout: n } = Dr
  if (!t && !n) return {}
  const r = { ...t, ...n }
  return {
    MeasureLayout:
      (t != null && t.isEnabled(e)) || (n != null && n.isEnabled(e)) ? r.MeasureLayout : void 0,
    ProjectionNode: r.ProjectionNode,
  }
}
const LP = [
  'animate',
  'circle',
  'defs',
  'desc',
  'ellipse',
  'g',
  'image',
  'line',
  'filter',
  'marker',
  'mask',
  'metadata',
  'path',
  'pattern',
  'polygon',
  'polyline',
  'rect',
  'stop',
  'switch',
  'symbol',
  'svg',
  'text',
  'tspan',
  'use',
  'view',
]
function Hc(e) {
  return typeof e != 'string' || e.includes('-') ? !1 : !!(LP.indexOf(e) > -1 || /[A-Z]/u.test(e))
}
function dh(e) {
  const t = [{}, {}]
  return (
    e == null ||
      e.values.forEach((n, r) => {
        ;((t[0][r] = n.get()), (t[1][r] = n.getVelocity()))
      }),
    t
  )
}
function Kc(e, t, n, r) {
  if (typeof t == 'function') {
    const [i, s] = dh(r)
    t = t(n !== void 0 ? n : e.custom, i, s)
  }
  if ((typeof t == 'string' && (t = e.variants && e.variants[t]), typeof t == 'function')) {
    const [i, s] = dh(r)
    t = t(n !== void 0 ? n : e.custom, i, s)
  }
  return t
}
const fu = (e) => Array.isArray(e),
  NP = (e) => !!(e && typeof e == 'object' && e.mix && e.toValue),
  DP = (e) => (fu(e) ? e[e.length - 1] || 0 : e),
  Ae = (e) => !!(e && e.getVelocity)
function Gs(e) {
  const t = Ae(e) ? e.get() : e
  return NP(t) ? t.toValue() : t
}
function MP({ scrapeMotionValuesFromProps: e, createRenderState: t, onUpdate: n }, r, i, s) {
  const o = { latestValues: bP(r, i, s, e), renderState: t() }
  return (
    n && ((o.onMount = (a) => n({ props: r, current: a, ...o })), (o.onUpdate = (a) => n(a))),
    o
  )
}
const Uy = (e) => (t, n) => {
  const r = w.useContext(sa),
    i = w.useContext(ia),
    s = () => MP(e, t, r, i)
  return n ? s() : Fc(s)
}
function bP(e, t, n, r) {
  const i = {},
    s = r(e, {})
  for (const d in s) i[d] = Gs(s[d])
  let { initial: o, animate: a } = e
  const l = aa(e),
    u = Vy(e)
  t &&
    u &&
    !l &&
    e.inherit !== !1 &&
    (o === void 0 && (o = t.initial), a === void 0 && (a = t.animate))
  let c = n ? n.initial === !1 : !1
  c = c || o === !1
  const f = c ? a : o
  if (f && typeof f != 'boolean' && !oa(f)) {
    const d = Array.isArray(f) ? f : [f]
    for (let g = 0; g < d.length; g++) {
      const v = Kc(e, d[g])
      if (v) {
        const { transitionEnd: x, transition: S, ...h } = v
        for (const p in h) {
          let m = h[p]
          if (Array.isArray(m)) {
            const P = c ? m.length - 1 : 0
            m = m[P]
          }
          m !== null && (i[p] = m)
        }
        for (const p in x) i[p] = x[p]
      }
    }
  }
  return i
}
const $r = [
    'transformPerspective',
    'x',
    'y',
    'z',
    'translateX',
    'translateY',
    'translateZ',
    'scale',
    'scaleX',
    'scaleY',
    'rotate',
    'rotateX',
    'rotateY',
    'rotateZ',
    'skew',
    'skewX',
    'skewY',
  ],
  Yn = new Set($r),
  $y = (e) => (t) => typeof t == 'string' && t.startsWith(e),
  Wy = $y('--'),
  FP = $y('var(--'),
  qc = (e) => (FP(e) ? VP.test(e.split('/*')[0].trim()) : !1),
  VP = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu,
  Hy = (e, t) => (t && typeof e == 'number' ? t.transform(e) : e),
  $t = (e, t, n) => (n > t ? t : n < e ? e : n),
  Wr = { test: (e) => typeof e == 'number', parse: parseFloat, transform: (e) => e },
  $i = { ...Wr, transform: (e) => $t(0, 1, e) },
  js = { ...Wr, default: 1 },
  rs = (e) => ({
    test: (t) => typeof t == 'string' && t.endsWith(e) && t.split(' ').length === 1,
    parse: parseFloat,
    transform: (t) => `${t}${e}`,
  }),
  Xt = rs('deg'),
  Tt = rs('%'),
  D = rs('px'),
  IP = rs('vh'),
  BP = rs('vw'),
  hh = { ...Tt, parse: (e) => Tt.parse(e) / 100, transform: (e) => Tt.transform(e * 100) },
  zP = {
    borderWidth: D,
    borderTopWidth: D,
    borderRightWidth: D,
    borderBottomWidth: D,
    borderLeftWidth: D,
    borderRadius: D,
    radius: D,
    borderTopLeftRadius: D,
    borderTopRightRadius: D,
    borderBottomRightRadius: D,
    borderBottomLeftRadius: D,
    width: D,
    maxWidth: D,
    height: D,
    maxHeight: D,
    top: D,
    right: D,
    bottom: D,
    left: D,
    padding: D,
    paddingTop: D,
    paddingRight: D,
    paddingBottom: D,
    paddingLeft: D,
    margin: D,
    marginTop: D,
    marginRight: D,
    marginBottom: D,
    marginLeft: D,
    backgroundPositionX: D,
    backgroundPositionY: D,
  },
  UP = {
    rotate: Xt,
    rotateX: Xt,
    rotateY: Xt,
    rotateZ: Xt,
    scale: js,
    scaleX: js,
    scaleY: js,
    scaleZ: js,
    skew: Xt,
    skewX: Xt,
    skewY: Xt,
    distance: D,
    translateX: D,
    translateY: D,
    translateZ: D,
    x: D,
    y: D,
    z: D,
    perspective: D,
    transformPerspective: D,
    opacity: $i,
    originX: hh,
    originY: hh,
    originZ: D,
  },
  ph = { ...Wr, transform: Math.round },
  Gc = { ...zP, ...UP, zIndex: ph, size: D, fillOpacity: $i, strokeOpacity: $i, numOctaves: ph },
  $P = { x: 'translateX', y: 'translateY', z: 'translateZ', transformPerspective: 'perspective' },
  WP = $r.length
function HP(e, t, n) {
  let r = '',
    i = !0
  for (let s = 0; s < WP; s++) {
    const o = $r[s],
      a = e[o]
    if (a === void 0) continue
    let l = !0
    if (
      (typeof a == 'number'
        ? (l = a === (o.startsWith('scale') ? 1 : 0))
        : (l = parseFloat(a) === 0),
      !l || n)
    ) {
      const u = Hy(a, Gc[o])
      if (!l) {
        i = !1
        const c = $P[o] || o
        r += `${c}(${u}) `
      }
      n && (t[o] = u)
    }
  }
  return ((r = r.trim()), n ? (r = n(t, i ? '' : r)) : i && (r = 'none'), r)
}
function Xc(e, t, n) {
  const { style: r, vars: i, transformOrigin: s } = e
  let o = !1,
    a = !1
  for (const l in t) {
    const u = t[l]
    if (Yn.has(l)) {
      o = !0
      continue
    } else if (Wy(l)) {
      i[l] = u
      continue
    } else {
      const c = Hy(u, Gc[l])
      l.startsWith('origin') ? ((a = !0), (s[l] = c)) : (r[l] = c)
    }
  }
  if (
    (t.transform ||
      (o || n ? (r.transform = HP(t, e.transform, n)) : r.transform && (r.transform = 'none')),
    a)
  ) {
    const { originX: l = '50%', originY: u = '50%', originZ: c = 0 } = s
    r.transformOrigin = `${l} ${u} ${c}`
  }
}
const KP = { offset: 'stroke-dashoffset', array: 'stroke-dasharray' },
  qP = { offset: 'strokeDashoffset', array: 'strokeDasharray' }
function GP(e, t, n = 1, r = 0, i = !0) {
  e.pathLength = 1
  const s = i ? KP : qP
  e[s.offset] = D.transform(-r)
  const o = D.transform(t),
    a = D.transform(n)
  e[s.array] = `${o} ${a}`
}
function mh(e, t, n) {
  return typeof e == 'string' ? e : D.transform(t + n * e)
}
function XP(e, t, n) {
  const r = mh(t, e.x, e.width),
    i = mh(n, e.y, e.height)
  return `${r} ${i}`
}
function Qc(
  e,
  {
    attrX: t,
    attrY: n,
    attrScale: r,
    originX: i,
    originY: s,
    pathLength: o,
    pathSpacing: a = 1,
    pathOffset: l = 0,
    ...u
  },
  c,
  f,
) {
  if ((Xc(e, u, f), c)) {
    e.style.viewBox && (e.attrs.viewBox = e.style.viewBox)
    return
  }
  ;((e.attrs = e.style), (e.style = {}))
  const { attrs: d, style: g, dimensions: v } = e
  ;(d.transform && (v && (g.transform = d.transform), delete d.transform),
    v &&
      (i !== void 0 || s !== void 0 || g.transform) &&
      (g.transformOrigin = XP(v, i !== void 0 ? i : 0.5, s !== void 0 ? s : 0.5)),
    t !== void 0 && (d.x = t),
    n !== void 0 && (d.y = n),
    r !== void 0 && (d.scale = r),
    o !== void 0 && GP(d, o, a, l, !1))
}
const Yc = () => ({ style: {}, transform: {}, transformOrigin: {}, vars: {} }),
  Ky = () => ({ ...Yc(), attrs: {} }),
  Jc = (e) => typeof e == 'string' && e.toLowerCase() === 'svg'
function qy(e, { style: t, vars: n }, r, i) {
  Object.assign(e.style, t, i && i.getProjectionStyles(r))
  for (const s in n) e.style.setProperty(s, n[s])
}
const Gy = new Set([
  'baseFrequency',
  'diffuseConstant',
  'kernelMatrix',
  'kernelUnitLength',
  'keySplines',
  'keyTimes',
  'limitingConeAngle',
  'markerHeight',
  'markerWidth',
  'numOctaves',
  'targetX',
  'targetY',
  'surfaceScale',
  'specularConstant',
  'specularExponent',
  'stdDeviation',
  'tableValues',
  'viewBox',
  'gradientTransform',
  'pathLength',
  'startOffset',
  'textLength',
  'lengthAdjust',
])
function Xy(e, t, n, r) {
  qy(e, t, void 0, r)
  for (const i in t.attrs) e.setAttribute(Gy.has(i) ? i : $c(i), t.attrs[i])
}
const jo = {}
function QP(e) {
  Object.assign(jo, e)
}
function Qy(e, { layout: t, layoutId: n }) {
  return (
    Yn.has(e) || e.startsWith('origin') || ((t || n !== void 0) && (!!jo[e] || e === 'opacity'))
  )
}
function Zc(e, t, n) {
  var r
  const { style: i } = e,
    s = {}
  for (const o in i)
    (Ae(i[o]) ||
      (t.style && Ae(t.style[o])) ||
      Qy(o, e) ||
      ((r = n == null ? void 0 : n.getValue(o)) === null || r === void 0 ? void 0 : r.liveStyle) !==
        void 0) &&
      (s[o] = i[o])
  return s
}
function Yy(e, t, n) {
  const r = Zc(e, t, n)
  for (const i in e)
    if (Ae(e[i]) || Ae(t[i])) {
      const s = $r.indexOf(i) !== -1 ? 'attr' + i.charAt(0).toUpperCase() + i.substring(1) : i
      r[s] = e[i]
    }
  return r
}
function YP(e, t) {
  try {
    t.dimensions = typeof e.getBBox == 'function' ? e.getBBox() : e.getBoundingClientRect()
  } catch {
    t.dimensions = { x: 0, y: 0, width: 0, height: 0 }
  }
}
const gh = ['x', 'y', 'width', 'height', 'cx', 'cy', 'r'],
  JP = {
    useVisualState: Uy({
      scrapeMotionValuesFromProps: Yy,
      createRenderState: Ky,
      onUpdate: ({ props: e, prevProps: t, current: n, renderState: r, latestValues: i }) => {
        if (!n) return
        let s = !!e.drag
        if (!s) {
          for (const a in i)
            if (Yn.has(a)) {
              s = !0
              break
            }
        }
        if (!s) return
        let o = !t
        if (t)
          for (let a = 0; a < gh.length; a++) {
            const l = gh[a]
            e[l] !== t[l] && (o = !0)
          }
        o &&
          X.read(() => {
            ;(YP(n, r),
              X.render(() => {
                ;(Qc(r, i, Jc(n.tagName), e.transformTemplate), Xy(n, r))
              }))
          })
      },
    }),
  },
  ZP = { useVisualState: Uy({ scrapeMotionValuesFromProps: Zc, createRenderState: Yc }) }
function Jy(e, t, n) {
  for (const r in t) !Ae(t[r]) && !Qy(r, n) && (e[r] = t[r])
}
function eC({ transformTemplate: e }, t) {
  return w.useMemo(() => {
    const n = Yc()
    return (Xc(n, t, e), Object.assign({}, n.vars, n.style))
  }, [t])
}
function tC(e, t) {
  const n = e.style || {},
    r = {}
  return (Jy(r, n, e), Object.assign(r, eC(e, t)), r)
}
function nC(e, t) {
  const n = {},
    r = tC(e, t)
  return (
    e.drag &&
      e.dragListener !== !1 &&
      ((n.draggable = !1),
      (r.userSelect = r.WebkitUserSelect = r.WebkitTouchCallout = 'none'),
      (r.touchAction = e.drag === !0 ? 'none' : `pan-${e.drag === 'x' ? 'y' : 'x'}`)),
    e.tabIndex === void 0 && (e.onTap || e.onTapStart || e.whileTap) && (n.tabIndex = 0),
    (n.style = r),
    n
  )
}
function rC(e, t, n, r) {
  const i = w.useMemo(() => {
    const s = Ky()
    return (Qc(s, t, Jc(r), e.transformTemplate), { ...s.attrs, style: { ...s.style } })
  }, [t])
  if (e.style) {
    const s = {}
    ;(Jy(s, e.style, e), (i.style = { ...s, ...i.style }))
  }
  return i
}
function iC(e = !1) {
  return (n, r, i, { latestValues: s }, o) => {
    const l = (Hc(n) ? rC : nC)(r, s, o, n),
      u = xP(r, typeof n == 'string', e),
      c = n !== w.Fragment ? { ...u, ...l, ref: i } : {},
      { children: f } = r,
      d = w.useMemo(() => (Ae(f) ? f.get() : f), [f])
    return w.createElement(n, { ...c, children: d })
  }
}
function sC(e, t) {
  return function (r, { forwardMotionProps: i } = { forwardMotionProps: !1 }) {
    const o = {
      ...(Hc(r) ? JP : ZP),
      preloadedFeatures: e,
      useRender: iC(i),
      createVisualElement: t,
      Component: r,
    }
    return AP(o)
  }
}
function Zy(e, t) {
  if (!Array.isArray(t)) return !1
  const n = t.length
  if (n !== e.length) return !1
  for (let r = 0; r < n; r++) if (t[r] !== e[r]) return !1
  return !0
}
function la(e, t, n) {
  const r = e.getProps()
  return Kc(r, t, n !== void 0 ? n : r.custom, e)
}
const oC = Bc(() => window.ScrollTimeline !== void 0)
class aC {
  constructor(t) {
    ;((this.stop = () => this.runAll('stop')), (this.animations = t.filter(Boolean)))
  }
  get finished() {
    return Promise.all(this.animations.map((t) => ('finished' in t ? t.finished : t)))
  }
  getAll(t) {
    return this.animations[0][t]
  }
  setAll(t, n) {
    for (let r = 0; r < this.animations.length; r++) this.animations[r][t] = n
  }
  attachTimeline(t, n) {
    const r = this.animations.map((i) => {
      if (oC() && i.attachTimeline) return i.attachTimeline(t)
      if (typeof n == 'function') return n(i)
    })
    return () => {
      r.forEach((i, s) => {
        ;(i && i(), this.animations[s].stop())
      })
    }
  }
  get time() {
    return this.getAll('time')
  }
  set time(t) {
    this.setAll('time', t)
  }
  get speed() {
    return this.getAll('speed')
  }
  set speed(t) {
    this.setAll('speed', t)
  }
  get startTime() {
    return this.getAll('startTime')
  }
  get duration() {
    let t = 0
    for (let n = 0; n < this.animations.length; n++) t = Math.max(t, this.animations[n].duration)
    return t
  }
  runAll(t) {
    this.animations.forEach((n) => n[t]())
  }
  flatten() {
    this.runAll('flatten')
  }
  play() {
    this.runAll('play')
  }
  pause() {
    this.runAll('pause')
  }
  cancel() {
    this.runAll('cancel')
  }
  complete() {
    this.runAll('complete')
  }
}
class lC extends aC {
  then(t, n) {
    return Promise.all(this.animations).then(t).catch(n)
  }
}
function ef(e, t) {
  return e ? e[t] || e.default || e : void 0
}
const du = 2e4
function e0(e) {
  let t = 0
  const n = 50
  let r = e.next(t)
  for (; !r.done && t < du;) ((t += n), (r = e.next(t)))
  return t >= du ? 1 / 0 : t
}
function tf(e) {
  return typeof e == 'function'
}
function yh(e, t) {
  ;((e.timeline = t), (e.onfinish = null))
}
const nf = (e) => Array.isArray(e) && typeof e[0] == 'number',
  uC = { linearEasing: void 0 }
function cC(e, t) {
  const n = Bc(e)
  return () => {
    var r
    return (r = uC[t]) !== null && r !== void 0 ? r : n()
  }
}
const Oo = cC(() => {
    try {
      document.createElement('div').animate({ opacity: 0 }, { easing: 'linear(0, 1)' })
    } catch {
      return !1
    }
    return !0
  }, 'linearEasing'),
  t0 = (e, t, n = 10) => {
    let r = ''
    const i = Math.max(Math.round(t / n), 2)
    for (let s = 0; s < i; s++) r += e(Nr(0, i - 1, s)) + ', '
    return `linear(${r.substring(0, r.length - 2)})`
  }
function n0(e) {
  return !!(
    (typeof e == 'function' && Oo()) ||
    !e ||
    (typeof e == 'string' && (e in hu || Oo())) ||
    nf(e) ||
    (Array.isArray(e) && e.every(n0))
  )
}
const oi = ([e, t, n, r]) => `cubic-bezier(${e}, ${t}, ${n}, ${r})`,
  hu = {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    circIn: oi([0, 0.65, 0.55, 1]),
    circOut: oi([0.55, 0, 1, 0.45]),
    backIn: oi([0.31, 0.01, 0.66, -0.59]),
    backOut: oi([0.33, 1.53, 0.69, 0.99]),
  }
function r0(e, t) {
  if (e)
    return typeof e == 'function' && Oo()
      ? t0(e, t)
      : nf(e)
        ? oi(e)
        : Array.isArray(e)
          ? e.map((n) => r0(n, t) || hu.easeOut)
          : hu[e]
}
const ut = { x: !1, y: !1 }
function i0() {
  return ut.x || ut.y
}
function fC(e, t, n) {
  var r
  if (e instanceof Element) return [e]
  if (typeof e == 'string') {
    let i = document
    const s = (r = void 0) !== null && r !== void 0 ? r : i.querySelectorAll(e)
    return s ? Array.from(s) : []
  }
  return Array.from(e)
}
function s0(e, t) {
  const n = fC(e),
    r = new AbortController(),
    i = { passive: !0, ...t, signal: r.signal }
  return [n, i, () => r.abort()]
}
function vh(e) {
  return (t) => {
    t.pointerType === 'touch' || i0() || e(t)
  }
}
function dC(e, t, n = {}) {
  const [r, i, s] = s0(e, n),
    o = vh((a) => {
      const { target: l } = a,
        u = t(a)
      if (typeof u != 'function' || !l) return
      const c = vh((f) => {
        ;(u(f), l.removeEventListener('pointerleave', c))
      })
      l.addEventListener('pointerleave', c, i)
    })
  return (
    r.forEach((a) => {
      a.addEventListener('pointerenter', o, i)
    }),
    s
  )
}
const o0 = (e, t) => (t ? (e === t ? !0 : o0(e, t.parentElement)) : !1),
  rf = (e) =>
    e.pointerType === 'mouse' ? typeof e.button != 'number' || e.button <= 0 : e.isPrimary !== !1,
  hC = new Set(['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A'])
function pC(e) {
  return hC.has(e.tagName) || e.tabIndex !== -1
}
const ai = new WeakSet()
function xh(e) {
  return (t) => {
    t.key === 'Enter' && e(t)
  }
}
function Ka(e, t) {
  e.dispatchEvent(new PointerEvent('pointer' + t, { isPrimary: !0, bubbles: !0 }))
}
const mC = (e, t) => {
  const n = e.currentTarget
  if (!n) return
  const r = xh(() => {
    if (ai.has(n)) return
    Ka(n, 'down')
    const i = xh(() => {
        Ka(n, 'up')
      }),
      s = () => Ka(n, 'cancel')
    ;(n.addEventListener('keyup', i, t), n.addEventListener('blur', s, t))
  })
  ;(n.addEventListener('keydown', r, t),
    n.addEventListener('blur', () => n.removeEventListener('keydown', r), t))
}
function wh(e) {
  return rf(e) && !i0()
}
function gC(e, t, n = {}) {
  const [r, i, s] = s0(e, n),
    o = (a) => {
      const l = a.currentTarget
      if (!wh(a) || ai.has(l)) return
      ai.add(l)
      const u = t(a),
        c = (g, v) => {
          ;(window.removeEventListener('pointerup', f),
            window.removeEventListener('pointercancel', d),
            !(!wh(g) || !ai.has(l)) &&
              (ai.delete(l), typeof u == 'function' && u(g, { success: v })))
        },
        f = (g) => {
          c(g, n.useGlobalTarget || o0(l, g.target))
        },
        d = (g) => {
          c(g, !1)
        }
      ;(window.addEventListener('pointerup', f, i), window.addEventListener('pointercancel', d, i))
    }
  return (
    r.forEach((a) => {
      ;(!pC(a) && a.getAttribute('tabindex') === null && (a.tabIndex = 0),
        (n.useGlobalTarget ? window : a).addEventListener('pointerdown', o, i),
        a.addEventListener('focus', (u) => mC(u, i), i))
    }),
    s
  )
}
function yC(e) {
  return e === 'x' || e === 'y'
    ? ut[e]
      ? null
      : ((ut[e] = !0),
        () => {
          ut[e] = !1
        })
    : ut.x || ut.y
      ? null
      : ((ut.x = ut.y = !0),
        () => {
          ut.x = ut.y = !1
        })
}
const a0 = new Set(['width', 'height', 'top', 'left', 'right', 'bottom', ...$r])
let Xs
function vC() {
  Xs = void 0
}
const Rt = {
  now: () => (
    Xs === void 0 &&
      Rt.set(ye.isProcessing || hP.useManualTiming ? ye.timestamp : performance.now()),
    Xs
  ),
  set: (e) => {
    ;((Xs = e), queueMicrotask(vC))
  },
}
function sf(e, t) {
  e.indexOf(t) === -1 && e.push(t)
}
function of(e, t) {
  const n = e.indexOf(t)
  n > -1 && e.splice(n, 1)
}
class af {
  constructor() {
    this.subscriptions = []
  }
  add(t) {
    return (sf(this.subscriptions, t), () => of(this.subscriptions, t))
  }
  notify(t, n, r) {
    const i = this.subscriptions.length
    if (i)
      if (i === 1) this.subscriptions[0](t, n, r)
      else
        for (let s = 0; s < i; s++) {
          const o = this.subscriptions[s]
          o && o(t, n, r)
        }
  }
  getSize() {
    return this.subscriptions.length
  }
  clear() {
    this.subscriptions.length = 0
  }
}
function l0(e, t) {
  return t ? e * (1e3 / t) : 0
}
const Sh = 30,
  xC = (e) => !isNaN(parseFloat(e))
class wC {
  constructor(t, n = {}) {
    ;((this.version = '11.18.2'),
      (this.canTrackVelocity = null),
      (this.events = {}),
      (this.updateAndNotify = (r, i = !0) => {
        const s = Rt.now()
        ;(this.updatedAt !== s && this.setPrevFrameValue(),
          (this.prev = this.current),
          this.setCurrent(r),
          this.current !== this.prev &&
            this.events.change &&
            this.events.change.notify(this.current),
          i && this.events.renderRequest && this.events.renderRequest.notify(this.current))
      }),
      (this.hasAnimated = !1),
      this.setCurrent(t),
      (this.owner = n.owner))
  }
  setCurrent(t) {
    ;((this.current = t),
      (this.updatedAt = Rt.now()),
      this.canTrackVelocity === null && t !== void 0 && (this.canTrackVelocity = xC(this.current)))
  }
  setPrevFrameValue(t = this.current) {
    ;((this.prevFrameValue = t), (this.prevUpdatedAt = this.updatedAt))
  }
  onChange(t) {
    return this.on('change', t)
  }
  on(t, n) {
    this.events[t] || (this.events[t] = new af())
    const r = this.events[t].add(n)
    return t === 'change'
      ? () => {
          ;(r(),
            X.read(() => {
              this.events.change.getSize() || this.stop()
            }))
        }
      : r
  }
  clearListeners() {
    for (const t in this.events) this.events[t].clear()
  }
  attach(t, n) {
    ;((this.passiveEffect = t), (this.stopPassiveEffect = n))
  }
  set(t, n = !0) {
    !n || !this.passiveEffect
      ? this.updateAndNotify(t, n)
      : this.passiveEffect(t, this.updateAndNotify)
  }
  setWithVelocity(t, n, r) {
    ;(this.set(n),
      (this.prev = void 0),
      (this.prevFrameValue = t),
      (this.prevUpdatedAt = this.updatedAt - r))
  }
  jump(t, n = !0) {
    ;(this.updateAndNotify(t),
      (this.prev = t),
      (this.prevUpdatedAt = this.prevFrameValue = void 0),
      n && this.stop(),
      this.stopPassiveEffect && this.stopPassiveEffect())
  }
  get() {
    return this.current
  }
  getPrevious() {
    return this.prev
  }
  getVelocity() {
    const t = Rt.now()
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || t - this.updatedAt > Sh)
      return 0
    const n = Math.min(this.updatedAt - this.prevUpdatedAt, Sh)
    return l0(parseFloat(this.current) - parseFloat(this.prevFrameValue), n)
  }
  start(t) {
    return (
      this.stop(),
      new Promise((n) => {
        ;((this.hasAnimated = !0),
          (this.animation = t(n)),
          this.events.animationStart && this.events.animationStart.notify())
      }).then(() => {
        ;(this.events.animationComplete && this.events.animationComplete.notify(),
          this.clearAnimation())
      })
    )
  }
  stop() {
    ;(this.animation &&
      (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()),
      this.clearAnimation())
  }
  isAnimating() {
    return !!this.animation
  }
  clearAnimation() {
    delete this.animation
  }
  destroy() {
    ;(this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect())
  }
}
function Wi(e, t) {
  return new wC(e, t)
}
function SC(e, t, n) {
  e.hasValue(t) ? e.getValue(t).set(n) : e.addValue(t, Wi(n))
}
function EC(e, t) {
  const n = la(e, t)
  let { transitionEnd: r = {}, transition: i = {}, ...s } = n || {}
  s = { ...s, ...r }
  for (const o in s) {
    const a = DP(s[o])
    SC(e, o, a)
  }
}
function PC(e) {
  return !!(Ae(e) && e.add)
}
function pu(e, t) {
  const n = e.getValue('willChange')
  if (PC(n)) return n.add(t)
}
function u0(e) {
  return e.props[Iy]
}
const c0 = (e, t, n) => (((1 - 3 * n + 3 * t) * e + (3 * n - 6 * t)) * e + 3 * t) * e,
  CC = 1e-7,
  kC = 12
function TC(e, t, n, r, i) {
  let s,
    o,
    a = 0
  do ((o = t + (n - t) / 2), (s = c0(o, r, i) - e), s > 0 ? (n = o) : (t = o))
  while (Math.abs(s) > CC && ++a < kC)
  return o
}
function is(e, t, n, r) {
  if (e === t && n === r) return qe
  const i = (s) => TC(s, 0, 1, e, n)
  return (s) => (s === 0 || s === 1 ? s : c0(i(s), t, r))
}
const f0 = (e) => (t) => (t <= 0.5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2),
  d0 = (e) => (t) => 1 - e(1 - t),
  h0 = is(0.33, 1.53, 0.69, 0.99),
  lf = d0(h0),
  p0 = f0(lf),
  m0 = (e) => ((e *= 2) < 1 ? 0.5 * lf(e) : 0.5 * (2 - Math.pow(2, -10 * (e - 1)))),
  uf = (e) => 1 - Math.sin(Math.acos(e)),
  g0 = d0(uf),
  y0 = f0(uf),
  v0 = (e) => /^0[^.\s]+$/u.test(e)
function RC(e) {
  return typeof e == 'number' ? e === 0 : e !== null ? e === 'none' || e === '0' || v0(e) : !0
}
const vi = (e) => Math.round(e * 1e5) / 1e5,
  cf = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu
function AC(e) {
  return e == null
}
const _C =
    /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,
  ff = (e, t) => (n) =>
    !!(
      (typeof n == 'string' && _C.test(n) && n.startsWith(e)) ||
      (t && !AC(n) && Object.prototype.hasOwnProperty.call(n, t))
    ),
  x0 = (e, t, n) => (r) => {
    if (typeof r != 'string') return r
    const [i, s, o, a] = r.match(cf)
    return {
      [e]: parseFloat(i),
      [t]: parseFloat(s),
      [n]: parseFloat(o),
      alpha: a !== void 0 ? parseFloat(a) : 1,
    }
  },
  jC = (e) => $t(0, 255, e),
  qa = { ...Wr, transform: (e) => Math.round(jC(e)) },
  bn = {
    test: ff('rgb', 'red'),
    parse: x0('red', 'green', 'blue'),
    transform: ({ red: e, green: t, blue: n, alpha: r = 1 }) =>
      'rgba(' +
      qa.transform(e) +
      ', ' +
      qa.transform(t) +
      ', ' +
      qa.transform(n) +
      ', ' +
      vi($i.transform(r)) +
      ')',
  }
function OC(e) {
  let t = '',
    n = '',
    r = '',
    i = ''
  return (
    e.length > 5
      ? ((t = e.substring(1, 3)),
        (n = e.substring(3, 5)),
        (r = e.substring(5, 7)),
        (i = e.substring(7, 9)))
      : ((t = e.substring(1, 2)),
        (n = e.substring(2, 3)),
        (r = e.substring(3, 4)),
        (i = e.substring(4, 5)),
        (t += t),
        (n += n),
        (r += r),
        (i += i)),
    {
      red: parseInt(t, 16),
      green: parseInt(n, 16),
      blue: parseInt(r, 16),
      alpha: i ? parseInt(i, 16) / 255 : 1,
    }
  )
}
const mu = { test: ff('#'), parse: OC, transform: bn.transform },
  pr = {
    test: ff('hsl', 'hue'),
    parse: x0('hue', 'saturation', 'lightness'),
    transform: ({ hue: e, saturation: t, lightness: n, alpha: r = 1 }) =>
      'hsla(' +
      Math.round(e) +
      ', ' +
      Tt.transform(vi(t)) +
      ', ' +
      Tt.transform(vi(n)) +
      ', ' +
      vi($i.transform(r)) +
      ')',
  },
  Te = {
    test: (e) => bn.test(e) || mu.test(e) || pr.test(e),
    parse: (e) => (bn.test(e) ? bn.parse(e) : pr.test(e) ? pr.parse(e) : mu.parse(e)),
    transform: (e) =>
      typeof e == 'string' ? e : e.hasOwnProperty('red') ? bn.transform(e) : pr.transform(e),
  },
  LC =
    /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu
function NC(e) {
  var t, n
  return (
    isNaN(e) &&
    typeof e == 'string' &&
    (((t = e.match(cf)) === null || t === void 0 ? void 0 : t.length) || 0) +
      (((n = e.match(LC)) === null || n === void 0 ? void 0 : n.length) || 0) >
      0
  )
}
const w0 = 'number',
  S0 = 'color',
  DC = 'var',
  MC = 'var(',
  Eh = '${}',
  bC =
    /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu
function Hi(e) {
  const t = e.toString(),
    n = [],
    r = { color: [], number: [], var: [] },
    i = []
  let s = 0
  const a = t
    .replace(
      bC,
      (l) => (
        Te.test(l)
          ? (r.color.push(s), i.push(S0), n.push(Te.parse(l)))
          : l.startsWith(MC)
            ? (r.var.push(s), i.push(DC), n.push(l))
            : (r.number.push(s), i.push(w0), n.push(parseFloat(l))),
        ++s,
        Eh
      ),
    )
    .split(Eh)
  return { values: n, split: a, indexes: r, types: i }
}
function E0(e) {
  return Hi(e).values
}
function P0(e) {
  const { split: t, types: n } = Hi(e),
    r = t.length
  return (i) => {
    let s = ''
    for (let o = 0; o < r; o++)
      if (((s += t[o]), i[o] !== void 0)) {
        const a = n[o]
        a === w0 ? (s += vi(i[o])) : a === S0 ? (s += Te.transform(i[o])) : (s += i[o])
      }
    return s
  }
}
const FC = (e) => (typeof e == 'number' ? 0 : e)
function VC(e) {
  const t = E0(e)
  return P0(e)(t.map(FC))
}
const yn = { test: NC, parse: E0, createTransformer: P0, getAnimatableNone: VC },
  IC = new Set(['brightness', 'contrast', 'saturate', 'opacity'])
function BC(e) {
  const [t, n] = e.slice(0, -1).split('(')
  if (t === 'drop-shadow') return e
  const [r] = n.match(cf) || []
  if (!r) return e
  const i = n.replace(r, '')
  let s = IC.has(t) ? 1 : 0
  return (r !== n && (s *= 100), t + '(' + s + i + ')')
}
const zC = /\b([a-z-]*)\(.*?\)/gu,
  gu = {
    ...yn,
    getAnimatableNone: (e) => {
      const t = e.match(zC)
      return t ? t.map(BC).join(' ') : e
    },
  },
  UC = {
    ...Gc,
    color: Te,
    backgroundColor: Te,
    outlineColor: Te,
    fill: Te,
    stroke: Te,
    borderColor: Te,
    borderTopColor: Te,
    borderRightColor: Te,
    borderBottomColor: Te,
    borderLeftColor: Te,
    filter: gu,
    WebkitFilter: gu,
  },
  df = (e) => UC[e]
function C0(e, t) {
  let n = df(e)
  return (n !== gu && (n = yn), n.getAnimatableNone ? n.getAnimatableNone(t) : void 0)
}
const $C = new Set(['auto', 'none', '0'])
function WC(e, t, n) {
  let r = 0,
    i
  for (; r < e.length && !i;) {
    const s = e[r]
    ;(typeof s == 'string' && !$C.has(s) && Hi(s).values.length && (i = e[r]), r++)
  }
  if (i && n) for (const s of t) e[s] = C0(n, i)
}
const Ph = (e) => e === Wr || e === D,
  Ch = (e, t) => parseFloat(e.split(', ')[t]),
  kh =
    (e, t) =>
    (n, { transform: r }) => {
      if (r === 'none' || !r) return 0
      const i = r.match(/^matrix3d\((.+)\)$/u)
      if (i) return Ch(i[1], t)
      {
        const s = r.match(/^matrix\((.+)\)$/u)
        return s ? Ch(s[1], e) : 0
      }
    },
  HC = new Set(['x', 'y', 'z']),
  KC = $r.filter((e) => !HC.has(e))
function qC(e) {
  const t = []
  return (
    KC.forEach((n) => {
      const r = e.getValue(n)
      r !== void 0 && (t.push([n, r.get()]), r.set(n.startsWith('scale') ? 1 : 0))
    }),
    t
  )
}
const Mr = {
  width: ({ x: e }, { paddingLeft: t = '0', paddingRight: n = '0' }) =>
    e.max - e.min - parseFloat(t) - parseFloat(n),
  height: ({ y: e }, { paddingTop: t = '0', paddingBottom: n = '0' }) =>
    e.max - e.min - parseFloat(t) - parseFloat(n),
  top: (e, { top: t }) => parseFloat(t),
  left: (e, { left: t }) => parseFloat(t),
  bottom: ({ y: e }, { top: t }) => parseFloat(t) + (e.max - e.min),
  right: ({ x: e }, { left: t }) => parseFloat(t) + (e.max - e.min),
  x: kh(4, 13),
  y: kh(5, 14),
}
Mr.translateX = Mr.x
Mr.translateY = Mr.y
const Bn = new Set()
let yu = !1,
  vu = !1
function k0() {
  if (vu) {
    const e = Array.from(Bn).filter((r) => r.needsMeasurement),
      t = new Set(e.map((r) => r.element)),
      n = new Map()
    ;(t.forEach((r) => {
      const i = qC(r)
      i.length && (n.set(r, i), r.render())
    }),
      e.forEach((r) => r.measureInitialState()),
      t.forEach((r) => {
        r.render()
        const i = n.get(r)
        i &&
          i.forEach(([s, o]) => {
            var a
            ;(a = r.getValue(s)) === null || a === void 0 || a.set(o)
          })
      }),
      e.forEach((r) => r.measureEndState()),
      e.forEach((r) => {
        r.suspendedScrollY !== void 0 && window.scrollTo(0, r.suspendedScrollY)
      }))
  }
  ;((vu = !1), (yu = !1), Bn.forEach((e) => e.complete()), Bn.clear())
}
function T0() {
  Bn.forEach((e) => {
    ;(e.readKeyframes(), e.needsMeasurement && (vu = !0))
  })
}
function GC() {
  ;(T0(), k0())
}
class hf {
  constructor(t, n, r, i, s, o = !1) {
    ;((this.isComplete = !1),
      (this.isAsync = !1),
      (this.needsMeasurement = !1),
      (this.isScheduled = !1),
      (this.unresolvedKeyframes = [...t]),
      (this.onComplete = n),
      (this.name = r),
      (this.motionValue = i),
      (this.element = s),
      (this.isAsync = o))
  }
  scheduleResolve() {
    ;((this.isScheduled = !0),
      this.isAsync
        ? (Bn.add(this), yu || ((yu = !0), X.read(T0), X.resolveKeyframes(k0)))
        : (this.readKeyframes(), this.complete()))
  }
  readKeyframes() {
    const { unresolvedKeyframes: t, name: n, element: r, motionValue: i } = this
    for (let s = 0; s < t.length; s++)
      if (t[s] === null)
        if (s === 0) {
          const o = i == null ? void 0 : i.get(),
            a = t[t.length - 1]
          if (o !== void 0) t[0] = o
          else if (r && n) {
            const l = r.readValue(n, a)
            l != null && (t[0] = l)
          }
          ;(t[0] === void 0 && (t[0] = a), i && o === void 0 && i.set(t[0]))
        } else t[s] = t[s - 1]
  }
  setFinalKeyframe() {}
  measureInitialState() {}
  renderEndStyles() {}
  measureEndState() {}
  complete() {
    ;((this.isComplete = !0),
      this.onComplete(this.unresolvedKeyframes, this.finalKeyframe),
      Bn.delete(this))
  }
  cancel() {
    this.isComplete || ((this.isScheduled = !1), Bn.delete(this))
  }
  resume() {
    this.isComplete || this.scheduleResolve()
  }
}
const R0 = (e) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e),
  XC = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
function QC(e) {
  const t = XC.exec(e)
  if (!t) return [,]
  const [, n, r, i] = t
  return [`--${n ?? r}`, i]
}
function A0(e, t, n = 1) {
  const [r, i] = QC(e)
  if (!r) return
  const s = window.getComputedStyle(t).getPropertyValue(r)
  if (s) {
    const o = s.trim()
    return R0(o) ? parseFloat(o) : o
  }
  return qc(i) ? A0(i, t, n + 1) : i
}
const _0 = (e) => (t) => t.test(e),
  YC = { test: (e) => e === 'auto', parse: (e) => e },
  j0 = [Wr, D, Tt, Xt, BP, IP, YC],
  Th = (e) => j0.find(_0(e))
class O0 extends hf {
  constructor(t, n, r, i, s) {
    super(t, n, r, i, s, !0)
  }
  readKeyframes() {
    const { unresolvedKeyframes: t, element: n, name: r } = this
    if (!n || !n.current) return
    super.readKeyframes()
    for (let l = 0; l < t.length; l++) {
      let u = t[l]
      if (typeof u == 'string' && ((u = u.trim()), qc(u))) {
        const c = A0(u, n.current)
        ;(c !== void 0 && (t[l] = c), l === t.length - 1 && (this.finalKeyframe = u))
      }
    }
    if ((this.resolveNoneKeyframes(), !a0.has(r) || t.length !== 2)) return
    const [i, s] = t,
      o = Th(i),
      a = Th(s)
    if (o !== a)
      if (Ph(o) && Ph(a))
        for (let l = 0; l < t.length; l++) {
          const u = t[l]
          typeof u == 'string' && (t[l] = parseFloat(u))
        }
      else this.needsMeasurement = !0
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: t, name: n } = this,
      r = []
    for (let i = 0; i < t.length; i++) RC(t[i]) && r.push(i)
    r.length && WC(t, r, n)
  }
  measureInitialState() {
    const { element: t, unresolvedKeyframes: n, name: r } = this
    if (!t || !t.current) return
    ;(r === 'height' && (this.suspendedScrollY = window.pageYOffset),
      (this.measuredOrigin = Mr[r](t.measureViewportBox(), window.getComputedStyle(t.current))),
      (n[0] = this.measuredOrigin))
    const i = n[n.length - 1]
    i !== void 0 && t.getValue(r, i).jump(i, !1)
  }
  measureEndState() {
    var t
    const { element: n, name: r, unresolvedKeyframes: i } = this
    if (!n || !n.current) return
    const s = n.getValue(r)
    s && s.jump(this.measuredOrigin, !1)
    const o = i.length - 1,
      a = i[o]
    ;((i[o] = Mr[r](n.measureViewportBox(), window.getComputedStyle(n.current))),
      a !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = a),
      !((t = this.removedTransforms) === null || t === void 0) &&
        t.length &&
        this.removedTransforms.forEach(([l, u]) => {
          n.getValue(l).set(u)
        }),
      this.resolveNoneKeyframes())
  }
}
const Rh = (e, t) =>
  t === 'zIndex'
    ? !1
    : !!(
        typeof e == 'number' ||
        Array.isArray(e) ||
        (typeof e == 'string' && (yn.test(e) || e === '0') && !e.startsWith('url('))
      )
function JC(e) {
  const t = e[0]
  if (e.length === 1) return !0
  for (let n = 0; n < e.length; n++) if (e[n] !== t) return !0
}
function ZC(e, t, n, r) {
  const i = e[0]
  if (i === null) return !1
  if (t === 'display' || t === 'visibility') return !0
  const s = e[e.length - 1],
    o = Rh(i, t),
    a = Rh(s, t)
  return !o || !a ? !1 : JC(e) || ((n === 'spring' || tf(n)) && r)
}
const ek = (e) => e !== null
function ua(e, { repeat: t, repeatType: n = 'loop' }, r) {
  const i = e.filter(ek),
    s = t && n !== 'loop' && t % 2 === 1 ? 0 : i.length - 1
  return !s || r === void 0 ? i[s] : r
}
const tk = 40
class L0 {
  constructor({
    autoplay: t = !0,
    delay: n = 0,
    type: r = 'keyframes',
    repeat: i = 0,
    repeatDelay: s = 0,
    repeatType: o = 'loop',
    ...a
  }) {
    ;((this.isStopped = !1),
      (this.hasAttemptedResolve = !1),
      (this.createdAt = Rt.now()),
      (this.options = {
        autoplay: t,
        delay: n,
        type: r,
        repeat: i,
        repeatDelay: s,
        repeatType: o,
        ...a,
      }),
      this.updateFinishedPromise())
  }
  calcStartTime() {
    return this.resolvedAt
      ? this.resolvedAt - this.createdAt > tk
        ? this.resolvedAt
        : this.createdAt
      : this.createdAt
  }
  get resolved() {
    return (!this._resolved && !this.hasAttemptedResolve && GC(), this._resolved)
  }
  onKeyframesResolved(t, n) {
    ;((this.resolvedAt = Rt.now()), (this.hasAttemptedResolve = !0))
    const {
      name: r,
      type: i,
      velocity: s,
      delay: o,
      onComplete: a,
      onUpdate: l,
      isGenerator: u,
    } = this.options
    if (!u && !ZC(t, r, i, s))
      if (o) this.options.duration = 0
      else {
        ;(l && l(ua(t, this.options, n)), a && a(), this.resolveFinishedPromise())
        return
      }
    const c = this.initPlayback(t, n)
    c !== !1 && ((this._resolved = { keyframes: t, finalKeyframe: n, ...c }), this.onPostResolved())
  }
  onPostResolved() {}
  then(t, n) {
    return this.currentFinishedPromise.then(t, n)
  }
  flatten() {
    ;((this.options.type = 'keyframes'), (this.options.ease = 'linear'))
  }
  updateFinishedPromise() {
    this.currentFinishedPromise = new Promise((t) => {
      this.resolveFinishedPromise = t
    })
  }
}
const Z = (e, t, n) => e + (t - e) * n
function Ga(e, t, n) {
  return (
    n < 0 && (n += 1),
    n > 1 && (n -= 1),
    n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e
  )
}
function nk({ hue: e, saturation: t, lightness: n, alpha: r }) {
  ;((e /= 360), (t /= 100), (n /= 100))
  let i = 0,
    s = 0,
    o = 0
  if (!t) i = s = o = n
  else {
    const a = n < 0.5 ? n * (1 + t) : n + t - n * t,
      l = 2 * n - a
    ;((i = Ga(l, a, e + 1 / 3)), (s = Ga(l, a, e)), (o = Ga(l, a, e - 1 / 3)))
  }
  return {
    red: Math.round(i * 255),
    green: Math.round(s * 255),
    blue: Math.round(o * 255),
    alpha: r,
  }
}
function Lo(e, t) {
  return (n) => (n > 0 ? t : e)
}
const Xa = (e, t, n) => {
    const r = e * e,
      i = n * (t * t - r) + r
    return i < 0 ? 0 : Math.sqrt(i)
  },
  rk = [mu, bn, pr],
  ik = (e) => rk.find((t) => t.test(e))
function Ah(e) {
  const t = ik(e)
  if (!t) return !1
  let n = t.parse(e)
  return (t === pr && (n = nk(n)), n)
}
const _h = (e, t) => {
    const n = Ah(e),
      r = Ah(t)
    if (!n || !r) return Lo(e, t)
    const i = { ...n }
    return (s) => (
      (i.red = Xa(n.red, r.red, s)),
      (i.green = Xa(n.green, r.green, s)),
      (i.blue = Xa(n.blue, r.blue, s)),
      (i.alpha = Z(n.alpha, r.alpha, s)),
      bn.transform(i)
    )
  },
  sk = (e, t) => (n) => t(e(n)),
  ss = (...e) => e.reduce(sk),
  xu = new Set(['none', 'hidden'])
function ok(e, t) {
  return xu.has(e) ? (n) => (n <= 0 ? e : t) : (n) => (n >= 1 ? t : e)
}
function ak(e, t) {
  return (n) => Z(e, t, n)
}
function pf(e) {
  return typeof e == 'number'
    ? ak
    : typeof e == 'string'
      ? qc(e)
        ? Lo
        : Te.test(e)
          ? _h
          : ck
      : Array.isArray(e)
        ? N0
        : typeof e == 'object'
          ? Te.test(e)
            ? _h
            : lk
          : Lo
}
function N0(e, t) {
  const n = [...e],
    r = n.length,
    i = e.map((s, o) => pf(s)(s, t[o]))
  return (s) => {
    for (let o = 0; o < r; o++) n[o] = i[o](s)
    return n
  }
}
function lk(e, t) {
  const n = { ...e, ...t },
    r = {}
  for (const i in n) e[i] !== void 0 && t[i] !== void 0 && (r[i] = pf(e[i])(e[i], t[i]))
  return (i) => {
    for (const s in r) n[s] = r[s](i)
    return n
  }
}
function uk(e, t) {
  var n
  const r = [],
    i = { color: 0, var: 0, number: 0 }
  for (let s = 0; s < t.values.length; s++) {
    const o = t.types[s],
      a = e.indexes[o][i[o]],
      l = (n = e.values[a]) !== null && n !== void 0 ? n : 0
    ;((r[s] = l), i[o]++)
  }
  return r
}
const ck = (e, t) => {
  const n = yn.createTransformer(t),
    r = Hi(e),
    i = Hi(t)
  return r.indexes.var.length === i.indexes.var.length &&
    r.indexes.color.length === i.indexes.color.length &&
    r.indexes.number.length >= i.indexes.number.length
    ? (xu.has(e) && !i.values.length) || (xu.has(t) && !r.values.length)
      ? ok(e, t)
      : ss(N0(uk(r, i), i.values), n)
    : Lo(e, t)
}
function D0(e, t, n) {
  return typeof e == 'number' && typeof t == 'number' && typeof n == 'number'
    ? Z(e, t, n)
    : pf(e)(e, t)
}
const fk = 5
function M0(e, t, n) {
  const r = Math.max(t - fk, 0)
  return l0(n - e(r), t - r)
}
const ne = {
    stiffness: 100,
    damping: 10,
    mass: 1,
    velocity: 0,
    duration: 800,
    bounce: 0.3,
    visualDuration: 0.3,
    restSpeed: { granular: 0.01, default: 2 },
    restDelta: { granular: 0.005, default: 0.5 },
    minDuration: 0.01,
    maxDuration: 10,
    minDamping: 0.05,
    maxDamping: 1,
  },
  Qa = 0.001
function dk({
  duration: e = ne.duration,
  bounce: t = ne.bounce,
  velocity: n = ne.velocity,
  mass: r = ne.mass,
}) {
  let i,
    s,
    o = 1 - t
  ;((o = $t(ne.minDamping, ne.maxDamping, o)),
    (e = $t(ne.minDuration, ne.maxDuration, Ft(e))),
    o < 1
      ? ((i = (u) => {
          const c = u * o,
            f = c * e,
            d = c - n,
            g = wu(u, o),
            v = Math.exp(-f)
          return Qa - (d / g) * v
        }),
        (s = (u) => {
          const f = u * o * e,
            d = f * n + n,
            g = Math.pow(o, 2) * Math.pow(u, 2) * e,
            v = Math.exp(-f),
            x = wu(Math.pow(u, 2), o)
          return ((-i(u) + Qa > 0 ? -1 : 1) * ((d - g) * v)) / x
        }))
      : ((i = (u) => {
          const c = Math.exp(-u * e),
            f = (u - n) * e + 1
          return -Qa + c * f
        }),
        (s = (u) => {
          const c = Math.exp(-u * e),
            f = (n - u) * (e * e)
          return c * f
        })))
  const a = 5 / e,
    l = pk(i, s, a)
  if (((e = bt(e)), isNaN(l))) return { stiffness: ne.stiffness, damping: ne.damping, duration: e }
  {
    const u = Math.pow(l, 2) * r
    return { stiffness: u, damping: o * 2 * Math.sqrt(r * u), duration: e }
  }
}
const hk = 12
function pk(e, t, n) {
  let r = n
  for (let i = 1; i < hk; i++) r = r - e(r) / t(r)
  return r
}
function wu(e, t) {
  return e * Math.sqrt(1 - t * t)
}
const mk = ['duration', 'bounce'],
  gk = ['stiffness', 'damping', 'mass']
function jh(e, t) {
  return t.some((n) => e[n] !== void 0)
}
function yk(e) {
  let t = {
    velocity: ne.velocity,
    stiffness: ne.stiffness,
    damping: ne.damping,
    mass: ne.mass,
    isResolvedFromDuration: !1,
    ...e,
  }
  if (!jh(e, gk) && jh(e, mk))
    if (e.visualDuration) {
      const n = e.visualDuration,
        r = (2 * Math.PI) / (n * 1.2),
        i = r * r,
        s = 2 * $t(0.05, 1, 1 - (e.bounce || 0)) * Math.sqrt(i)
      t = { ...t, mass: ne.mass, stiffness: i, damping: s }
    } else {
      const n = dk(e)
      ;((t = { ...t, ...n, mass: ne.mass }), (t.isResolvedFromDuration = !0))
    }
  return t
}
function b0(e = ne.visualDuration, t = ne.bounce) {
  const n = typeof e != 'object' ? { visualDuration: e, keyframes: [0, 1], bounce: t } : e
  let { restSpeed: r, restDelta: i } = n
  const s = n.keyframes[0],
    o = n.keyframes[n.keyframes.length - 1],
    a = { done: !1, value: s },
    {
      stiffness: l,
      damping: u,
      mass: c,
      duration: f,
      velocity: d,
      isResolvedFromDuration: g,
    } = yk({ ...n, velocity: -Ft(n.velocity || 0) }),
    v = d || 0,
    x = u / (2 * Math.sqrt(l * c)),
    S = o - s,
    h = Ft(Math.sqrt(l / c)),
    p = Math.abs(S) < 5
  ;(r || (r = p ? ne.restSpeed.granular : ne.restSpeed.default),
    i || (i = p ? ne.restDelta.granular : ne.restDelta.default))
  let m
  if (x < 1) {
    const C = wu(h, x)
    m = (k) => {
      const A = Math.exp(-x * h * k)
      return o - A * (((v + x * h * S) / C) * Math.sin(C * k) + S * Math.cos(C * k))
    }
  } else if (x === 1) m = (C) => o - Math.exp(-h * C) * (S + (v + h * S) * C)
  else {
    const C = h * Math.sqrt(x * x - 1)
    m = (k) => {
      const A = Math.exp(-x * h * k),
        T = Math.min(C * k, 300)
      return o - (A * ((v + x * h * S) * Math.sinh(T) + C * S * Math.cosh(T))) / C
    }
  }
  const P = {
    calculatedDuration: (g && f) || null,
    next: (C) => {
      const k = m(C)
      if (g) a.done = C >= f
      else {
        let A = 0
        x < 1 && (A = C === 0 ? bt(v) : M0(m, C, k))
        const T = Math.abs(A) <= r,
          b = Math.abs(o - k) <= i
        a.done = T && b
      }
      return ((a.value = a.done ? o : k), a)
    },
    toString: () => {
      const C = Math.min(e0(P), du),
        k = t0((A) => P.next(C * A).value, C, 30)
      return C + 'ms ' + k
    },
  }
  return P
}
function Oh({
  keyframes: e,
  velocity: t = 0,
  power: n = 0.8,
  timeConstant: r = 325,
  bounceDamping: i = 10,
  bounceStiffness: s = 500,
  modifyTarget: o,
  min: a,
  max: l,
  restDelta: u = 0.5,
  restSpeed: c,
}) {
  const f = e[0],
    d = { done: !1, value: f },
    g = (T) => (a !== void 0 && T < a) || (l !== void 0 && T > l),
    v = (T) => (a === void 0 ? l : l === void 0 || Math.abs(a - T) < Math.abs(l - T) ? a : l)
  let x = n * t
  const S = f + x,
    h = o === void 0 ? S : o(S)
  h !== S && (x = h - f)
  const p = (T) => -x * Math.exp(-T / r),
    m = (T) => h + p(T),
    P = (T) => {
      const b = p(T),
        L = m(T)
      ;((d.done = Math.abs(b) <= u), (d.value = d.done ? h : L))
    }
  let C, k
  const A = (T) => {
    g(d.value) &&
      ((C = T),
      (k = b0({
        keyframes: [d.value, v(d.value)],
        velocity: M0(m, T, d.value),
        damping: i,
        stiffness: s,
        restDelta: u,
        restSpeed: c,
      })))
  }
  return (
    A(0),
    {
      calculatedDuration: null,
      next: (T) => {
        let b = !1
        return (
          !k && C === void 0 && ((b = !0), P(T), A(T)),
          C !== void 0 && T >= C ? k.next(T - C) : (!b && P(T), d)
        )
      },
    }
  )
}
const vk = is(0.42, 0, 1, 1),
  xk = is(0, 0, 0.58, 1),
  F0 = is(0.42, 0, 0.58, 1),
  wk = (e) => Array.isArray(e) && typeof e[0] != 'number',
  Sk = {
    linear: qe,
    easeIn: vk,
    easeInOut: F0,
    easeOut: xk,
    circIn: uf,
    circInOut: y0,
    circOut: g0,
    backIn: lf,
    backInOut: p0,
    backOut: h0,
    anticipate: m0,
  },
  Lh = (e) => {
    if (nf(e)) {
      Dy(e.length === 4)
      const [t, n, r, i] = e
      return is(t, n, r, i)
    } else if (typeof e == 'string') return Sk[e]
    return e
  }
function Ek(e, t, n) {
  const r = [],
    i = n || D0,
    s = e.length - 1
  for (let o = 0; o < s; o++) {
    let a = i(e[o], e[o + 1])
    if (t) {
      const l = Array.isArray(t) ? t[o] || qe : t
      a = ss(l, a)
    }
    r.push(a)
  }
  return r
}
function Pk(e, t, { clamp: n = !0, ease: r, mixer: i } = {}) {
  const s = e.length
  if ((Dy(s === t.length), s === 1)) return () => t[0]
  if (s === 2 && t[0] === t[1]) return () => t[1]
  const o = e[0] === e[1]
  e[0] > e[s - 1] && ((e = [...e].reverse()), (t = [...t].reverse()))
  const a = Ek(t, r, i),
    l = a.length,
    u = (c) => {
      if (o && c < e[0]) return t[0]
      let f = 0
      if (l > 1) for (; f < e.length - 2 && !(c < e[f + 1]); f++);
      const d = Nr(e[f], e[f + 1], c)
      return a[f](d)
    }
  return n ? (c) => u($t(e[0], e[s - 1], c)) : u
}
function Ck(e, t) {
  const n = e[e.length - 1]
  for (let r = 1; r <= t; r++) {
    const i = Nr(0, t, r)
    e.push(Z(n, 1, i))
  }
}
function kk(e) {
  const t = [0]
  return (Ck(t, e.length - 1), t)
}
function Tk(e, t) {
  return e.map((n) => n * t)
}
function Rk(e, t) {
  return e.map(() => t || F0).splice(0, e.length - 1)
}
function No({ duration: e = 300, keyframes: t, times: n, ease: r = 'easeInOut' }) {
  const i = wk(r) ? r.map(Lh) : Lh(r),
    s = { done: !1, value: t[0] },
    o = Tk(n && n.length === t.length ? n : kk(t), e),
    a = Pk(o, t, { ease: Array.isArray(i) ? i : Rk(t, i) })
  return { calculatedDuration: e, next: (l) => ((s.value = a(l)), (s.done = l >= e), s) }
}
const Ak = (e) => {
    const t = ({ timestamp: n }) => e(n)
    return {
      start: () => X.update(t, !0),
      stop: () => gn(t),
      now: () => (ye.isProcessing ? ye.timestamp : Rt.now()),
    }
  },
  _k = { decay: Oh, inertia: Oh, tween: No, keyframes: No, spring: b0 },
  jk = (e) => e / 100
class mf extends L0 {
  constructor(t) {
    ;(super(t),
      (this.holdTime = null),
      (this.cancelTime = null),
      (this.currentTime = 0),
      (this.playbackSpeed = 1),
      (this.pendingPlayState = 'running'),
      (this.startTime = null),
      (this.state = 'idle'),
      (this.stop = () => {
        if ((this.resolver.cancel(), (this.isStopped = !0), this.state === 'idle')) return
        this.teardown()
        const { onStop: l } = this.options
        l && l()
      }))
    const { name: n, motionValue: r, element: i, keyframes: s } = this.options,
      o = (i == null ? void 0 : i.KeyframeResolver) || hf,
      a = (l, u) => this.onKeyframesResolved(l, u)
    ;((this.resolver = new o(s, a, n, r, i)), this.resolver.scheduleResolve())
  }
  flatten() {
    ;(super.flatten(),
      this._resolved && Object.assign(this._resolved, this.initPlayback(this._resolved.keyframes)))
  }
  initPlayback(t) {
    const {
        type: n = 'keyframes',
        repeat: r = 0,
        repeatDelay: i = 0,
        repeatType: s,
        velocity: o = 0,
      } = this.options,
      a = tf(n) ? n : _k[n] || No
    let l, u
    a !== No && typeof t[0] != 'number' && ((l = ss(jk, D0(t[0], t[1]))), (t = [0, 100]))
    const c = a({ ...this.options, keyframes: t })
    ;(s === 'mirror' && (u = a({ ...this.options, keyframes: [...t].reverse(), velocity: -o })),
      c.calculatedDuration === null && (c.calculatedDuration = e0(c)))
    const { calculatedDuration: f } = c,
      d = f + i,
      g = d * (r + 1) - i
    return {
      generator: c,
      mirroredGenerator: u,
      mapPercentToKeyframes: l,
      calculatedDuration: f,
      resolvedDuration: d,
      totalDuration: g,
    }
  }
  onPostResolved() {
    const { autoplay: t = !0 } = this.options
    ;(this.play(),
      this.pendingPlayState === 'paused' || !t
        ? this.pause()
        : (this.state = this.pendingPlayState))
  }
  tick(t, n = !1) {
    const { resolved: r } = this
    if (!r) {
      const { keyframes: T } = this.options
      return { done: !0, value: T[T.length - 1] }
    }
    const {
      finalKeyframe: i,
      generator: s,
      mirroredGenerator: o,
      mapPercentToKeyframes: a,
      keyframes: l,
      calculatedDuration: u,
      totalDuration: c,
      resolvedDuration: f,
    } = r
    if (this.startTime === null) return s.next(0)
    const { delay: d, repeat: g, repeatType: v, repeatDelay: x, onUpdate: S } = this.options
    ;(this.speed > 0
      ? (this.startTime = Math.min(this.startTime, t))
      : this.speed < 0 && (this.startTime = Math.min(t - c / this.speed, this.startTime)),
      n
        ? (this.currentTime = t)
        : this.holdTime !== null
          ? (this.currentTime = this.holdTime)
          : (this.currentTime = Math.round(t - this.startTime) * this.speed))
    const h = this.currentTime - d * (this.speed >= 0 ? 1 : -1),
      p = this.speed >= 0 ? h < 0 : h > c
    ;((this.currentTime = Math.max(h, 0)),
      this.state === 'finished' && this.holdTime === null && (this.currentTime = c))
    let m = this.currentTime,
      P = s
    if (g) {
      const T = Math.min(this.currentTime, c) / f
      let b = Math.floor(T),
        L = T % 1
      ;(!L && T >= 1 && (L = 1),
        L === 1 && b--,
        (b = Math.min(b, g + 1)),
        !!(b % 2) &&
          (v === 'reverse' ? ((L = 1 - L), x && (L -= x / f)) : v === 'mirror' && (P = o)),
        (m = $t(0, 1, L) * f))
    }
    const C = p ? { done: !1, value: l[0] } : P.next(m)
    a && (C.value = a(C.value))
    let { done: k } = C
    !p && u !== null && (k = this.speed >= 0 ? this.currentTime >= c : this.currentTime <= 0)
    const A =
      this.holdTime === null && (this.state === 'finished' || (this.state === 'running' && k))
    return (
      A && i !== void 0 && (C.value = ua(l, this.options, i)),
      S && S(C.value),
      A && this.finish(),
      C
    )
  }
  get duration() {
    const { resolved: t } = this
    return t ? Ft(t.calculatedDuration) : 0
  }
  get time() {
    return Ft(this.currentTime)
  }
  set time(t) {
    ;((t = bt(t)),
      (this.currentTime = t),
      this.holdTime !== null || this.speed === 0
        ? (this.holdTime = t)
        : this.driver && (this.startTime = this.driver.now() - t / this.speed))
  }
  get speed() {
    return this.playbackSpeed
  }
  set speed(t) {
    const n = this.playbackSpeed !== t
    ;((this.playbackSpeed = t), n && (this.time = Ft(this.currentTime)))
  }
  play() {
    if ((this.resolver.isScheduled || this.resolver.resume(), !this._resolved)) {
      this.pendingPlayState = 'running'
      return
    }
    if (this.isStopped) return
    const { driver: t = Ak, onPlay: n, startTime: r } = this.options
    ;(this.driver || (this.driver = t((s) => this.tick(s))), n && n())
    const i = this.driver.now()
    ;(this.holdTime !== null
      ? (this.startTime = i - this.holdTime)
      : this.startTime
        ? this.state === 'finished' && (this.startTime = i)
        : (this.startTime = r ?? this.calcStartTime()),
      this.state === 'finished' && this.updateFinishedPromise(),
      (this.cancelTime = this.startTime),
      (this.holdTime = null),
      (this.state = 'running'),
      this.driver.start())
  }
  pause() {
    var t
    if (!this._resolved) {
      this.pendingPlayState = 'paused'
      return
    }
    ;((this.state = 'paused'),
      (this.holdTime = (t = this.currentTime) !== null && t !== void 0 ? t : 0))
  }
  complete() {
    ;(this.state !== 'running' && this.play(),
      (this.pendingPlayState = this.state = 'finished'),
      (this.holdTime = null))
  }
  finish() {
    ;(this.teardown(), (this.state = 'finished'))
    const { onComplete: t } = this.options
    t && t()
  }
  cancel() {
    ;(this.cancelTime !== null && this.tick(this.cancelTime),
      this.teardown(),
      this.updateFinishedPromise())
  }
  teardown() {
    ;((this.state = 'idle'),
      this.stopDriver(),
      this.resolveFinishedPromise(),
      this.updateFinishedPromise(),
      (this.startTime = this.cancelTime = null),
      this.resolver.cancel())
  }
  stopDriver() {
    this.driver && (this.driver.stop(), (this.driver = void 0))
  }
  sample(t) {
    return ((this.startTime = 0), this.tick(t, !0))
  }
}
const Ok = new Set(['opacity', 'clipPath', 'filter', 'transform'])
function Lk(
  e,
  t,
  n,
  {
    delay: r = 0,
    duration: i = 300,
    repeat: s = 0,
    repeatType: o = 'loop',
    ease: a = 'easeInOut',
    times: l,
  } = {},
) {
  const u = { [t]: n }
  l && (u.offset = l)
  const c = r0(a, i)
  return (
    Array.isArray(c) && (u.easing = c),
    e.animate(u, {
      delay: r,
      duration: i,
      easing: Array.isArray(c) ? 'linear' : c,
      fill: 'both',
      iterations: s + 1,
      direction: o === 'reverse' ? 'alternate' : 'normal',
    })
  )
}
const Nk = Bc(() => Object.hasOwnProperty.call(Element.prototype, 'animate')),
  Do = 10,
  Dk = 2e4
function Mk(e) {
  return tf(e.type) || e.type === 'spring' || !n0(e.ease)
}
function bk(e, t) {
  const n = new mf({ ...t, keyframes: e, repeat: 0, delay: 0, isGenerator: !0 })
  let r = { done: !1, value: e[0] }
  const i = []
  let s = 0
  for (; !r.done && s < Dk;) ((r = n.sample(s)), i.push(r.value), (s += Do))
  return { times: void 0, keyframes: i, duration: s - Do, ease: 'linear' }
}
const V0 = { anticipate: m0, backInOut: p0, circInOut: y0 }
function Fk(e) {
  return e in V0
}
class Nh extends L0 {
  constructor(t) {
    super(t)
    const { name: n, motionValue: r, element: i, keyframes: s } = this.options
    ;((this.resolver = new O0(s, (o, a) => this.onKeyframesResolved(o, a), n, r, i)),
      this.resolver.scheduleResolve())
  }
  initPlayback(t, n) {
    let {
      duration: r = 300,
      times: i,
      ease: s,
      type: o,
      motionValue: a,
      name: l,
      startTime: u,
    } = this.options
    if (!a.owner || !a.owner.current) return !1
    if ((typeof s == 'string' && Oo() && Fk(s) && (s = V0[s]), Mk(this.options))) {
      const { onComplete: f, onUpdate: d, motionValue: g, element: v, ...x } = this.options,
        S = bk(t, x)
      ;((t = S.keyframes),
        t.length === 1 && (t[1] = t[0]),
        (r = S.duration),
        (i = S.times),
        (s = S.ease),
        (o = 'keyframes'))
    }
    const c = Lk(a.owner.current, l, t, { ...this.options, duration: r, times: i, ease: s })
    return (
      (c.startTime = u ?? this.calcStartTime()),
      this.pendingTimeline
        ? (yh(c, this.pendingTimeline), (this.pendingTimeline = void 0))
        : (c.onfinish = () => {
            const { onComplete: f } = this.options
            ;(a.set(ua(t, this.options, n)), f && f(), this.cancel(), this.resolveFinishedPromise())
          }),
      { animation: c, duration: r, times: i, type: o, ease: s, keyframes: t }
    )
  }
  get duration() {
    const { resolved: t } = this
    if (!t) return 0
    const { duration: n } = t
    return Ft(n)
  }
  get time() {
    const { resolved: t } = this
    if (!t) return 0
    const { animation: n } = t
    return Ft(n.currentTime || 0)
  }
  set time(t) {
    const { resolved: n } = this
    if (!n) return
    const { animation: r } = n
    r.currentTime = bt(t)
  }
  get speed() {
    const { resolved: t } = this
    if (!t) return 1
    const { animation: n } = t
    return n.playbackRate
  }
  set speed(t) {
    const { resolved: n } = this
    if (!n) return
    const { animation: r } = n
    r.playbackRate = t
  }
  get state() {
    const { resolved: t } = this
    if (!t) return 'idle'
    const { animation: n } = t
    return n.playState
  }
  get startTime() {
    const { resolved: t } = this
    if (!t) return null
    const { animation: n } = t
    return n.startTime
  }
  attachTimeline(t) {
    if (!this._resolved) this.pendingTimeline = t
    else {
      const { resolved: n } = this
      if (!n) return qe
      const { animation: r } = n
      yh(r, t)
    }
    return qe
  }
  play() {
    if (this.isStopped) return
    const { resolved: t } = this
    if (!t) return
    const { animation: n } = t
    ;(n.playState === 'finished' && this.updateFinishedPromise(), n.play())
  }
  pause() {
    const { resolved: t } = this
    if (!t) return
    const { animation: n } = t
    n.pause()
  }
  stop() {
    if ((this.resolver.cancel(), (this.isStopped = !0), this.state === 'idle')) return
    ;(this.resolveFinishedPromise(), this.updateFinishedPromise())
    const { resolved: t } = this
    if (!t) return
    const { animation: n, keyframes: r, duration: i, type: s, ease: o, times: a } = t
    if (n.playState === 'idle' || n.playState === 'finished') return
    if (this.time) {
      const { motionValue: u, onUpdate: c, onComplete: f, element: d, ...g } = this.options,
        v = new mf({
          ...g,
          keyframes: r,
          duration: i,
          type: s,
          ease: o,
          times: a,
          isGenerator: !0,
        }),
        x = bt(this.time)
      u.setWithVelocity(v.sample(x - Do).value, v.sample(x).value, Do)
    }
    const { onStop: l } = this.options
    ;(l && l(), this.cancel())
  }
  complete() {
    const { resolved: t } = this
    t && t.animation.finish()
  }
  cancel() {
    const { resolved: t } = this
    t && t.animation.cancel()
  }
  static supports(t) {
    const { motionValue: n, name: r, repeatDelay: i, repeatType: s, damping: o, type: a } = t
    if (!n || !n.owner || !(n.owner.current instanceof HTMLElement)) return !1
    const { onUpdate: l, transformTemplate: u } = n.owner.getProps()
    return Nk() && r && Ok.has(r) && !l && !u && !i && s !== 'mirror' && o !== 0 && a !== 'inertia'
  }
}
const Vk = { type: 'spring', stiffness: 500, damping: 25, restSpeed: 10 },
  Ik = (e) => ({
    type: 'spring',
    stiffness: 550,
    damping: e === 0 ? 2 * Math.sqrt(550) : 30,
    restSpeed: 10,
  }),
  Bk = { type: 'keyframes', duration: 0.8 },
  zk = { type: 'keyframes', ease: [0.25, 0.1, 0.35, 1], duration: 0.3 },
  Uk = (e, { keyframes: t }) =>
    t.length > 2 ? Bk : Yn.has(e) ? (e.startsWith('scale') ? Ik(t[1]) : Vk) : zk
function $k({
  when: e,
  delay: t,
  delayChildren: n,
  staggerChildren: r,
  staggerDirection: i,
  repeat: s,
  repeatType: o,
  repeatDelay: a,
  from: l,
  elapsed: u,
  ...c
}) {
  return !!Object.keys(c).length
}
const gf =
  (e, t, n, r = {}, i, s) =>
  (o) => {
    const a = ef(r, e) || {},
      l = a.delay || r.delay || 0
    let { elapsed: u = 0 } = r
    u = u - bt(l)
    let c = {
      keyframes: Array.isArray(n) ? n : [null, n],
      ease: 'easeOut',
      velocity: t.getVelocity(),
      ...a,
      delay: -u,
      onUpdate: (d) => {
        ;(t.set(d), a.onUpdate && a.onUpdate(d))
      },
      onComplete: () => {
        ;(o(), a.onComplete && a.onComplete())
      },
      name: e,
      motionValue: t,
      element: s ? void 0 : i,
    }
    ;($k(a) || (c = { ...c, ...Uk(e, c) }),
      c.duration && (c.duration = bt(c.duration)),
      c.repeatDelay && (c.repeatDelay = bt(c.repeatDelay)),
      c.from !== void 0 && (c.keyframes[0] = c.from))
    let f = !1
    if (
      ((c.type === !1 || (c.duration === 0 && !c.repeatDelay)) &&
        ((c.duration = 0), c.delay === 0 && (f = !0)),
      f && !s && t.get() !== void 0)
    ) {
      const d = ua(c.keyframes, a)
      if (d !== void 0)
        return (
          X.update(() => {
            ;(c.onUpdate(d), c.onComplete())
          }),
          new lC([])
        )
    }
    return !s && Nh.supports(c) ? new Nh(c) : new mf(c)
  }
function Wk({ protectedKeys: e, needsAnimating: t }, n) {
  const r = e.hasOwnProperty(n) && t[n] !== !0
  return ((t[n] = !1), r)
}
function I0(e, t, { delay: n = 0, transitionOverride: r, type: i } = {}) {
  var s
  let { transition: o = e.getDefaultTransition(), transitionEnd: a, ...l } = t
  r && (o = r)
  const u = [],
    c = i && e.animationState && e.animationState.getState()[i]
  for (const f in l) {
    const d = e.getValue(f, (s = e.latestValues[f]) !== null && s !== void 0 ? s : null),
      g = l[f]
    if (g === void 0 || (c && Wk(c, f))) continue
    const v = { delay: n, ...ef(o || {}, f) }
    let x = !1
    if (window.MotionHandoffAnimation) {
      const h = u0(e)
      if (h) {
        const p = window.MotionHandoffAnimation(h, f, X)
        p !== null && ((v.startTime = p), (x = !0))
      }
    }
    ;(pu(e, f), d.start(gf(f, d, g, e.shouldReduceMotion && a0.has(f) ? { type: !1 } : v, e, x)))
    const S = d.animation
    S && u.push(S)
  }
  return (
    a &&
      Promise.all(u).then(() => {
        X.update(() => {
          a && EC(e, a)
        })
      }),
    u
  )
}
function Su(e, t, n = {}) {
  var r
  const i = la(
    e,
    t,
    n.type === 'exit'
      ? (r = e.presenceContext) === null || r === void 0
        ? void 0
        : r.custom
      : void 0,
  )
  let { transition: s = e.getDefaultTransition() || {} } = i || {}
  n.transitionOverride && (s = n.transitionOverride)
  const o = i ? () => Promise.all(I0(e, i, n)) : () => Promise.resolve(),
    a =
      e.variantChildren && e.variantChildren.size
        ? (u = 0) => {
            const { delayChildren: c = 0, staggerChildren: f, staggerDirection: d } = s
            return Hk(e, t, c + u, f, d, n)
          }
        : () => Promise.resolve(),
    { when: l } = s
  if (l) {
    const [u, c] = l === 'beforeChildren' ? [o, a] : [a, o]
    return u().then(() => c())
  } else return Promise.all([o(), a(n.delay)])
}
function Hk(e, t, n = 0, r = 0, i = 1, s) {
  const o = [],
    a = (e.variantChildren.size - 1) * r,
    l = i === 1 ? (u = 0) => u * r : (u = 0) => a - u * r
  return (
    Array.from(e.variantChildren)
      .sort(Kk)
      .forEach((u, c) => {
        ;(u.notify('AnimationStart', t),
          o.push(Su(u, t, { ...s, delay: n + l(c) }).then(() => u.notify('AnimationComplete', t))))
      }),
    Promise.all(o)
  )
}
function Kk(e, t) {
  return e.sortNodePosition(t)
}
function qk(e, t, n = {}) {
  e.notify('AnimationStart', t)
  let r
  if (Array.isArray(t)) {
    const i = t.map((s) => Su(e, s, n))
    r = Promise.all(i)
  } else if (typeof t == 'string') r = Su(e, t, n)
  else {
    const i = typeof t == 'function' ? la(e, t, n.custom) : t
    r = Promise.all(I0(e, i, n))
  }
  return r.then(() => {
    e.notify('AnimationComplete', t)
  })
}
const Gk = Uc.length
function B0(e) {
  if (!e) return
  if (!e.isControllingVariants) {
    const n = e.parent ? B0(e.parent) || {} : {}
    return (e.props.initial !== void 0 && (n.initial = e.props.initial), n)
  }
  const t = {}
  for (let n = 0; n < Gk; n++) {
    const r = Uc[n],
      i = e.props[r]
    ;(Ui(i) || i === !1) && (t[r] = i)
  }
  return t
}
const Xk = [...zc].reverse(),
  Qk = zc.length
function Yk(e) {
  return (t) => Promise.all(t.map(({ animation: n, options: r }) => qk(e, n, r)))
}
function Jk(e) {
  let t = Yk(e),
    n = Dh(),
    r = !0
  const i = (l) => (u, c) => {
    var f
    const d = la(
      e,
      c,
      l === 'exit'
        ? (f = e.presenceContext) === null || f === void 0
          ? void 0
          : f.custom
        : void 0,
    )
    if (d) {
      const { transition: g, transitionEnd: v, ...x } = d
      u = { ...u, ...x, ...v }
    }
    return u
  }
  function s(l) {
    t = l(e)
  }
  function o(l) {
    const { props: u } = e,
      c = B0(e.parent) || {},
      f = [],
      d = new Set()
    let g = {},
      v = 1 / 0
    for (let S = 0; S < Qk; S++) {
      const h = Xk[S],
        p = n[h],
        m = u[h] !== void 0 ? u[h] : c[h],
        P = Ui(m),
        C = h === l ? p.isActive : null
      C === !1 && (v = S)
      let k = m === c[h] && m !== u[h] && P
      if (
        (k && r && e.manuallyAnimateOnMount && (k = !1),
        (p.protectedKeys = { ...g }),
        (!p.isActive && C === null) || (!m && !p.prevProp) || oa(m) || typeof m == 'boolean')
      )
        continue
      const A = Zk(p.prevProp, m)
      let T = A || (h === l && p.isActive && !k && P) || (S > v && P),
        b = !1
      const L = Array.isArray(m) ? m : [m]
      let W = L.reduce(i(h), {})
      C === !1 && (W = {})
      const { prevResolvedValues: ze = {} } = p,
        yt = { ...ze, ...W },
        Ee = (Y) => {
          ;((T = !0), d.has(Y) && ((b = !0), d.delete(Y)), (p.needsAnimating[Y] = !0))
          const _ = e.getValue(Y)
          _ && (_.liveStyle = !1)
        }
      for (const Y in yt) {
        const _ = W[Y],
          M = ze[Y]
        if (g.hasOwnProperty(Y)) continue
        let N = !1
        ;(fu(_) && fu(M) ? (N = !Zy(_, M)) : (N = _ !== M),
          N
            ? _ != null
              ? Ee(Y)
              : d.add(Y)
            : _ !== void 0 && d.has(Y)
              ? Ee(Y)
              : (p.protectedKeys[Y] = !0))
      }
      ;((p.prevProp = m),
        (p.prevResolvedValues = W),
        p.isActive && (g = { ...g, ...W }),
        r && e.blockInitialAnimation && (T = !1),
        T && (!(k && A) || b) && f.push(...L.map((Y) => ({ animation: Y, options: { type: h } }))))
    }
    if (d.size) {
      const S = {}
      ;(d.forEach((h) => {
        const p = e.getBaseTarget(h),
          m = e.getValue(h)
        ;(m && (m.liveStyle = !0), (S[h] = p ?? null))
      }),
        f.push({ animation: S }))
    }
    let x = !!f.length
    return (
      r && (u.initial === !1 || u.initial === u.animate) && !e.manuallyAnimateOnMount && (x = !1),
      (r = !1),
      x ? t(f) : Promise.resolve()
    )
  }
  function a(l, u) {
    var c
    if (n[l].isActive === u) return Promise.resolve()
    ;((c = e.variantChildren) === null ||
      c === void 0 ||
      c.forEach((d) => {
        var g
        return (g = d.animationState) === null || g === void 0 ? void 0 : g.setActive(l, u)
      }),
      (n[l].isActive = u))
    const f = o(l)
    for (const d in n) n[d].protectedKeys = {}
    return f
  }
  return {
    animateChanges: o,
    setActive: a,
    setAnimateFunction: s,
    getState: () => n,
    reset: () => {
      ;((n = Dh()), (r = !0))
    },
  }
}
function Zk(e, t) {
  return typeof t == 'string' ? t !== e : Array.isArray(t) ? !Zy(t, e) : !1
}
function Rn(e = !1) {
  return { isActive: e, protectedKeys: {}, needsAnimating: {}, prevResolvedValues: {} }
}
function Dh() {
  return {
    animate: Rn(!0),
    whileInView: Rn(),
    whileHover: Rn(),
    whileTap: Rn(),
    whileDrag: Rn(),
    whileFocus: Rn(),
    exit: Rn(),
  }
}
class Cn {
  constructor(t) {
    ;((this.isMounted = !1), (this.node = t))
  }
  update() {}
}
class eT extends Cn {
  constructor(t) {
    ;(super(t), t.animationState || (t.animationState = Jk(t)))
  }
  updateAnimationControlsSubscription() {
    const { animate: t } = this.node.getProps()
    oa(t) && (this.unmountControls = t.subscribe(this.node))
  }
  mount() {
    this.updateAnimationControlsSubscription()
  }
  update() {
    const { animate: t } = this.node.getProps(),
      { animate: n } = this.node.prevProps || {}
    t !== n && this.updateAnimationControlsSubscription()
  }
  unmount() {
    var t
    ;(this.node.animationState.reset(),
      (t = this.unmountControls) === null || t === void 0 || t.call(this))
  }
}
let tT = 0
class nT extends Cn {
  constructor() {
    ;(super(...arguments), (this.id = tT++))
  }
  update() {
    if (!this.node.presenceContext) return
    const { isPresent: t, onExitComplete: n } = this.node.presenceContext,
      { isPresent: r } = this.node.prevPresenceContext || {}
    if (!this.node.animationState || t === r) return
    const i = this.node.animationState.setActive('exit', !t)
    n && !t && i.then(() => n(this.id))
  }
  mount() {
    const { register: t } = this.node.presenceContext || {}
    t && (this.unmount = t(this.id))
  }
  unmount() {}
}
const rT = { animation: { Feature: eT }, exit: { Feature: nT } }
function Ki(e, t, n, r = { passive: !0 }) {
  return (e.addEventListener(t, n, r), () => e.removeEventListener(t, n))
}
function os(e) {
  return { point: { x: e.pageX, y: e.pageY } }
}
const iT = (e) => (t) => rf(t) && e(t, os(t))
function xi(e, t, n, r) {
  return Ki(e, t, iT(n), r)
}
const Mh = (e, t) => Math.abs(e - t)
function sT(e, t) {
  const n = Mh(e.x, t.x),
    r = Mh(e.y, t.y)
  return Math.sqrt(n ** 2 + r ** 2)
}
class z0 {
  constructor(t, n, { transformPagePoint: r, contextWindow: i, dragSnapToOrigin: s = !1 } = {}) {
    if (
      ((this.startEvent = null),
      (this.lastMoveEvent = null),
      (this.lastMoveEventInfo = null),
      (this.handlers = {}),
      (this.contextWindow = window),
      (this.updatePoint = () => {
        if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return
        const f = Ja(this.lastMoveEventInfo, this.history),
          d = this.startEvent !== null,
          g = sT(f.offset, { x: 0, y: 0 }) >= 3
        if (!d && !g) return
        const { point: v } = f,
          { timestamp: x } = ye
        this.history.push({ ...v, timestamp: x })
        const { onStart: S, onMove: h } = this.handlers
        ;(d || (S && S(this.lastMoveEvent, f), (this.startEvent = this.lastMoveEvent)),
          h && h(this.lastMoveEvent, f))
      }),
      (this.handlePointerMove = (f, d) => {
        ;((this.lastMoveEvent = f),
          (this.lastMoveEventInfo = Ya(d, this.transformPagePoint)),
          X.update(this.updatePoint, !0))
      }),
      (this.handlePointerUp = (f, d) => {
        this.end()
        const { onEnd: g, onSessionEnd: v, resumeAnimation: x } = this.handlers
        if ((this.dragSnapToOrigin && x && x(), !(this.lastMoveEvent && this.lastMoveEventInfo)))
          return
        const S = Ja(
          f.type === 'pointercancel' ? this.lastMoveEventInfo : Ya(d, this.transformPagePoint),
          this.history,
        )
        ;(this.startEvent && g && g(f, S), v && v(f, S))
      }),
      !rf(t))
    )
      return
    ;((this.dragSnapToOrigin = s),
      (this.handlers = n),
      (this.transformPagePoint = r),
      (this.contextWindow = i || window))
    const o = os(t),
      a = Ya(o, this.transformPagePoint),
      { point: l } = a,
      { timestamp: u } = ye
    this.history = [{ ...l, timestamp: u }]
    const { onSessionStart: c } = n
    ;(c && c(t, Ja(a, this.history)),
      (this.removeListeners = ss(
        xi(this.contextWindow, 'pointermove', this.handlePointerMove),
        xi(this.contextWindow, 'pointerup', this.handlePointerUp),
        xi(this.contextWindow, 'pointercancel', this.handlePointerUp),
      )))
  }
  updateHandlers(t) {
    this.handlers = t
  }
  end() {
    ;(this.removeListeners && this.removeListeners(), gn(this.updatePoint))
  }
}
function Ya(e, t) {
  return t ? { point: t(e.point) } : e
}
function bh(e, t) {
  return { x: e.x - t.x, y: e.y - t.y }
}
function Ja({ point: e }, t) {
  return { point: e, delta: bh(e, U0(t)), offset: bh(e, oT(t)), velocity: aT(t, 0.1) }
}
function oT(e) {
  return e[0]
}
function U0(e) {
  return e[e.length - 1]
}
function aT(e, t) {
  if (e.length < 2) return { x: 0, y: 0 }
  let n = e.length - 1,
    r = null
  const i = U0(e)
  for (; n >= 0 && ((r = e[n]), !(i.timestamp - r.timestamp > bt(t)));) n--
  if (!r) return { x: 0, y: 0 }
  const s = Ft(i.timestamp - r.timestamp)
  if (s === 0) return { x: 0, y: 0 }
  const o = { x: (i.x - r.x) / s, y: (i.y - r.y) / s }
  return (o.x === 1 / 0 && (o.x = 0), o.y === 1 / 0 && (o.y = 0), o)
}
const $0 = 1e-4,
  lT = 1 - $0,
  uT = 1 + $0,
  W0 = 0.01,
  cT = 0 - W0,
  fT = 0 + W0
function Xe(e) {
  return e.max - e.min
}
function dT(e, t, n) {
  return Math.abs(e - t) <= n
}
function Fh(e, t, n, r = 0.5) {
  ;((e.origin = r),
    (e.originPoint = Z(t.min, t.max, e.origin)),
    (e.scale = Xe(n) / Xe(t)),
    (e.translate = Z(n.min, n.max, e.origin) - e.originPoint),
    ((e.scale >= lT && e.scale <= uT) || isNaN(e.scale)) && (e.scale = 1),
    ((e.translate >= cT && e.translate <= fT) || isNaN(e.translate)) && (e.translate = 0))
}
function wi(e, t, n, r) {
  ;(Fh(e.x, t.x, n.x, r ? r.originX : void 0), Fh(e.y, t.y, n.y, r ? r.originY : void 0))
}
function Vh(e, t, n) {
  ;((e.min = n.min + t.min), (e.max = e.min + Xe(t)))
}
function hT(e, t, n) {
  ;(Vh(e.x, t.x, n.x), Vh(e.y, t.y, n.y))
}
function Ih(e, t, n) {
  ;((e.min = t.min - n.min), (e.max = e.min + Xe(t)))
}
function Si(e, t, n) {
  ;(Ih(e.x, t.x, n.x), Ih(e.y, t.y, n.y))
}
function pT(e, { min: t, max: n }, r) {
  return (
    t !== void 0 && e < t
      ? (e = r ? Z(t, e, r.min) : Math.max(e, t))
      : n !== void 0 && e > n && (e = r ? Z(n, e, r.max) : Math.min(e, n)),
    e
  )
}
function Bh(e, t, n) {
  return {
    min: t !== void 0 ? e.min + t : void 0,
    max: n !== void 0 ? e.max + n - (e.max - e.min) : void 0,
  }
}
function mT(e, { top: t, left: n, bottom: r, right: i }) {
  return { x: Bh(e.x, n, i), y: Bh(e.y, t, r) }
}
function zh(e, t) {
  let n = t.min - e.min,
    r = t.max - e.max
  return (t.max - t.min < e.max - e.min && ([n, r] = [r, n]), { min: n, max: r })
}
function gT(e, t) {
  return { x: zh(e.x, t.x), y: zh(e.y, t.y) }
}
function yT(e, t) {
  let n = 0.5
  const r = Xe(e),
    i = Xe(t)
  return (
    i > r ? (n = Nr(t.min, t.max - r, e.min)) : r > i && (n = Nr(e.min, e.max - i, t.min)),
    $t(0, 1, n)
  )
}
function vT(e, t) {
  const n = {}
  return (
    t.min !== void 0 && (n.min = t.min - e.min),
    t.max !== void 0 && (n.max = t.max - e.min),
    n
  )
}
const Eu = 0.35
function xT(e = Eu) {
  return (
    e === !1 ? (e = 0) : e === !0 && (e = Eu),
    { x: Uh(e, 'left', 'right'), y: Uh(e, 'top', 'bottom') }
  )
}
function Uh(e, t, n) {
  return { min: $h(e, t), max: $h(e, n) }
}
function $h(e, t) {
  return typeof e == 'number' ? e : e[t] || 0
}
const Wh = () => ({ translate: 0, scale: 1, origin: 0, originPoint: 0 }),
  mr = () => ({ x: Wh(), y: Wh() }),
  Hh = () => ({ min: 0, max: 0 }),
  se = () => ({ x: Hh(), y: Hh() })
function et(e) {
  return [e('x'), e('y')]
}
function H0({ top: e, left: t, right: n, bottom: r }) {
  return { x: { min: t, max: n }, y: { min: e, max: r } }
}
function wT({ x: e, y: t }) {
  return { top: t.min, right: e.max, bottom: t.max, left: e.min }
}
function ST(e, t) {
  if (!t) return e
  const n = t({ x: e.left, y: e.top }),
    r = t({ x: e.right, y: e.bottom })
  return { top: n.y, left: n.x, bottom: r.y, right: r.x }
}
function Za(e) {
  return e === void 0 || e === 1
}
function Pu({ scale: e, scaleX: t, scaleY: n }) {
  return !Za(e) || !Za(t) || !Za(n)
}
function jn(e) {
  return Pu(e) || K0(e) || e.z || e.rotate || e.rotateX || e.rotateY || e.skewX || e.skewY
}
function K0(e) {
  return Kh(e.x) || Kh(e.y)
}
function Kh(e) {
  return e && e !== '0%'
}
function Mo(e, t, n) {
  const r = e - n,
    i = t * r
  return n + i
}
function qh(e, t, n, r, i) {
  return (i !== void 0 && (e = Mo(e, i, r)), Mo(e, n, r) + t)
}
function Cu(e, t = 0, n = 1, r, i) {
  ;((e.min = qh(e.min, t, n, r, i)), (e.max = qh(e.max, t, n, r, i)))
}
function q0(e, { x: t, y: n }) {
  ;(Cu(e.x, t.translate, t.scale, t.originPoint), Cu(e.y, n.translate, n.scale, n.originPoint))
}
const Gh = 0.999999999999,
  Xh = 1.0000000000001
function ET(e, t, n, r = !1) {
  const i = n.length
  if (!i) return
  t.x = t.y = 1
  let s, o
  for (let a = 0; a < i; a++) {
    ;((s = n[a]), (o = s.projectionDelta))
    const { visualElement: l } = s.options
    ;(l && l.props.style && l.props.style.display === 'contents') ||
      (r &&
        s.options.layoutScroll &&
        s.scroll &&
        s !== s.root &&
        yr(e, { x: -s.scroll.offset.x, y: -s.scroll.offset.y }),
      o && ((t.x *= o.x.scale), (t.y *= o.y.scale), q0(e, o)),
      r && jn(s.latestValues) && yr(e, s.latestValues))
  }
  ;(t.x < Xh && t.x > Gh && (t.x = 1), t.y < Xh && t.y > Gh && (t.y = 1))
}
function gr(e, t) {
  ;((e.min = e.min + t), (e.max = e.max + t))
}
function Qh(e, t, n, r, i = 0.5) {
  const s = Z(e.min, e.max, i)
  Cu(e, t, n, s, r)
}
function yr(e, t) {
  ;(Qh(e.x, t.x, t.scaleX, t.scale, t.originX), Qh(e.y, t.y, t.scaleY, t.scale, t.originY))
}
function G0(e, t) {
  return H0(ST(e.getBoundingClientRect(), t))
}
function PT(e, t, n) {
  const r = G0(e, n),
    { scroll: i } = t
  return (i && (gr(r.x, i.offset.x), gr(r.y, i.offset.y)), r)
}
const X0 = ({ current: e }) => (e ? e.ownerDocument.defaultView : null),
  CT = new WeakMap()
class kT {
  constructor(t) {
    ;((this.openDragLock = null),
      (this.isDragging = !1),
      (this.currentDirection = null),
      (this.originPoint = { x: 0, y: 0 }),
      (this.constraints = !1),
      (this.hasMutatedConstraints = !1),
      (this.elastic = se()),
      (this.visualElement = t))
  }
  start(t, { snapToCursor: n = !1 } = {}) {
    const { presenceContext: r } = this.visualElement
    if (r && r.isPresent === !1) return
    const i = (c) => {
        const { dragSnapToOrigin: f } = this.getProps()
        ;(f ? this.pauseAnimation() : this.stopAnimation(), n && this.snapToCursor(os(c).point))
      },
      s = (c, f) => {
        const { drag: d, dragPropagation: g, onDragStart: v } = this.getProps()
        if (
          d &&
          !g &&
          (this.openDragLock && this.openDragLock(),
          (this.openDragLock = yC(d)),
          !this.openDragLock)
        )
          return
        ;((this.isDragging = !0),
          (this.currentDirection = null),
          this.resolveConstraints(),
          this.visualElement.projection &&
            ((this.visualElement.projection.isAnimationBlocked = !0),
            (this.visualElement.projection.target = void 0)),
          et((S) => {
            let h = this.getAxisMotionValue(S).get() || 0
            if (Tt.test(h)) {
              const { projection: p } = this.visualElement
              if (p && p.layout) {
                const m = p.layout.layoutBox[S]
                m && (h = Xe(m) * (parseFloat(h) / 100))
              }
            }
            this.originPoint[S] = h
          }),
          v && X.postRender(() => v(c, f)),
          pu(this.visualElement, 'transform'))
        const { animationState: x } = this.visualElement
        x && x.setActive('whileDrag', !0)
      },
      o = (c, f) => {
        const {
          dragPropagation: d,
          dragDirectionLock: g,
          onDirectionLock: v,
          onDrag: x,
        } = this.getProps()
        if (!d && !this.openDragLock) return
        const { offset: S } = f
        if (g && this.currentDirection === null) {
          ;((this.currentDirection = TT(S)),
            this.currentDirection !== null && v && v(this.currentDirection))
          return
        }
        ;(this.updateAxis('x', f.point, S),
          this.updateAxis('y', f.point, S),
          this.visualElement.render(),
          x && x(c, f))
      },
      a = (c, f) => this.stop(c, f),
      l = () =>
        et((c) => {
          var f
          return (
            this.getAnimationState(c) === 'paused' &&
            ((f = this.getAxisMotionValue(c).animation) === null || f === void 0
              ? void 0
              : f.play())
          )
        }),
      { dragSnapToOrigin: u } = this.getProps()
    this.panSession = new z0(
      t,
      { onSessionStart: i, onStart: s, onMove: o, onSessionEnd: a, resumeAnimation: l },
      {
        transformPagePoint: this.visualElement.getTransformPagePoint(),
        dragSnapToOrigin: u,
        contextWindow: X0(this.visualElement),
      },
    )
  }
  stop(t, n) {
    const r = this.isDragging
    if ((this.cancel(), !r)) return
    const { velocity: i } = n
    this.startAnimation(i)
    const { onDragEnd: s } = this.getProps()
    s && X.postRender(() => s(t, n))
  }
  cancel() {
    this.isDragging = !1
    const { projection: t, animationState: n } = this.visualElement
    ;(t && (t.isAnimationBlocked = !1),
      this.panSession && this.panSession.end(),
      (this.panSession = void 0))
    const { dragPropagation: r } = this.getProps()
    ;(!r && this.openDragLock && (this.openDragLock(), (this.openDragLock = null)),
      n && n.setActive('whileDrag', !1))
  }
  updateAxis(t, n, r) {
    const { drag: i } = this.getProps()
    if (!r || !Os(t, i, this.currentDirection)) return
    const s = this.getAxisMotionValue(t)
    let o = this.originPoint[t] + r[t]
    ;(this.constraints && this.constraints[t] && (o = pT(o, this.constraints[t], this.elastic[t])),
      s.set(o))
  }
  resolveConstraints() {
    var t
    const { dragConstraints: n, dragElastic: r } = this.getProps(),
      i =
        this.visualElement.projection && !this.visualElement.projection.layout
          ? this.visualElement.projection.measure(!1)
          : (t = this.visualElement.projection) === null || t === void 0
            ? void 0
            : t.layout,
      s = this.constraints
    ;(n && hr(n)
      ? this.constraints || (this.constraints = this.resolveRefConstraints())
      : n && i
        ? (this.constraints = mT(i.layoutBox, n))
        : (this.constraints = !1),
      (this.elastic = xT(r)),
      s !== this.constraints &&
        i &&
        this.constraints &&
        !this.hasMutatedConstraints &&
        et((o) => {
          this.constraints !== !1 &&
            this.getAxisMotionValue(o) &&
            (this.constraints[o] = vT(i.layoutBox[o], this.constraints[o]))
        }))
  }
  resolveRefConstraints() {
    const { dragConstraints: t, onMeasureDragConstraints: n } = this.getProps()
    if (!t || !hr(t)) return !1
    const r = t.current,
      { projection: i } = this.visualElement
    if (!i || !i.layout) return !1
    const s = PT(r, i.root, this.visualElement.getTransformPagePoint())
    let o = gT(i.layout.layoutBox, s)
    if (n) {
      const a = n(wT(o))
      ;((this.hasMutatedConstraints = !!a), a && (o = H0(a)))
    }
    return o
  }
  startAnimation(t) {
    const {
        drag: n,
        dragMomentum: r,
        dragElastic: i,
        dragTransition: s,
        dragSnapToOrigin: o,
        onDragTransitionEnd: a,
      } = this.getProps(),
      l = this.constraints || {},
      u = et((c) => {
        if (!Os(c, n, this.currentDirection)) return
        let f = (l && l[c]) || {}
        o && (f = { min: 0, max: 0 })
        const d = i ? 200 : 1e6,
          g = i ? 40 : 1e7,
          v = {
            type: 'inertia',
            velocity: r ? t[c] : 0,
            bounceStiffness: d,
            bounceDamping: g,
            timeConstant: 750,
            restDelta: 1,
            restSpeed: 10,
            ...s,
            ...f,
          }
        return this.startAxisValueAnimation(c, v)
      })
    return Promise.all(u).then(a)
  }
  startAxisValueAnimation(t, n) {
    const r = this.getAxisMotionValue(t)
    return (pu(this.visualElement, t), r.start(gf(t, r, 0, n, this.visualElement, !1)))
  }
  stopAnimation() {
    et((t) => this.getAxisMotionValue(t).stop())
  }
  pauseAnimation() {
    et((t) => {
      var n
      return (n = this.getAxisMotionValue(t).animation) === null || n === void 0
        ? void 0
        : n.pause()
    })
  }
  getAnimationState(t) {
    var n
    return (n = this.getAxisMotionValue(t).animation) === null || n === void 0 ? void 0 : n.state
  }
  getAxisMotionValue(t) {
    const n = `_drag${t.toUpperCase()}`,
      r = this.visualElement.getProps(),
      i = r[n]
    return i || this.visualElement.getValue(t, (r.initial ? r.initial[t] : void 0) || 0)
  }
  snapToCursor(t) {
    et((n) => {
      const { drag: r } = this.getProps()
      if (!Os(n, r, this.currentDirection)) return
      const { projection: i } = this.visualElement,
        s = this.getAxisMotionValue(n)
      if (i && i.layout) {
        const { min: o, max: a } = i.layout.layoutBox[n]
        s.set(t[n] - Z(o, a, 0.5))
      }
    })
  }
  scalePositionWithinConstraints() {
    if (!this.visualElement.current) return
    const { drag: t, dragConstraints: n } = this.getProps(),
      { projection: r } = this.visualElement
    if (!hr(n) || !r || !this.constraints) return
    this.stopAnimation()
    const i = { x: 0, y: 0 }
    et((o) => {
      const a = this.getAxisMotionValue(o)
      if (a && this.constraints !== !1) {
        const l = a.get()
        i[o] = yT({ min: l, max: l }, this.constraints[o])
      }
    })
    const { transformTemplate: s } = this.visualElement.getProps()
    ;((this.visualElement.current.style.transform = s ? s({}, '') : 'none'),
      r.root && r.root.updateScroll(),
      r.updateLayout(),
      this.resolveConstraints(),
      et((o) => {
        if (!Os(o, t, null)) return
        const a = this.getAxisMotionValue(o),
          { min: l, max: u } = this.constraints[o]
        a.set(Z(l, u, i[o]))
      }))
  }
  addListeners() {
    if (!this.visualElement.current) return
    CT.set(this.visualElement, this)
    const t = this.visualElement.current,
      n = xi(t, 'pointerdown', (l) => {
        const { drag: u, dragListener: c = !0 } = this.getProps()
        u && c && this.start(l)
      }),
      r = () => {
        const { dragConstraints: l } = this.getProps()
        hr(l) && l.current && (this.constraints = this.resolveRefConstraints())
      },
      { projection: i } = this.visualElement,
      s = i.addEventListener('measure', r)
    ;(i && !i.layout && (i.root && i.root.updateScroll(), i.updateLayout()), X.read(r))
    const o = Ki(window, 'resize', () => this.scalePositionWithinConstraints()),
      a = i.addEventListener('didUpdate', ({ delta: l, hasLayoutChanged: u }) => {
        this.isDragging &&
          u &&
          (et((c) => {
            const f = this.getAxisMotionValue(c)
            f && ((this.originPoint[c] += l[c].translate), f.set(f.get() + l[c].translate))
          }),
          this.visualElement.render())
      })
    return () => {
      ;(o(), n(), s(), a && a())
    }
  }
  getProps() {
    const t = this.visualElement.getProps(),
      {
        drag: n = !1,
        dragDirectionLock: r = !1,
        dragPropagation: i = !1,
        dragConstraints: s = !1,
        dragElastic: o = Eu,
        dragMomentum: a = !0,
      } = t
    return {
      ...t,
      drag: n,
      dragDirectionLock: r,
      dragPropagation: i,
      dragConstraints: s,
      dragElastic: o,
      dragMomentum: a,
    }
  }
}
function Os(e, t, n) {
  return (t === !0 || t === e) && (n === null || n === e)
}
function TT(e, t = 10) {
  let n = null
  return (Math.abs(e.y) > t ? (n = 'y') : Math.abs(e.x) > t && (n = 'x'), n)
}
class RT extends Cn {
  constructor(t) {
    ;(super(t),
      (this.removeGroupControls = qe),
      (this.removeListeners = qe),
      (this.controls = new kT(t)))
  }
  mount() {
    const { dragControls: t } = this.node.getProps()
    ;(t && (this.removeGroupControls = t.subscribe(this.controls)),
      (this.removeListeners = this.controls.addListeners() || qe))
  }
  unmount() {
    ;(this.removeGroupControls(), this.removeListeners())
  }
}
const Yh = (e) => (t, n) => {
  e && X.postRender(() => e(t, n))
}
class AT extends Cn {
  constructor() {
    ;(super(...arguments), (this.removePointerDownListener = qe))
  }
  onPointerDown(t) {
    this.session = new z0(t, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: X0(this.node),
    })
  }
  createPanHandlers() {
    const { onPanSessionStart: t, onPanStart: n, onPan: r, onPanEnd: i } = this.node.getProps()
    return {
      onSessionStart: Yh(t),
      onStart: Yh(n),
      onMove: r,
      onEnd: (s, o) => {
        ;(delete this.session, i && X.postRender(() => i(s, o)))
      },
    }
  }
  mount() {
    this.removePointerDownListener = xi(this.node.current, 'pointerdown', (t) =>
      this.onPointerDown(t),
    )
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers())
  }
  unmount() {
    ;(this.removePointerDownListener(), this.session && this.session.end())
  }
}
const Qs = { hasAnimatedSinceResize: !0, hasEverUpdated: !1 }
function Jh(e, t) {
  return t.max === t.min ? 0 : (e / (t.max - t.min)) * 100
}
const ti = {
    correct: (e, t) => {
      if (!t.target) return e
      if (typeof e == 'string')
        if (D.test(e)) e = parseFloat(e)
        else return e
      const n = Jh(e, t.target.x),
        r = Jh(e, t.target.y)
      return `${n}% ${r}%`
    },
  },
  _T = {
    correct: (e, { treeScale: t, projectionDelta: n }) => {
      const r = e,
        i = yn.parse(e)
      if (i.length > 5) return r
      const s = yn.createTransformer(e),
        o = typeof i[0] != 'number' ? 1 : 0,
        a = n.x.scale * t.x,
        l = n.y.scale * t.y
      ;((i[0 + o] /= a), (i[1 + o] /= l))
      const u = Z(a, l, 0.5)
      return (
        typeof i[2 + o] == 'number' && (i[2 + o] /= u),
        typeof i[3 + o] == 'number' && (i[3 + o] /= u),
        s(i)
      )
    },
  }
class jT extends w.Component {
  componentDidMount() {
    const { visualElement: t, layoutGroup: n, switchLayoutGroup: r, layoutId: i } = this.props,
      { projection: s } = t
    ;(QP(OT),
      s &&
        (n.group && n.group.add(s),
        r && r.register && i && r.register(s),
        s.root.didUpdate(),
        s.addEventListener('animationComplete', () => {
          this.safeToRemove()
        }),
        s.setOptions({ ...s.options, onExitComplete: () => this.safeToRemove() })),
      (Qs.hasEverUpdated = !0))
  }
  getSnapshotBeforeUpdate(t) {
    const { layoutDependency: n, visualElement: r, drag: i, isPresent: s } = this.props,
      o = r.projection
    return (
      o &&
        ((o.isPresent = s),
        i || t.layoutDependency !== n || n === void 0 ? o.willUpdate() : this.safeToRemove(),
        t.isPresent !== s &&
          (s
            ? o.promote()
            : o.relegate() ||
              X.postRender(() => {
                const a = o.getStack()
                ;(!a || !a.members.length) && this.safeToRemove()
              }))),
      null
    )
  }
  componentDidUpdate() {
    const { projection: t } = this.props.visualElement
    t &&
      (t.root.didUpdate(),
      Wc.postRender(() => {
        !t.currentAnimation && t.isLead() && this.safeToRemove()
      }))
  }
  componentWillUnmount() {
    const { visualElement: t, layoutGroup: n, switchLayoutGroup: r } = this.props,
      { projection: i } = t
    i &&
      (i.scheduleCheckAfterUnmount(),
      n && n.group && n.group.remove(i),
      r && r.deregister && r.deregister(i))
  }
  safeToRemove() {
    const { safeToRemove: t } = this.props
    t && t()
  }
  render() {
    return null
  }
}
function Q0(e) {
  const [t, n] = Ly(),
    r = w.useContext(bc)
  return y.jsx(jT, {
    ...e,
    layoutGroup: r,
    switchLayoutGroup: w.useContext(By),
    isPresent: t,
    safeToRemove: n,
  })
}
const OT = {
  borderRadius: {
    ...ti,
    applyTo: [
      'borderTopLeftRadius',
      'borderTopRightRadius',
      'borderBottomLeftRadius',
      'borderBottomRightRadius',
    ],
  },
  borderTopLeftRadius: ti,
  borderTopRightRadius: ti,
  borderBottomLeftRadius: ti,
  borderBottomRightRadius: ti,
  boxShadow: _T,
}
function LT(e, t, n) {
  const r = Ae(e) ? e : Wi(e)
  return (r.start(gf('', r, t, n)), r.animation)
}
function NT(e) {
  return e instanceof SVGElement && e.tagName !== 'svg'
}
const DT = (e, t) => e.depth - t.depth
class MT {
  constructor() {
    ;((this.children = []), (this.isDirty = !1))
  }
  add(t) {
    ;(sf(this.children, t), (this.isDirty = !0))
  }
  remove(t) {
    ;(of(this.children, t), (this.isDirty = !0))
  }
  forEach(t) {
    ;(this.isDirty && this.children.sort(DT), (this.isDirty = !1), this.children.forEach(t))
  }
}
function bT(e, t) {
  const n = Rt.now(),
    r = ({ timestamp: i }) => {
      const s = i - n
      s >= t && (gn(r), e(s - t))
    }
  return (X.read(r, !0), () => gn(r))
}
const Y0 = ['TopLeft', 'TopRight', 'BottomLeft', 'BottomRight'],
  FT = Y0.length,
  Zh = (e) => (typeof e == 'string' ? parseFloat(e) : e),
  ep = (e) => typeof e == 'number' || D.test(e)
function VT(e, t, n, r, i, s) {
  i
    ? ((e.opacity = Z(0, n.opacity !== void 0 ? n.opacity : 1, IT(r))),
      (e.opacityExit = Z(t.opacity !== void 0 ? t.opacity : 1, 0, BT(r))))
    : s &&
      (e.opacity = Z(t.opacity !== void 0 ? t.opacity : 1, n.opacity !== void 0 ? n.opacity : 1, r))
  for (let o = 0; o < FT; o++) {
    const a = `border${Y0[o]}Radius`
    let l = tp(t, a),
      u = tp(n, a)
    if (l === void 0 && u === void 0) continue
    ;(l || (l = 0),
      u || (u = 0),
      l === 0 || u === 0 || ep(l) === ep(u)
        ? ((e[a] = Math.max(Z(Zh(l), Zh(u), r), 0)), (Tt.test(u) || Tt.test(l)) && (e[a] += '%'))
        : (e[a] = u))
  }
  ;(t.rotate || n.rotate) && (e.rotate = Z(t.rotate || 0, n.rotate || 0, r))
}
function tp(e, t) {
  return e[t] !== void 0 ? e[t] : e.borderRadius
}
const IT = J0(0, 0.5, g0),
  BT = J0(0.5, 0.95, qe)
function J0(e, t, n) {
  return (r) => (r < e ? 0 : r > t ? 1 : n(Nr(e, t, r)))
}
function np(e, t) {
  ;((e.min = t.min), (e.max = t.max))
}
function Ze(e, t) {
  ;(np(e.x, t.x), np(e.y, t.y))
}
function rp(e, t) {
  ;((e.translate = t.translate),
    (e.scale = t.scale),
    (e.originPoint = t.originPoint),
    (e.origin = t.origin))
}
function ip(e, t, n, r, i) {
  return ((e -= t), (e = Mo(e, 1 / n, r)), i !== void 0 && (e = Mo(e, 1 / i, r)), e)
}
function zT(e, t = 0, n = 1, r = 0.5, i, s = e, o = e) {
  if (
    (Tt.test(t) && ((t = parseFloat(t)), (t = Z(o.min, o.max, t / 100) - o.min)),
    typeof t != 'number')
  )
    return
  let a = Z(s.min, s.max, r)
  ;(e === s && (a -= t), (e.min = ip(e.min, t, n, a, i)), (e.max = ip(e.max, t, n, a, i)))
}
function sp(e, t, [n, r, i], s, o) {
  zT(e, t[n], t[r], t[i], t.scale, s, o)
}
const UT = ['x', 'scaleX', 'originX'],
  $T = ['y', 'scaleY', 'originY']
function op(e, t, n, r) {
  ;(sp(e.x, t, UT, n ? n.x : void 0, r ? r.x : void 0),
    sp(e.y, t, $T, n ? n.y : void 0, r ? r.y : void 0))
}
function ap(e) {
  return e.translate === 0 && e.scale === 1
}
function Z0(e) {
  return ap(e.x) && ap(e.y)
}
function lp(e, t) {
  return e.min === t.min && e.max === t.max
}
function WT(e, t) {
  return lp(e.x, t.x) && lp(e.y, t.y)
}
function up(e, t) {
  return Math.round(e.min) === Math.round(t.min) && Math.round(e.max) === Math.round(t.max)
}
function ev(e, t) {
  return up(e.x, t.x) && up(e.y, t.y)
}
function cp(e) {
  return Xe(e.x) / Xe(e.y)
}
function fp(e, t) {
  return e.translate === t.translate && e.scale === t.scale && e.originPoint === t.originPoint
}
class HT {
  constructor() {
    this.members = []
  }
  add(t) {
    ;(sf(this.members, t), t.scheduleRender())
  }
  remove(t) {
    if ((of(this.members, t), t === this.prevLead && (this.prevLead = void 0), t === this.lead)) {
      const n = this.members[this.members.length - 1]
      n && this.promote(n)
    }
  }
  relegate(t) {
    const n = this.members.findIndex((i) => t === i)
    if (n === 0) return !1
    let r
    for (let i = n; i >= 0; i--) {
      const s = this.members[i]
      if (s.isPresent !== !1) {
        r = s
        break
      }
    }
    return r ? (this.promote(r), !0) : !1
  }
  promote(t, n) {
    const r = this.lead
    if (t !== r && ((this.prevLead = r), (this.lead = t), t.show(), r)) {
      ;(r.instance && r.scheduleRender(),
        t.scheduleRender(),
        (t.resumeFrom = r),
        n && (t.resumeFrom.preserveOpacity = !0),
        r.snapshot &&
          ((t.snapshot = r.snapshot),
          (t.snapshot.latestValues = r.animationValues || r.latestValues)),
        t.root && t.root.isUpdating && (t.isLayoutDirty = !0))
      const { crossfade: i } = t.options
      i === !1 && r.hide()
    }
  }
  exitAnimationComplete() {
    this.members.forEach((t) => {
      const { options: n, resumingFrom: r } = t
      ;(n.onExitComplete && n.onExitComplete(),
        r && r.options.onExitComplete && r.options.onExitComplete())
    })
  }
  scheduleRender() {
    this.members.forEach((t) => {
      t.instance && t.scheduleRender(!1)
    })
  }
  removeLeadSnapshot() {
    this.lead && this.lead.snapshot && (this.lead.snapshot = void 0)
  }
}
function KT(e, t, n) {
  let r = ''
  const i = e.x.translate / t.x,
    s = e.y.translate / t.y,
    o = (n == null ? void 0 : n.z) || 0
  if (
    ((i || s || o) && (r = `translate3d(${i}px, ${s}px, ${o}px) `),
    (t.x !== 1 || t.y !== 1) && (r += `scale(${1 / t.x}, ${1 / t.y}) `),
    n)
  ) {
    const { transformPerspective: u, rotate: c, rotateX: f, rotateY: d, skewX: g, skewY: v } = n
    ;(u && (r = `perspective(${u}px) ${r}`),
      c && (r += `rotate(${c}deg) `),
      f && (r += `rotateX(${f}deg) `),
      d && (r += `rotateY(${d}deg) `),
      g && (r += `skewX(${g}deg) `),
      v && (r += `skewY(${v}deg) `))
  }
  const a = e.x.scale * t.x,
    l = e.y.scale * t.y
  return ((a !== 1 || l !== 1) && (r += `scale(${a}, ${l})`), r || 'none')
}
const On = {
    type: 'projectionFrame',
    totalNodes: 0,
    resolvedTargetDeltas: 0,
    recalculatedProjection: 0,
  },
  li = typeof window < 'u' && window.MotionDebug !== void 0,
  el = ['', 'X', 'Y', 'Z'],
  qT = { visibility: 'hidden' },
  dp = 1e3
let GT = 0
function tl(e, t, n, r) {
  const { latestValues: i } = t
  i[e] && ((n[e] = i[e]), t.setStaticValue(e, 0), r && (r[e] = 0))
}
function tv(e) {
  if (((e.hasCheckedOptimisedAppear = !0), e.root === e)) return
  const { visualElement: t } = e.options
  if (!t) return
  const n = u0(t)
  if (window.MotionHasOptimisedAnimation(n, 'transform')) {
    const { layout: i, layoutId: s } = e.options
    window.MotionCancelOptimisedAnimation(n, 'transform', X, !(i || s))
  }
  const { parent: r } = e
  r && !r.hasCheckedOptimisedAppear && tv(r)
}
function nv({
  attachResizeListener: e,
  defaultParent: t,
  measureScroll: n,
  checkIsScrollRoot: r,
  resetTransform: i,
}) {
  return class {
    constructor(o = {}, a = t == null ? void 0 : t()) {
      ;((this.id = GT++),
        (this.animationId = 0),
        (this.children = new Set()),
        (this.options = {}),
        (this.isTreeAnimating = !1),
        (this.isAnimationBlocked = !1),
        (this.isLayoutDirty = !1),
        (this.isProjectionDirty = !1),
        (this.isSharedProjectionDirty = !1),
        (this.isTransformDirty = !1),
        (this.updateManuallyBlocked = !1),
        (this.updateBlockedByResize = !1),
        (this.isUpdating = !1),
        (this.isSVG = !1),
        (this.needsReset = !1),
        (this.shouldResetTransform = !1),
        (this.hasCheckedOptimisedAppear = !1),
        (this.treeScale = { x: 1, y: 1 }),
        (this.eventHandlers = new Map()),
        (this.hasTreeAnimated = !1),
        (this.updateScheduled = !1),
        (this.scheduleUpdate = () => this.update()),
        (this.projectionUpdateScheduled = !1),
        (this.checkUpdateFailed = () => {
          this.isUpdating && ((this.isUpdating = !1), this.clearAllSnapshots())
        }),
        (this.updateProjection = () => {
          ;((this.projectionUpdateScheduled = !1),
            li && (On.totalNodes = On.resolvedTargetDeltas = On.recalculatedProjection = 0),
            this.nodes.forEach(YT),
            this.nodes.forEach(nR),
            this.nodes.forEach(rR),
            this.nodes.forEach(JT),
            li && window.MotionDebug.record(On))
        }),
        (this.resolvedRelativeTargetAt = 0),
        (this.hasProjected = !1),
        (this.isVisible = !0),
        (this.animationProgress = 0),
        (this.sharedNodes = new Map()),
        (this.latestValues = o),
        (this.root = a ? a.root || a : this),
        (this.path = a ? [...a.path, a] : []),
        (this.parent = a),
        (this.depth = a ? a.depth + 1 : 0))
      for (let l = 0; l < this.path.length; l++) this.path[l].shouldResetTransform = !0
      this.root === this && (this.nodes = new MT())
    }
    addEventListener(o, a) {
      return (
        this.eventHandlers.has(o) || this.eventHandlers.set(o, new af()),
        this.eventHandlers.get(o).add(a)
      )
    }
    notifyListeners(o, ...a) {
      const l = this.eventHandlers.get(o)
      l && l.notify(...a)
    }
    hasListeners(o) {
      return this.eventHandlers.has(o)
    }
    mount(o, a = this.root.hasTreeAnimated) {
      if (this.instance) return
      ;((this.isSVG = NT(o)), (this.instance = o))
      const { layoutId: l, layout: u, visualElement: c } = this.options
      if (
        (c && !c.current && c.mount(o),
        this.root.nodes.add(this),
        this.parent && this.parent.children.add(this),
        a && (u || l) && (this.isLayoutDirty = !0),
        e)
      ) {
        let f
        const d = () => (this.root.updateBlockedByResize = !1)
        e(o, () => {
          ;((this.root.updateBlockedByResize = !0),
            f && f(),
            (f = bT(d, 250)),
            Qs.hasAnimatedSinceResize && ((Qs.hasAnimatedSinceResize = !1), this.nodes.forEach(pp)))
        })
      }
      ;(l && this.root.registerSharedNode(l, this),
        this.options.animate !== !1 &&
          c &&
          (l || u) &&
          this.addEventListener(
            'didUpdate',
            ({ delta: f, hasLayoutChanged: d, hasRelativeTargetChanged: g, layout: v }) => {
              if (this.isTreeAnimationBlocked()) {
                ;((this.target = void 0), (this.relativeTarget = void 0))
                return
              }
              const x = this.options.transition || c.getDefaultTransition() || lR,
                { onLayoutAnimationStart: S, onLayoutAnimationComplete: h } = c.getProps(),
                p = !this.targetLayout || !ev(this.targetLayout, v) || g,
                m = !d && g
              if (
                this.options.layoutRoot ||
                (this.resumeFrom && this.resumeFrom.instance) ||
                m ||
                (d && (p || !this.currentAnimation))
              ) {
                ;(this.resumeFrom &&
                  ((this.resumingFrom = this.resumeFrom),
                  (this.resumingFrom.resumingFrom = void 0)),
                  this.setAnimationOrigin(f, m))
                const P = { ...ef(x, 'layout'), onPlay: S, onComplete: h }
                ;((c.shouldReduceMotion || this.options.layoutRoot) &&
                  ((P.delay = 0), (P.type = !1)),
                  this.startAnimation(P))
              } else
                (d || pp(this),
                  this.isLead() && this.options.onExitComplete && this.options.onExitComplete())
              this.targetLayout = v
            },
          ))
    }
    unmount() {
      ;(this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this))
      const o = this.getStack()
      ;(o && o.remove(this),
        this.parent && this.parent.children.delete(this),
        (this.instance = void 0),
        gn(this.updateProjection))
    }
    blockUpdate() {
      this.updateManuallyBlocked = !0
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || (this.parent && this.parent.isTreeAnimationBlocked()) || !1
    }
    startUpdate() {
      this.isUpdateBlocked() ||
        ((this.isUpdating = !0), this.nodes && this.nodes.forEach(iR), this.animationId++)
    }
    getTransformTemplate() {
      const { visualElement: o } = this.options
      return o && o.getProps().transformTemplate
    }
    willUpdate(o = !0) {
      if (((this.root.hasTreeAnimated = !0), this.root.isUpdateBlocked())) {
        this.options.onExitComplete && this.options.onExitComplete()
        return
      }
      if (
        (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && tv(this),
        !this.root.isUpdating && this.root.startUpdate(),
        this.isLayoutDirty)
      )
        return
      this.isLayoutDirty = !0
      for (let c = 0; c < this.path.length; c++) {
        const f = this.path[c]
        ;((f.shouldResetTransform = !0),
          f.updateScroll('snapshot'),
          f.options.layoutRoot && f.willUpdate(!1))
      }
      const { layoutId: a, layout: l } = this.options
      if (a === void 0 && !l) return
      const u = this.getTransformTemplate()
      ;((this.prevTransformTemplateValue = u ? u(this.latestValues, '') : void 0),
        this.updateSnapshot(),
        o && this.notifyListeners('willUpdate'))
    }
    update() {
      if (((this.updateScheduled = !1), this.isUpdateBlocked())) {
        ;(this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(hp))
        return
      }
      ;(this.isUpdating || this.nodes.forEach(eR),
        (this.isUpdating = !1),
        this.nodes.forEach(tR),
        this.nodes.forEach(XT),
        this.nodes.forEach(QT),
        this.clearAllSnapshots())
      const a = Rt.now()
      ;((ye.delta = $t(0, 1e3 / 60, a - ye.timestamp)),
        (ye.timestamp = a),
        (ye.isProcessing = !0),
        Ha.update.process(ye),
        Ha.preRender.process(ye),
        Ha.render.process(ye),
        (ye.isProcessing = !1))
    }
    didUpdate() {
      this.updateScheduled || ((this.updateScheduled = !0), Wc.read(this.scheduleUpdate))
    }
    clearAllSnapshots() {
      ;(this.nodes.forEach(ZT), this.sharedNodes.forEach(sR))
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled ||
        ((this.projectionUpdateScheduled = !0), X.preRender(this.updateProjection, !1, !0))
    }
    scheduleCheckAfterUnmount() {
      X.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed()
      })
    }
    updateSnapshot() {
      this.snapshot || !this.instance || (this.snapshot = this.measure())
    }
    updateLayout() {
      if (
        !this.instance ||
        (this.updateScroll(),
        !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty)
      )
        return
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let l = 0; l < this.path.length; l++) this.path[l].updateScroll()
      const o = this.layout
      ;((this.layout = this.measure(!1)),
        (this.layoutCorrected = se()),
        (this.isLayoutDirty = !1),
        (this.projectionDelta = void 0),
        this.notifyListeners('measure', this.layout.layoutBox))
      const { visualElement: a } = this.options
      a && a.notify('LayoutMeasure', this.layout.layoutBox, o ? o.layoutBox : void 0)
    }
    updateScroll(o = 'measure') {
      let a = !!(this.options.layoutScroll && this.instance)
      if (
        (this.scroll &&
          this.scroll.animationId === this.root.animationId &&
          this.scroll.phase === o &&
          (a = !1),
        a)
      ) {
        const l = r(this.instance)
        this.scroll = {
          animationId: this.root.animationId,
          phase: o,
          isRoot: l,
          offset: n(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : l,
        }
      }
    }
    resetTransform() {
      if (!i) return
      const o = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout,
        a = this.projectionDelta && !Z0(this.projectionDelta),
        l = this.getTransformTemplate(),
        u = l ? l(this.latestValues, '') : void 0,
        c = u !== this.prevTransformTemplateValue
      o &&
        (a || jn(this.latestValues) || c) &&
        (i(this.instance, u), (this.shouldResetTransform = !1), this.scheduleRender())
    }
    measure(o = !0) {
      const a = this.measurePageBox()
      let l = this.removeElementScroll(a)
      return (
        o && (l = this.removeTransform(l)),
        uR(l),
        {
          animationId: this.root.animationId,
          measuredBox: a,
          layoutBox: l,
          latestValues: {},
          source: this.id,
        }
      )
    }
    measurePageBox() {
      var o
      const { visualElement: a } = this.options
      if (!a) return se()
      const l = a.measureViewportBox()
      if (!(
        ((o = this.scroll) === null || o === void 0 ? void 0 : o.wasRoot) || this.path.some(cR)
      )) {
        const { scroll: c } = this.root
        c && (gr(l.x, c.offset.x), gr(l.y, c.offset.y))
      }
      return l
    }
    removeElementScroll(o) {
      var a
      const l = se()
      if ((Ze(l, o), !((a = this.scroll) === null || a === void 0) && a.wasRoot)) return l
      for (let u = 0; u < this.path.length; u++) {
        const c = this.path[u],
          { scroll: f, options: d } = c
        c !== this.root &&
          f &&
          d.layoutScroll &&
          (f.wasRoot && Ze(l, o), gr(l.x, f.offset.x), gr(l.y, f.offset.y))
      }
      return l
    }
    applyTransform(o, a = !1) {
      const l = se()
      Ze(l, o)
      for (let u = 0; u < this.path.length; u++) {
        const c = this.path[u]
        ;(!a &&
          c.options.layoutScroll &&
          c.scroll &&
          c !== c.root &&
          yr(l, { x: -c.scroll.offset.x, y: -c.scroll.offset.y }),
          jn(c.latestValues) && yr(l, c.latestValues))
      }
      return (jn(this.latestValues) && yr(l, this.latestValues), l)
    }
    removeTransform(o) {
      const a = se()
      Ze(a, o)
      for (let l = 0; l < this.path.length; l++) {
        const u = this.path[l]
        if (!u.instance || !jn(u.latestValues)) continue
        Pu(u.latestValues) && u.updateSnapshot()
        const c = se(),
          f = u.measurePageBox()
        ;(Ze(c, f), op(a, u.latestValues, u.snapshot ? u.snapshot.layoutBox : void 0, c))
      }
      return (jn(this.latestValues) && op(a, this.latestValues), a)
    }
    setTargetDelta(o) {
      ;((this.targetDelta = o), this.root.scheduleUpdateProjection(), (this.isProjectionDirty = !0))
    }
    setOptions(o) {
      this.options = { ...this.options, ...o, crossfade: o.crossfade !== void 0 ? o.crossfade : !0 }
    }
    clearMeasurements() {
      ;((this.scroll = void 0),
        (this.layout = void 0),
        (this.snapshot = void 0),
        (this.prevTransformTemplateValue = void 0),
        (this.targetDelta = void 0),
        (this.target = void 0),
        (this.isLayoutDirty = !1))
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent &&
        this.relativeParent.resolvedRelativeTargetAt !== ye.timestamp &&
        this.relativeParent.resolveTargetDelta(!0)
    }
    resolveTargetDelta(o = !1) {
      var a
      const l = this.getLead()
      ;(this.isProjectionDirty || (this.isProjectionDirty = l.isProjectionDirty),
        this.isTransformDirty || (this.isTransformDirty = l.isTransformDirty),
        this.isSharedProjectionDirty || (this.isSharedProjectionDirty = l.isSharedProjectionDirty))
      const u = !!this.resumingFrom || this !== l
      if (!(
        o ||
        (u && this.isSharedProjectionDirty) ||
        this.isProjectionDirty ||
        (!((a = this.parent) === null || a === void 0) && a.isProjectionDirty) ||
        this.attemptToResolveRelativeTarget ||
        this.root.updateBlockedByResize
      ))
        return
      const { layout: f, layoutId: d } = this.options
      if (!(!this.layout || !(f || d))) {
        if (
          ((this.resolvedRelativeTargetAt = ye.timestamp),
          !this.targetDelta && !this.relativeTarget)
        ) {
          const g = this.getClosestProjectingParent()
          g && g.layout && this.animationProgress !== 1
            ? ((this.relativeParent = g),
              this.forceRelativeParentToResolveTarget(),
              (this.relativeTarget = se()),
              (this.relativeTargetOrigin = se()),
              Si(this.relativeTargetOrigin, this.layout.layoutBox, g.layout.layoutBox),
              Ze(this.relativeTarget, this.relativeTargetOrigin))
            : (this.relativeParent = this.relativeTarget = void 0)
        }
        if (!(!this.relativeTarget && !this.targetDelta)) {
          if (
            (this.target || ((this.target = se()), (this.targetWithTransforms = se())),
            this.relativeTarget &&
            this.relativeTargetOrigin &&
            this.relativeParent &&
            this.relativeParent.target
              ? (this.forceRelativeParentToResolveTarget(),
                hT(this.target, this.relativeTarget, this.relativeParent.target))
              : this.targetDelta
                ? (this.resumingFrom
                    ? (this.target = this.applyTransform(this.layout.layoutBox))
                    : Ze(this.target, this.layout.layoutBox),
                  q0(this.target, this.targetDelta))
                : Ze(this.target, this.layout.layoutBox),
            this.attemptToResolveRelativeTarget)
          ) {
            this.attemptToResolveRelativeTarget = !1
            const g = this.getClosestProjectingParent()
            g &&
            !!g.resumingFrom == !!this.resumingFrom &&
            !g.options.layoutScroll &&
            g.target &&
            this.animationProgress !== 1
              ? ((this.relativeParent = g),
                this.forceRelativeParentToResolveTarget(),
                (this.relativeTarget = se()),
                (this.relativeTargetOrigin = se()),
                Si(this.relativeTargetOrigin, this.target, g.target),
                Ze(this.relativeTarget, this.relativeTargetOrigin))
              : (this.relativeParent = this.relativeTarget = void 0)
          }
          li && On.resolvedTargetDeltas++
        }
      }
    }
    getClosestProjectingParent() {
      if (!(!this.parent || Pu(this.parent.latestValues) || K0(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent()
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout)
    }
    calcProjection() {
      var o
      const a = this.getLead(),
        l = !!this.resumingFrom || this !== a
      let u = !0
      if (
        ((this.isProjectionDirty ||
          (!((o = this.parent) === null || o === void 0) && o.isProjectionDirty)) &&
          (u = !1),
        l && (this.isSharedProjectionDirty || this.isTransformDirty) && (u = !1),
        this.resolvedRelativeTargetAt === ye.timestamp && (u = !1),
        u)
      )
        return
      const { layout: c, layoutId: f } = this.options
      if (
        ((this.isTreeAnimating = !!(
          (this.parent && this.parent.isTreeAnimating) ||
          this.currentAnimation ||
          this.pendingAnimation
        )),
        this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0),
        !this.layout || !(c || f))
      )
        return
      Ze(this.layoutCorrected, this.layout.layoutBox)
      const d = this.treeScale.x,
        g = this.treeScale.y
      ;(ET(this.layoutCorrected, this.treeScale, this.path, l),
        a.layout &&
          !a.target &&
          (this.treeScale.x !== 1 || this.treeScale.y !== 1) &&
          ((a.target = a.layout.layoutBox), (a.targetWithTransforms = se())))
      const { target: v } = a
      if (!v) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender())
        return
      }
      ;(!this.projectionDelta || !this.prevProjectionDelta
        ? this.createProjectionDeltas()
        : (rp(this.prevProjectionDelta.x, this.projectionDelta.x),
          rp(this.prevProjectionDelta.y, this.projectionDelta.y)),
        wi(this.projectionDelta, this.layoutCorrected, v, this.latestValues),
        (this.treeScale.x !== d ||
          this.treeScale.y !== g ||
          !fp(this.projectionDelta.x, this.prevProjectionDelta.x) ||
          !fp(this.projectionDelta.y, this.prevProjectionDelta.y)) &&
          ((this.hasProjected = !0),
          this.scheduleRender(),
          this.notifyListeners('projectionUpdate', v)),
        li && On.recalculatedProjection++)
    }
    hide() {
      this.isVisible = !1
    }
    show() {
      this.isVisible = !0
    }
    scheduleRender(o = !0) {
      var a
      if (((a = this.options.visualElement) === null || a === void 0 || a.scheduleRender(), o)) {
        const l = this.getStack()
        l && l.scheduleRender()
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0)
    }
    createProjectionDeltas() {
      ;((this.prevProjectionDelta = mr()),
        (this.projectionDelta = mr()),
        (this.projectionDeltaWithTransform = mr()))
    }
    setAnimationOrigin(o, a = !1) {
      const l = this.snapshot,
        u = l ? l.latestValues : {},
        c = { ...this.latestValues },
        f = mr()
      ;((!this.relativeParent || !this.relativeParent.options.layoutRoot) &&
        (this.relativeTarget = this.relativeTargetOrigin = void 0),
        (this.attemptToResolveRelativeTarget = !a))
      const d = se(),
        g = l ? l.source : void 0,
        v = this.layout ? this.layout.source : void 0,
        x = g !== v,
        S = this.getStack(),
        h = !S || S.members.length <= 1,
        p = !!(x && !h && this.options.crossfade === !0 && !this.path.some(aR))
      this.animationProgress = 0
      let m
      ;((this.mixTargetDelta = (P) => {
        const C = P / 1e3
        ;(mp(f.x, o.x, C),
          mp(f.y, o.y, C),
          this.setTargetDelta(f),
          this.relativeTarget &&
            this.relativeTargetOrigin &&
            this.layout &&
            this.relativeParent &&
            this.relativeParent.layout &&
            (Si(d, this.layout.layoutBox, this.relativeParent.layout.layoutBox),
            oR(this.relativeTarget, this.relativeTargetOrigin, d, C),
            m && WT(this.relativeTarget, m) && (this.isProjectionDirty = !1),
            m || (m = se()),
            Ze(m, this.relativeTarget)),
          x && ((this.animationValues = c), VT(c, u, this.latestValues, C, p, h)),
          this.root.scheduleUpdateProjection(),
          this.scheduleRender(),
          (this.animationProgress = C))
      }),
        this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0))
    }
    startAnimation(o) {
      ;(this.notifyListeners('animationStart'),
        this.currentAnimation && this.currentAnimation.stop(),
        this.resumingFrom &&
          this.resumingFrom.currentAnimation &&
          this.resumingFrom.currentAnimation.stop(),
        this.pendingAnimation && (gn(this.pendingAnimation), (this.pendingAnimation = void 0)),
        (this.pendingAnimation = X.update(() => {
          ;((Qs.hasAnimatedSinceResize = !0),
            (this.currentAnimation = LT(0, dp, {
              ...o,
              onUpdate: (a) => {
                ;(this.mixTargetDelta(a), o.onUpdate && o.onUpdate(a))
              },
              onComplete: () => {
                ;(o.onComplete && o.onComplete(), this.completeAnimation())
              },
            })),
            this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation),
            (this.pendingAnimation = void 0))
        })))
    }
    completeAnimation() {
      this.resumingFrom &&
        ((this.resumingFrom.currentAnimation = void 0),
        (this.resumingFrom.preserveOpacity = void 0))
      const o = this.getStack()
      ;(o && o.exitAnimationComplete(),
        (this.resumingFrom = this.currentAnimation = this.animationValues = void 0),
        this.notifyListeners('animationComplete'))
    }
    finishAnimation() {
      ;(this.currentAnimation &&
        (this.mixTargetDelta && this.mixTargetDelta(dp), this.currentAnimation.stop()),
        this.completeAnimation())
    }
    applyTransformsToTarget() {
      const o = this.getLead()
      let { targetWithTransforms: a, target: l, layout: u, latestValues: c } = o
      if (!(!a || !l || !u)) {
        if (
          this !== o &&
          this.layout &&
          u &&
          rv(this.options.animationType, this.layout.layoutBox, u.layoutBox)
        ) {
          l = this.target || se()
          const f = Xe(this.layout.layoutBox.x)
          ;((l.x.min = o.target.x.min), (l.x.max = l.x.min + f))
          const d = Xe(this.layout.layoutBox.y)
          ;((l.y.min = o.target.y.min), (l.y.max = l.y.min + d))
        }
        ;(Ze(a, l), yr(a, c), wi(this.projectionDeltaWithTransform, this.layoutCorrected, a, c))
      }
    }
    registerSharedNode(o, a) {
      ;(this.sharedNodes.has(o) || this.sharedNodes.set(o, new HT()),
        this.sharedNodes.get(o).add(a))
      const u = a.options.initialPromotionConfig
      a.promote({
        transition: u ? u.transition : void 0,
        preserveFollowOpacity:
          u && u.shouldPreserveFollowOpacity ? u.shouldPreserveFollowOpacity(a) : void 0,
      })
    }
    isLead() {
      const o = this.getStack()
      return o ? o.lead === this : !0
    }
    getLead() {
      var o
      const { layoutId: a } = this.options
      return a ? ((o = this.getStack()) === null || o === void 0 ? void 0 : o.lead) || this : this
    }
    getPrevLead() {
      var o
      const { layoutId: a } = this.options
      return a ? ((o = this.getStack()) === null || o === void 0 ? void 0 : o.prevLead) : void 0
    }
    getStack() {
      const { layoutId: o } = this.options
      if (o) return this.root.sharedNodes.get(o)
    }
    promote({ needsReset: o, transition: a, preserveFollowOpacity: l } = {}) {
      const u = this.getStack()
      ;(u && u.promote(this, l),
        o && ((this.projectionDelta = void 0), (this.needsReset = !0)),
        a && this.setOptions({ transition: a }))
    }
    relegate() {
      const o = this.getStack()
      return o ? o.relegate(this) : !1
    }
    resetSkewAndRotation() {
      const { visualElement: o } = this.options
      if (!o) return
      let a = !1
      const { latestValues: l } = o
      if (
        ((l.z || l.rotate || l.rotateX || l.rotateY || l.rotateZ || l.skewX || l.skewY) && (a = !0),
        !a)
      )
        return
      const u = {}
      l.z && tl('z', o, u, this.animationValues)
      for (let c = 0; c < el.length; c++)
        (tl(`rotate${el[c]}`, o, u, this.animationValues),
          tl(`skew${el[c]}`, o, u, this.animationValues))
      o.render()
      for (const c in u)
        (o.setStaticValue(c, u[c]), this.animationValues && (this.animationValues[c] = u[c]))
      o.scheduleRender()
    }
    getProjectionStyles(o) {
      var a, l
      if (!this.instance || this.isSVG) return
      if (!this.isVisible) return qT
      const u = { visibility: '' },
        c = this.getTransformTemplate()
      if (this.needsReset)
        return (
          (this.needsReset = !1),
          (u.opacity = ''),
          (u.pointerEvents = Gs(o == null ? void 0 : o.pointerEvents) || ''),
          (u.transform = c ? c(this.latestValues, '') : 'none'),
          u
        )
      const f = this.getLead()
      if (!this.projectionDelta || !this.layout || !f.target) {
        const x = {}
        return (
          this.options.layoutId &&
            ((x.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1),
            (x.pointerEvents = Gs(o == null ? void 0 : o.pointerEvents) || '')),
          this.hasProjected &&
            !jn(this.latestValues) &&
            ((x.transform = c ? c({}, '') : 'none'), (this.hasProjected = !1)),
          x
        )
      }
      const d = f.animationValues || f.latestValues
      ;(this.applyTransformsToTarget(),
        (u.transform = KT(this.projectionDeltaWithTransform, this.treeScale, d)),
        c && (u.transform = c(d, u.transform)))
      const { x: g, y: v } = this.projectionDelta
      ;((u.transformOrigin = `${g.origin * 100}% ${v.origin * 100}% 0`),
        f.animationValues
          ? (u.opacity =
              f === this
                ? (l = (a = d.opacity) !== null && a !== void 0 ? a : this.latestValues.opacity) !==
                    null && l !== void 0
                  ? l
                  : 1
                : this.preserveOpacity
                  ? this.latestValues.opacity
                  : d.opacityExit)
          : (u.opacity =
              f === this
                ? d.opacity !== void 0
                  ? d.opacity
                  : ''
                : d.opacityExit !== void 0
                  ? d.opacityExit
                  : 0))
      for (const x in jo) {
        if (d[x] === void 0) continue
        const { correct: S, applyTo: h } = jo[x],
          p = u.transform === 'none' ? d[x] : S(d[x], f)
        if (h) {
          const m = h.length
          for (let P = 0; P < m; P++) u[h[P]] = p
        } else u[x] = p
      }
      return (
        this.options.layoutId &&
          (u.pointerEvents = f === this ? Gs(o == null ? void 0 : o.pointerEvents) || '' : 'none'),
        u
      )
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0
    }
    resetTree() {
      ;(this.root.nodes.forEach((o) => {
        var a
        return (a = o.currentAnimation) === null || a === void 0 ? void 0 : a.stop()
      }),
        this.root.nodes.forEach(hp),
        this.root.sharedNodes.clear())
    }
  }
}
function XT(e) {
  e.updateLayout()
}
function QT(e) {
  var t
  const n = ((t = e.resumeFrom) === null || t === void 0 ? void 0 : t.snapshot) || e.snapshot
  if (e.isLead() && e.layout && n && e.hasListeners('didUpdate')) {
    const { layoutBox: r, measuredBox: i } = e.layout,
      { animationType: s } = e.options,
      o = n.source !== e.layout.source
    s === 'size'
      ? et((f) => {
          const d = o ? n.measuredBox[f] : n.layoutBox[f],
            g = Xe(d)
          ;((d.min = r[f].min), (d.max = d.min + g))
        })
      : rv(s, n.layoutBox, r) &&
        et((f) => {
          const d = o ? n.measuredBox[f] : n.layoutBox[f],
            g = Xe(r[f])
          ;((d.max = d.min + g),
            e.relativeTarget &&
              !e.currentAnimation &&
              ((e.isProjectionDirty = !0), (e.relativeTarget[f].max = e.relativeTarget[f].min + g)))
        })
    const a = mr()
    wi(a, r, n.layoutBox)
    const l = mr()
    o ? wi(l, e.applyTransform(i, !0), n.measuredBox) : wi(l, r, n.layoutBox)
    const u = !Z0(a)
    let c = !1
    if (!e.resumeFrom) {
      const f = e.getClosestProjectingParent()
      if (f && !f.resumeFrom) {
        const { snapshot: d, layout: g } = f
        if (d && g) {
          const v = se()
          Si(v, n.layoutBox, d.layoutBox)
          const x = se()
          ;(Si(x, r, g.layoutBox),
            ev(v, x) || (c = !0),
            f.options.layoutRoot &&
              ((e.relativeTarget = x), (e.relativeTargetOrigin = v), (e.relativeParent = f)))
        }
      }
    }
    e.notifyListeners('didUpdate', {
      layout: r,
      snapshot: n,
      delta: l,
      layoutDelta: a,
      hasLayoutChanged: u,
      hasRelativeTargetChanged: c,
    })
  } else if (e.isLead()) {
    const { onExitComplete: r } = e.options
    r && r()
  }
  e.options.transition = void 0
}
function YT(e) {
  ;(li && On.totalNodes++,
    e.parent &&
      (e.isProjecting() || (e.isProjectionDirty = e.parent.isProjectionDirty),
      e.isSharedProjectionDirty ||
        (e.isSharedProjectionDirty = !!(
          e.isProjectionDirty ||
          e.parent.isProjectionDirty ||
          e.parent.isSharedProjectionDirty
        )),
      e.isTransformDirty || (e.isTransformDirty = e.parent.isTransformDirty)))
}
function JT(e) {
  e.isProjectionDirty = e.isSharedProjectionDirty = e.isTransformDirty = !1
}
function ZT(e) {
  e.clearSnapshot()
}
function hp(e) {
  e.clearMeasurements()
}
function eR(e) {
  e.isLayoutDirty = !1
}
function tR(e) {
  const { visualElement: t } = e.options
  ;(t && t.getProps().onBeforeLayoutMeasure && t.notify('BeforeLayoutMeasure'), e.resetTransform())
}
function pp(e) {
  ;(e.finishAnimation(),
    (e.targetDelta = e.relativeTarget = e.target = void 0),
    (e.isProjectionDirty = !0))
}
function nR(e) {
  e.resolveTargetDelta()
}
function rR(e) {
  e.calcProjection()
}
function iR(e) {
  e.resetSkewAndRotation()
}
function sR(e) {
  e.removeLeadSnapshot()
}
function mp(e, t, n) {
  ;((e.translate = Z(t.translate, 0, n)),
    (e.scale = Z(t.scale, 1, n)),
    (e.origin = t.origin),
    (e.originPoint = t.originPoint))
}
function gp(e, t, n, r) {
  ;((e.min = Z(t.min, n.min, r)), (e.max = Z(t.max, n.max, r)))
}
function oR(e, t, n, r) {
  ;(gp(e.x, t.x, n.x, r), gp(e.y, t.y, n.y, r))
}
function aR(e) {
  return e.animationValues && e.animationValues.opacityExit !== void 0
}
const lR = { duration: 0.45, ease: [0.4, 0, 0.1, 1] },
  yp = (e) =>
    typeof navigator < 'u' && navigator.userAgent && navigator.userAgent.toLowerCase().includes(e),
  vp = yp('applewebkit/') && !yp('chrome/') ? Math.round : qe
function xp(e) {
  ;((e.min = vp(e.min)), (e.max = vp(e.max)))
}
function uR(e) {
  ;(xp(e.x), xp(e.y))
}
function rv(e, t, n) {
  return e === 'position' || (e === 'preserve-aspect' && !dT(cp(t), cp(n), 0.2))
}
function cR(e) {
  var t
  return e !== e.root && ((t = e.scroll) === null || t === void 0 ? void 0 : t.wasRoot)
}
const fR = nv({
    attachResizeListener: (e, t) => Ki(e, 'resize', t),
    measureScroll: () => ({
      x: document.documentElement.scrollLeft || document.body.scrollLeft,
      y: document.documentElement.scrollTop || document.body.scrollTop,
    }),
    checkIsScrollRoot: () => !0,
  }),
  nl = { current: void 0 },
  iv = nv({
    measureScroll: (e) => ({ x: e.scrollLeft, y: e.scrollTop }),
    defaultParent: () => {
      if (!nl.current) {
        const e = new fR({})
        ;(e.mount(window), e.setOptions({ layoutScroll: !0 }), (nl.current = e))
      }
      return nl.current
    },
    resetTransform: (e, t) => {
      e.style.transform = t !== void 0 ? t : 'none'
    },
    checkIsScrollRoot: (e) => window.getComputedStyle(e).position === 'fixed',
  }),
  dR = { pan: { Feature: AT }, drag: { Feature: RT, ProjectionNode: iv, MeasureLayout: Q0 } }
function wp(e, t, n) {
  const { props: r } = e
  e.animationState && r.whileHover && e.animationState.setActive('whileHover', n === 'Start')
  const i = 'onHover' + n,
    s = r[i]
  s && X.postRender(() => s(t, os(t)))
}
class hR extends Cn {
  mount() {
    const { current: t } = this.node
    t && (this.unmount = dC(t, (n) => (wp(this.node, n, 'Start'), (r) => wp(this.node, r, 'End'))))
  }
  unmount() {}
}
class pR extends Cn {
  constructor() {
    ;(super(...arguments), (this.isActive = !1))
  }
  onFocus() {
    let t = !1
    try {
      t = this.node.current.matches(':focus-visible')
    } catch {
      t = !0
    }
    !t ||
      !this.node.animationState ||
      (this.node.animationState.setActive('whileFocus', !0), (this.isActive = !0))
  }
  onBlur() {
    !this.isActive ||
      !this.node.animationState ||
      (this.node.animationState.setActive('whileFocus', !1), (this.isActive = !1))
  }
  mount() {
    this.unmount = ss(
      Ki(this.node.current, 'focus', () => this.onFocus()),
      Ki(this.node.current, 'blur', () => this.onBlur()),
    )
  }
  unmount() {}
}
function Sp(e, t, n) {
  const { props: r } = e
  e.animationState && r.whileTap && e.animationState.setActive('whileTap', n === 'Start')
  const i = 'onTap' + (n === 'End' ? '' : n),
    s = r[i]
  s && X.postRender(() => s(t, os(t)))
}
class mR extends Cn {
  mount() {
    const { current: t } = this.node
    t &&
      (this.unmount = gC(
        t,
        (n) => (
          Sp(this.node, n, 'Start'),
          (r, { success: i }) => Sp(this.node, r, i ? 'End' : 'Cancel')
        ),
        { useGlobalTarget: this.node.props.globalTapTarget },
      ))
  }
  unmount() {}
}
const ku = new WeakMap(),
  rl = new WeakMap(),
  gR = (e) => {
    const t = ku.get(e.target)
    t && t(e)
  },
  yR = (e) => {
    e.forEach(gR)
  }
function vR({ root: e, ...t }) {
  const n = e || document
  rl.has(n) || rl.set(n, {})
  const r = rl.get(n),
    i = JSON.stringify(t)
  return (r[i] || (r[i] = new IntersectionObserver(yR, { root: e, ...t })), r[i])
}
function xR(e, t, n) {
  const r = vR(t)
  return (
    ku.set(e, n),
    r.observe(e),
    () => {
      ;(ku.delete(e), r.unobserve(e))
    }
  )
}
const wR = { some: 0, all: 1 }
class SR extends Cn {
  constructor() {
    ;(super(...arguments), (this.hasEnteredView = !1), (this.isInView = !1))
  }
  startObserver() {
    this.unmount()
    const { viewport: t = {} } = this.node.getProps(),
      { root: n, margin: r, amount: i = 'some', once: s } = t,
      o = {
        root: n ? n.current : void 0,
        rootMargin: r,
        threshold: typeof i == 'number' ? i : wR[i],
      },
      a = (l) => {
        const { isIntersecting: u } = l
        if (this.isInView === u || ((this.isInView = u), s && !u && this.hasEnteredView)) return
        ;(u && (this.hasEnteredView = !0),
          this.node.animationState && this.node.animationState.setActive('whileInView', u))
        const { onViewportEnter: c, onViewportLeave: f } = this.node.getProps(),
          d = u ? c : f
        d && d(l)
      }
    return xR(this.node.current, o, a)
  }
  mount() {
    this.startObserver()
  }
  update() {
    if (typeof IntersectionObserver > 'u') return
    const { props: t, prevProps: n } = this.node
    ;['amount', 'margin', 'root'].some(ER(t, n)) && this.startObserver()
  }
  unmount() {}
}
function ER({ viewport: e = {} }, { viewport: t = {} } = {}) {
  return (n) => e[n] !== t[n]
}
const PR = {
    inView: { Feature: SR },
    tap: { Feature: mR },
    focus: { Feature: pR },
    hover: { Feature: hR },
  },
  CR = { layout: { ProjectionNode: iv, MeasureLayout: Q0 } },
  Tu = { current: null },
  sv = { current: !1 }
function kR() {
  if (((sv.current = !0), !!Ic))
    if (window.matchMedia) {
      const e = window.matchMedia('(prefers-reduced-motion)'),
        t = () => (Tu.current = e.matches)
      ;(e.addListener(t), t())
    } else Tu.current = !1
}
const TR = [...j0, Te, yn],
  RR = (e) => TR.find(_0(e)),
  Ep = new WeakMap()
function AR(e, t, n) {
  for (const r in t) {
    const i = t[r],
      s = n[r]
    if (Ae(i)) e.addValue(r, i)
    else if (Ae(s)) e.addValue(r, Wi(i, { owner: e }))
    else if (s !== i)
      if (e.hasValue(r)) {
        const o = e.getValue(r)
        o.liveStyle === !0 ? o.jump(i) : o.hasAnimated || o.set(i)
      } else {
        const o = e.getStaticValue(r)
        e.addValue(r, Wi(o !== void 0 ? o : i, { owner: e }))
      }
  }
  for (const r in n) t[r] === void 0 && e.removeValue(r)
  return t
}
const Pp = [
  'AnimationStart',
  'AnimationComplete',
  'Update',
  'BeforeLayoutMeasure',
  'LayoutMeasure',
  'LayoutAnimationStart',
  'LayoutAnimationComplete',
]
class _R {
  scrapeMotionValuesFromProps(t, n, r) {
    return {}
  }
  constructor(
    {
      parent: t,
      props: n,
      presenceContext: r,
      reducedMotionConfig: i,
      blockInitialAnimation: s,
      visualState: o,
    },
    a = {},
  ) {
    ;((this.current = null),
      (this.children = new Set()),
      (this.isVariantNode = !1),
      (this.isControllingVariants = !1),
      (this.shouldReduceMotion = null),
      (this.values = new Map()),
      (this.KeyframeResolver = hf),
      (this.features = {}),
      (this.valueSubscriptions = new Map()),
      (this.prevMotionValues = {}),
      (this.events = {}),
      (this.propEventSubscriptions = {}),
      (this.notifyUpdate = () => this.notify('Update', this.latestValues)),
      (this.render = () => {
        this.current &&
          (this.triggerBuild(),
          this.renderInstance(this.current, this.renderState, this.props.style, this.projection))
      }),
      (this.renderScheduledAt = 0),
      (this.scheduleRender = () => {
        const g = Rt.now()
        this.renderScheduledAt < g && ((this.renderScheduledAt = g), X.render(this.render, !1, !0))
      }))
    const { latestValues: l, renderState: u, onUpdate: c } = o
    ;((this.onUpdate = c),
      (this.latestValues = l),
      (this.baseTarget = { ...l }),
      (this.initialValues = n.initial ? { ...l } : {}),
      (this.renderState = u),
      (this.parent = t),
      (this.props = n),
      (this.presenceContext = r),
      (this.depth = t ? t.depth + 1 : 0),
      (this.reducedMotionConfig = i),
      (this.options = a),
      (this.blockInitialAnimation = !!s),
      (this.isControllingVariants = aa(n)),
      (this.isVariantNode = Vy(n)),
      this.isVariantNode && (this.variantChildren = new Set()),
      (this.manuallyAnimateOnMount = !!(t && t.current)))
    const { willChange: f, ...d } = this.scrapeMotionValuesFromProps(n, {}, this)
    for (const g in d) {
      const v = d[g]
      l[g] !== void 0 && Ae(v) && v.set(l[g], !1)
    }
  }
  mount(t) {
    ;((this.current = t),
      Ep.set(t, this),
      this.projection && !this.projection.instance && this.projection.mount(t),
      this.parent &&
        this.isVariantNode &&
        !this.isControllingVariants &&
        (this.removeFromVariantTree = this.parent.addVariantChild(this)),
      this.values.forEach((n, r) => this.bindToMotionValue(r, n)),
      sv.current || kR(),
      (this.shouldReduceMotion =
        this.reducedMotionConfig === 'never'
          ? !1
          : this.reducedMotionConfig === 'always'
            ? !0
            : Tu.current),
      this.parent && this.parent.children.add(this),
      this.update(this.props, this.presenceContext))
  }
  unmount() {
    ;(Ep.delete(this.current),
      this.projection && this.projection.unmount(),
      gn(this.notifyUpdate),
      gn(this.render),
      this.valueSubscriptions.forEach((t) => t()),
      this.valueSubscriptions.clear(),
      this.removeFromVariantTree && this.removeFromVariantTree(),
      this.parent && this.parent.children.delete(this))
    for (const t in this.events) this.events[t].clear()
    for (const t in this.features) {
      const n = this.features[t]
      n && (n.unmount(), (n.isMounted = !1))
    }
    this.current = null
  }
  bindToMotionValue(t, n) {
    this.valueSubscriptions.has(t) && this.valueSubscriptions.get(t)()
    const r = Yn.has(t),
      i = n.on('change', (a) => {
        ;((this.latestValues[t] = a),
          this.props.onUpdate && X.preRender(this.notifyUpdate),
          r && this.projection && (this.projection.isTransformDirty = !0))
      }),
      s = n.on('renderRequest', this.scheduleRender)
    let o
    ;(window.MotionCheckAppearSync && (o = window.MotionCheckAppearSync(this, t, n)),
      this.valueSubscriptions.set(t, () => {
        ;(i(), s(), o && o(), n.owner && n.stop())
      }))
  }
  sortNodePosition(t) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== t.type
      ? 0
      : this.sortInstanceNodePosition(this.current, t.current)
  }
  updateFeatures() {
    let t = 'animation'
    for (t in Dr) {
      const n = Dr[t]
      if (!n) continue
      const { isEnabled: r, Feature: i } = n
      if (
        (!this.features[t] && i && r(this.props) && (this.features[t] = new i(this)),
        this.features[t])
      ) {
        const s = this.features[t]
        s.isMounted ? s.update() : (s.mount(), (s.isMounted = !0))
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props)
  }
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : se()
  }
  getStaticValue(t) {
    return this.latestValues[t]
  }
  setStaticValue(t, n) {
    this.latestValues[t] = n
  }
  update(t, n) {
    ;((t.transformTemplate || this.props.transformTemplate) && this.scheduleRender(),
      (this.prevProps = this.props),
      (this.props = t),
      (this.prevPresenceContext = this.presenceContext),
      (this.presenceContext = n))
    for (let r = 0; r < Pp.length; r++) {
      const i = Pp[r]
      this.propEventSubscriptions[i] &&
        (this.propEventSubscriptions[i](), delete this.propEventSubscriptions[i])
      const s = 'on' + i,
        o = t[s]
      o && (this.propEventSubscriptions[i] = this.on(i, o))
    }
    ;((this.prevMotionValues = AR(
      this,
      this.scrapeMotionValuesFromProps(t, this.prevProps, this),
      this.prevMotionValues,
    )),
      this.handleChildMotionValue && this.handleChildMotionValue(),
      this.onUpdate && this.onUpdate(this))
  }
  getProps() {
    return this.props
  }
  getVariant(t) {
    return this.props.variants ? this.props.variants[t] : void 0
  }
  getDefaultTransition() {
    return this.props.transition
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0
  }
  addVariantChild(t) {
    const n = this.getClosestVariantNode()
    if (n) return (n.variantChildren && n.variantChildren.add(t), () => n.variantChildren.delete(t))
  }
  addValue(t, n) {
    const r = this.values.get(t)
    n !== r &&
      (r && this.removeValue(t),
      this.bindToMotionValue(t, n),
      this.values.set(t, n),
      (this.latestValues[t] = n.get()))
  }
  removeValue(t) {
    this.values.delete(t)
    const n = this.valueSubscriptions.get(t)
    ;(n && (n(), this.valueSubscriptions.delete(t)),
      delete this.latestValues[t],
      this.removeValueFromRenderState(t, this.renderState))
  }
  hasValue(t) {
    return this.values.has(t)
  }
  getValue(t, n) {
    if (this.props.values && this.props.values[t]) return this.props.values[t]
    let r = this.values.get(t)
    return (
      r === void 0 &&
        n !== void 0 &&
        ((r = Wi(n === null ? void 0 : n, { owner: this })), this.addValue(t, r)),
      r
    )
  }
  readValue(t, n) {
    var r
    let i =
      this.latestValues[t] !== void 0 || !this.current
        ? this.latestValues[t]
        : (r = this.getBaseTargetFromProps(this.props, t)) !== null && r !== void 0
          ? r
          : this.readValueFromInstance(this.current, t, this.options)
    return (
      i != null &&
        (typeof i == 'string' && (R0(i) || v0(i))
          ? (i = parseFloat(i))
          : !RR(i) && yn.test(n) && (i = C0(t, n)),
        this.setBaseTarget(t, Ae(i) ? i.get() : i)),
      Ae(i) ? i.get() : i
    )
  }
  setBaseTarget(t, n) {
    this.baseTarget[t] = n
  }
  getBaseTarget(t) {
    var n
    const { initial: r } = this.props
    let i
    if (typeof r == 'string' || typeof r == 'object') {
      const o = Kc(
        this.props,
        r,
        (n = this.presenceContext) === null || n === void 0 ? void 0 : n.custom,
      )
      o && (i = o[t])
    }
    if (r && i !== void 0) return i
    const s = this.getBaseTargetFromProps(this.props, t)
    return s !== void 0 && !Ae(s)
      ? s
      : this.initialValues[t] !== void 0 && i === void 0
        ? void 0
        : this.baseTarget[t]
  }
  on(t, n) {
    return (this.events[t] || (this.events[t] = new af()), this.events[t].add(n))
  }
  notify(t, ...n) {
    this.events[t] && this.events[t].notify(...n)
  }
}
class ov extends _R {
  constructor() {
    ;(super(...arguments), (this.KeyframeResolver = O0))
  }
  sortInstanceNodePosition(t, n) {
    return t.compareDocumentPosition(n) & 2 ? 1 : -1
  }
  getBaseTargetFromProps(t, n) {
    return t.style ? t.style[n] : void 0
  }
  removeValueFromRenderState(t, { vars: n, style: r }) {
    ;(delete n[t], delete r[t])
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription)
    const { children: t } = this.props
    Ae(t) &&
      (this.childSubscription = t.on('change', (n) => {
        this.current && (this.current.textContent = `${n}`)
      }))
  }
}
function jR(e) {
  return window.getComputedStyle(e)
}
class OR extends ov {
  constructor() {
    ;(super(...arguments), (this.type = 'html'), (this.renderInstance = qy))
  }
  readValueFromInstance(t, n) {
    if (Yn.has(n)) {
      const r = df(n)
      return (r && r.default) || 0
    } else {
      const r = jR(t),
        i = (Wy(n) ? r.getPropertyValue(n) : r[n]) || 0
      return typeof i == 'string' ? i.trim() : i
    }
  }
  measureInstanceViewportBox(t, { transformPagePoint: n }) {
    return G0(t, n)
  }
  build(t, n, r) {
    Xc(t, n, r.transformTemplate)
  }
  scrapeMotionValuesFromProps(t, n, r) {
    return Zc(t, n, r)
  }
}
class LR extends ov {
  constructor() {
    ;(super(...arguments),
      (this.type = 'svg'),
      (this.isSVGTag = !1),
      (this.measureInstanceViewportBox = se))
  }
  getBaseTargetFromProps(t, n) {
    return t[n]
  }
  readValueFromInstance(t, n) {
    if (Yn.has(n)) {
      const r = df(n)
      return (r && r.default) || 0
    }
    return ((n = Gy.has(n) ? n : $c(n)), t.getAttribute(n))
  }
  scrapeMotionValuesFromProps(t, n, r) {
    return Yy(t, n, r)
  }
  build(t, n, r) {
    Qc(t, n, this.isSVGTag, r.transformTemplate)
  }
  renderInstance(t, n, r, i) {
    Xy(t, n, r, i)
  }
  mount(t) {
    ;((this.isSVGTag = Jc(t.tagName)), super.mount(t))
  }
}
const NR = (e, t) => (Hc(e) ? new LR(t) : new OR(t, { allowProjection: e !== w.Fragment })),
  DR = sC({ ...rT, ...PR, ...dR, ...CR }, NR),
  zn = wP(DR),
  il = [
    { src: '/images/ensalada.webp', alt: 'Ensalada de la casa' },
    { src: '/images/pasta2.webp', alt: 'Pasta fresca' },
    { src: '/images/pizza1.webp', alt: 'Pizza artesanal' },
    { src: '/images/postres1.webp', alt: 'Postre de la casa' },
  ]
function MR() {
  const [e, t] = w.useState(0)
  return (
    w.useEffect(() => {
      const n = setInterval(() => t((r) => (r + 1) % il.length), 6e3)
      return () => clearInterval(n)
    }, []),
    y.jsxs('section', {
      className:
        'relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-black',
      children: [
        y.jsxs('div', {
          className: 'absolute inset-0',
          children: [
            y.jsx(dP, {
              children: y.jsx(
                zn.img,
                {
                  src: il[e].src,
                  alt: il[e].alt,
                  className: 'absolute inset-0 w-full h-full object-cover',
                  initial: { opacity: 0, scale: 1.05 },
                  animate: { opacity: 0.6, scale: 1 },
                  exit: { opacity: 0 },
                  transition: {
                    opacity: { duration: 1.4 },
                    scale: { duration: 6, ease: 'linear' },
                  },
                },
                e,
              ),
            }),
            y.jsx('div', {
              className: 'absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80',
            }),
          ],
        }),
        y.jsx('div', {
          className: 'relative z-10 text-center px-4 max-w-4xl',
          children: y.jsxs(zn.div, {
            initial: { opacity: 0, y: 30 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.8 },
            children: [
              y.jsx('p', {
                className:
                  'text-primary text-lg md:text-xl font-semibold mb-4 tracking-widest uppercase',
                children: 'Bienvenido a',
              }),
              y.jsxs('h1', {
                className: 'text-5xl md:text-7xl lg:text-8xl font-display text-white mb-4',
                children: ['Hostal ', y.jsx('span', { className: 'text-gold', children: 'Cofre' })],
              }),
              y.jsx('p', {
                className: 'text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-body',
                children:
                  'Donde cada platillo cuenta una historia. Ingredientes frescos, recetas tradicionales y pasión por la gastronomía.',
              }),
              y.jsxs('div', {
                className: 'flex flex-col sm:flex-row gap-4 justify-center',
                children: [
                  y.jsxs(ve, {
                    to: '/menu',
                    className: 'btn-primary text-lg flex items-center justify-center gap-2',
                    children: ['Ver Menú ', y.jsx(JS, {})],
                  }),
                  y.jsx(ve, {
                    to: '/reservas',
                    className:
                      'btn-outline border-white text-white hover:bg-white hover:text-black text-lg',
                    children: 'Reservar Mesa',
                  }),
                ],
              }),
            ],
          }),
        }),
        y.jsx('div', {
          className: 'absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce',
          children: y.jsx('div', {
            className: 'w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2',
            children: y.jsx('div', {
              className: 'w-1.5 h-3 bg-white/60 rounded-full animate-pulse',
            }),
          }),
        }),
      ],
    })
  )
}
function bR() {
  return y.jsx('section', {
    className: 'section-padding bg-white',
    children: y.jsxs('div', {
      className: 'container-main',
      children: [
        y.jsxs('div', {
          className: 'grid grid-cols-1 lg:grid-cols-2 gap-12 items-center',
          children: [
            y.jsxs(zn.div, {
              initial: { opacity: 0, x: -40 },
              whileInView: { opacity: 1, x: 0 },
              viewport: { once: !0 },
              transition: { duration: 0.7 },
              children: [
                y.jsx('p', {
                  className: 'text-primary font-semibold text-lg mb-2',
                  children: 'Nuestra Historia',
                }),
                y.jsxs('h2', {
                  className: 'text-4xl md:text-5xl font-display text-gray-900 mb-6',
                  children: [
                    'Pasión por la ',
                    y.jsx('span', { className: 'text-primary', children: 'Gastronomía' }),
                  ],
                }),
                y.jsx('p', {
                  className: 'text-gray-600 text-lg leading-relaxed mb-6',
                  children:
                    'En Hostal Cofee creemos que la comida es más que nourishment — es una experiencia. Desde 2020, nuestra chef María González ha creado platos que fusionan tradición colombiana con técnicas internacionales.',
                }),
                y.jsx('p', {
                  className: 'text-gray-600 text-lg leading-relaxed mb-8',
                  children:
                    'Cada ingrediente es seleccionado cuidadosamente de productores locales, garantizando frescura y calidad en cada bocado.',
                }),
                y.jsx(ve, { to: '/menu', className: 'btn-primary', children: 'Explorar Menú' }),
              ],
            }),
            y.jsxs(zn.div, {
              initial: { opacity: 0, x: 40 },
              whileInView: { opacity: 1, x: 0 },
              viewport: { once: !0 },
              transition: { duration: 0.7 },
              className: 'grid grid-cols-2 gap-4',
              children: [
                y.jsxs('div', {
                  className: 'space-y-4',
                  children: [
                    y.jsx('div', {
                      className: 'card overflow-hidden rounded-2xl',
                      children: y.jsx('img', {
                        src: '/images/nosotros1.webp',
                        alt: 'Restaurante',
                        loading: 'lazy',
                        className: 'w-full h-48 object-cover',
                      }),
                    }),
                    y.jsx('div', {
                      className: 'card overflow-hidden rounded-2xl',
                      children: y.jsx('img', {
                        src: '/images/nosotros2.webp',
                        alt: 'Pasta fresca',
                        loading: 'lazy',
                        className: 'w-full h-36 object-cover',
                      }),
                    }),
                  ],
                }),
                y.jsxs('div', {
                  className: 'space-y-4 pt-8',
                  children: [
                    y.jsx('div', {
                      className: 'card overflow-hidden rounded-2xl',
                      children: y.jsx('img', {
                        src: '/images/nosotros3.webp',
                        alt: 'Pizza artesanal',
                        loading: 'lazy',
                        className: 'w-full h-36 object-cover',
                      }),
                    }),
                    y.jsx('div', {
                      className: 'card overflow-hidden rounded-2xl',
                      children: y.jsx('img', {
                        src: '/images/postres1.webp',
                        alt: 'Postre',
                        loading: 'lazy',
                        className: 'w-full h-48 object-cover',
                      }),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        y.jsx('div', {
          className: 'grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center',
          children: [
            { num: '5+', label: 'Años de Experiencia' },
            { num: '50+', label: 'Platos Únicos' },
            { num: '10K+', label: 'Clientes Felices' },
            { num: '4.9', label: 'Calificación Google' },
          ].map((e, t) =>
            y.jsxs(
              zn.div,
              {
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: !0 },
                transition: { delay: t * 0.1, duration: 0.5 },
                children: [
                  y.jsx('div', {
                    className: 'text-4xl md:text-5xl font-display text-primary mb-2',
                    children: e.num,
                  }),
                  y.jsx('div', { className: 'text-gray-500 text-sm', children: e.label }),
                ],
              },
              t,
            ),
          ),
        }),
      ],
    }),
  })
}
function FR() {
  return y.jsx('section', {
    className: 'section-padding bg-gray-50',
    children: y.jsxs('div', {
      className: 'container-main text-center',
      children: [
        y.jsxs(zn.div, {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: !0 },
          children: [
            y.jsx('p', {
              className: 'text-primary font-semibold text-lg mb-2',
              children: 'Nuestro Equipo',
            }),
            y.jsx('h2', {
              className: 'text-4xl md:text-5xl font-display text-gray-900 mb-12',
              children: 'El Chef',
            }),
          ],
        }),
        y.jsx(zn.div, {
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: !0 },
          transition: { duration: 0.7 },
          className: 'max-w-3xl mx-auto',
          children: y.jsxs('div', {
            className: 'card overflow-hidden',
            children: [
              y.jsx('img', {
                src: '/images/chef.webp',
                alt: 'Chef María González',
                loading: 'lazy',
                className: 'w-full h-80 object-cover',
              }),
              y.jsxs('div', {
                className: 'p-8',
                children: [
                  y.jsx('h3', {
                    className: 'font-display text-3xl text-gray-900 mb-3',
                    children: 'María González',
                  }),
                  y.jsx('p', {
                    className: 'text-primary font-semibold mb-4',
                    children: 'Chef Ejecutiva',
                  }),
                  y.jsx('p', {
                    className: 'text-gray-600 text-lg leading-relaxed',
                    children:
                      'Con más de 25 años de experiencia creando experiencias gastronómicas inolvidables, María fusiona los sabores tradicionales colombianos con técnicas culinarias internacionales. Su pasión por los ingredientes frescos y locales se refleja en cada platillo que sale de nuestra cocina.',
                  }),
                  y.jsx('div', {
                    className: 'flex justify-center gap-4 mt-6',
                    children: [
                      '🏆 Chef del Año 2023',
                      '🌟 Estrella Michelin',
                      '📖 Autora de "Sabores de Casa"',
                    ].map((e, t) =>
                      y.jsx(
                        'span',
                        {
                          className:
                            'bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold',
                          children: e,
                        },
                        t,
                      ),
                    ),
                  }),
                ],
              }),
            ],
          }),
        }),
      ],
    }),
  })
}
function VR() {
  return y.jsxs(y.Fragment, { children: [y.jsx(MR, {}), y.jsx(bR, {}), y.jsx(FR, {})] })
}
function IR({ children: e, adminOnly: t = !1 }) {
  const { user: n, loading: r } = Mc()
  return r
    ? y.jsx('div', {
        className: 'min-h-screen flex items-center justify-center',
        children: y.jsx('div', {
          className:
            'w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin',
        }),
      })
    : n
      ? t && n.role !== 'admin'
        ? y.jsx(bd, { to: '/', replace: !0 })
        : y.jsx(y.Fragment, { children: e })
      : y.jsx(bd, { to: '/login', replace: !0 })
}
const BR = w.lazy(() => Je(() => import('./MenuPage-DgxTXhXM.js'), [])),
  zR = w.lazy(() => Je(() => import('./ReservationsPage-BZYSVS-x.js'), [])),
  UR = w.lazy(() => Je(() => import('./CartPage-zcSjXxij.js'), [])),
  $R = w.lazy(() => Je(() => import('./LoginPage-C1TulPgH.js'), [])),
  WR = w.lazy(() => Je(() => import('./MesaPage-D7WcWop3.js'), [])),
  HR = w.lazy(() => Je(() => import('./AdminDashboard-qfG-y6I1.js'), [])),
  KR = w.lazy(() => Je(() => import('./AdminMenu-BDjtUVZn.js'), [])),
  qR = w.lazy(() => Je(() => import('./AdminOrders-DKTY5H9b.js'), [])),
  GR = w.lazy(() => Je(() => import('./AdminReservations-BMjPVnI2.js'), [])),
  XR = w.lazy(() => Je(() => import('./AdminPOS-DEMllwmZ.js'), [])),
  QR = w.lazy(() => Je(() => import('./AdminShifts-BkfXik7e.js'), __vite__mapDeps([0, 1]))),
  YR = w.lazy(() => Je(() => import('./AdminReports-YEA1y_Pe.js'), __vite__mapDeps([2, 1]))),
  JR = w.lazy(() => Je(() => import('./AdminTables-BVd7lMm_.js'), []))
function ZR() {
  return y.jsx('div', {
    className: 'min-h-screen flex items-center justify-center',
    children: y.jsx('div', {
      className: 'animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full',
    }),
  })
}
function eA() {
  return y.jsxs(y.Fragment, {
    children: [
      y.jsx(LS, {
        position: 'top-right',
        toastOptions: { duration: 3e3, style: { fontFamily: '"Mulish", sans-serif' } },
      }),
      y.jsx(w.Suspense, {
        fallback: y.jsx(ZR, {}),
        children: y.jsxs(Ow, {
          children: [
            y.jsx(me, { path: '/mesa', element: y.jsx(WR, {}) }),
            y.jsx(me, { path: '/login', element: y.jsx($R, {}) }),
            y.jsxs(me, {
              element: y.jsx(iP, {}),
              children: [
                y.jsx(me, { path: '/', element: y.jsx(VR, {}) }),
                y.jsx(me, { path: '/menu', element: y.jsx(BR, {}) }),
                y.jsx(me, { path: '/reservas', element: y.jsx(zR, {}) }),
                y.jsx(me, { path: '/carrito', element: y.jsx(UR, {}) }),
              ],
            }),
            y.jsxs(me, {
              element: y.jsx(IR, { adminOnly: !0, children: y.jsx(aP, {}) }),
              children: [
                y.jsx(me, { path: '/admin', element: y.jsx(HR, {}) }),
                y.jsx(me, { path: '/admin/menu', element: y.jsx(KR, {}) }),
                y.jsx(me, { path: '/admin/pedidos', element: y.jsx(qR, {}) }),
                y.jsx(me, { path: '/admin/reservas', element: y.jsx(GR, {}) }),
                y.jsx(me, { path: '/admin/pos', element: y.jsx(XR, {}) }),
                y.jsx(me, { path: '/admin/turnos', element: y.jsx(QR, {}) }),
                y.jsx(me, { path: '/admin/reportes', element: y.jsx(YR, {}) }),
                y.jsx(me, { path: '/admin/mesas', element: y.jsx(JR, {}) }),
              ],
            }),
          ],
        }),
      }),
    ],
  })
}
sl.createRoot(document.getElementById('root')).render(
  y.jsx(Dt.StrictMode, {
    children: y.jsx(Iw, {
      children: y.jsx(eP, { children: y.jsx(eE, { children: y.jsx(eA, {}) }) }),
    }),
  }),
)
export {
  dP as A,
  oA as B,
  ny as C,
  dA as D,
  nA as E,
  gA as F,
  US as G,
  fA as H,
  pA as I,
  ve as L,
  Dt as R,
  St as a,
  aA as b,
  Mc as c,
  cA as d,
  mA as e,
  sA as f,
  lA as g,
  iA as h,
  rA as i,
  y as j,
  HS as k,
  KS as l,
  zn as m,
  uA as n,
  Tc as o,
  tA as p,
  hA as q,
  w as r,
  QS as s,
  Wd as t,
  tE as u,
  iu as v,
  FA as w,
  zS as x,
  YS as y,
  NS as z,
}
