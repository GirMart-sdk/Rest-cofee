import { defineConfig, devices } from '@playwright/test'

/**
 * Configuración de Playwright para los tests E2E de Hostal Cofee.
 *
 * IMPORTANTE: No se incluye un bloque `webServer` a propósito. Estos tests
 * asumen que el servidor de desarrollo ya está corriendo en:
 *   http://localhost:3001
 *
 * En desarrollo, el backend (Express + Vite middleware) sirve tanto la SPA
 * como la API /api en ese único puerto. Levanta el servidor manualmente con:
 *   npm run dev          (o)   npm run start:all
 * desde la raíz del repositorio, antes de ejecutar `npm run test:e2e`.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 0,
  reporter: 'html',
  outputDir: './test-results',
  use: {
    baseURL: 'http://localhost:3001',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
