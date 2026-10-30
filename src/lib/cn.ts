import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge about custom @theme tokens so they are grouped correctly, e.g. `text-h2`
// (font-size) vs `text-ink` (colour), or `font-book` (weight, not font-family).
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "h2",
            "h3",
            "subtitle",
            "card",
            "title",
            "title-lg",
            "body",
            "body-lg",
            "cta",
            "small",
            "tiny",
          ],
        },
      ],
      "font-weight": [{ font: ["book"] }],
    },
    theme: {
      radius: ["card", "nav", "specifics"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
