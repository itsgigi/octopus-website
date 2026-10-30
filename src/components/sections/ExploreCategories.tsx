import { CategoryTile } from "@/components/cards/CategoryTile";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import type { SectionOf } from "./types";

export function ExploreCategories({ section }: { section: SectionOf<"explore-categories"> }) {
  const titleId = `${section.id}-title`;
  return (
    <section aria-labelledby={titleId} className="py-20 lg:pt-30 lg:pb-45">
      <Container className="flex flex-col gap-10">
        <Heading as="h2" size="h3" id={titleId}>
          {section.title}
        </Heading>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 lg:gap-12">
          {section.categories.map((category) => (
            <li key={category.slug}>
              <CategoryTile category={category} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
