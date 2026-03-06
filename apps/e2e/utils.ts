import { expect, type Page } from "@playwright/test";

export async function loginAs(page: Page, email: string, password: string): Promise<void> {
  await page.goto("/auth/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Continue" }).click();

  const deadline = Date.now() + 25_000;
  while (Date.now() < deadline && !page.url().includes("/app")) {
    if (page.url().includes("/auth/login")) {
      const mfaField = page.getByLabel("Authenticator code");
      if (await mfaField.isVisible()) {
        await mfaField.fill("123456");
        await page.getByRole("button", { name: "Continue" }).click();
      }
    }

    if (page.url().includes("/auth/onboarding")) {
      const finish = page.getByRole("button", { name: "Finish Onboarding" });
      const finishVisible = await finish.isVisible().catch(() => false);
      if (finishVisible) {
        await finish.click();
      } else {
        const continueButton = page.getByRole("button", { name: "Continue" });
        const continueVisible = await continueButton.isVisible().catch(() => false);
        if (continueVisible) {
          await continueButton.click();
        } else {
          break;
        }
      }
    }

    await page.waitForTimeout(700);
  }

  await expect(page).not.toHaveURL(/\/auth\/login/, { timeout: 10_000 });
}
