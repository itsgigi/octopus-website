import rawCategories from "@/data/categories.json";
import { CategorySchema, type Category, type CategorySlug } from "@/lib/types";
import { resolveImage } from "./images";
import { assertUnique } from "./validate";

const categories: Category[] = CategorySchema.array()
  .parse(rawCategories)
  .map((category) => ({ ...category, image: resolveImage(category.image) }));

assertUnique(categories, (c) => c.slug, "category slug");

export async function getCategories(): Promise<Category[]> {
  "use cache";
  return categories;
}

export async function getCategory(slug: CategorySlug): Promise<Category | undefined> {
  "use cache";
  return categories.find((c) => c.slug === slug);
}

/** Explore tiles jump to the matching homepage section (brief: anchor or placeholder route). */
export function categoryHref(slug: CategorySlug) {
  return `/#${slug}`;
}
