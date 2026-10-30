import { Reveal } from "@/components/motion/Reveal";
import { CarouselCard } from "@/components/cards/CarouselCard";
import { Carousel } from "@/components/carousel/Carousel";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { getCategories } from "@/lib/data/categories";
import type { SectionOf } from "./types";

export async function BestSellers({ section }: { section: SectionOf<"best-sellers"> }) {
  const categories = await getCategories();
  const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? "";

  return (
    <section aria-labelledby={`${section.id}-title`} className="pt-20 pb-10 lg:pt-30 lg:pb-15">
      <Reveal>
        <Container className="mb-10">
          <Heading as="h2" size="h3" id={`${section.id}-title`}>
            {section.title}
          </Heading>
        </Container>
        <Carousel
          label={section.title}
          slideClassName="w-carousel-sm max-w-[85vw] md:w-carousel-md lg:w-carousel-lg"
        >
          {section.products.map((product) => (
            <CarouselCard
              key={product.slug}
              product={product}
              categoryName={categoryName(product.category)}
            />
          ))}
        </Carousel>
      </Reveal>
    </section>
  );
}
