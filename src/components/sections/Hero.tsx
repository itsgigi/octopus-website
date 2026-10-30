import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ProductImage } from "@/components/ui/ProductImage";
import { Text } from "@/components/ui/Text";
import { VisuallyHidden } from "@/components/ui/VisuallyHidden";
import { productHref } from "@/lib/data/products";
import type { SectionOf } from "./types";
import { HeroVideo } from "./HeroVideo";

/**
 * Full-bleed hero. The poster is the LCP element (priority); the video only loads on the client,
 * muted, and is skipped entirely with prefers-reduced-motion.
 */
export function Hero({ section }: { section: SectionOf<"hero"> }) {
  const { product, subtitle, cta, poster, video } = section;
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex h-svh flex-col overflow-hidden md:aspect-hero-tablet md:h-auto lg:aspect-video"
    >
      <ProductImage
        src={poster.src}
        alt={poster.alt}
        aspect="fill"
        rounded={false}
        priority
        sizes="100vw"
        className="absolute inset-0 -z-10"
      />
      {video ? <HeroVideo src={video} poster={poster.src} /> : null}
      <Container className="flex flex-col items-center gap-8 pt-32 text-center lg:pt-40">
        <div className="flex flex-col items-center gap-4">
          <Heading as="h1" size="display" id="hero-title">
            {product.name}
          </Heading>
          <Text size="subtitle" tone="muted" className="max-w-copy">
            {subtitle}
          </Text>
        </div>
        <Button href={cta?.href ?? productHref(product.slug)}>
          {cta?.label ?? "Learn more"}
          <VisuallyHidden> about {product.name}</VisuallyHidden>
        </Button>
      </Container>
    </section>
  );
}
