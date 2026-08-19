/* eslint-disable no-console, @typescript-eslint/no-explicit-any */
import 'dotenv/config'
import jwt from 'jsonwebtoken'

const BASE = process.env.TEST_URL || 'http://localhost:3001'
const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-that-is-at-least-32-characters-long!!'

let passed = 0
let failed = 0
let total = 0
const VULNS: string[] = []

async function test(name: string, fn: () => Promise<void>) {
  total++
  try {
    await fn()
    passed++
    console.log(`  ? ${name}`)
  } catch (err: any) {
    failed++
    VULNS.push(name)
    console.log(`  ? VULN: ${name} � ${err.message}`)
  }
}

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(msg)
}

function assertEqual(actual: any, expected: any, msg: string) {
  if (actual !== expected) throw new Error(`${msg} (got: ${actual}, expected: ${expected})`)
}

async function api(
  method: string,
  path: string,
  body?: any,
  headers?: Record<string, string>,
): Promise<{ status: number; data: any; headers: Record<string, string> }> {
  const opts: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
  }
  if (body && method !== 'GET') {
    opts.body = JSON.stringify(body)
  }
  const res = await fetch(`${BASE}${path}`, opts)
  const data = await res.json().catch(() => null)
  return { status: res.status, data, headers: Object.fromEntries(res.headers.entries()) }
}

async function registerUser(email: string, password = 'Attack!Test1') {
  return api('POST', '/api/auth/register', { name: 'Attack Test', email, password })
}

async function loginUser(email: string, password: string) {
  const res = await api('POST', '/api/auth/login', { email, password })
  const token = res.data?.data?.accessToken
  const rawCookie = res.headers['set-cookie'] || ''
  let cookie = ''
  for (const part of rawCookie.split(',')) {
    const [pair] = part.trim().split(';')
    const [name, ...rest] = pair.split('=')
    if (name === 'hostal_refresh') cookie = rest.join('=')
  }
  return { ...res, token, cookie }
}

// ============================================================
// 1. SQL INJECTION � OWASP A03 � OBLIGATORIO POR LEY
// ============================================================
async function testSQLInjection() {
  console.log('\n?? 1. SQL Injection � OWASP A03')

  const payloads = [
    { value: "' OR '1'='1", desc: 'classic OR bypass' },
    { value: "'; DROP TABLE users; --", desc: 'DROP TABLE' },
    { value: "' UNION SELECT * FROM users --", desc: 'UNION SELECT' },
    { value: "' OR 1=1 LIMIT 1 OFFSET 0 --", desc: 'PostgreSQL-style' },
    { value: "admin'--", desc: 'comment truncation' },
    { value: '1; SELECT * FROM users', desc: 'stacked query' },
    { value: "1' AND SLEEP(5)--", desc: 'time-based blind' },
  ]

  for (const p of payloads) {
    await test(`SQLi "${p.desc}" en login`, async () => {
      const { status } = await api('POST', '/api/auth/login', { email: p.value, password: 'x' })
      assert(status !== 200 && status !== 500, `SQLi returned ${status}`)
    })
    await test(`SQLi "${p.desc}" en registro`, async () => {
      const { status } = await api('POST', '/api/auth/register', {
        name: p.value,
        email: `sqli-${Date.now()}@test.com`,
        password: 'Attack!Test1',
      })
      assert(status !== 500, `SQLi caused 500`)
    })
  }

  await test('SQLi en query string', async () => {
    const { status } = await api('GET', "/api/orders?page=1'+OR+1=1--")
    assert(status !== 500, 'SQLi query caused 500')
  })
}

