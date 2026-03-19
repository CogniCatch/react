// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react() as any, tsconfigPaths() as any],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: ['node_modules', 'dist'],
  },
})
