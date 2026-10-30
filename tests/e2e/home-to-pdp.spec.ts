import { expect, test } from "@playwright/test";

test("homepage → Countertop Blender PDP: colour selection and specs accordion", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // "Learn more" on the Countertop Blender card (Kitchen section) opens its PDP.
  const kitchen = page.locator("#kitchen");
  await kitchen.scrollIntoViewIfNeeded();
  await kitchen.getByRole("link", { name: "Learn more about Octopus Countertop Blender" }).click();

  await expect(page).toHaveURL(/\/products\/octopus-countertop-blender$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Octopus Countertop Blender" }),
  ).toBeVisible();
  await expect(page).toHaveTitle(/Octopus Countertop Blender/);

  // Colour selector updates the selected state and its label.
  await expect(page.getByRole("group", { name: "Colour - Black" })).toBeVisible();
  // Tap the visible swatch (the <label>), like a user; the radio itself is visually hidden.
  await page.getByRole("radio", { name: "Silver" }).locator("xpath=ancestor::label").click();
  await expect(page.getByRole("radio", { name: "Silver" })).toBeChecked();
  await expect(page.getByRole("group", { name: "Colour - Silver" })).toBeVisible();

  // Specification sections expand and collapse.
  const specs = page.getByRole("button", { name: "Technical specifications" });
  await specs.scrollIntoViewIfNeeded();
  await expect(specs).toHaveAttribute("aria-expanded", "false");
  await specs.click();
  await expect(specs).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("region", { name: "Technical specifications" })).toContainText(
    "1500W",
  );
  await specs.click();
  await expect(specs).toHaveAttribute("aria-expanded", "false");
});

test("best-sellers carousel: arrows disabled at the ends", async ({ page }) => {
  await page.goto("/");
  const carousel = page.getByRole("group", { name: "Best sellers" });
  await carousel.scrollIntoViewIfNeeded();
  const prev = carousel.getByRole("button", { name: "Previous slide" });
  const next = carousel.getByRole("button", { name: "Next slide" });

  await expect(prev).toBeDisabled();
  await next.click();
  await expect(prev).toBeEnabled();
  await carousel.getByRole("button", { name: "Go to slide 3" }).click();
  await expect(next).toBeDisabled();
});
