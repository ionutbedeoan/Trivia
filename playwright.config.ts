import { defineConfig } from '@playwright/test';
const externalUrl = process.env.E2E_BASE_URL;
export default defineConfig({
  testDir: './tests/browser',
  outputDir: externalUrl ? 'test-results/live' : 'test-results/isolated',
  workers: 1,
  timeout: 90000,
  expect: { timeout: 10000 },
  use: {
    baseURL: externalUrl ?? 'http://127.0.0.1:3100',
    channel: 'chrome',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: externalUrl
    ? undefined
    : {
        command: 'npx tsx tests/e2e-server.ts',
        url: 'http://127.0.0.1:3100/api/health',
        reuseExistingServer: false,
        timeout: 30000,
      },
});
