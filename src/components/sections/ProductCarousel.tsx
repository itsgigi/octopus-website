import { ProductCard } from "@/components/cards/ProductCard";
import { Carousel } from "@/components/carousel/Carousel";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import type { Product } from "@/lib/types";

type ProductCarouselProps = { id: string; title: string; products: Product[] };

/**
 * Carousel of product cards: 2 / 3 / 5 visible (mobile / tablet / desktop). Slide width is
 * computed from the column count and the 24px track gap, so it always fills the content width.
 */
export function ProductCarousel({ id, title, products }: ProductCarouselProps) {
  if (products.length === 0) return null;
  const titleId = `${id}-title`;
  return (
    <section aria-labelledby={titleId} className="py-20 lg:py-30">
      <Container className="mb-10">
        <Heading as="h2" size="h3" id={titleId}>
          {title}
        </Heading>
      </Container>
      <Carousel
        label={title}
        slideClassName="[--cols:2] md:[--cols:3] lg:[--cols:5] w-[calc((100%-(var(--cols)-1)*--spacing(6))/var(--cols))]"
      >
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </Carousel>
    </section>
  );
}
