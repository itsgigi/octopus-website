import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
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

const mediaVariants = cva("bg-transparent", {
  variants: {
    media: {
      /** Photo fills the banner behind the text (it already leaves room on the left). */
      cover: "md:absolute md:inset-0 md:-z-10 md:aspect-auto md:h-full",
      /** Product shot on the right, fading into the banner colour behind the text. */
      side: "aspect-photo md:absolute md:inset-y-0 md:right-0 md:-z-10 md:aspect-auto md:h-full md:w-3/5 md:mask-l-from-70% md:mask-l-to-100%",
    },
  },
  defaultVariants: { media: "cover" },
});

type FullBleedBannerProps = VariantProps<typeof bannerVariants> &
  VariantProps<typeof mediaVariants> & {
    id: string;
    labelledBy: string;
    image: ImageRef;
    /** e.g. an object-position to keep the subject in the mobile crop. */
    imageClassName?: string;
    children: ReactNode;
  };

/** Edge-to-edge banner: text over the image from tablet, text above the image on mobile. */
export function FullBleedBanner({
  id,
  labelledBy,
  image,
  tone,
  media,
  imageClassName,
  children,
}: FullBleedBannerProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={bannerVariants({ tone })}>
      <Container className="py-12 md:py-0">
        <Reveal
          travel="md"
          className="flex flex-col items-center gap-8 text-center md:max-w-2/5 md:items-start md:text-left"
        >
          {children}
        </Reveal>
      </Container>
      <ProductImage
        src={image.src}
        alt={image.alt}
        rounded={false}
        sizes={media === "side" ? "(min-width: 810px) 60vw, 100vw" : "100vw"}
        tone={tone ?? "light"}
        imageClassName={imageClassName}
        className={mediaVariants({ media })}
      />
    </section>
  );
}
