import rawProducts from "@/data/products.json";
import { ProductSchema, type CategorySlug, type Product } from "@/lib/types";
import { resolveImage } from "./images";
import { assertUnique } from "./validate";

// Parsed once at module load: invalid JSON fails `next build` instead of rendering a broken page.
const catalogue: Product[] = ProductSchema.array()
  .parse(rawProducts)
  .map((product) => ({
    ...product,
    image: resolveImage(product.image),
    lifestyleImages: product.lifestyleImages.map(resolveImage),
    features: product.features.map((f) => ({ ...f, image: resolveImage(f.image) })),
  }));

assertUnique(catalogue, (p) => p.id, "product id");
assertUnique(catalogue, (p) => p.slug, "product slug");

/*
 * Data access goes through these async, cached functions only. Swapping the JSON for a headless
 * CMS means changing their bodies, not their callers.
 */

export async function getProducts(): Promise<Product[]> {
  "use cache";
  return catalogue;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  "use cache";
  return catalogue.find((p) => p.slug === slug);
}

/** Products flagged `featured` in a category, in featured order (first = large card). */
export async function getFeaturedProducts(category: CategorySlug): Promise<Product[]> {
  "use cache";
  return catalogue
    .filter((p) => p.category === category && p.featured !== undefined)
    .sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0));
}

/** Best sellers by rank; `exclude` drops the product currently shown (PDP). */
export async function getBestSellers(exclude?: string): Promise<Product[]> {
  "use cache";
  return catalogue
    .filter((p) => p.bestSeller && p.slug !== exclude)
    .sort(
      (a, b) =>
        (a.bestSellerRank ?? Number.MAX_SAFE_INTEGER) -
        (b.bestSellerRank ?? Number.MAX_SAFE_INTEGER),
    );
}

export function productHref(slug: string) {
  return `/products/${slug}`;
}
