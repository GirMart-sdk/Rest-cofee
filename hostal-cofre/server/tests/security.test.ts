const BASE = process.env.TEST_URL || 'http://localhost:3001'

let passed = 0
let failed = 0
let total = 0

async function test(name: string, fn: () => Promise<void>) {
  total++
  try {
    await fn()
    passed++
    console.log(`  ✅ ${name}`)
  } catch (err: any) {
    failed++
    console.log(`  ❌ ${name}: ${err.message}`)
  }
}

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(msg)
}

async function api(method: string, path: string, body?: any, headers?: Record<string, string>) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => null)
  return { status: res.status, data, headers: Object.fromEntries(res.headers.entries()) }
}

// ============================================================
// CAPA 4: HEADERS DE SEGURIDAD
// ============================================================
async function testSecurityHeaders() {
  console.log('\n🛡️  CAPA 4: Headers de Seguridad')

  await test('Helmet X-Content-Type-Options: nosniff', async () => {
    const { headers } = await api('GET', '/api/health')
    assert(headers['x-content-type-options'] === 'nosniff', `Expected nosniff, got: ${headers['x-content-type-options']}`)
  })

  await test('Helmet X-Frame-Options: DENY', async () => {
    const { headers } = await api('GET', '/api/health')
    assert(headers['x-frame-options'] === 'DENY', `Expected DENY, got: ${headers['x-frame-options']}`)
  })

  await test('Helmet Strict-Transport-Security present', async () => {
    const { headers } = await api('GET', '/api/health')
    assert(headers['strict-transport-security']?.includes('max-age'), `HSTS missing`)
  })

  await test('Helmet Referrer-Policy present', async () => {
    const { headers } = await api('GET', '/api/health')
    assert(headers['referrer-policy']?.includes('strict-origin'), `Referrer-Policy missing`)
  })

  await test('X-Request-Id header generated', async () => {
    const { headers } = await api('GET', '/api/health')
    assert(!!headers['x-request-id'], 'X-Request-Id header missing')
  })

  await test('X-Request-Id echoed from client', async () => {
    const { headers } = await api('GET', '/api/health', undefined, { 'X-Request-Id': 'test-123' })
    assert(headers['x-request-id'] === 'test-123', `Expected test-123, got: ${headers['x-request-id']}`)
  })

  await test('CORS headers configured', async () => {
    const { headers } = await api('OPTIONS', '/api/health')
    assert(!!headers['access-control-allow-origin'], 'CORS origin missing')
  })

  await test('X-Powered-By hidden', async () => {
    const { headers } = await api('GET', '/api/health')
    assert(!headers['x-powered-by'], 'X-Powered-By should be hidden')
  })
}

// ============================================================
// CAPA 4: RATE LIMITING
// ============================================================
async function testRateLimiting() {
  console.log('\n⏱️  CAPA 4: Rate Limiting')

  await test('Rate limit headers present', async () => {
    const { headers } = await api('GET', '/api/menu')
    assert(!!headers['ratelimit-limit'] || !!headers['x-ratelimit-limit'], 'Rate limit headers missing')
  })
}

// ============================================================
// CAPA 5: AUTH - PASSWORD POLICY
// ============================================================
async function testPasswordPolicy() {
  console.log('\n🔑 CAPA 5: Password Policy')

  await test('Reject password without uppercase', async () => {
    const { status } = await api('POST', '/api/auth/register', {
      name: 'Test', email: `test-${Date.now()}@mail.com`, password: 'alllower1!',
    })
    assert(status === 400, `Expected 400, got: ${status}`)
  })

  await test('Reject password without number', async () => {
    const { status } = await api('POST', '/api/auth/register', {
      name: 'Test', email: `test-${Date.now()}@mail.com`, password: 'AllLower!',
    })
    assert(status === 400, `Expected 400, got: ${status}`)
  })

  await test('Reject password without special char', async () => {
    const { status } = await api('POST', '/api/auth/register', {
      name: 'Test', email: `test-${Date.now()}@mail.com`, password: 'AllLower1',
    })
    assert(status === 400, `Expected 400, got: ${status}`)
  })

  await test('Reject short password', async () => {
    const { status } = await api('POST', '/api/auth/register', {
      name: 'Test', email: `test-${Date.now()}@mail.com`, password: 'Ab1!',
    })
    assert(status === 400, `Expected 400, got: ${status}`)
  })

  await test('Accept valid strong password', async () => {
    const { status } = await api('POST', '/api/auth/register', {
      name: 'Test User', email: `test-${Date.now()}@mail.com`, password: 'Secure!Pass1',
    })
    assert(status === 201, `Expected 201, got: ${status}`)
  })
}

