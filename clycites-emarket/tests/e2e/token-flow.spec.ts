import { expect, test } from "@playwright/test";
import { mockAuthAndDashboard } from "./helpers";

test("token create, rotate, and revoke workflow", async ({ page }) => {
  await mockAuthAndDashboard(page, { role: "org_admin" });

  const token = {
    id: "64f1b2c3d4e5f6a7b8c9d0ff",
    name: "Integration Token",
    tokenType: "organization",
    scopes: ["orders:read", "orders:write"],
    status: "active",
    createdAt: new Date().toISOString(),
  };

  await page.route("**/api/v1/auth/tokens**", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { token, secret: "ct_secret_created" },
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: [token],
      }),
    });
  });

  await page.route("**/api/v1/auth/tokens/*/usage**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: {
          token,
          summary: { totalRequests: 5, clientErrors: 0, serverErrors: 0 },
          lastUsedAt: new Date().toISOString(),
        },
      }),
    });
  });

  await page.route("**/api/v1/auth/tokens/*/rotate", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: { token, secret: "ct_secret_rotated" },
      }),
    });
  });

  await page.route("**/api/v1/auth/tokens/*/revoke", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: { ...token, status: "revoked" },
      }),
    });
  });

  await page.goto("/login");
  await page.getByPlaceholder("you@example.com").fill("orgadmin@clycites.com");
  await page.locator('input[type="password"]').first().fill("SecurePass123!");
  await page.getByRole("button", { name: "Log in" }).click();

  await page.goto("/dashboard/tokens");
  await expect(page.getByText("API Token Management")).toBeVisible();

  await page.getByRole("button", { name: "Create Token" }).click();
  await page.getByLabel("Name").fill("Integration Token");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByText("Token Secret (One-time view)")).toBeVisible();

  await page.getByText("Integration Token").first().click();
  await page.getByRole("button", { name: "Rotate Secret" }).click();
  await expect(page.getByText("ct_secret_rotated")).toBeVisible();

  await page.getByRole("button", { name: "Revoke Token" }).click();
});
