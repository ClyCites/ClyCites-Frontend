import { expect, test } from "@playwright/test";
import { mockAuthAndDashboard } from "./helpers";

test("organization scoped requests include boundary header", async ({ page }) => {
  const organizationId = "64f1b2c3d4e5f6a7b8c9d0aa";
  await mockAuthAndDashboard(page, { role: "org_admin", organizationId });

  let tokenRequestCount = 0;

  await page.route("**/api/v1/auth/tokens**", async (route) => {
    tokenRequestCount += 1;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: [
          {
            id: "64f1b2c3d4e5f6a7b8c9d0ff",
            name: "Org Scoped Token",
            tokenType: "organization",
            status: "active",
            scopes: ["orders:read"],
            orgId: organizationId,
            createdAt: new Date().toISOString(),
          },
        ],
      }),
    });
  });

  await page.goto("/login");
  await page.getByPlaceholder("you@example.com").fill("orgadmin@clycites.com");
  await page.locator('input[type="password"]').first().fill("SecurePass123!");
  await page.getByRole("button", { name: "Log in" }).click();

  await page.goto("/dashboard/tokens");
  await expect(page.getByText("API Token Management")).toBeVisible();
  await expect(page.getByRole("heading", { name: "ClyCites Org" })).toBeVisible();
  await expect(page.getByText("Org Scoped Token")).toBeVisible();
  await expect.poll(() => tokenRequestCount).toBeGreaterThan(0);
});