// ============================================================
// CAPA 5: AUTH - TOKEN REFRESH
// ============================================================
async function testTokenRefresh() {
  console.log('\n🔄 CAPA 5: Token Refresh')

  let refreshToken = ''

  await test('Login returns accessToken + refreshToken', async () => {
    const { status, data } = await api('POST', '/api/auth/login', {
      email: 'admin@hostalcofee.com', password: 'Admin!2026#Sec',
    })
    assert(status === 200, `Expected 200, got: ${status}`)
    assert(!!data?.data?.accessToken, 'Missing accessToken')
    assert(!!data?.data?.refreshToken, 'Missing refreshToken')
    refreshToken = data.data.refreshToken
  })

  await test('Refresh endpoint issues new tokens', async () => {
    const { status, data } = await api('POST', '/api/auth/refresh', { refreshToken })
    assert(status === 200, `Expected 200, got: ${status}`)
    assert(!!data?.data?.accessToken, 'Missing new accessToken')
    assert(!!data?.data?.refreshToken, 'Missing new refreshToken')
  })

  await test('Old refresh token revoked after use', async () => {
    const { status } = await api('POST', '/api/auth/refresh', { refreshToken })
    assert(status === 401, `Expected 401 (revoked), got: ${status}`)
  })

  await test('Invalid refresh token rejected', async () => {
    const { status } = await api('POST', '/api/auth/refresh', {
      refreshToken: '00000000-0000-0000-0000-000000000000',
    })
    assert(status === 401, `Expected 401, got: ${status}`)
  })

  await test('Logout revokes refresh token', async () => {
    const loginRes = await api('POST', '/api/auth/login', {
      email: 'admin@hostalcofee.com', password: 'Admin!2026#Sec',
    })
    const rt = loginRes.data?.data?.refreshToken
    const { status } = await api('POST', '/api/auth/logout', { refreshToken: rt })
    assert(status === 200, `Expected 200, got: ${status}`)

    const refreshStatus = await api('POST', '/api/auth/refresh', { refreshToken: rt })
    assert(refreshStatus.status === 401, 'Revoked refresh token should be rejected')
  })
}

// ============================================================
// CAPA 5: AUTH - ACCOUNT LOCKOUT
// ============================================================
async function testAccountLockout() {
  console.log('\n🔒 CAPA 5: Account Lockout')

  const testEmail = `lockout-test-${Date.now()}@mail.com`

  await test('Create user for lockout test', async () => {
    await api('POST', '/api/auth/register', {
      name: 'Lockout Test', email: testEmail, password: 'Lockout!1Test',
    })
  })

  await test('5 failed attempts trigger lockout', async () => {
    for (let i = 0; i < 5; i++) {
      await api('POST', '/api/auth/login', { email: testEmail, password: 'WrongPass!1' })
    }
    const { status, data } = await api('POST', '/api/auth/login', { email: testEmail, password: 'WrongPass!1' })
    assert(status === 429, `Expected 429 (locked), got: ${status}`)
    assert(data?.error?.includes('locked') || data?.error?.includes('Too many'), `Expected lockout message`)
  })
}

// ============================================================
// CAPA 5: CHANGE PASSWORD INVALIDATES SESSIONS
// ============================================================
async function testPasswordChange() {
  console.log('\n🔐 CAPA 5: Password Change Invalidation')

  const testEmail = `pwchange-${Date.now()}@mail.com`
  let token = ''

  await test('Setup: register and login', async () => {
    await api('POST', '/api/auth/register', {
      name: 'PW Change', email: testEmail, password: 'Initial!1Pass',
    })
    const { data } = await api('POST', '/api/auth/login', {
      email: testEmail, password: 'Initial!1Pass',
    })
    token = data?.data?.accessToken
  })

  await test('Change password invalidates old sessions', async () => {
    const { status } = await api('POST', '/api/auth/change-password', {
      currentPassword: 'Initial!1Pass',
      newPassword: 'NewSecure!1Pass',
    }, { Authorization: `Bearer ${token}` })
    assert(status === 200, `Expected 200, got: ${status}`)

    const meRes = await api('GET', '/api/auth/me', undefined, { Authorization: `Bearer ${token}` })
    assert(meRes.status === 401, 'Old token should be invalid after password change')
  })
}