// ============================================================
// 2. XSS � OWASP A03 � OBLIGATORIO POR LEY
// ============================================================
async function testXSS() {
  console.log('\n?? 2. XSS � OWASP A03')

  const payloads = [
    { value: '<script>alert(1)</script>', desc: 'script tag' },
    { value: '<img src=x onerror=alert(1)>', desc: 'img onerror' },
    { value: '<svg/onload=alert(1)>', desc: 'svg onload' },
    { value: '"><script>alert(1)</script>', desc: 'attribute breakout' },
    { value: "';alert(1)//", desc: 'JS string breakout' },
    { value: 'javascript:alert(1)', desc: 'javascript URI' },
    { value: '\u003cscript\u003ealert(1)\u003c/script\u003e', desc: 'unicode escape' },
  ]

  for (const p of payloads) {
    await test(`XSS "${p.desc}" sanitizado`, async () => {
      const { data } = await api('POST', '/api/reservations', {
        name: p.value,
        phone: '1234567890',
        date: '2026-12-31',
        time: '20:00',
        guests: 2,
      })
      const name = data?.data?.name || ''
      assert(!name.includes('<script'), `Script tag not stripped: ${name}`)
      assert(
        !name.includes('onerror') && !name.includes('onload'),
        `Event handler not stripped: ${name}`,
      )
      assert(!name.toLowerCase().includes('javascript:'), `javascript: URI not stripped`)
    })
  }
}

// ============================================================
// 3. JWT SECURITY � OWASP A02 � OBLIGATORIO
// ============================================================
async function testJWTSecurity() {
  console.log('\n?? 3. JWT Security � OWASP A02')

  await test('Rechazar JWT algoritmo "none"', async () => {
    const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url')
    const payload = Buffer.from(
      JSON.stringify({ id: 'x', email: 'a@b.com', role: 'admin', ver: 0 }),
    ).toString('base64url')
    const { status } = await api('GET', '/api/auth/me', undefined, {
      Authorization: `Bearer ${header}.${payload}.`,
    })
    assertEqual(status, 401, 'none algo must be rejected')
  })

  await test('Rechazar JWT firmado con secret incorrecto', async () => {
    const forged = jwt.sign(
      { id: 'x', email: 'a@b.com', role: 'admin', ver: 0 },
      'wrong-secret-that-is-long-enough!!',
      { algorithm: 'HS256', expiresIn: '15m' },
    )
    const { status } = await api('GET', '/api/auth/me', undefined, {
      Authorization: `Bearer ${forged}`,
    })
    assertEqual(status, 401, 'Wrong secret must be rejected')
  })

  await test('Rechazar JWT expirado', async () => {
    const expired = jwt.sign({ id: 'x', email: 'a@b.com', role: 'client', ver: 0 }, JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: '-1h',
    })
    const { status } = await api('GET', '/api/auth/me', undefined, {
      Authorization: `Bearer ${expired}`,
    })
    assertEqual(status, 401, 'Expired token must be rejected')
  })

  await test('Rechazar JWT con purpose equivocado como access token', async () => {
    const resetToken = jwt.sign({ purpose: 'password-reset', id: 'x' }, JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: '15m',
    })
    const { status } = await api('GET', '/api/auth/me', undefined, {
      Authorization: `Bearer ${resetToken}`,
    })
    assertEqual(status, 401, 'Reset token must not work as access token')
  })

  await test('JWT_SECRET minimo 32 caracteres', async () => {
    assert(JWT_SECRET.length >= 32, `Secret too short: ${JWT_SECRET.length}`)
  })

  await test('JWT_SECRET no es placeholder', async () => {
    assert(!/change.*me|placeholder|test.*secret/i.test(JWT_SECRET), 'Secret is placeholder')
  })
}

