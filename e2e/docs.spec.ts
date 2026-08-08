import { test, expect } from '@playwright/test'
import { mkdirSync } from 'node:fs'

/**
 * Captura de pantallas de documentación.
 *
 * Este spec SOLO se ejecuta bajo demanda (no forma parte de la suite normal):
 *   npm run test:e2e:docs
 *
 * Requiere el servidor de desarrollo corriendo en http://localhost:3001.
 * Las imágenes se guardan en docs/screenshots/.
 */

const SHOTS_DIR = 'docs/screenshots'

async function addFirstItemToCart(page: import('@playwright/test').Page): Promise<boolean> {
  const addButton = page.getByRole('button', { name: 'Añadir', exact: true }).first()
  if ((await addButton.count()) === 0) {
    return false
  }
  await addButton.click()
  await expect(
    page.getByRole('button', { name: 'Añadido', exact: true }).first()
  ).toBeVisible()
  return true
}

test.describe('docs screenshots', () => {
  test.beforeAll(() => {
    mkdirSync(SHOTS_DIR, { recursive: true })
  })

  test('home', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', { name: 'Hostal Cofre' }).first()
    ).toBeVisible()
    await page.waitForTimeout(1200)
    await page.screenshot({ path: `${SHOTS_DIR}/home.png`, fullPage: true })
  })

  test('menu', async ({ page }) => {
    await page.goto('/menu')
    await expect(page.getByRole('heading', { name: 'Nuestro Menú' })).toBeVisible()
    await expect(page.getByText('Cargando menú...')).toBeHidden()
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${SHOTS_DIR}/menu.png`, fullPage: true })
  })

  test('login', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible()
    await page.screenshot({ path: `${SHOTS_DIR}/login.png`, fullPage: true })
  })

  test('carrito', async ({ page }) => {
    await page.goto('/menu')
    await expect(page.getByText('Cargando menú...')).toBeHidden()
    await addFirstItemToCart(page)

    await page.goto('/carrito')
    await expect(
      page.getByRole('heading', { name: /Tu Carrito|Tu carrito está vacío/ })
    ).toBeVisible()
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${SHOTS_DIR}/carrito.png`, fullPage: true })
  })

  test('reservas', async ({ page }) => {
    await page.goto('/reservas')
    await expect(page.getByRole('heading', { name: 'Tu Mesa' })).toBeVisible()
    await page.screenshot({ path: `${SHOTS_DIR}/reservas.png`, fullPage: true })
  })

  test('mesa', async ({ page }) => {
    await page.goto('/mesa?t=3')
    await expect(page.getByRole('heading', { name: 'Mesa #3' })).toBeVisible()
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${SHOTS_DIR}/mesa.png`, fullPage: true })
  })
})
