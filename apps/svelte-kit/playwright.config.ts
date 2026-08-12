import { defineConfig } from "@playwright/test";

// Runs against the production build so the assertions cover real SSR output
// rather than the dev server's. `pnpm build` (from the repo root) first, so
// the component and the app bundle are current.
export default defineConfig({
  testDir: "e2e",
  use: { baseURL: "http://localhost:4173" },
  webServer: {
    command: "pnpm preview --port 4173",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env["CI"],
  },
});