// ============================================================
// 4. PRIVILEGE ESCALATION � OWASP A01 � OBLIGATORIO
// ============================================================
async function testPrivilegeEscalation() {
  console.log('\n?? 4. Privilege Escalation � OWASP A01')

  const email = `privesc-${Date.now()}@test.com`
  await registerUser(email)
  const login = await loginUser(email, 'Attack!Test1')
  const clientToken = login.token || ''

  await test('Cliente no puede modificar estado de orden (admin)', async () => {
    const { status } = await api(
      'PATCH',
      '/api/orders/fake-id/status',
      { status: 'delivered' },
      { Authorization: `Bearer ${clientToken}` },
    )
    assert(status === 401 || status === 403, `Got ${status}, expected 401/403`)
  })

  await test('Cliente no puede crear items en menu', async () => {
    const { status } = await api(
      'POST',
      '/api/menu',
      { name: 'Hacked', price: 0, category: 'pizza' },
      { Authorization: `Bearer ${clientToken}` },
    )
    assertEqual(status, 403, 'Client creating menu must be 403')
  })

  await test('Cliente no puede ver auditoria', async () => {
    const { status } = await api('GET', '/api/audit', undefined, {
      Authorization: `Bearer ${clientToken}`,
    })
    assert(status === 401 || status === 403, `Got ${status}`)
  })

  await test('Token con role=admin pero user inexistente -> 401', async () => {
    const token = jwt.sign(
      { id: 'nonexistent-id-12345', email: 'ghost@test.com', role: 'admin', ver: 0 },
      JWT_SECRET,
      { algorithm: 'HS256', expiresIn: '15m' },
    )
    const { status } = await api('GET', '/api/auth/me', undefined, {
      Authorization: `Bearer ${token}`,
    })
    assertEqual(status, 401, 'Phantom admin must be rejected')
  })
}

// ============================================================
// 5. IDOR � OWASP A01 � OBLIGATORIO (Ley 1581 datos personales)
// ============================================================
async function testIDOR() {
  console.log('\n?? 5. IDOR � OWASP A01')

  const email1 = `idor-a-${Date.now()}@test.com`
  const email2 = `idor-b-${Date.now()}@test.com`
  await registerUser(email1)
  await registerUser(email2)
  const userA = await loginUser(email1, 'Attack!Test1')
  const userB = await loginUser(email2, 'Attack!Test1')

  await test('Usuario B no ve ordenes de Usuario A', async () => {
    const { status, data } = await api('GET', '/api/orders', undefined, {
      Authorization: `Bearer ${userB.token}`,
    })
    if (status === 200) {
      const orders = data?.data || []
      for (const order of orders) {
        assert(order.userId !== userA.token, 'User B can see User A orders')
      }
    }
  })

  await test('Cliente no puede usar endpoint admin de reset', async () => {
    const { status } = await api(
      'POST',
      '/api/auth/admin/reset-password/c00000000000000000000001',
      { newPassword: 'New!Pass123' },
      { Authorization: `Bearer ${userA.token}` },
    )
    assertEqual(status, 403, 'Client on admin endpoint must be 403')
  })
}

// ============================================================
// 6. PASSWORD � OWASP A07 � OBLIGATORIO
// ============================================================
async function testPasswordSecurity() {
  console.log('\n?? 6. Password Security � OWASP A07')

  await test('Reset token no reutilizable', async () => {
    const email = `reset-reuse-${Date.now()}@test.com`
    await registerUser(email)
    const forgotRes = await api('POST', '/api/auth/forgot-password', { email })
    const resetToken = forgotRes.data?.debug?.resetToken
    if (resetToken) {
      await api('POST', '/api/auth/reset-password', {
        token: resetToken,
        newPassword: 'New!Secure1',
      })
      const { status } = await api('POST', '/api/auth/reset-password', {
        token: resetToken,
        newPassword: 'New!Secure2',
      })
      assert(status !== 200, 'Reset token was reusable')
    }
  })

  await test('Forgot-password no revela si email existe', async () => {
    const existing = `enum-${Date.now()}@test.com`
    await registerUser(existing)
    const resA = await api('POST', '/api/auth/forgot-password', { email: existing })
    const resB = await api('POST', '/api/auth/forgot-password', {
      email: `no-${Date.now()}@test.com`,
    })
    assertEqual(resA.status, resB.status, 'Status must be identical')
    assertEqual(JSON.stringify(resA.data), JSON.stringify(resB.data), 'Body must be identical')
  })

  await test('Password change invalida todas las sesiones', async () => {
    const email = `pw-inv-${Date.now()}@test.com`
    await registerUser(email)
    const login1 = await loginUser(email, 'Attack!Test1')
    const login2 = await loginUser(email, 'Attack!Test1')

    await api(
      'POST',
      '/api/auth/change-password',
      { currentPassword: 'Attack!Test1', newPassword: 'NewSecure!1Pass' },
      { Authorization: `Bearer ${login1.token}` },
    )

    const r1 = await api('POST', '/api/auth/refresh', undefined, {
      Cookie: `hostal_refresh=${login1.cookie}`,
    })
    const r2 = await api('POST', '/api/auth/refresh', undefined, {
      Cookie: `hostal_refresh=${login2.cookie}`,
    })
    assertEqual(r1.status, 401, 'Session 1 must be invalidated')
    assertEqual(r2.status, 401, 'Session 2 must be invalidated')
  })
}

