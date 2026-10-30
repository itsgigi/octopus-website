import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { FullBleedBanner } from "./FullBleedBanner";
import type { SectionOf } from "./types";

/** Red "Find us at" banner: retailer lockup (name as text if no logo), CTA to the store locator. */
export function FindUsBanner({ section }: { section: SectionOf<"find-us"> }) {
  const titleId = `${section.id}-title`;
  return (
    <FullBleedBanner
      id={section.id}
      labelledBy={titleId}
      image={section.image}
      tone="brand"
      media="side"
    >
      <div className="flex flex-col gap-3">
        <Heading as="h2" size="h3" tone="inverse" id={titleId}>
          {section.title}
        </Heading>
        {section.retailerLogo ? (
          <Image
            src={section.retailerLogo}
            alt={section.retailer}
            width={1037}
            height={192}
            sizes="(min-width: 810px) 450px, 100vw"
            className="h-auto w-full max-w-copy"
          />
        ) : (
          <p className="text-h3 font-bold text-ink-inverse">{section.retailer}</p>
        )}
      </div>
      <Button href={section.cta.href} variant="secondary">
        {section.cta.label}
      </Button>
    </FullBleedBanner>
  );
}
