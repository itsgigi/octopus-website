import type { Metadata } from "next";
import { Banner } from "@/components/sections/Banner";
import { BestSellers } from "@/components/sections/BestSellers";
import { CategorySection } from "@/components/sections/CategorySection";
import { ExploreCategories } from "@/components/sections/ExploreCategories";
import { FindUsBanner } from "@/components/sections/FindUsBanner";
import { Hero } from "@/components/sections/Hero";
import { getHomePage, type ResolvedHomeSection } from "@/lib/data/home";

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = await getHomePage();
  return {
    title: { absolute: title },
    description,
    openGraph: { title, description, type: "website" },
  };
}

/** The homepage is pure composition: section order and content come from home.json. */
export default async function Home() {
  const { sections } = await getHomePage();
  return sections.map((section) => <HomeSection key={section.id} section={section} />);
}

function HomeSection({ section }: { section: ResolvedHomeSection }) {
  switch (section.type) {
    case "hero":
      return <Hero section={section} />;
    case "best-sellers":
      return <BestSellers section={section} />;
    case "category":
      return <CategorySection section={section} />;
    case "banner":
      return <Banner section={section} />;
    case "explore-categories":
      return <ExploreCategories section={section} />;
    case "find-us":
      return <FindUsBanner section={section} />;
  }
}
