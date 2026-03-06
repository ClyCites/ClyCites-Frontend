import { expect, test } from "@playwright/test";
import { loginAs } from "./utils";

test.describe("Auth and RBAC", () => {
  test("ops user can access app shell and admin audit", async ({ page }) => {
    await loginAs(page, "ops@clycites.io", "ops12345");

    await page.goto("/app/admin/audit");
    await expect(page.getByText("Audit Log Viewer")).toBeVisible();
  });

  test("farmer user is denied from admin audit", async ({ page }) => {
    await loginAs(page, "farmer@clycites.io", "farmer123");

    await page.goto("/app/admin/audit");
    await expect(page.getByText("Access denied")).toBeVisible();
  });
});
