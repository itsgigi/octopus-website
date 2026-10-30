import { cva, type VariantProps } from "class-variance-authority";
import { Heading } from "@/components/ui/Heading";
import { ProductImage } from "@/components/ui/ProductImage";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn";
import type { Feature } from "@/lib/types";

/** The photo fills the card and the text sits on its empty side, as in Figma. */
const cardVariants = cva("relative isolate flex overflow-hidden rounded-card bg-surface", {
  variants: {
    shape: {
      /**
       * Full row: text on the left, subject on the right. On mobile the row is too narrow for
       * both, so the text stacks above the photo.
       */
      wide: "flex-col md:aspect-feature-wide md:flex-row md:items-center lg:col-span-2",
      /** Half row on desktop: text on top of the photo. */
      tall: "aspect-feature-tall flex-col",
    },
  },
  defaultVariants: { shape: "wide" },
});

const imageVariants = cva("", {
  variants: {
    shape: {
      wide: "aspect-photo md:absolute md:inset-0 md:-z-10 md:aspect-auto md:h-full",
      tall: "absolute inset-0 -z-10",
    },
  },
});

type FeatureCardProps = VariantProps<typeof cardVariants> & {
  feature: Feature;
  className?: string;
};

export function FeatureCard({ feature, shape, className }: FeatureCardProps) {
  const s = shape ?? "wide";
  return (
    <article className={cn(cardVariants({ shape: s }), className)}>
      <div
        className={cn(
          "flex flex-col gap-2 p-6 md:p-8",
          s === "wide" && "md:w-1/2 lg:py-12 lg:pr-0 lg:pl-12",
        )}
      >
        <Heading as="h3" size="title">
          {feature.title}
        </Heading>
        <Text>{feature.description}</Text>
      </div>
      <ProductImage
        src={feature.image.src}
        alt={feature.image.alt}
        rounded={false}
        aspect="fill"
        sizes={
          s === "wide" ? "(min-width: 1200px) 709px, 100vw" : "(min-width: 1200px) 346px, 100vw"
        }
        imageClassName={s === "wide" ? "object-right" : undefined}
        className={imageVariants({ shape: s })}
      />
    </article>
  );
}
