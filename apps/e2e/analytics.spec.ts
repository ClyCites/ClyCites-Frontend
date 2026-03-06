import { expect, test } from "@playwright/test";
import { loginAs } from "./utils";

test.describe("Analytics studio", () => {
  test.setTimeout(180_000);

  test("supports chart save, dashboard attach, and report export", async ({ page }) => {
    await loginAs(page, "ops@clycites.io", "ops12345");
    await page.goto("/app/analytics/charts");

    await page.getByRole("button", { name: "Preview" }).click();
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Saved Charts")).toBeVisible();

    await page.getByRole("tab", { name: "Dashboards" }).click();
    await page.getByPlaceholder("Dashboard name").fill(`Ops board ${Date.now()}`);
    await page.getByRole("button", { name: "Create" }).click();

    const attachButton = page.getByRole("button", { name: "Attach" }).first();
    await expect(attachButton).toBeVisible();
    await attachButton.click();

    await page.getByRole("tab", { name: "Reports" }).click();
    await page.getByRole("button", { name: "Generate & Export" }).click();
    await expect(page.getByText("Report exported")).toBeVisible();
  });
});
