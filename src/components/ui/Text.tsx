import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const textVariants = cva("", {
  variants: {
    size: {
      subtitle: "text-subtitle font-book",
      card: "text-card font-book",
      "body-lg": "text-body-lg font-book",
      body: "text-body font-book",
      small: "text-small font-book",
      tiny: "text-tiny font-book",
    },
    tone: {
      default: "text-ink",
      muted: "text-ink-muted",
      accent: "text-brand",
      inverse: "text-ink-inverse",
    },
    weight: {
      book: "",
      medium: "font-medium",
      bold: "font-bold",
    },
  },
  defaultVariants: { size: "body", tone: "default", weight: "book" },
});

type TextElement = "p" | "span" | "div" | "li" | "dt" | "dd" | "small";

type TextProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof textVariants> & {
    as?: TextElement;
  };

export function Text({ as: Tag = "p", size, tone, weight, className, ...props }: TextProps) {
  return <Tag className={cn(textVariants({ size, tone, weight }), className)} {...props} />;
}
