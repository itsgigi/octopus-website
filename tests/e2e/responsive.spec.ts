import { expect, test } from "@playwright/test";

// Brief #1: no horizontal scroll at the three breakpoints and in between.
const widths = [360, 402, 640, 809, 810, 1024, 1199, 1200, 1440, 1600, 1920];
const pages = ["/", "/products/octopus-countertop-blender"];

test.describe("no horizontal scroll", () => {
  test.skip(({ isMobile }) => isMobile, "viewport sweep runs on desktop Chrome only");

  for (const path of pages) {
    test(path, async ({ page }) => {
      await page.goto(path);
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `${path} at ${width}px`).toBe(0);
      }
    });
  }
});
