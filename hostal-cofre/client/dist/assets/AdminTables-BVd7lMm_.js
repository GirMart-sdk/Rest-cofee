import {
  R as v,
  r as P,
  j as i,
  b as W,
  m as $,
  l as xe,
  D as Z,
  h as be,
  x as ye,
  C as J,
  I as Ee,
  a as k,
  z as I,
} from './index-BSHWOaHa.js'
var Ce = Object.defineProperty,
  D = Object.getOwnPropertySymbols,
  ee = Object.prototype.hasOwnProperty,
  te = Object.prototype.propertyIsEnumerable,
  q = (f, c, a) =>
    c in f ? Ce(f, c, { enumerable: !0, configurable: !0, writable: !0, value: a }) : (f[c] = a),
  Q = (f, c) => {
    for (var a in c || (c = {})) ee.call(c, a) && q(f, a, c[a])
    if (D) for (var a of D(c)) te.call(c, a) && q(f, a, c[a])
    return f
  },
  H = (f, c) => {
    var a = {}
    for (var u in f) ee.call(f, u) && c.indexOf(u) < 0 && (a[u] = f[u])
    if (f != null && D) for (var u of D(f)) c.indexOf(u) < 0 && te.call(f, u) && (a[u] = f[u])
    return a
  }
/**
 * @license QR Code generator library (TypeScript)
 * Copyright (c) Project Nayuki.
 * SPDX-License-Identifier: MIT
 */ var z
