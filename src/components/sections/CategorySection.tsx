import { CardLarge } from "@/components/cards/CardLarge";
import { CardMedium } from "@/components/cards/CardMedium";
import { CardSmall } from "@/components/cards/CardSmall";
import { Container } from "@/components/ui/Container";
import type { Product } from "@/lib/types";
import { SectionHeading } from "./SectionHeading";
import type { SectionOf } from "./types";

type Section = SectionOf<"category">;

/**
 * Category bento. The layout comes from home.json, the products from `featured` in products.json:
 * the first featured product is the large card, any further ones flow into the grid.
 */
export function CategorySection({ section }: { section: Section }) {
  const headingId = `${section.id}-title`;
  return (
    <section
      id={section.id}
      aria-labelledby={headingId}
      className="scroll-mt-24 py-10 md:py-20 lg:scroll-mt-28"
    >
      <Container className="flex flex-col gap-10 md:gap-20">
        <SectionHeading
          id={headingId}
          title={section.categoryData.name}
          subtitle={section.categoryData.tagline}
          cta={section.cta}
        />
        <Bento layout={section.layout} products={section.products} />
      </Container>
    </section>
  );
}

function Bento({ layout, products }: { layout: Section["layout"]; products: Product[] }) {
  const [lead, ...rest] = products;
  if (!lead) return null;

  switch (layout) {
    case "large-first":
      return (
        <div className="flex flex-col gap-6">
          <CardLarge product={lead} />
          <div className="grid gap-6 md:grid-cols-2">
            {rest.map((p) => (
              <CardMedium key={p.slug} product={p} />
            ))}
          </div>
        </div>
      );
    case "large-side":
      return (
        <div className="grid gap-6 lg:grid-cols-2">
          <CardLarge product={lead} orientation="vertical-on-desktop" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {rest.map((p) => (
              <CardMedium key={p.slug} product={p} orientation="horizontal-on-desktop" />
            ))}
          </div>
        </div>
      );
    case "small-row":
      return (
        <div className="grid gap-6 md:grid-cols-3">
          {products.map((p) => (
            <CardSmall key={p.slug} product={p} />
          ))}
        </div>
      );
  }
}
