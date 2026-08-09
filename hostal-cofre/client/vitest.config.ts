import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    testTimeout: 15000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'src/test/',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'vitest.config.ts',
        'vite.config.ts',
        'postcss.config.js',
        'tailwind.config.js',
        'eslint.config.js',
      ],
      thresholds: {
        statements: 95,
        branches: 90,
        functions: 90,
        lines: 95,
      },
    },
  },
})
