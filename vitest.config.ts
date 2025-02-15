import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      include: ['src/**'],
      provider: 'istanbul',
      reporter: ['text', 'json-summary', 'json'],
      reportOnFailure: true,
    },
  },
})