// ============================================================
// 7. RATE LIMITING � OWASP A07 � OBLIGATORIO
// ============================================================
async function testRateLimiting() {
  console.log('\n??  7. Rate Limiting � OWASP A07')

  const email = `lock-${Date.now()}@test.com`
  await registerUser(email)

  await test('5 intentos fallidos -> lockout', async () => {
    for (let i = 0; i < 5; i++) {
      await api('POST', '/api/auth/login', { email, password: 'Wrong!1Pass' })
    }
    const { status } = await api('POST', '/api/auth/login', { email, password: 'Wrong!1Pass' })
    assertEqual(status, 429, 'Account must be locked after 5 failures')
  })

  await test('Request-Id spoofing no afecta comportamiento', async () => {
    const { headers } = await api('GET', '/api/health', undefined, {
      'X-Request-Id': 'spoofed-id-123',
    })
    assert(headers['x-request-id'] !== 'spoofed-id-123', 'Server accepted spoofed Request-Id')
  })

  await test('Body JSON malformado -> 400, no 500', async () => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{bad json',
    })
    assert(res.status !== 500, `Malformed JSON caused 500: ${res.status}`)
  })
}

// ============================================================
// 8. INFORMATION DISCLOSURE � OWASP A01 � OBLIGATORIO
// ============================================================
async function testInformationDisclosure() {
  console.log('\n???  8. Information Disclosure � OWASP A01')

  await test('Stack trace no se expone', async () => {
    const { data } = await api('GET', '/api/orders/nonexistent-id/status', undefined, {
      Authorization: 'Bearer fake-token',
    })
    const body = JSON.stringify(data || {})
    assert(!body.includes('at ') && !body.includes('node_modules'), 'Stack trace leaked')
  })

  await test('Login 401 identico para email existente/inexistente', async () => {
    const existing = `disc-${Date.now()}@test.com`
    await registerUser(existing)
    const resA = await api('POST', '/api/auth/login', {
      email: existing,
      password: 'Wrong!Pass1',
    })
    const resB = await api('POST', '/api/auth/login', {
      email: `nobody-${Date.now()}@test.com`,
      password: 'Wrong!Pass1',
    })
    assertEqual(resA.status, resB.status, 'Status must be identical')
    assertEqual(resA.data?.error, resB.data?.error, 'Error message must be identical')
  })

  await test('Password/bcrypt hash nunca se retorna', async () => {
    const email = `disc-pw-${Date.now()}@test.com`
    const regRes = await registerUser(email)
    const body = JSON.stringify(regRes.data || {})
    assert(!body.includes('$2a$'), 'Bcrypt hash leaked in response')
    assert(!body.includes('password'), 'Password field leaked in response')
  })

  await test('X-Powered-By no se expone', async () => {
    const { headers } = await api('GET', '/api/health')
    assert(!headers['x-powered-by'], 'X-Powered-By header leaked')
  })

  await test('Security headers presentes (HSTS, CSP, nosniff)', async () => {
    const { headers } = await api('GET', '/api/health')
    assert(headers['strict-transport-security'], 'HSTS missing')
    assert(headers['content-security-policy'], 'CSP missing')
    assertEqual(headers['x-content-type-options'], 'nosniff', 'nosniff missing')
    assertEqual(headers['x-frame-options'], 'DENY', 'X-Frame-Options missing')
  })
}

