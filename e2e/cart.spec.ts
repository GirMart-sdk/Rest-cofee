import { test, expect } from '@playwright/test'

/**
 * Pruebas E2E del carrito de compras.
 *
 * El menú se carga desde /api/menu. Si la base de datos está vacía (sin seed),
 * no hay botones "Añadir" y la prueba se omite con test.skip.
 * El carrito se persiste en localStorage, por lo que una navegación completa
 * a /carrito conserva el artículo agregado.
 */
test.describe('Carrito', () => {
  test('agrega el primer plato del menú y aparece en el carrito', async ({
    page,
  }) => {
    await page.goto('/menu')

    await expect(page.getByText('Cargando menú...')).toBeHidden()

    const addButtons = page.getByRole('button', { name: 'Añadir', exact: true })
    if ((await addButtons.count()) === 0) {
      test.skip(true, 'Menú vacío: no hay platillos disponibles para añadir al carrito')
    }

    const addButton = addButtons.first()
    const card = page.locator('.card', { has: addButton }).first()
    const itemName = (await card.locator('h3').textContent())?.trim() ?? ''

    await addButton.click()

    const cartBadge = page.locator('nav').getByText('1', { exact: true }).first()
    await expect(cartBadge).toBeVisible()

    await page.goto('/carrito')
    await expect(page.getByRole('heading', { name: /Tu Carrito/ })).toBeVisible()

    if (itemName) {
      await expect(page.getByText(itemName, { exact: true })).toBeVisible()
    }

    const subtotal = page.getByText('Subtotal', { exact: true })
    await expect(subtotal).toBeVisible()
  })
})
