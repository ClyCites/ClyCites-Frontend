import { expect, test } from "@playwright/test";
import { mockAuthAndDashboard } from "./helpers";

test("super admin privileged action sends explicit mode headers with reason", async ({ page }) => {
  await mockAuthAndDashboard(page, { role: "super_admin" });

  let capturedModeHeader = "";
  let capturedReasonHeader = "";
  let maintenanceEnabled = false;

  await page.route("**/api/v1/admin/system/maintenance", async (route) => {
    if (route.request().method() === "PATCH") {
      capturedModeHeader = route.request().headers()["x-super-admin-mode"] ?? "";
      capturedReasonHeader = route.request().headers()["x-super-admin-reason"] ?? "";
      maintenanceEnabled = true;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: { enabled: maintenanceEnabled, message: "maintenance" },
      }),
    });
  });

  await page.route("**/api/v1/admin/system/feature-flags", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: { flags: { orderEscrowV2: true } },
      }),
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
      body: JSON.stringify({ success: true, data: { uptime: "99.99%" } }),
    });
  });

  await page.route("**/api/v1/audit**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [] }),
    });
  });

  await page.goto("/login");
  await page.getByPlaceholder("you@example.com").fill("superadmin@clycites.com");
  await page.locator('input[type="password"]').first().fill("SecurePass123!");
  await page.getByRole("button", { name: "Log in" }).click();

  await page.goto("/dashboard/super-admin");
  await expect(page.getByText("Super Admin Control Center")).toBeVisible();

  await page.locator('button[role="switch"]').first().click();

  expect(capturedModeHeader).toBe("true");
  expect(capturedReasonHeader.length).toBeGreaterThan(0);
});