// ============================================================
// CAPA 3: XSS SANITIZATION
// ============================================================
async function testXSSSanitization() {
  console.log('\n🧹 CAPA 3: XSS Sanitization')

  await test('Script tags stripped from reservation name', async () => {
    const { status, data } = await api('POST', '/api/reservations', {
      name: '<script>alert("xss")</script>John',
      phone: '1234567890',
      date: '2026-12-31',
      time: '20:00',
      guests: 2,
    })
    assert(status === 201, `Expected 201, got: ${status}`)
    assert(!data?.data?.name?.includes('<script>'), 'Script tag should be stripped')
    assert(data?.data?.name?.includes('John'), 'Normal text should remain')
  })

  await test('Event handlers stripped from input', async () => {
    const { data } = await api('POST', '/api/reservations', {
      name: 'John onclick=alert(1)',
      phone: '1234567890',
      date: '2026-12-31',
      time: '21:00',
      guests: 2,
    })
    assert(!data?.data?.name?.includes('onclick='), 'Event handler should be stripped')
  })

  await test('javascript: URI stripped', async () => {
    const { data } = await api('POST', '/api/reservations', {
      name: 'javascript:alert(1)',
      phone: '1234567890',
      date: '2026-12-31',
      time: '22:00',
      guests: 2,
    })
    assert(!data?.data?.name?.includes('javascript:'), 'javascript: URI should be stripped')
  })
}

// ============================================================
// CAPA 3: INPUT VALIDATION
// ============================================================
async function testInputValidation() {
  console.log('\n✅ CAPA 3: Input Validation')

  await test('Order status rejects invalid enum', async () => {
    const { status } = await api('PATCH', '/api/orders/fake-id/status', {
      status: 'hacked_status',
    }, { Authorization: 'Bearer fake-token' })
    assert(status === 400 || status === 401, `Expected 400/401, got: ${status}`)
  })

  await test('Reservation time rejects invalid format', async () => {
    const { status } = await api('POST', '/api/reservations', {
      name: 'Test', phone: '123', date: '2026-12-31',
      time: 'invalid-time', guests: 2,
    })
    assert(status === 400, `Expected 400, got: ${status}`)
  })

  await test('Reservation guests > 50 rejected', async () => {
    const { status } = await api('POST', '/api/reservations', {
      name: 'Test', phone: '123', date: '2026-12-31',
      time: '20:00', guests: 999,
    })
    assert(status === 400, `Expected 400, got: ${status}`)
  })

  await test('Menu category rejects invalid value', async () => {
    const { status } = await api('POST', '/api/menu', {
      name: 'Test', price: 10, category: 'invalid_category',
    }, { Authorization: 'Bearer fake-admin-token' })
    assert(status === 400 || status === 401, `Expected 400/401, got: ${status}`)
  })

  await test('JSON payload > 10kb rejected', async () => {
    const bigPayload = { name: 'A'.repeat(12000) }
    const { status } = await api('POST', '/api/menu', bigPayload)
    assert(status === 413 || status === 400, `Expected 413/400, got: ${status}`)
  })
}

// ============================================================
// CAPA 5: AUTH - JWT ALGORITHM LOCKING
// ============================================================
async function testJWTSecurity() {
  console.log('\n🔏 CAPA 5: JWT Security')

  await test('Reject token with none algorithm', async () => {
    const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url')
    const payload = Buffer.from(JSON.stringify({ id: '1', email: 'a@b.com', role: 'admin' })).toString('base64url')
    const fakeToken = `${header}.${payload}.`
    const { status } = await api('GET', '/api/auth/me', undefined, { Authorization: `Bearer ${fakeToken}` })
    assert(status === 401, `Expected 401 for none algo, got: ${status}`)
  })

  await test('Reject malformed tokens', async () => {
    const { status } = await api('GET', '/api/auth/me', undefined, {
      Authorization: 'Bearer not.a.valid.jwt.token',
    })
    assert(status === 401, `Expected 401 for malformed, got: ${status}`)
  })

  await test('Reject empty bearer', async () => {
    const { status } = await api('GET', '/api/auth/me', undefined, {
      Authorization: 'Bearer ',
    })
    assert(status === 401, `Expected 401 for empty, got: ${status}`)
  })
}

// ============================================================
// RUN ALL
// ============================================================
async function run() {
  console.log('🔒 HOSTAL COFEE — Security Test Suite')
  console.log('═'.repeat(50))
  console.log(`Target: ${BASE}`)

  try {
    await api('GET', '/api/health')
    console.log('🟢 Server is reachable\n')
  } catch {
    console.log('🔴 Server is NOT reachable. Aborting.')
    process.exit(1)
  }

  await testSecurityHeaders()
  await testRateLimiting()
  await testPasswordPolicy()
  await testTokenRefresh()
  await testAccountLockout()
  await testPasswordChange()
  await testXSSSanitization()
  await testInputValidation()
  await testJWTSecurity()

  console.log('\n' + '═'.repeat(50))
  console.log(`📊 Results: ${passed}/${total} passed, ${failed} failed`)
  if (failed > 0) {
    console.log('⚠️  Some tests failed!')
    process.exit(1)
  } else {
    console.log('✅ All security tests passed!')
  }
}

run().catch(console.error)
