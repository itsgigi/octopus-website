import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { FullBleedBanner } from "./FullBleedBanner";
import type { SectionOf } from "./types";

/** Red "Find us at" banner. Retailer shown as text (no third-party logo reproduction). */
export function FindUsBanner({ section }: { section: SectionOf<"find-us"> }) {
  const titleId = `${section.id}-title`;
  return (
    <FullBleedBanner id={section.id} labelledBy={titleId} image={section.image} tone="brand">
      <div className="flex flex-col gap-6">
        <Heading as="h2" size="h2" tone="inverse" id={titleId}>
          {section.title}
        </Heading>
        <Text size="subtitle" tone="inverse" weight="bold">
          {section.retailer}
        </Text>
      </div>
      <Button href={section.cta.href} variant="secondary">
        {section.cta.label}
      </Button>
    </FullBleedBanner>
  );
}
