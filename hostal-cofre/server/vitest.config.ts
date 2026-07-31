import { defineConfig } from 'vitest/config'
import { config } from 'dotenv'
config()

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
    exclude: ['tests/security.test.ts', 'node_modules/**', 'dist/**'],
    testTimeout: 30000,
    hookTimeout: 30000,
    fileParallelism: false,
    env: {
      NODE_ENV: 'test',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
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
