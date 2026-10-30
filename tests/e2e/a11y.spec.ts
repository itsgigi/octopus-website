import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = ["/", "/products/octopus-countertop-blender"];

for (const path of pages) {
  test(`axe: no WCAG A/AA violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    // Reveal everything so axe checks the final state, not the pre-animation opacity 0.
    await page.evaluate(() =>
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        el.dataset.visible = "";
        el.style.transition = "none";
      }),
    );
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const summary = results.violations.map(
      (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
    );
    expect(summary).toEqual([]);
  });
}

test("keyboard: skip link is first and moves focus to main", async ({
  page,
  isMobile,
  browserName,
}) => {
  test.skip(isMobile, "keyboard flow checked on desktop");
  await page.goto("/");
  // Safari on macOS only tabs to links with Option+Tab (or "Full Keyboard Access" enabled).
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});
