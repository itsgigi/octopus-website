import { cva, type VariantProps } from "class-variance-authority";
import { ProductImage } from "@/components/ui/ProductImage";
import { productHref } from "@/lib/data/products";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/types";
import { CardContent } from "./CardContent";

const cardVariants = cva("flex flex-col overflow-hidden rounded-card bg-surface", {
  variants: {
    orientation: {
      vertical: "",
      /** Security bento: text left, image right on desktop; vertical below. */
      "horizontal-on-desktop": "lg:flex-row lg:items-center",
    },
  },
  defaultVariants: { orientation: "vertical" },
});

const halfOnDesktop = { vertical: "", "horizontal-on-desktop": "lg:w-1/2" } as const;

type CardMediumProps = VariantProps<typeof cardVariants> & { product: Product };

/** Light tile: text centred above a square product shot (or side by side on desktop). */
export function CardMedium({ product, orientation }: CardMediumProps) {
  const o = orientation ?? "vertical";
  return (
    <article className={cardVariants({ orientation: o })}>
      <CardContent
        title={product.name}
        description={product.shortDescription}
        href={productHref(product.slug)}
        align="center"
        className={
          o === "horizontal-on-desktop"
            ? "p-8 md:p-10 lg:w-1/2 lg:items-start lg:py-10 lg:pr-0 lg:pl-10 lg:text-left"
            : "p-8 md:p-10 lg:p-12"
        }
      />
      <ProductImage
        src={product.image.src}
        alt={product.image.alt}
        rounded={false}
        fit="contain"
        sizes="(min-width: 810px) 50vw, 100vw"
        className={cn("mt-auto bg-transparent", halfOnDesktop[o])}
      />
    </article>
  );
}