// ============================================================
// 9. MASS ASSIGNMENT � OWASP A04 � OBLIGATORIO
// ============================================================
async function testMassAssignment() {
  console.log('\n?? 9. Mass Assignment � OWASP A04')

  await test('Registro ignora campo "role" inyectado', async () => {
    const email = `mass-${Date.now()}@test.com`
    const { status, data } = await api('POST', '/api/auth/register', {
      name: 'Hacker',
      email,
      password: 'Attack!Test1',
      role: 'admin',
    })
    assertEqual(status, 201, 'Registration should succeed')
    assert(data?.data?.user?.role !== 'admin', `User got admin role via mass assignment!`)
  })

  await test('Registro ignora campo "tokenVersion" inyectado', async () => {
    const email = `mass-tv-${Date.now()}@test.com`
    const { status } = await api('POST', '/api/auth/register', {
      name: 'Hacker',
      email,
      password: 'Attack!Test1',
      tokenVersion: 999,
    })
    assertEqual(status, 201, 'Registration should succeed')
  })
}

// ============================================================
// 10. BUSINESS LOGIC � OWASP A04 � OBLIGATORIO
// ============================================================
async function testBusinessLogic() {
  console.log('\n?? 10. Business Logic � OWASP A04')

  await test('Orden con cantidad negativa es rechazada', async () => {
    const { status } = await api('POST', '/api/orders', {
      customerName: 'Hacker',
      customerPhone: '3001234567',
      paymentMethod: 'cash',
      items: [{ menuItemId: '000000000000000000000001', quantity: -5 }],
      orderType: 'tienda',
    })
    assert(status === 400, `Negative quantity returned ${status}`)
  })

  await test('Orden con cantidad > 100 es rechazada', async () => {
    const { status } = await api('POST', '/api/orders', {
      customerName: 'Hacker',
      customerPhone: '3001234567',
      paymentMethod: 'cash',
      items: [{ menuItemId: '000000000000000000000001', quantity: 999 }],
      orderType: 'tienda',
    })
    assert(status === 400, `Excessive quantity returned ${status}`)
  })

  await test('Reservacion con guests > 50 es rechazada', async () => {
    const { status } = await api('POST', '/api/reservations', {
      name: 'Hacker',
      phone: '3001234567',
      date: '2026-12-31',
      time: '20:00',
      guests: 999,
    })
    assert(status === 400, `999 guests returned ${status}`)
  })

  await test('Orden domicilio sin direccion es rechazada', async () => {
    const { status } = await api('POST', '/api/orders', {
      customerName: 'Hacker',
      customerPhone: '3001234567',
      paymentMethod: 'cash',
      items: [{ menuItemId: '000000000000000000000001', quantity: 1 }],
      orderType: 'domicilio',
    })
    assert(status === 400, `Delivery without address returned ${status}`)
  })

  await test('Endpoint inexistente retorna 404, no 500', async () => {
    const { status } = await api('GET', '/api/nonexistent-endpoint-xyz')
    assert(status === 404 || status === 401, `Nonexistent returned ${status}`)
  })
}

// ============================================================
// 11. CORS � DECO (datos legibles, no criticos)
// ============================================================
async function testCORS() {
  console.log('\n?? 11. CORS � Cross-Origin')

  await test('CORS no permite origen arbitrario', async () => {
    const res = await fetch(`${BASE}/api/health`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://evil.com',
        'Access-Control-Request-Method': 'GET',
      },
    })
    const allowOrigin = res.headers.get('access-control-allow-origin')
    assert(allowOrigin !== 'https://evil.com', `CORS allows evil.com: ${allowOrigin}`)
  })
}

