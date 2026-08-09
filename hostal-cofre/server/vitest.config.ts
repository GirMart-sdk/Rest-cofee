import { defineConfig } from 'vitest/config'
import { config } from 'dotenv'
config()

function withDatabase(url: string, db: string): string {
  const parsed = new URL(url)
  const segments = parsed.pathname.split('/')
  segments[segments.length - 1] = db
  parsed.pathname = segments.join('/')
  return parsed.toString()
}

const testDatabaseUrl = withDatabase(process.env.DATABASE_URL!, 'hostal_cofee_test')

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
    exclude: ['tests/security.test.ts', 'node_modules/**', 'dist/**'],
    globalSetup: ['./tests/global-setup.ts'],
    testTimeout: 30000,
    hookTimeout: 30000,
    fileParallelism: false,
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: testDatabaseUrl,
      WOMPI_MODE: 'sandbox',
      WOMPI_EVENTS_SECRET: 'test-events-secret-for-signing-0000',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        'src/db.ts',
        'src/index.ts',
        'src/utils/seed.ts',
        'vitest.config.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 65,
        functions: 80,
        lines: 80,
      },
    },
  },
})
