import { expect, test } from "@playwright/test";
import { mockAuthAndDashboard } from "./helpers";

test("login routes user to role-aware dashboard", async ({ page }) => {
  await mockAuthAndDashboard(page, { role: "farmer" });

  await page.goto("/login");
  await page.getByPlaceholder("you@example.com").fill("farmer@clycites.com");
  await page.locator('input[type="password"]').first().fill("SecurePass123!");
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText("Farmer Operations Dashboard")).toBeVisible();
});
