import categoriesJson from "@/data/categories.json";
import productsJson from "@/data/products.json";
import { getCategories } from "@/lib/data/categories";
import { getHomePage } from "@/lib/data/home";
import { resolveImage } from "@/lib/data/images";
import {
  getBestSellers,
  getFeaturedProducts,
  getProduct,
  getProducts,
  productHref,
} from "@/lib/data/products";
import { assertUnique } from "@/lib/data/validate";

describe("content data", () => {
  it("has unique product ids and slugs", () => {
    const slugs = productsJson.map((p) => p.slug);
    const ids = productsJson.map((p) => p.id);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("puts every product in an existing category", async () => {
    const categories = new Set((await getCategories()).map((c) => c.slug));
    for (const product of await getProducts()) {
      expect(categories, product.slug).toContain(product.category);
    }
    expect(categories.size).toBe(categoriesJson.length);
  });

  it("rejects duplicates", () => {
    expect(() => assertUnique([{ s: "a" }, { s: "a" }], (x) => x.s, "slug")).toThrow(
      'Duplicate slug: "a"',
    );
  });
});

describe("product loaders", () => {
  it("returns featured products of a category in featured order", async () => {
    const kitchen = await getFeaturedProducts("kitchen");
    expect(kitchen.map((p) => p.slug)).toEqual([
      "octopus-kettle-1-7l",
      "octopus-blender",
      "octopus-countertop-blender",
    ]);
  });

  it("orders best sellers by rank and can exclude the current product", async () => {
    const all = await getBestSellers();
    expect(all[0]?.slug).toBe("octopus-ionic-hair-dryer");
    const ranks = all.map((p) => p.bestSellerRank ?? Infinity);
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));

    const withoutDryer = await getBestSellers("octopus-ionic-hair-dryer");
    expect(withoutDryer.map((p) => p.slug)).not.toContain("octopus-ionic-hair-dryer");
  });

  it("has the full PDP content for the Countertop Blender", async () => {
    const blender = await getProduct("octopus-countertop-blender");
    expect(blender?.specs.map((s) => s.title)).toEqual([
      "Technical specifications",
      "Dimensions & weight",
      "Product information",
    ]);
    expect(blender?.downloads).toHaveLength(1);
    expect(blender?.colours.length).toBeGreaterThan(1);
    expect(blender?.features).toHaveLength(4);
  });

  it("returns undefined for an unknown slug", async () => {
    expect(await getProduct("nope")).toBeUndefined();
  });

  it("builds product URLs", () => {
    expect(productHref("octopus-blender")).toBe("/products/octopus-blender");
  });
});

describe("images", () => {
  it("drops src when the file is not in /public, keeping alt", () => {
    expect(resolveImage({ src: "/images/does-not-exist.png", alt: "Kettle" })).toEqual({
      alt: "Kettle",
    });
  });
});

describe("homepage", () => {
  it("resolves every section reference in Figma order", async () => {
    const home = await getHomePage();
    expect(home.sections.map((s) => s.type)).toEqual([
      "hero",
      "best-sellers",
      "category",
      "banner",
      "category",
      "category",
      "explore-categories",
      "find-us",
    ]);
  });

  it("fills the best-sellers carousel and category sections with products", async () => {
    const home = await getHomePage();
    for (const section of home.sections) {
      if (section.type === "best-sellers") expect(section.products).toHaveLength(3);
      if (section.type === "category") expect(section.products.length).toBeGreaterThan(0);
    }
  });
});
