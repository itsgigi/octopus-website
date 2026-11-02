import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { VisuallyHidden } from "@/components/ui/VisuallyHidden";
import { productHref } from "@/lib/data/products";
import { FullBleedBanner } from "./FullBleedBanner";
import type { SectionOf } from "./types";

/** Hair Care banner (the hair-care "category" on the homepage). */
export function Banner({ section }: { section: SectionOf<"banner"> }) {
  const titleId = `${section.id}-title`;
  return (
    <FullBleedBanner
      id={section.id}
      labelledBy={titleId}
      image={section.image}
      imageMobile={section.imageMobile}
      className="max-md:aspect-banner-mobile"
    >
      <div className="flex flex-col gap-4">
        <Heading as="h2" size="h2" id={titleId}>
          {section.title}
        </Heading>
        <Text size="subtitle" tone="muted" className="max-w-copy">
          {section.text}
        </Text>
      </div>
      <Button href={productHref(section.product.slug)}>
        Learn more
        <VisuallyHidden> about {section.product.name}</VisuallyHidden>
      </Button>
    </FullBleedBanner>
  );
}
