import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { LogoMark } from "./Logo";

const frameVariants = cva("relative w-full overflow-hidden bg-surface", {
  variants: {
    aspect: {
      square: "aspect-square",
      video: "aspect-video",
      banner: "aspect-banner",
      "card-large": "aspect-card-large",
      "card-medium": "aspect-card-medium",
      "pdp-product": "aspect-pdp-product",
      "pdp-lifestyle": "aspect-pdp-lifestyle",
      fill: "h-full",
    },
    rounded: {
      true: "rounded-card",
      false: "",
    },
    tone: {
      light: "",
      brand: "bg-brand",
    },
  },
  defaultVariants: { aspect: "square", rounded: true, tone: "light" },
});

type ProductImageProps = VariantProps<typeof frameVariants> & {
  /** Path under /public. Missing → neutral placeholder with the same ratio (Figma export disabled). */
  src?: string;
  /** Empty string for decorative images. */
  alt: string;
  /** Required for responsive srcset, e.g. "(min-width: 1200px) 50vw, 100vw". */
  sizes: string;
  /** Only for the LCP image. */
  priority?: boolean;
  fit?: "cover" | "contain";
  className?: string;
};

/**
 * Single entry point for every content image: the frame reserves the slot's aspect ratio
 * (no CLS) so real files can be dropped into /public/images without touching components.
 */
export function ProductImage({
  src,
  alt,
  sizes,
  priority = false,
  fit = "cover",
  aspect,
  rounded,
  tone,
  className,
}: ProductImageProps) {
  return (
    <div className={cn(frameVariants({ aspect, rounded, tone }), className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={fit === "cover" ? "object-cover" : "object-contain"}
        />
      ) : (
        <div
          role={alt ? "img" : undefined}
          aria-label={alt || undefined}
          aria-hidden={alt ? undefined : true}
          className={cn(
            "absolute inset-0 grid place-items-center bg-linear-to-br",
            tone === "brand"
              ? "from-brand to-brand-pressed text-ink-inverse/20"
              : "from-surface to-surface-strong text-line",
          )}
        >
          <LogoMark className="size-1/5 max-w-24 min-w-8" />
        </div>
      )}
    </div>
  );
}
