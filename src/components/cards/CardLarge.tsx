import { cva, type VariantProps } from "class-variance-authority";
import { ProductImage } from "@/components/ui/ProductImage";
import { productHref } from "@/lib/data/products";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/types";
import { CardContent } from "./CardContent";

const cardVariants = cva(
  "relative isolate flex aspect-card-large-mobile overflow-hidden rounded-card md:aspect-card-large",
  {
    variants: {
      orientation: {
        horizontal: "",
        /**
         * Security bento: text centred on top of a portrait photo, 660 × 1038 on desktop (it sets
         * the height of the whole bento).
         */
        "vertical-on-desktop": "lg:aspect-card-portrait",
      },
      /** Tablet: horizontal like Figma when a landscape crop exists, else tall (4:5) and centred. */
      tablet: { landscape: "", portrait: "" },
    },
    compoundVariants: [
      { orientation: "vertical-on-desktop", tablet: "portrait", className: "md:aspect-card-tall" },
    ],
    defaultVariants: { orientation: "horizontal", tablet: "landscape" },
  },
);

const contentVariants = cva(
  "w-full gap-6 px-6 pt-10 md:max-w-copy md:items-start md:justify-center md:gap-8 md:p-10 md:text-left lg:p-20",
  {
    variants: {
      orientation: {
        horizontal: "",
        // Text column 450 wide, centred: the padding takes the rest of the card width.
        "vertical-on-desktop":
          "lg:mx-auto lg:max-w-none lg:items-center lg:justify-start lg:px-[calc((100%-var(--container-copy))/2)] lg:text-center",
      },
      tablet: { landscape: "", portrait: "" },
    },
    compoundVariants: [
      {
        orientation: "vertical-on-desktop",
        tablet: "portrait",
        className: "md:mx-auto md:items-center md:justify-start md:text-center",
      },
      // Figma tablet frame: 80 top/bottom, 40 sides.
      { orientation: "vertical-on-desktop", tablet: "landscape", className: "md:px-10 md:py-20" },
    ],
  },
);

type CardLargeProps = VariantProps<typeof cardVariants> & {
  product: Product;
  className?: string;
};

/** Lifestyle image with the text on top of it (mobile: text centred at the top). */
export function CardLarge({ product, orientation, className }: CardLargeProps) {
  const image = product.lifestyleImages[0] ?? product.image;
  const vertical = orientation === "vertical-on-desktop";
  // The portrait photo turns the card tall on tablet; a landscape crop keeps Figma's layout.
  const landscape = vertical && image.srcLandscape ? image.srcLandscape : undefined;
  const tablet = vertical && !landscape ? "portrait" : "landscape";
  return (
    <article className={cn(cardVariants({ orientation, tablet }), className)}>
      <ProductImage
        src={image.src}
        alt={image.alt}
        focus={image.focus}
        aspect="fill"
        rounded={false}
        sizes="(min-width: 1200px) 1344px, 100vw"
        imageClassName={vertical ? "object-bottom" : undefined}
        className={cn("absolute inset-0 -z-10", landscape && "md:max-lg:hidden")}
      />
      {landscape ? (
        // Only shown on tablet; lazy, so other breakpoints never download it.
        <ProductImage
          src={landscape}
          alt={image.alt}
          aspect="fill"
          rounded={false}
          sizes="100vw"
          className="absolute inset-0 -z-10 hidden md:max-lg:block"
        />
      ) : null}
      <CardContent
        title={product.name}
        description={product.shortDescription}
        href={productHref(product.slug)}
        align="center"
        className={contentVariants({ orientation, tablet })}
      />
    </article>
  );
}
