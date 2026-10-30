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
        /**
         * Security bento: text centred on top of a portrait photo. Tall (4:5) on tablet, because the
         * only asset is portrait; 660 × 1038 on desktop, which sets the height of the whole bento.
         */
        "vertical-on-desktop": "md:aspect-card-tall lg:aspect-card-portrait",
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
        // Text column 450 wide, centred: the padding takes the rest of the card width.
        "vertical-on-desktop":
          "md:mx-auto md:items-center md:justify-start md:text-center lg:max-w-none lg:px-[calc((100%-var(--container-copy))/2)]",
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
        focus={image.focus}
        aspect="fill"
        rounded={false}
        sizes="(min-width: 1200px) 1344px, 100vw"
        imageClassName={orientation === "vertical-on-desktop" ? "object-bottom" : undefined}
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
