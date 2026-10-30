import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { FullBleedBanner } from "./FullBleedBanner";
import type { SectionOf } from "./types";

/** Red "Find us at" banner: retailer icon + name, CTA to the store locator. */
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
      <div className="flex flex-col gap-6">
        <Heading as="h2" size="h2" tone="inverse" id={titleId}>
          {section.title}
        </Heading>
        <p className="flex items-center gap-3 text-ink-inverse max-md:justify-center">
          {section.retailerLogo ? (
            // Decorative: the retailer name follows as text. SVG, so no optimisation needed.
            <Image
              src={section.retailerLogo}
              alt=""
              width={40}
              height={40}
              unoptimized
              className="size-10"
            />
          ) : null}
          <span className="text-h3 font-bold">{section.retailer}</span>
        </p>
      </div>
      <Button href={section.cta.href} variant="secondary">
        {section.cta.label}
      </Button>
    </FullBleedBanner>
  );
}
