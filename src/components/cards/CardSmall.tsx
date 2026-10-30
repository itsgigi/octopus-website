import { ProductImage } from "@/components/ui/ProductImage";
import { productHref } from "@/lib/data/products";
import type { Product } from "@/lib/types";
import { CardContent } from "./CardContent";

/**
 * Accessories tile: product image on top, left-aligned text below. On mobile it matches the other
 * category cards (CardMedium): text centred on top, product shot below.
 */
export function CardSmall({ product }: { product: Product }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-card bg-surface">
      <ProductImage
        src={product.image.src}
        alt={product.image.alt}
        rounded={false}
        fit="contain"
        sizes="(min-width: 810px) 33vw, 100vw"
        className="bg-transparent max-md:mt-auto"
      />
      <CardContent
        title={product.name}
        description={product.shortDescription}
        href={productHref(product.slug)}
        titleSize="title-lg"
        className="flex-1 justify-between p-6 max-md:order-first max-md:flex-none max-md:items-center max-md:p-8 max-md:text-center lg:p-8"
      />
    </article>
  );
}
