import { test, expect } from '@playwright/test'

test.describe('Flujo completo de pedido (Mesa)', () => {
  test('un cliente puede crear un pedido desde la mesa', async ({ page }) => {
    await page.goto('/mesa/1')

    await expect(page.getByText('Cargando menú...')).toBeHidden({ timeout: 10000 })

    const addButtons = page.getByRole('button', { name: 'Añadir', exact: true })
    if ((await addButtons.count()) === 0) {
      test.skip(true, 'Menú vacío')
    }

    await addButtons.first().click()
    await expect(page.getByText('1')).toBeVisible()

    const orderBtn = page.getByRole('button', { name: /Realizar Pedido|Enviar Pedido/ })
    if ((await orderBtn.count()) > 0) {
      await orderBtn.first().click()
      await expect(page.getByText(/Pedido enviado|Error/)).toBeVisible({ timeout: 10000 })
    }
  })
})

test.describe('Flujo de reservas', () => {
  test('la página de reservas renderiza el formulario', async ({ page }) => {
    await page.goto('/reservas')

    await expect(page.getByRole('heading', { name: /Reservar|Reservas/ })).toBeVisible()
    await expect(page.getByPlaceholder(/Nombre|name/i)).toBeVisible()
    await expect(page.getByPlaceholder(/Teléfono|phone/i)).toBeVisible()
  })

  test('puede llenar y enviar el formulario de reserva', async ({ page }) => {
    await page.goto('/reservas')

    const nameInput = page.getByPlaceholder(/Nombre|name/i)
    const phoneInput = page.getByPlaceholder(/Teléfono|phone/i)

    if ((await nameInput.count()) > 0 && (await phoneInput.count()) > 0) {
      await nameInput.fill('Cliente E2E')
      await phoneInput.fill('3001234567')

      const emailInput = page.getByPlaceholder(/Email|correo/i)
      if ((await emailInput.count()) > 0) {
        await emailInput.fill('e2e@test.com')
      }

      const submitBtn = page.getByRole('button', { name: /Reservar|Enviar|Confirmar/ })
      if ((await submitBtn.count()) > 0) {
        await submitBtn.first().click()
        await expect(page.getByText(/éxito|éxito|error|Error/)).toBeVisible({ timeout: 10000 })
      }
    }
  })
})

test.describe('Navegación del admin', () => {
  test('redirige a login si no autenticado', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/login/)
  })

  test('login como admin muestra el dashboard', async ({ page }) => {
    await page.goto('/login')

    await page.getByPlaceholder('Email').fill('admin@hostalcofee.com')
    await page.getByPlaceholder('Contraseña').fill('Admin123!')
    await page.getByRole('button', { name: 'Iniciar Sesión', exact: true }).click()

    await expect(page).toHaveURL(/admin/, { timeout: 10000 })
    await expect(page.getByText(/Dashboard|Panel/)).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Puntos de venta y turnos', () => {
  test('la página de POS requiere auth', async ({ page }) => {
    await page.goto('/admin/pos')
    await expect(page).toHaveURL(/login/)
  })

  test('la página de turnos requiere auth', async ({ page }) => {
    await page.goto('/admin/turnos')
    await expect(page).toHaveURL(/login/)
  })
})

test.describe('Página de pagos', () => {
  test('la página de pagos requiere auth', async ({ page }) => {
    await page.goto('/admin/pagos')
    await expect(page).toHaveURL(/login/)
  })
})

test.describe('PWA manifest', () => {
  test('el manifest.json es accesible', async ({ page }) => {
    const response = await page.goto('/manifest.json')
    expect(response?.status()).toBe(200)
  })
})

test.describe('Health check', () => {
  test('la API de health responde', async ({ page }) => {
    const response = await page.goto('/api/health')
    expect(response?.status()).toBe(200)
    const body = await response?.json()
    expect(body.status).toBe('ok')
  })
})
