import { expect, test } from "@playwright/test";
import { mockAuthAndDashboard } from "./helpers";

test("organization scoped requests include boundary header", async ({ page }) => {
  const organizationId = "64f1b2c3d4e5f6a7b8c9d0aa";
  await mockAuthAndDashboard(page, { role: "org_admin", organizationId });

  let capturedOrgHeader = "";

  await page.route("**/api/v1/auth/tokens**", async (route) => {
    capturedOrgHeader = route.request().headers()["x-organization-id"] ?? "";
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: [],
      }),
    });
  });

  await page.goto("/login");
  await page.getByPlaceholder("you@example.com").fill("orgadmin@clycites.com");
  await page.locator('input[type="password"]').first().fill("SecurePass123!");
  await page.getByRole("button", { name: "Log in" }).click();

  await page.goto("/dashboard/tokens");
  await expect(page.getByText("API Token Management")).toBeVisible();
  expect(capturedOrgHeader).toBe(organizationId);
});
