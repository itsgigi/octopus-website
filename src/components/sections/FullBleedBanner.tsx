import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { ProductImage } from "@/components/ui/ProductImage";
import type { ImageRef } from "@/lib/types";

const bannerVariants = cva(
  "relative isolate flex scroll-mt-24 flex-col overflow-hidden md:aspect-banner md:justify-center lg:scroll-mt-28",
  {
    variants: {
      tone: {
        light: "bg-surface text-ink",
        brand: "bg-brand text-ink-inverse",
      },
    },
    defaultVariants: { tone: "light" },
  },
);

type FullBleedBannerProps = VariantProps<typeof bannerVariants> & {
  id: string;
  labelledBy: string;
  image: ImageRef;
  children: ReactNode;
};

/** Edge-to-edge banner: text over the image from tablet, text above the image on mobile. */
export function FullBleedBanner({ id, labelledBy, image, tone, children }: FullBleedBannerProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={bannerVariants({ tone })}>
      <Container className="flex flex-col items-center gap-8 py-12 text-center md:items-start md:py-0 md:text-left">
        {children}
      </Container>
      <ProductImage
        src={image.src}
        alt={image.alt}
        rounded={false}
        sizes="100vw"
        tone={tone ?? "light"}
        className="bg-transparent md:absolute md:inset-0 md:-z-10 md:aspect-auto md:h-full"
      />
    </section>
  );
}
