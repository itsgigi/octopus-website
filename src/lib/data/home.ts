import rawHome from "@/data/pages/home.json";
import { HomePageSchema, type Category, type HomeSection, type Product } from "@/lib/types";
import { getCategories, getCategory } from "./categories";
import { resolveImage } from "./images";
import { getBestSellers, getFeaturedProducts, getProduct } from "./products";
import { assertUnique } from "./validate";

type Section<T extends HomeSection["type"]> = Extract<HomeSection, { type: T }>;

/** home.json sections with every slug reference replaced by the full record. */
export type ResolvedHomeSection =
  | (Omit<Section<"hero">, "product"> & { product: Product })
  | (Omit<Section<"best-sellers">, "products"> & { products: Product[] })
  | (Section<"category"> & { categoryData: Category; products: Product[] })
  | (Omit<Section<"banner">, "product"> & { product: Product })
  | (Section<"explore-categories"> & { categories: Category[] })
  | Section<"find-us">;

export type ResolvedHomePage = {
  title: string;
  description: string;
  sections: ResolvedHomeSection[];
};

const home = HomePageSchema.parse(rawHome);
assertUnique(home.sections, (s) => s.id, "home section id");

async function requireProduct(slug: string, sectionId: string): Promise<Product> {
  const product = await getProduct(slug);
  if (!product)
    throw new Error(`home.json section "${sectionId}" references unknown product "${slug}"`);
  return product;
}

async function resolveSection(section: HomeSection): Promise<ResolvedHomeSection> {
  switch (section.type) {
    case "hero":
      return {
        ...section,
        poster: resolveImage(section.poster),
        product: await requireProduct(section.product, section.id),
      };
    case "best-sellers":
      return {
        ...section,
        products: section.products
          ? await Promise.all(section.products.map((slug) => requireProduct(slug, section.id)))
          : await getBestSellers(),
      };
    case "category": {
      const categoryData = await getCategory(section.category);
      if (!categoryData) throw new Error(`Unknown category "${section.category}"`);
      return { ...section, categoryData, products: await getFeaturedProducts(section.category) };
    }
    case "banner":
      return {
        ...section,
        image: resolveImage(section.image),
        product: await requireProduct(section.product, section.id),
      };
    case "explore-categories":
      return { ...section, categories: await getCategories() };
    case "find-us":
      return { ...section, image: resolveImage(section.image) };
  }
}

export async function getHomePage(): Promise<ResolvedHomePage> {
  "use cache";
  return { ...home, sections: await Promise.all(home.sections.map(resolveSection)) };
}
