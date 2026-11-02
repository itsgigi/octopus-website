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
      imageTablet={section.imageTablet}
      imageMobile={section.imageMobile}
      tone="brand"
      className="max-md:aspect-find-us-mobile md:max-lg:aspect-find-us-tablet"
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
            className="mx-auto h-auto w-full max-w-60 md:mx-0 md:max-w-copy"
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