;((f) => {
  const c = class b {
    constructor(e, s, t, r) {
      if (
        ((this.version = e),
        (this.errorCorrectionLevel = s),
        (this.modules = []),
        (this.isFunction = []),
        e < b.MIN_VERSION || e > b.MAX_VERSION)
      )
        throw new RangeError('Version value out of range')
      if (r < -1 || r > 7) throw new RangeError('Mask value out of range')
      this.size = e * 4 + 17
      let n = []
      for (let o = 0; o < this.size; o++) n.push(!1)
      for (let o = 0; o < this.size; o++)
        (this.modules.push(n.slice()), this.isFunction.push(n.slice()))
      this.drawFunctionPatterns()
      const d = this.addEccAndInterleave(t)
      if ((this.drawCodewords(d), r == -1)) {
        let o = 1e9
        for (let x = 0; x < 8; x++) {
          ;(this.applyMask(x), this.drawFormatBits(x))
          const g = this.getPenaltyScore()
          ;(g < o && ((r = x), (o = g)), this.applyMask(x))
        }
      }
      ;(m(0 <= r && r <= 7),
        (this.mask = r),
        this.applyMask(r),
        this.drawFormatBits(r),
        (this.isFunction = []))
    }
    static encodeText(e, s) {
      const t = f.QrSegment.makeSegments(e)
      return b.encodeSegments(t, s)
    }
    static encodeBinary(e, s) {
      const t = f.QrSegment.makeBytes(e)
      return b.encodeSegments([t], s)
    }
    static encodeSegments(e, s, t = 1, r = 40, n = -1, d = !0) {
      if (!(b.MIN_VERSION <= t && t <= r && r <= b.MAX_VERSION) || n < -1 || n > 7)
        throw new RangeError('Invalid value')
      let o, x
      for (o = t; ; o++) {
        const p = b.getNumDataCodewords(o, s) * 8,
          l = w.getTotalBits(e, o)
        if (l <= p) {
          x = l
          break
        }
        if (o >= r) throw new RangeError('Data too long')
      }
      for (const p of [b.Ecc.MEDIUM, b.Ecc.QUARTILE, b.Ecc.HIGH])
        d && x <= b.getNumDataCodewords(o, p) * 8 && (s = p)
      let g = []
      for (const p of e) {
        ;(a(p.mode.modeBits, 4, g), a(p.numChars, p.mode.numCharCountBits(o), g))
        for (const l of p.getData()) g.push(l)
      }
      m(g.length == x)
      const M = b.getNumDataCodewords(o, s) * 8
      ;(m(g.length <= M),
        a(0, Math.min(4, M - g.length), g),
        a(0, (8 - (g.length % 8)) % 8, g),
        m(g.length % 8 == 0))
      for (let p = 236; g.length < M; p ^= 253) a(p, 8, g)
      let N = []
      for (; N.length * 8 < g.length;) N.push(0)
      return (g.forEach((p, l) => (N[l >>> 3] |= p << (7 - (l & 7)))), new b(o, s, N, n))
    }
    getModule(e, s) {
      return 0 <= e && e < this.size && 0 <= s && s < this.size && this.modules[s][e]
    }
    getModules() {
      return this.modules
    }
    drawFunctionPatterns() {
      for (let t = 0; t < this.size; t++)
        (this.setFunctionModule(6, t, t % 2 == 0), this.setFunctionModule(t, 6, t % 2 == 0))
      ;(this.drawFinderPattern(3, 3),
        this.drawFinderPattern(this.size - 4, 3),
        this.drawFinderPattern(3, this.size - 4))
      const e = this.getAlignmentPatternPositions(),
        s = e.length
      for (let t = 0; t < s; t++)
        for (let r = 0; r < s; r++)
          (t == 0 && r == 0) ||
            (t == 0 && r == s - 1) ||
            (t == s - 1 && r == 0) ||
            this.drawAlignmentPattern(e[t], e[r])
      ;(this.drawFormatBits(0), this.drawVersion())
    }
    drawFormatBits(e) {
      const s = (this.errorCorrectionLevel.formatBits << 3) | e
      let t = s
      for (let n = 0; n < 10; n++) t = (t << 1) ^ ((t >>> 9) * 1335)
      const r = ((s << 10) | t) ^ 21522
      m(r >>> 15 == 0)
      for (let n = 0; n <= 5; n++) this.setFunctionModule(8, n, u(r, n))
      ;(this.setFunctionModule(8, 7, u(r, 6)),
        this.setFunctionModule(8, 8, u(r, 7)),
        this.setFunctionModule(7, 8, u(r, 8)))
      for (let n = 9; n < 15; n++) this.setFunctionModule(14 - n, 8, u(r, n))
      for (let n = 0; n < 8; n++) this.setFunctionModule(this.size - 1 - n, 8, u(r, n))
      for (let n = 8; n < 15; n++) this.setFunctionModule(8, this.size - 15 + n, u(r, n))
      this.setFunctionModule(8, this.size - 8, !0)
    }
    drawVersion() {
      if (this.version < 7) return
      let e = this.version
      for (let t = 0; t < 12; t++) e = (e << 1) ^ ((e >>> 11) * 7973)
      const s = (this.version << 12) | e
      m(s >>> 18 == 0)
      for (let t = 0; t < 18; t++) {
        const r = u(s, t),
          n = this.size - 11 + (t % 3),
          d = Math.floor(t / 3)
        ;(this.setFunctionModule(n, d, r), this.setFunctionModule(d, n, r))
      }
    }
    drawFinderPattern(e, s) {
      for (let t = -4; t <= 4; t++)
        for (let r = -4; r <= 4; r++) {
          const n = Math.max(Math.abs(r), Math.abs(t)),
            d = e + r,
            o = s + t
          0 <= d &&
            d < this.size &&
            0 <= o &&
            o < this.size &&
            this.setFunctionModule(d, o, n != 2 && n != 4)
        }
    }
    drawAlignmentPattern(e, s) {
      for (let t = -2; t <= 2; t++)
        for (let r = -2; r <= 2; r++)
          this.setFunctionModule(e + r, s + t, Math.max(Math.abs(r), Math.abs(t)) != 1)
    }
    setFunctionModule(e, s, t) {
      ;((this.modules[s][e] = t), (this.isFunction[s][e] = !0))
    }
    addEccAndInterleave(e) {
      const s = this.version,
        t = this.errorCorrectionLevel
      if (e.length != b.getNumDataCodewords(s, t)) throw new RangeError('Invalid argument')
      const r = b.NUM_ERROR_CORRECTION_BLOCKS[t.ordinal][s],
        n = b.ECC_CODEWORDS_PER_BLOCK[t.ordinal][s],
        d = Math.floor(b.getNumRawDataModules(s) / 8),
        o = r - (d % r),
        x = Math.floor(d / r)
      let g = []
      const M = b.reedSolomonComputeDivisor(n)
      for (let p = 0, l = 0; p < r; p++) {
        let E = e.slice(l, l + x - n + (p < o ? 0 : 1))
        l += E.length
        const j = b.reedSolomonComputeRemainder(E, M)
        ;(p < o && E.push(0), g.push(E.concat(j)))
      }
      let N = []
      for (let p = 0; p < g[0].length; p++)
        g.forEach((l, E) => {
          ;(p != x - n || E >= o) && N.push(l[p])
        })
      return (m(N.length == d), N)
    }
    drawCodewords(e) {
      if (e.length != Math.floor(b.getNumRawDataModules(this.version) / 8))
        throw new RangeError('Invalid argument')
      let s = 0
      for (let t = this.size - 1; t >= 1; t -= 2) {
        t == 6 && (t = 5)
        for (let r = 0; r < this.size; r++)
          for (let n = 0; n < 2; n++) {
            const d = t - n,
              x = ((t + 1) & 2) == 0 ? this.size - 1 - r : r
            !this.isFunction[x][d] &&
              s < e.length * 8 &&
              ((this.modules[x][d] = u(e[s >>> 3], 7 - (s & 7))), s++)
          }
      }
      m(s == e.length * 8)
    }
    applyMask(e) {
      if (e < 0 || e > 7) throw new RangeError('Mask value out of range')
      for (let s = 0; s < this.size; s++)
        for (let t = 0; t < this.size; t++) {
          let r
          switch (e) {
            case 0:
              r = (t + s) % 2 == 0
              break
            case 1:
              r = s % 2 == 0
              break
            case 2:
              r = t % 3 == 0
              break
            case 3:
              r = (t + s) % 3 == 0
              break
            case 4:
              r = (Math.floor(t / 3) + Math.floor(s / 2)) % 2 == 0
              break
            case 5:
              r = ((t * s) % 2) + ((t * s) % 3) == 0
              break
            case 6:
              r = (((t * s) % 2) + ((t * s) % 3)) % 2 == 0
              break
            case 7:
              r = (((t + s) % 2) + ((t * s) % 3)) % 2 == 0
              break
            default:
              throw new Error('Unreachable')
          }
          !this.isFunction[s][t] && r && (this.modules[s][t] = !this.modules[s][t])
        }
    }
    getPenaltyScore() {
      let e = 0
      for (let n = 0; n < this.size; n++) {
        let d = !1,
          o = 0,
          x = [0, 0, 0, 0, 0, 0, 0]
        for (let g = 0; g < this.size; g++)
          this.modules[n][g] == d
            ? (o++, o == 5 ? (e += b.PENALTY_N1) : o > 5 && e++)
            : (this.finderPenaltyAddHistory(o, x),
              d || (e += this.finderPenaltyCountPatterns(x) * b.PENALTY_N3),
              (d = this.modules[n][g]),
              (o = 1))
        e += this.finderPenaltyTerminateAndCount(d, o, x) * b.PENALTY_N3
      }
      for (let n = 0; n < this.size; n++) {
        let d = !1,
          o = 0,
          x = [0, 0, 0, 0, 0, 0, 0]
        for (let g = 0; g < this.size; g++)
          this.modules[g][n] == d
            ? (o++, o == 5 ? (e += b.PENALTY_N1) : o > 5 && e++)
            : (this.finderPenaltyAddHistory(o, x),
              d || (e += this.finderPenaltyCountPatterns(x) * b.PENALTY_N3),
              (d = this.modules[g][n]),
              (o = 1))
        e += this.finderPenaltyTerminateAndCount(d, o, x) * b.PENALTY_N3
      }
      for (let n = 0; n < this.size - 1; n++)
        for (let d = 0; d < this.size - 1; d++) {
          const o = this.modules[n][d]
          o == this.modules[n][d + 1] &&
            o == this.modules[n + 1][d] &&
            o == this.modules[n + 1][d + 1] &&
            (e += b.PENALTY_N2)
        }
      let s = 0
      for (const n of this.modules) s = n.reduce((d, o) => d + (o ? 1 : 0), s)
      const t = this.size * this.size,
        r = Math.ceil(Math.abs(s * 20 - t * 10) / t) - 1
      return (m(0 <= r && r <= 9), (e += r * b.PENALTY_N4), m(0 <= e && e <= 2568888), e)
    }
    getAlignmentPatternPositions() {
      if (this.version == 1) return []
      {
        const e = Math.floor(this.version / 7) + 2,
          s = this.version == 32 ? 26 : Math.ceil((this.version * 4 + 4) / (e * 2 - 2)) * 2
        let t = [6]
        for (let r = this.size - 7; t.length < e; r -= s) t.splice(1, 0, r)
        return t
      }
    }
    static getNumRawDataModules(e) {
      if (e < b.MIN_VERSION || e > b.MAX_VERSION)
        throw new RangeError('Version number out of range')
      let s = (16 * e + 128) * e + 64
      if (e >= 2) {
        const t = Math.floor(e / 7) + 2
        ;((s -= (25 * t - 10) * t - 55), e >= 7 && (s -= 36))
      }
      return (m(208 <= s && s <= 29648), s)
    }
    static getNumDataCodewords(e, s) {
      return (
        Math.floor(b.getNumRawDataModules(e) / 8) -
        b.ECC_CODEWORDS_PER_BLOCK[s.ordinal][e] * b.NUM_ERROR_CORRECTION_BLOCKS[s.ordinal][e]
      )
    }
    static reedSolomonComputeDivisor(e) {
      if (e < 1 || e > 255) throw new RangeError('Degree out of range')
      let s = []
      for (let r = 0; r < e - 1; r++) s.push(0)
      s.push(1)
      let t = 1
      for (let r = 0; r < e; r++) {
        for (let n = 0; n < s.length; n++)
          ((s[n] = b.reedSolomonMultiply(s[n], t)), n + 1 < s.length && (s[n] ^= s[n + 1]))
        t = b.reedSolomonMultiply(t, 2)
      }
      return s
    }
    static reedSolomonComputeRemainder(e, s) {
      let t = s.map((r) => 0)
      for (const r of e) {
        const n = r ^ t.shift()
        ;(t.push(0), s.forEach((d, o) => (t[o] ^= b.reedSolomonMultiply(d, n))))
      }
      return t
    }
    static reedSolomonMultiply(e, s) {
      if (e >>> 8 || s >>> 8) throw new RangeError('Byte out of range')
      let t = 0
      for (let r = 7; r >= 0; r--) ((t = (t << 1) ^ ((t >>> 7) * 285)), (t ^= ((s >>> r) & 1) * e))
      return (m(t >>> 8 == 0), t)
    }
    finderPenaltyCountPatterns(e) {
      const s = e[1]
      m(s <= this.size * 3)
      const t = s > 0 && e[2] == s && e[3] == s * 3 && e[4] == s && e[5] == s
      return (t && e[0] >= s * 4 && e[6] >= s ? 1 : 0) + (t && e[6] >= s * 4 && e[0] >= s ? 1 : 0)
    }
    finderPenaltyTerminateAndCount(e, s, t) {
      return (
        e && (this.finderPenaltyAddHistory(s, t), (s = 0)),
        (s += this.size),
        this.finderPenaltyAddHistory(s, t),
        this.finderPenaltyCountPatterns(t)
      )
    }
    finderPenaltyAddHistory(e, s) {
      ;(s[0] == 0 && (e += this.size), s.pop(), s.unshift(e))
    }
  }
  ;((c.MIN_VERSION = 1),
    (c.MAX_VERSION = 40),
    (c.PENALTY_N1 = 3),
    (c.PENALTY_N2 = 3),
    (c.PENALTY_N3 = 40),
    (c.PENALTY_N4 = 10),
    (c.ECC_CODEWORDS_PER_BLOCK = [
      [
        -1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28,
        30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
      ],
      [
        -1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28,
        28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28,
      ],
      [
        -1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30,
        30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
      ],
      [
        -1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24,
        30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
      ],
    ]),
    (c.NUM_ERROR_CORRECTION_BLOCKS = [
      [
        -1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13,
        14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25,
      ],
      [
        -1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21,
        23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49,
      ],
      [
        -1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29,
        34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68,
      ],
      [
        -1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32,
        35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81,
      ],
    ]),
    (f.QrCode = c))
  function a(y, e, s) {
    if (e < 0 || e > 31 || y >>> e) throw new RangeError('Value out of range')
    for (let t = e - 1; t >= 0; t--) s.push((y >>> t) & 1)
  }
  function u(y, e) {
    return ((y >>> e) & 1) != 0
  }
  function m(y) {
    if (!y) throw new Error('Assertion error')
  }
  const h = class C {
    constructor(e, s, t) {
      if (((this.mode = e), (this.numChars = s), (this.bitData = t), s < 0))
        throw new RangeError('Invalid argument')
      this.bitData = t.slice()
    }
    static makeBytes(e) {
      let s = []
      for (const t of e) a(t, 8, s)
      return new C(C.Mode.BYTE, e.length, s)
    }
    static makeNumeric(e) {
      if (!C.isNumeric(e)) throw new RangeError('String contains non-numeric characters')
      let s = []
      for (let t = 0; t < e.length;) {
        const r = Math.min(e.length - t, 3)
        ;(a(parseInt(e.substring(t, t + r), 10), r * 3 + 1, s), (t += r))
      }
      return new C(C.Mode.NUMERIC, e.length, s)
    }
    static makeAlphanumeric(e) {
      if (!C.isAlphanumeric(e))
        throw new RangeError('String contains unencodable characters in alphanumeric mode')
      let s = [],
        t
      for (t = 0; t + 2 <= e.length; t += 2) {
        let r = C.ALPHANUMERIC_CHARSET.indexOf(e.charAt(t)) * 45
        ;((r += C.ALPHANUMERIC_CHARSET.indexOf(e.charAt(t + 1))), a(r, 11, s))
      }
      return (
        t < e.length && a(C.ALPHANUMERIC_CHARSET.indexOf(e.charAt(t)), 6, s),
        new C(C.Mode.ALPHANUMERIC, e.length, s)
      )
    }
    static makeSegments(e) {
      return e == ''
        ? []
        : C.isNumeric(e)
          ? [C.makeNumeric(e)]
          : C.isAlphanumeric(e)
            ? [C.makeAlphanumeric(e)]
            : [C.makeBytes(C.toUtf8ByteArray(e))]
    }
    static makeEci(e) {
      let s = []
      if (e < 0) throw new RangeError('ECI assignment value out of range')
      if (e < 128) a(e, 8, s)
      else if (e < 16384) (a(2, 2, s), a(e, 14, s))
      else if (e < 1e6) (a(6, 3, s), a(e, 21, s))
      else throw new RangeError('ECI assignment value out of range')
      return new C(C.Mode.ECI, 0, s)
    }
    static isNumeric(e) {
      return C.NUMERIC_REGEX.test(e)
    }
    static isAlphanumeric(e) {
      return C.ALPHANUMERIC_REGEX.test(e)
    }
    getData() {
      return this.bitData.slice()
    }
    static getTotalBits(e, s) {
      let t = 0
      for (const r of e) {
        const n = r.mode.numCharCountBits(s)
        if (r.numChars >= 1 << n) return 1 / 0
        t += 4 + n + r.bitData.length
      }
      return t
    }
    static toUtf8ByteArray(e) {
      e = encodeURI(e)
      let s = []
      for (let t = 0; t < e.length; t++)
        e.charAt(t) != '%'
          ? s.push(e.charCodeAt(t))
          : (s.push(parseInt(e.substring(t + 1, t + 3), 16)), (t += 2))
      return s
    }
  }
  ;((h.NUMERIC_REGEX = /^[0-9]*$/),
    (h.ALPHANUMERIC_REGEX = /^[A-Z0-9 $%*+.\/:-]*$/),
    (h.ALPHANUMERIC_CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:'))
  let w = h
  f.QrSegment = h
})(z || (z = {}))
;((f) => {
  ;((c) => {
    const a = class {
      constructor(m, h) {
        ;((this.ordinal = m), (this.formatBits = h))
      }
    }
    ;((a.LOW = new a(0, 1)),
      (a.MEDIUM = new a(1, 0)),
      (a.QUARTILE = new a(2, 3)),
      (a.HIGH = new a(3, 2)),
      (c.Ecc = a))
  })(f.QrCode || (f.QrCode = {}))
})(z || (z = {}))
;((f) => {
  ;((c) => {
    const a = class {
      constructor(m, h) {
        ;((this.modeBits = m), (this.numBitsCharCount = h))
      }
      numCharCountBits(m) {
        return this.numBitsCharCount[Math.floor((m + 7) / 17)]
      }
    }
    ;((a.NUMERIC = new a(1, [10, 12, 14])),
      (a.ALPHANUMERIC = new a(2, [9, 11, 13])),
      (a.BYTE = new a(4, [8, 16, 16])),
      (a.KANJI = new a(8, [8, 10, 12])),
      (a.ECI = new a(7, [0, 0, 0])),
      (c.Mode = a))
  })(f.QrSegment || (f.QrSegment = {}))
})(z || (z = {}))
var O = z
/**
 * @license qrcode.react
 * Copyright (c) Paul O'Shannessy
 * SPDX-License-Identifier: ISC
 */ var Ne = {
    L: O.QrCode.Ecc.LOW,
    M: O.QrCode.Ecc.MEDIUM,
    Q: O.QrCode.Ecc.QUARTILE,
    H: O.QrCode.Ecc.HIGH,
  },
  se = 128,
  re = 'L',
  ne = '#FFFFFF',
  ie = '#000000',
  ae = !1,
  oe = 1,
  we = 4,
  ve = 0,
  Me = 0.1
function le(f, c = 0) {
  const a = []
  return (
    f.forEach(function (u, m) {
      let h = null
      u.forEach(function (w, y) {
        if (!w && h !== null) {
          ;(a.push(`M${h + c} ${m + c}h${y - h}v1H${h + c}z`), (h = null))
          return
        }
        if (y === u.length - 1) {
          if (!w) return
          h === null
            ? a.push(`M${y + c},${m + c} h1v1H${y + c}z`)
            : a.push(`M${h + c},${m + c} h${y + 1 - h}v1H${h + c}z`)
          return
        }
        w && h === null && (h = y)
      })
    }),
    a.join('')
  )
}
function ce(f, c) {
  return f
    .slice()
    .map((a, u) =>
      u < c.y || u >= c.y + c.h ? a : a.map((m, h) => (h < c.x || h >= c.x + c.w ? m : !1)),
    )
}
function je(f, c, a, u) {
  if (u == null) return null
  const m = f.length + a * 2,
    h = Math.floor(c * Me),
    w = m / c,
    y = (u.width || h) * w,
    e = (u.height || h) * w,
    s = u.x == null ? f.length / 2 - y / 2 : u.x * w,
    t = u.y == null ? f.length / 2 - e / 2 : u.y * w,
    r = u.opacity == null ? 1 : u.opacity
  let n = null
  if (u.excavate) {
    let o = Math.floor(s),
      x = Math.floor(t),
      g = Math.ceil(y + s - o),
      M = Math.ceil(e + t - x)
    n = { x: o, y: x, w: g, h: M }
  }
  const d = u.crossOrigin
  return { x: s, y: t, h: e, w: y, excavation: n, opacity: r, crossOrigin: d }
}
function Re(f, c) {
  return c != null ? Math.max(Math.floor(c), 0) : f ? we : ve
}
function de({
  value: f,
  level: c,
  minVersion: a,
  includeMargin: u,
  marginSize: m,
  imageSettings: h,
  size: w,
  boostLevel: y,
}) {
  let e = v.useMemo(() => {
    const o = (Array.isArray(f) ? f : [f]).reduce(
      (x, g) => (x.push(...O.QrSegment.makeSegments(g)), x),
      [],
    )
    return O.QrCode.encodeSegments(o, Ne[c], a, void 0, void 0, y)
  }, [f, c, a, y])
  const {
    cells: s,
    margin: t,
    numCells: r,
    calculatedImageSettings: n,
  } = v.useMemo(() => {
    let d = e.getModules()
    const o = Re(u, m),
      x = d.length + o * 2,
      g = je(d, w, o, h)
    return { cells: d, margin: o, numCells: x, calculatedImageSettings: g }
  }, [e, w, h, u, m])
  return { qrcode: e, margin: t, cells: s, numCells: r, calculatedImageSettings: n }
}
var Ae = (function () {
    try {
      new Path2D().addPath(new Path2D())
    } catch {
      return !1
    }
    return !0
  })(),
  Pe = v.forwardRef(function (c, a) {
    const u = c,
      {
        value: m,
        size: h = se,
        level: w = re,
        bgColor: y = ne,
        fgColor: e = ie,
        includeMargin: s = ae,
        minVersion: t = oe,
        boostLevel: r,
        marginSize: n,
        imageSettings: d,
      } = u,
      x = H(u, [
        'value',
        'size',
        'level',
        'bgColor',
        'fgColor',
        'includeMargin',
        'minVersion',
        'boostLevel',
        'marginSize',
        'imageSettings',
      ]),
      { style: g } = x,
      M = H(x, ['style']),
      N = d == null ? void 0 : d.src,
      p = v.useRef(null),
      l = v.useRef(null),
      E = v.useCallback(
        (S) => {
          ;((p.current = S), typeof a == 'function' ? a(S) : a && (a.current = S))
        },
        [a],
      ),
      [j, T] = v.useState(!1),
      {
        margin: F,
        cells: B,
        numCells: U,
        calculatedImageSettings: R,
      } = de({
        value: m,
        level: w,
        minVersion: t,
        boostLevel: r,
        includeMargin: s,
        marginSize: n,
        imageSettings: d,
        size: h,
      })
    ;(v.useEffect(() => {
      if (p.current != null) {
        const S = p.current,
          A = S.getContext('2d')
        if (!A) return
        let Y = B
        const L = l.current,
          V = R != null && L !== null && L.complete && L.naturalHeight !== 0 && L.naturalWidth !== 0
        V && R.excavation != null && (Y = ce(B, R.excavation))
        const X = window.devicePixelRatio || 1
        S.height = S.width = h * X
        const K = (h / U) * X
        ;(A.scale(K, K),
          (A.fillStyle = y),
          A.fillRect(0, 0, U, U),
          (A.fillStyle = e),
          Ae
            ? A.fill(new Path2D(le(Y, F)))
            : B.forEach(function (me, fe) {
                me.forEach(function (ge, pe) {
                  ge && A.fillRect(pe + F, fe + F, 1, 1)
                })
              }),
          R && (A.globalAlpha = R.opacity),
          V && A.drawImage(L, R.x + F, R.y + F, R.w, R.h))
      }
    }),
      v.useEffect(() => {
        T(!1)
      }, [N]))
    const he = Q({ height: h, width: h }, g)
    let G = null
    return (
      N != null &&
        (G = v.createElement('img', {
          src: N,
          key: N,
          style: { display: 'none' },
          onLoad: () => {
            T(!0)
          },
          ref: l,
          crossOrigin: R == null ? void 0 : R.crossOrigin,
        })),
      v.createElement(
        v.Fragment,
        null,
        v.createElement('canvas', Q({ style: he, height: h, width: h, ref: E, role: 'img' }, M)),
        G,
      )
    )
  })
Pe.displayName = 'QRCodeCanvas'
var ue = v.forwardRef(function (c, a) {
  const u = c,
    {
      value: m,
      size: h = se,
      level: w = re,
      bgColor: y = ne,
      fgColor: e = ie,
      includeMargin: s = ae,
      minVersion: t = oe,
      boostLevel: r,
      title: n,
      marginSize: d,
      imageSettings: o,
    } = u,
    x = H(u, [
      'value',
      'size',
      'level',
      'bgColor',
      'fgColor',
      'includeMargin',
      'minVersion',
      'boostLevel',
      'title',
      'marginSize',
      'imageSettings',
    ]),
    {
      margin: g,
      cells: M,
      numCells: N,
      calculatedImageSettings: p,
    } = de({
      value: m,
      level: w,
      minVersion: t,
      boostLevel: r,
      includeMargin: s,
      marginSize: d,
      imageSettings: o,
      size: h,
    })
  let l = M,
    E = null
  o != null &&
    p != null &&
    (p.excavation != null && (l = ce(M, p.excavation)),
    (E = v.createElement('image', {
      href: o.src,
      height: p.h,
      width: p.w,
      x: p.x + g,
      y: p.y + g,
      preserveAspectRatio: 'none',
      opacity: p.opacity,
      crossOrigin: p.crossOrigin,
    })))
  const j = le(l, g)
  return v.createElement(
    'svg',
    Q({ height: h, width: h, viewBox: `0 0 ${N} ${N}`, ref: a, role: 'img' }, x),
    !!n && v.createElement('title', null, n),
    v.createElement('path', { fill: y, d: `M0,0 h${N}v${N}H0z`, shapeRendering: 'crispEdges' }),
    v.createElement('path', { fill: e, d: j, shapeRendering: 'crispEdges' }),
    E,
  )
})
ue.displayName = 'QRCodeSVG'
const _ = { number: '', capacity: '', zone: 'interior' }
function Oe() {
  const [f, c] = P.useState([]),
    [a, u] = P.useState(!0),
    [m, h] = P.useState(null),
    [w, y] = P.useState(!1),
    [e, s] = P.useState(null),
    [t, r] = P.useState(_),
    [n, d] = P.useState(!1),
    o = async () => {
      try {
        u(!0)
        const l = await k.get('/tables/active')
        c(l.data.data)
      } catch {
        I.error('Error al cargar mesas')
      } finally {
        u(!1)
      }
    }
  P.useEffect(() => {
    o()
  }, [])
  const x = (l) => {
      const E = `${window.location.origin}/mesa?t=${l}`
      ;(navigator.clipboard.writeText(E), I.success('Enlace copiado'))
    },
    g = () => {
      ;(s(null), r(_), y(!0))
    },
    M = (l) => {
      ;(s(l), r({ number: String(l.number), capacity: String(l.capacity), zone: l.zone }), y(!0))
    },
    N = async () => {
      var l, E
      if (!t.number || !t.capacity) {
        I.error('Número y capacidad son requeridos')
        return
      }
      d(!0)
      try {
        ;(e
          ? (await k.put(`/tables/${e.id}`, {
              number: parseInt(t.number),
              capacity: parseInt(t.capacity),
              zone: t.zone,
            }),
            I.success('Mesa actualizada'))
          : (await k.post('/tables', {
              number: parseInt(t.number),
              capacity: parseInt(t.capacity),
              zone: t.zone,
            }),
            I.success('Mesa creada')),
          y(!1),
          s(null),
          r(_),
          o())
      } catch (j) {
        I.error(
          ((E = (l = j.response) == null ? void 0 : l.data) == null ? void 0 : E.error) ||
            'Error al guardar mesa',
        )
      } finally {
        d(!1)
      }
    },
    p = async (l) => {
      var E, j
      if (confirm(`¿Eliminar Mesa #${l.number}?`))
        try {
          ;(await k.delete(`/tables/${l.id}`), I.success('Mesa eliminada'), h(null), o())
        } catch (T) {
          I.error(
            ((j = (E = T.response) == null ? void 0 : E.data) == null ? void 0 : j.error) ||
              'No se puede eliminar esta mesa',
          )
        }
    }
  return i.jsxs('div', {
    className: 'container-main',
    children: [
      i.jsxs('div', {
        className: 'flex items-center justify-between mb-6',
        children: [
          i.jsx('h1', { className: 'text-3xl font-display', children: 'Gestión de Mesas' }),
          i.jsxs('div', {
            className: 'flex gap-2',
            children: [
              i.jsx('button', {
                onClick: o,
                className: 'btn-outline text-sm px-3 py-2',
                children: 'Actualizar',
              }),
              i.jsxs('button', {
                onClick: g,
                className: 'btn-primary text-sm px-3 py-2 flex items-center gap-1',
                children: [i.jsx(W, { size: 16 }), ' Agregar Mesa'],
              }),
            ],
          }),
        ],
      }),
      a
        ? i.jsx('div', {
            className: 'text-center py-16 text-gray-400',
            children: 'Cargando mesas...',
          })
        : i.jsxs('div', {
            className: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
            children: [
              f.map((l) =>
                i.jsxs(
                  $.div,
                  {
                    initial: { opacity: 0, scale: 0.9 },
                    animate: { opacity: 1, scale: 1 },
                    className: `bg-white rounded-2xl p-5 shadow-md border-2 transition-all cursor-pointer group ${l.isOccupied ? 'border-orange-300 bg-orange-50' : 'border-primary/20 hover:border-primary/50'}`,
                    onClick: () => h(l),
                    children: [
                      i.jsxs('div', {
                        className: 'flex items-center justify-between mb-3',
                        children: [
                          i.jsx('div', {
                            className: `w-12 h-12 rounded-xl flex items-center justify-center text-white ${l.isOccupied ? 'bg-orange-500' : 'bg-primary'}`,
                            children: i.jsx(xe, { size: 22 }),
                          }),
                          i.jsxs('div', {
                            className:
                              'flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
                            children: [
                              i.jsx('button', {
                                onClick: (E) => {
                                  ;(E.stopPropagation(), M(l))
                                },
                                className:
                                  'w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200',
                                children: i.jsx(Z, { size: 12 }),
                              }),
                              i.jsx('button', {
                                onClick: (E) => {
                                  ;(E.stopPropagation(), p(l))
                                },
                                className:
                                  'w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200',
                                children: i.jsx(be, { size: 12 }),
                              }),
                            ],
                          }),
                        ],
                      }),
                      i.jsxs('h3', {
                        className: 'font-display text-xl mb-1',
                        children: ['Mesa #', l.number],
                      }),
                      i.jsxs('p', {
                        className: 'text-sm text-gray-500 flex items-center gap-1',
                        children: [i.jsx(ye, { size: 12 }), ' ', l.capacity, ' personas'],
                      }),
                      i.jsx('span', {
                        className: `inline-block mt-2 text-xs px-2 py-1 rounded-full ${l.zone === 'interior' ? 'bg-blue-100 text-blue-700' : l.zone === 'exterior' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`,
                        children: l.zone,
                      }),
                      l.isOccupied &&
                        l.totalPending !== void 0 &&
                        i.jsxs('p', {
                          className: 'text-sm font-bold text-orange-600 mt-2',
                          children: ['$', l.totalPending.toLocaleString(), ' pendiente'],
                        }),
                    ],
                  },
                  l.id,
                ),
              ),
              i.jsxs('button', {
                onClick: g,
                className:
                  'border-2 border-dashed border-gray-300 rounded-2xl p-5 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all min-h-[180px]',
                children: [
                  i.jsx(W, { size: 32, className: 'mb-2' }),
                  i.jsx('span', { className: 'font-semibold', children: 'Agregar Mesa' }),
                ],
              }),
            ],
          }),
      w &&
        i.jsx('div', {
          className: 'modal-overlay',
          children: i.jsxs($.div, {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            className: 'modal-content',
            children: [
              i.jsxs('div', {
                className: 'flex items-center justify-between mb-6',
                children: [
                  i.jsx('h2', {
                    className: 'text-2xl font-display',
                    children: e ? 'Editar Mesa' : 'Nueva Mesa',
                  }),
                  i.jsx('button', {
                    onClick: () => {
                      ;(y(!1), s(null))
                    },
                    className: 'text-gray-400 hover:text-gray-600',
                    children: i.jsx(J, { size: 24 }),
                  }),
                ],
              }),
              i.jsxs('div', {
                className: 'space-y-4 mb-6',
                children: [
                  i.jsxs('div', {
                    children: [
                      i.jsx('label', {
                        className: 'text-sm font-semibold text-gray-700 mb-1 block',
                        children: 'Número de mesa *',
                      }),
                      i.jsx('input', {
                        type: 'number',
                        value: t.number,
                        onChange: (l) => r({ ...t, number: l.target.value }),
                        className: 'input-field',
                        placeholder: 'Ej: 8',
                        min: '1',
                      }),
                    ],
                  }),
                  i.jsxs('div', {
                    children: [
                      i.jsx('label', {
                        className: 'text-sm font-semibold text-gray-700 mb-1 block',
                        children: 'Capacidad (personas) *',
                      }),
                      i.jsx('input', {
                        type: 'number',
                        value: t.capacity,
                        onChange: (l) => r({ ...t, capacity: l.target.value }),
                        className: 'input-field',
                        placeholder: 'Ej: 4',
                        min: '1',
                        max: '50',
                      }),
                    ],
                  }),
                  i.jsxs('div', {
                    children: [
                      i.jsx('label', {
                        className: 'text-sm font-semibold text-gray-700 mb-2 block',
                        children: 'Zona',
                      }),
                      i.jsx('div', {
                        className: 'grid grid-cols-3 gap-2',
                        children: [
                          {
                            key: 'interior',
                            label: 'Interior',
                            color: 'bg-blue-100 text-blue-700 border-blue-300',
                          },
                          {
                            key: 'exterior',
                            label: 'Exterior',
                            color: 'bg-green-100 text-green-700 border-green-300',
                          },
                          {
                            key: 'privado',
                            label: 'Privado',
                            color: 'bg-purple-100 text-purple-700 border-purple-300',
                          },
                        ].map((l) =>
                          i.jsx(
                            'button',
                            {
                              onClick: () => r({ ...t, zone: l.key }),
                              className: `py-2 rounded-lg text-sm font-semibold border-2 transition-all ${t.zone === l.key ? l.color + ' shadow-sm' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`,
                              children: l.label,
                            },
                            l.key,
                          ),
                        ),
                      }),
                    ],
                  }),
                ],
              }),
              i.jsxs('div', {
                className: 'flex gap-3',
                children: [
                  i.jsx('button', {
                    onClick: () => {
                      ;(y(!1), s(null))
                    },
                    className: 'flex-1 py-3 border border-gray-300 rounded-xl font-semibold',
                    children: 'Cancelar',
                  }),
                  i.jsx('button', {
                    onClick: N,
                    disabled: n,
                    className:
                      'flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark disabled:opacity-50',
                    children: n ? 'Guardando...' : e ? 'Actualizar' : 'Crear Mesa',
                  }),
                ],
              }),
            ],
          }),
        }),
      m &&
        i.jsx('div', {
          className: 'modal-overlay',
          children: i.jsxs($.div, {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            className: 'modal-content',
            children: [
              i.jsxs('div', {
                className: 'flex items-center justify-between mb-6',
                children: [
                  i.jsxs('h2', {
                    className: 'text-2xl font-display',
                    children: ['Mesa #', m.number],
                  }),
                  i.jsx('button', {
                    onClick: () => h(null),
                    className: 'text-gray-400 hover:text-gray-600',
                    children: i.jsx(J, { size: 24 }),
                  }),
                ],
              }),
              i.jsxs('div', {
                className: 'text-center mb-6',
                children: [
                  i.jsx('div', {
                    className: 'bg-white p-4 rounded-xl border-2 border-gray-100 inline-block mb-4',
                    children: i.jsx(ue, {
                      value: `${window.location.origin}/mesa?t=${m.number}`,
                      size: 180,
                      level: 'M',
                      includeMargin: !0,
                    }),
                  }),
                  i.jsx('p', {
                    className: 'text-sm text-gray-500 mb-3',
                    children: 'Escanea este QR para ordenar desde la mesa',
                  }),
                  i.jsxs('button', {
                    onClick: () => x(m.number),
                    className:
                      'inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold hover:bg-primary/20',
                    children: [i.jsx(Ee, { size: 14 }), ' Copiar enlace'],
                  }),
                ],
              }),
              i.jsxs('div', {
                className: 'bg-gray-50 rounded-xl p-4 space-y-2 mb-4',
                children: [
                  i.jsxs('div', {
                    className: 'flex justify-between text-sm',
                    children: [
                      i.jsx('span', { className: 'text-gray-600', children: 'Capacidad:' }),
                      i.jsxs('span', {
                        className: 'font-bold',
                        children: [m.capacity, ' personas'],
                      }),
                    ],
                  }),
                  i.jsxs('div', {
                    className: 'flex justify-between text-sm',
                    children: [
                      i.jsx('span', { className: 'text-gray-600', children: 'Zona:' }),
                      i.jsx('span', { className: 'font-bold capitalize', children: m.zone }),
                    ],
                  }),
                  i.jsxs('div', {
                    className: 'flex justify-between text-sm',
                    children: [
                      i.jsx('span', { className: 'text-gray-600', children: 'Estado:' }),
                      i.jsx('span', {
                        className: `font-bold ${m.isOccupied ? 'text-orange-600' : 'text-green-600'}`,
                        children: m.isOccupied ? 'Ocupada' : 'Libre',
                      }),
                    ],
                  }),
                ],
              }),
              m.orders &&
                m.orders.length > 0 &&
                i.jsxs('div', {
                  children: [
                    i.jsx('h3', { className: 'font-semibold mb-2', children: 'Pedidos Activos:' }),
                    m.orders.map((l) =>
                      i.jsxs(
                        'div',
                        {
                          className: 'bg-orange-50 rounded-lg p-3 mb-2',
                          children: [
                            i.jsxs('div', {
                              className: 'flex justify-between text-sm',
                              children: [
                                i.jsxs('span', {
                                  className: 'font-semibold',
                                  children: ['#', l.id.slice(0, 8)],
                                }),
                                i.jsxs('span', {
                                  className: 'font-bold text-primary',
                                  children: ['$', l.total],
                                }),
                              ],
                            }),
                            i.jsx('div', {
                              className: 'text-xs text-gray-500 mt-1',
                              children: l.items
                                .map((E) => {
                                  var j
                                  return `${E.quantity}x ${((j = E.menuItem) == null ? void 0 : j.name) || 'Item'}`
                                })
                                .join(', '),
                            }),
                          ],
                        },
                        l.id,
                      ),
                    ),
                  ],
                }),
              i.jsxs('div', {
                className: 'flex gap-2 mt-4',
                children: [
                  i.jsxs('button', {
                    onClick: () => {
                      ;(h(null), M(m))
                    },
                    className:
                      'flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 flex items-center justify-center gap-1',
                    children: [i.jsx(Z, { size: 14 }), ' Editar'],
                  }),
                  i.jsx('button', {
                    onClick: () => h(null),
                    className: 'flex-1 py-3 bg-gray-100 rounded-xl font-semibold',
                    children: 'Cerrar',
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  })
}
export { Oe as default }
