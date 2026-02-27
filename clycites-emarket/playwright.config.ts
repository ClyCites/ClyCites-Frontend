import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  timeout: 90_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: "http://127.0.0.1:3000",
    headless: true,
    viewport: { width: 1280, height: 800 },
  },
  webServer: {
    command: "powershell -NoProfile -Command \"$env:NEXT_PUBLIC_API_BASE='http://127.0.0.1:3000'; pnpm dev\"",
    url: "http://127.0.0.1:3000",
    timeout: 180_000,
    reuseExistingServer: true,
  },
});
