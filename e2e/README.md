# Tests E2E (Playwright)

[![Proyecto](https://img.shields.io/badge/Proyecto-Hostal%20Cofee--v2-brightgreen.svg)](../README.md)
[![Licencia: DEVCO Propietaria](https://img.shields.io/badge/Licencia-DEVCO%20Propietaria-red.svg)](../LICENSE)
![Actualizado](https://img.shields.io/badge/Actualizado-Agosto%202026-orange.svg)
![Framework](https://img.shields.io/badge/Framework-Playwright-brightgreen.svg)
![Navegador](https://img.shields.io/badge/Navegador-Chromium-blue.svg)

---

> **Resumen**: suite end-to-end de Hostal Cofee con Playwright. Cubre home, menú,
> autenticación y carrito. Requiere el servidor corriendo en `http://localhost:3001`.
> Incluye el script `npm run test:e2e:docs` que genera capturas full-page en
> `docs/screenshots/` para la documentación.

Suite de pruebas end-to-end para Hostal Cofee, ubicada en la raíz del
repositorio (`D:\Rest-COFEE\e2e`).

## Requisitos previos

1. Instalar dependencias y el navegador (una sola vez):

   ```bash
   npm install -D @playwright/test
   npx playwright install chromium
   ```

2. Levantar el servidor de desarrollo. Los tests **no** arrancan el servidor
   automáticamente: asumen que ya está corriendo en `http://localhost:3001`.

   En desarrollo, el backend Express monta el middleware de Vite, por lo que
   ese único puerto sirve tanto la SPA como la API `/api`. Desde la raíz:

   ```bash
   npm run dev        # backend con Vite embebido (Express + Prisma, puerto 3001)
   npm run start:all  # alternativa: levanta backend y frontend en ventanas separadas
   ```

   > Nota: `npm run start:all` lanza el frontend de Vite en el puerto 5173,
   > pero para los tests E2E se usa exclusivamente `http://localhost:3001`.

## Cómo ejecutar los tests

Con el servidor corriendo en `:3001`:

```bash
npm run test:e2e              # toda la suite (home, menu, auth, cart)
npx playwright test e2e/home.spec.ts   # un solo archivo
```

Los resultados y capturas de fallos se guardan en `test-results/` y el reporte
HTML en `playwright-report/` (ambos ignorados por git).

## Capturas de pantalla para documentación

Las capturas se generan solo bajo demanda con:

```bash
npm run test:e2e:docs
```

Genera imágenes full-page en `docs/screenshots/`:

| Ruta        | Archivo de salida               |
| ----------- | ------------------------------- |
| `/`         | `docs/screenshots/home.png`     |
| `/menu`     | `docs/screenshots/menu.png`     |
| `/login`    | `docs/screenshots/login.png`    |
| `/carrito`  | `docs/screenshots/carrito.png`  |
| `/reservas` | `docs/screenshots/reservas.png` |
| `/mesa?t=3` | `docs/screenshots/mesa.png`     |

La página `/carrito` se captura con un plato agregado si el menú tiene
platillos; si el menú está vacío, se captura el estado vacío.

## Notas

- Las pruebas no crean datos en la API: se basan en contenido estable
  existente (textos en español de los componentes) y no requieren limpiar nada.
- Si el menú está vacío (sin seed), `cart.spec.ts` y la captura de `/carrito`
  se omiten de forma controlada mediante `test.skip`.
- El login usa un email inventado para forzar siempre el camino de error
  (toast "Credenciales incorrectas"), estable aunque la API falle.

---

## Licencia

[![Licencia: DEVCO Propietaria](https://img.shields.io/badge/Licencia-DEVCO%20Propietaria-red.svg)](../LICENSE)

Este proyecto se distribuye bajo una **Licencia de Uso Propietario DEVCO - Versión Comercial**.
Copyright (c) 2026 **GirMart-SDK**. Todos los derechos reservados.

Prohibida la reproducción total o parcial sin autorización expresa por escrito.
Para más detalles, consulte el archivo [LICENSE](../LICENSE).