// ============================================================
// 12. COOKIE SECURITY � DECO (datos legibles, no criticos)
// ============================================================
async function testCookieSecurity() {
  console.log('\n?? 12. Cookie Security')

  const email = `cookie-${Date.now()}@test.com`
  await registerUser(email)
  const login = await loginUser(email, 'Attack!Test1')

  await test('Refresh cookie es HttpOnly', async () => {
    const rawCookie = login.headers?.['set-cookie'] || ''
    assert(rawCookie.toLowerCase().includes('httponly'), 'Cookie missing HttpOnly')
  })

  await test('Refresh cookie tiene SameSite', async () => {
    const rawCookie = login.headers?.['set-cookie'] || ''
    assert(rawCookie.toLowerCase().includes('samesite'), 'Cookie missing SameSite')
  })

  await test('Refresh cookie falsificado es rechazado', async () => {
    const { status } = await api('POST', '/api/auth/refresh', undefined, {
      Cookie: 'hostal_refresh=fake-tampered-value',
    })
    assertEqual(status, 401, 'Tampered cookie must be rejected')
  })
}

// ============================================================
// 13. RACE CONDITIONS � DECO (integridad de datos)
// ============================================================
async function testRaceConditions() {
  console.log('\n?? 13. Race Conditions')

  await test('Refresh token rotation es atomico', async () => {
    const email = `race-${Date.now()}@test.com`
    await registerUser(email)
    const login = await loginUser(email, 'Attack!Test1')
    const cookie = login.cookie

    const results = await Promise.all([
      api('POST', '/api/auth/refresh', undefined, { Cookie: `hostal_refresh=${cookie}` }),
      api('POST', '/api/auth/refresh', undefined, { Cookie: `hostal_refresh=${cookie}` }),
      api('POST', '/api/auth/refresh', undefined, { Cookie: `hostal_refresh=${cookie}` }),
    ])

    const successes = results.filter((r) => r.status === 200)
    assert(successes.length === 1, `Race: ${successes.length} refreshes succeeded � expected 1`)
  })

  await test('Registro concurrente del mismo email no duplica', async () => {
    const email = `race-reg-${Date.now()}@test.com`
    const results = await Promise.all([
      api('POST', '/api/auth/register', { name: 'Race1', email, password: 'Attack!Test1' }),
      api('POST', '/api/auth/register', { name: 'Race2', email, password: 'Attack!Test1' }),
      api('POST', '/api/auth/register', { name: 'Race3', email, password: 'Attack!Test1' }),
    ])
    const successes = results.filter((r) => r.status === 201)
    assert(successes.length <= 1, `Race: ${successes.length} registrations succeeded`)
  })
}

// ============================================================
// RUN
// ============================================================
async function run() {
  console.log('')
  console.log('========================================================')
  console.log('  HOSTAL COFEE � Cybersecurity Attack Tests')
  console.log('  OWASP Top 10 + Ley 1581 (Datos Personales)')
  console.log('========================================================')
  console.log(`Target: ${BASE}\n`)

  try {
    await api('GET', '/api/health')
    console.log('Server reachable\n')
  } catch {
    console.log('Server NOT reachable. Aborting.')
    process.exit(1)
  }

  const startTime = Date.now()

  await testSQLInjection()
  await testXSS()
  await testJWTSecurity()
  await testPrivilegeEscalation()
  await testIDOR()
  await testPasswordSecurity()
  await testRateLimiting()
  await testInformationDisclosure()
  await testMassAssignment()
  await testBusinessLogic()
  await testCORS()
  await testCookieSecurity()
  await testRaceConditions()

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)

  console.log('\n' + '='.repeat(60))
  console.log(`RESULTS: ${passed}/${total} passed, ${failed} failed`)
  console.log(`Elapsed: ${elapsed}s`)

  if (VULNS.length > 0) {
    console.log(`\nVULNERABILITIES FOUND (${VULNS.length}):`)
    VULNS.forEach((v, i) => console.log(`  ${i + 1}. ${v}`))
  }

  console.log('='.repeat(60))

  if (failed > 0) {
    console.log(`\n${failed} security test(s) FAILED`)
    process.exit(1)
  } else {
    console.log('\nALL TESTS PASSED')
  }
}

run().catch(console.error)
