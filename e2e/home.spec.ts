import { test, expect } from '@playwright/test'

/**
 * Pruebas E2E de la página de inicio (Hostal Cofee).
 * Asume que el servidor de desarrollo ya está corriendo en http://localhost:3001.
 */
test.describe('HomePage', () => {
  test('renderiza el hero y los enlaces de navegación', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle('Hostal Cofee')

    const heroHeading = page.getByRole('heading', { name: 'Hostal Cofre' }).first()
    await expect(heroHeading).toBeVisible()

    await expect(page.getByText('Bienvenido a', { exact: true })).toBeVisible()
    await expect(
      page.getByText('Donde cada platillo cuenta una historia', { exact: false }).first()
    ).toBeVisible()

    const nav = page.locator('nav')
    await expect(nav.getByRole('link', { name: 'Inicio', exact: true })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Menú', exact: true })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Reservas', exact: true })).toBeVisible()

    await expect(page.getByRole('link', { name: 'Ver Menú', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Reservar Mesa', exact: true })).toBeVisible()
  })
})
