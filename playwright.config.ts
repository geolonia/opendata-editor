import { devices } from '@playwright/test';

export default {
  testMatch: /.*(pw)\.(js|ts|mjs)/,
  workers: 1, // disable concurrent tests

  projects: [
    {
      name: 'Chromium',
      use: {
        ...devices['Desktop Chrome'],
        // ▼ Debug Options
        // headless: false,
        // launchOptions: {
        //   slowMo: 3000,
        // },
      },
    },
  ],

  webServer: {
    command: 'npx vite --config ./vite.config.web.ts --port 2923',
    url: 'http://localhost:2923/opendata-editor/',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:2923/opendata-editor/',
  },
};
