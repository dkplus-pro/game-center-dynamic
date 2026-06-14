import { defineConfig } from '@playwright/test';

/**
 * Playwright configuration for the H5 mobile app E2E tests.
 *
 * Runs against the Modern.js dev server on port 8081.
 * The webServer config auto-starts the dev server if not already running.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  expect: { timeout: 10000 },
  use: {
    baseURL: 'http://localhost:8081',
    headless: true,
  },
  webServer: {
    command: 'pnpm dev',
    port: 8081,
    reuseExistingServer: true,
  },
});