import { expect, test } from "@playwright/test";

test("homepage responds", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
});
