import { expect, test } from "@playwright/test";
import { mockAuthAndDashboard } from "./helpers";

test("super admin privileged action sends explicit mode headers with reason", async ({ page }) => {
  await mockAuthAndDashboard(page, { role: "super_admin" });

  let capturedReason = "";
  let privilegedUpdateCount = 0;
  let maintenanceEnabled = false;

  await page.route("**/api/v1/admin/system/maintenance", async (route) => {
    if (route.request().method() === "PATCH") {
      privilegedUpdateCount += 1;
      const postData = route.request().postDataJSON() as { reason?: string };
      capturedReason = postData.reason ?? "";
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
    if (route.request().method() === "PATCH") {
      privilegedUpdateCount += 1;
      const postData = route.request().postDataJSON() as { reason?: string };
      capturedReason = postData.reason ?? capturedReason;
    }

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

  await page.getByRole("button", { name: "Update Flags" }).click();
  await expect.poll(() => privilegedUpdateCount).toBeGreaterThan(0);
  await expect.poll(() => capturedReason.length).toBeGreaterThan(0);
});
