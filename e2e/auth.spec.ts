import { test, expect } from '@playwright/test'

/**
 * Pruebas E2E de la página de inicio de sesión (/login).
 *
 * Se usan credenciales inventadas (email válido pero inexistente) para forzar
 * siempre el camino de error. El backend devuelve 401/error y la pantalla de
 * login muestra el toast "Credenciales incorrectas", incluso cuando la API
 * no responde, por lo que la aserción es estable en ambos escenarios.
 */
test.describe('LoginPage', () => {
  test('renderiza el formulario de inicio de sesión', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible()
    await expect(page.getByPlaceholder('Email')).toBeVisible()
    await expect(page.getByPlaceholder('Contraseña')).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Iniciar Sesión', exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: '¿No tienes cuenta? Regístrate', exact: true })
    ).toBeVisible()
  })

  test('envía el formulario y muestra error con credenciales incorrectas', async ({
    page,
  }) => {
    await page.goto('/login')

    const email = `e2e-noexiste-${Date.now()}@example.com`
    await page.getByPlaceholder('Email').fill(email)
    await page.getByPlaceholder('Contraseña').fill('clave-incorrecta-1')

    await page.getByRole('button', { name: 'Iniciar Sesión', exact: true }).click()

    await expect(page.getByText('Credenciales incorrectas')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible()
  })
})
