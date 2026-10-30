import type { Metadata } from "next";
import { Banner } from "@/components/sections/Banner";
import { BestSellers } from "@/components/sections/BestSellers";
import { CategorySection, type SectionSpacing } from "@/components/sections/CategorySection";
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
  return sections.map((section, i) => (
    <HomeSection
      key={section.id}
      section={section}
      spacing={spacingBetween(sections[i - 1], sections[i + 1])}
    />
  ));
}

const fullBleed = new Set<ResolvedHomeSection["type"]>(["hero", "banner", "find-us"]);

/** Vertical rhythm depends on the neighbours, so reordering home.json keeps it right. */
function spacingBetween(prev?: ResolvedHomeSection, next?: ResolvedHomeSection): SectionSpacing {
  return {
    top: prev && fullBleed.has(prev.type) ? "lg" : prev?.type === "best-sellers" ? "sm" : "md",
    bottom: next && fullBleed.has(next.type) ? "lg" : "md",
  };
}

function HomeSection({
  section,
  spacing,
}: {
  section: ResolvedHomeSection;
  spacing: SectionSpacing;
}) {
  switch (section.type) {
    case "hero":
      return <Hero section={section} />;
    case "best-sellers":
      return <BestSellers section={section} />;
    case "category":
      return <CategorySection section={section} spacing={spacing} />;
    case "banner":
      return <Banner section={section} />;
    case "explore-categories":
      return <ExploreCategories section={section} />;
    case "find-us":
      return <FindUsBanner section={section} />;
  }
}
