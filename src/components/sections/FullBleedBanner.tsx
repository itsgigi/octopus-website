import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { ProductImage } from "@/components/ui/ProductImage";
import { cn } from "@/lib/cn";
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
  /** Desktop photo; also used on smaller screens when no dedicated crop exists. */
  image: ImageRef;
  /** Crop for 810–1199px. */
  imageTablet?: ImageRef;
  /** Portrait crop for < 810px, with room for the text on top. */
  imageMobile?: ImageRef;
  /** Section ratio on the breakpoints with their own crop. */
  className?: string;
  /** e.g. an object-position to keep the subject in a crop. */
  imageClassName?: string;
  children: ReactNode;
};

/**
 * Edge-to-edge banner with the text over the photo. Each breakpoint can have its own crop: the
 * others stay `display: none`, and since they are lazy the browser never downloads them.
 */
export function FullBleedBanner({
  id,
  labelledBy,
  image,
  imageTablet,
  imageMobile,
  tone,
  className,
  imageClassName,
  children,
}: FullBleedBannerProps) {
  const hasMobile = Boolean(imageMobile?.src);
  const hasTablet = Boolean(imageTablet?.src);
  const layers = [
    {
      image,
      visibility: cn(hasMobile && "max-md:hidden", hasTablet && "md:max-lg:hidden"),
      imageClassName,
    },
    ...(hasTablet && imageTablet
      ? [{ image: imageTablet, visibility: "hidden md:max-lg:block" }]
      : []),
    ...(hasMobile && imageMobile ? [{ image: imageMobile, visibility: "md:hidden" }] : []),
  ];

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(bannerVariants({ tone }), className)}
    >
      <Container className="py-12 md:py-0">
        <Reveal
          travel="md"
          className="flex flex-col items-center gap-8 text-center md:max-w-2/5 md:items-start md:text-left"
        >
          {children}
        </Reveal>
      </Container>
      {layers.map((layer) => (
        <ProductImage
          key={layer.image.src}
          src={layer.image.src}
          alt={layer.image.alt}
          aspect="fill"
          rounded={false}
          sizes="100vw"
          tone={tone ?? "light"}
          imageClassName={layer.imageClassName}
          className={cn("absolute inset-0 -z-10", layer.visibility)}
        />
      ))}
    </section>
  );
}
