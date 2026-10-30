import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export const headingVariants = cva("text-balance", {
  variants: {
    size: {
      display: "text-display",
      h2: "text-h2",
      h3: "text-h3",
      "title-lg": "text-title-lg font-bold",
      title: "text-title font-bold",
    },
    tone: {
      default: "text-ink",
      inverse: "text-ink-inverse",
    },
  },
  defaultVariants: { size: "h2", tone: "default" },
});

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadingProps = ComponentPropsWithoutRef<"h2"> &
  VariantProps<typeof headingVariants> & {
    /** Semantic level — independent from the visual `size`. */
    as?: HeadingLevel;
  };

export function Heading({ as: Tag = "h2", size, tone, className, ...props }: HeadingProps) {
  return <Tag className={cn(headingVariants({ size, tone }), className)} {...props} />;
}
