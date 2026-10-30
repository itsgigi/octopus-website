import { expect, test } from "@playwright/test";

test("layout shell renders header, skip link and footer", async ({ page }) => {
  await page.goto("/placeholder/where-to-buy");
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "Where to buy" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Skip to content" })).toHaveAttribute(
    "href",
    "#main",
  );
});

test("navigation collapses into a menu below 1200px", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile project only");
  await page.goto("/placeholder/where-to-buy");

  const toggle = page.getByRole("button", { name: "Menu" });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("banner").getByRole("link", { name: "Kitchen" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});
