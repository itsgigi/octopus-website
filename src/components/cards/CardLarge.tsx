import { cva, type VariantProps } from "class-variance-authority";
import { ProductImage } from "@/components/ui/ProductImage";
import { productHref } from "@/lib/data/products";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/types";
import { CardContent } from "./CardContent";

const cardVariants = cva(
  "relative isolate flex aspect-card-medium overflow-hidden rounded-card md:aspect-card-large",
  {
    variants: {
      orientation: {
        horizontal: "",
        /** Security bento: tall card in the left column on desktop, text centred on top. */
        "vertical-on-desktop": "lg:aspect-auto lg:h-full lg:min-h-full",
      },
    },
    defaultVariants: { orientation: "horizontal" },
  },
);

const contentVariants = cva(
  "w-full p-8 md:max-w-copy md:items-start md:justify-center md:p-10 md:text-left lg:p-20",
  {
    variants: {
      orientation: {
        horizontal: "",
        "vertical-on-desktop": "lg:max-w-none lg:items-center lg:justify-start lg:text-center",
      },
    },
  },
);

type CardLargeProps = VariantProps<typeof cardVariants> & {
  product: Product;
  className?: string;
};

/** Lifestyle image with the text on top of it (mobile: text centred at the top). */
export function CardLarge({ product, orientation, className }: CardLargeProps) {
  const image = product.lifestyleImages[0] ?? product.image;
  return (
    <article className={cn(cardVariants({ orientation }), className)}>
      <ProductImage
        src={image.src}
        alt={image.alt}
        aspect="fill"
        rounded={false}
        sizes="(min-width: 1200px) 1344px, 100vw"
        className="absolute inset-0 -z-10"
      />
      <CardContent
        title={product.name}
        description={product.shortDescription}
        href={productHref(product.slug)}
        align="center"
        className={contentVariants({ orientation })}
      />
    </article>
  );
}
