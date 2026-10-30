import { ProductImage } from "@/components/ui/ProductImage";
import { productHref } from "@/lib/data/products";
import type { Product } from "@/lib/types";
import { CardContent } from "./CardContent";

type CarouselCardProps = { product: Product; categoryName: string };

/** Home best-sellers card: vertical on mobile, text left + image right from tablet. */
export function CarouselCard({ product, categoryName }: CarouselCardProps) {
  return (
    <article className="flex aspect-carousel-sm flex-col overflow-hidden rounded-card bg-surface md:aspect-carousel-md md:flex-row lg:aspect-carousel-lg">
      <CardContent
        eyebrow={categoryName}
        title={product.name}
        description={product.shortDescription}
        href={productHref(product.slug)}
        align="center"
        className="px-6 pt-8 md:w-1/2 md:shrink-0 md:items-start md:justify-center md:py-10 md:pl-10 md:text-left lg:max-w-copy lg:pl-20"
      />
      <ProductImage
        src={product.image.src}
        alt={product.image.alt}
        aspect="fill"
        rounded={false}
        fit="contain"
        sizes="(min-width: 1200px) 520px, (min-width: 810px) 344px, 320px"
        className="min-h-0 flex-1 bg-transparent"
      />
    </article>
  );
}
