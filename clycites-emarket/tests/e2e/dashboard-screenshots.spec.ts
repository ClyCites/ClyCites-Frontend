import fs from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { mockAuthAndDashboard } from "./helpers";

const roles = ["farmer", "buyer", "trader", "expert", "org_admin", "super_admin"] as const;
const outputDir = path.join(process.cwd(), "docs", "screenshots");

for (const role of roles) {
  test(`capture ${role} dashboard screenshot`, async ({ page }) => {
    await fs.mkdir(outputDir, { recursive: true });
    await mockAuthAndDashboard(page, { role });

    if (role === "super_admin") {
      await page.route("**/api/v1/admin/system/maintenance", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, data: { enabled: false } }),
        });
      });
      await page.route("**/api/v1/admin/system/feature-flags", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, data: { flags: { orderEscrowV2: true } } }),
        });
      });
      await page.route("**/api/v1/auth/super-admin/impersonation", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, data: [] }),
        });
      });
      await page.route("**/api/v1/analytics/global**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, data: {} }),
        });
      });
      await page.route("**/api/v1/audit**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, data: [] }),
        });
      });
    }

    await page.goto("/login");
    await page.getByPlaceholder("you@example.com").fill(`${role}@clycites.com`);
    await page.locator('input[type="password"]').first().fill("SecurePass123!");
    await page.getByRole("button", { name: "Log in" }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: path.join(outputDir, `dashboard-${role}.png`),
      fullPage: true,
    });
  });
}
