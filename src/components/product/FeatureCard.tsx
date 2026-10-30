import { cva, type VariantProps } from "class-variance-authority";
import { Heading } from "@/components/ui/Heading";
import { ProductImage } from "@/components/ui/ProductImage";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn";
import type { Feature } from "@/lib/types";

const cardVariants = cva("relative isolate flex overflow-hidden rounded-card bg-surface", {
  variants: {
    shape: {
      /** Full width: text on the left, over the image. */
      wide: "aspect-square md:aspect-video lg:col-span-2",
      /** Half width on desktop: text on top, image below. */
      tall: "flex-col",
    },
  },
  defaultVariants: { shape: "wide" },
});

type FeatureCardProps = VariantProps<typeof cardVariants> & {
  feature: Feature;
  className?: string;
};

export function FeatureCard({ feature, shape, className }: FeatureCardProps) {
  const wide = (shape ?? "wide") === "wide";
  return (
    <article className={cn(cardVariants({ shape }), className)}>
      <div
        className={cn(
          "flex flex-col gap-2 p-6 md:p-8",
          wide && "max-w-copy md:w-1/2 md:max-w-none",
        )}
      >
        <Heading as="h3" size="title">
          {feature.title}
        </Heading>
        <Text tone="muted">{feature.description}</Text>
      </div>
      <ProductImage
        src={feature.image.src}
        alt={feature.image.alt}
        rounded={false}
        aspect={wide ? "fill" : "square"}
        sizes={wide ? "(min-width: 1200px) 709px, 100vw" : "(min-width: 1200px) 346px, 100vw"}
        className={cn(wide ? "absolute inset-0 -z-10" : "mt-auto max-lg:aspect-video")}
      />
    </article>
  );
}
