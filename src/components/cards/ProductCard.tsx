import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { Text } from "@/components/ui/Text";
import { productHref } from "@/lib/data/products";
import type { Product } from "@/lib/types";

/** PDP best-sellers card: square tile + name + short description; the whole card is one link. */
export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={productHref(product.slug)} className="group flex flex-col gap-4 rounded-card">
      <ProductImage
        src={product.image.src}
        alt={product.image.alt}
        fit="contain"
        sizes="(min-width: 1200px) 250px, (min-width: 810px) 33vw, 50vw"
        className="transition-transform duration-300 group-hover:scale-[1.02]"
      />
      <span className="flex flex-col gap-2">
        <span className="text-title font-bold text-ink group-hover:underline">{product.name}</span>
        <Text as="span" tone="muted">
          {product.shortDescription}
        </Text>
      </span>
    </Link>
  );
}
