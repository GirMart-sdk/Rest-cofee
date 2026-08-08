import { test, expect } from '@playwright/test'

/**
 * Pruebas E2E de la página del menú (/menu).
 * Los botones de categoría siempre se renderizan, por lo que la aserción
 * es estable aunque la base de datos esté vacía o sin seed.
 */
test.describe('MenuPage', () => {
  test('renderiza el título y los filtros de categoría', async ({ page }) => {
    await page.goto('/menu')

    await expect(page.getByRole('heading', { name: 'Nuestro Menú' })).toBeVisible()
    await expect(page.getByText('Descubre', { exact: true })).toBeVisible()

    const categoryButtons = page.getByRole('button', {
      name: /Todos|Ensaladas|Pastas|Pizzas|Postres|Bebidas/,
    })
    await expect(categoryButtons.first()).toBeVisible()
    await expect(categoryButtons).toHaveCount(6)

    await expect(
      page.getByRole('button', { name: 'Pizzas', exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Pastas', exact: true })
    ).toBeVisible()

    await page.getByRole('button', { name: 'Pizzas', exact: true }).click()
    await expect(
      page.getByRole('button', { name: 'Pizzas', exact: true })
    ).toBeVisible()
  })

  test('carga el menú desde la API (con datos o vacío)', async ({ page }) => {
    await page.goto('/menu')
    await expect(page.getByText('Cargando menú...')).toBeHidden()

    const emptyState = page.getByText('No hay platillos disponibles en esta categoría')
    const addButtons = page.getByRole('button', { name: 'Añadir', exact: true })

    if ((await addButtons.count()) > 0) {
      await expect(addButtons.first()).toBeVisible()
    } else {
      await expect(emptyState).toBeVisible()
    }
  })
})
