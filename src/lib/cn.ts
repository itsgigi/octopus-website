import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge about custom @theme tokens so e.g. `text-h2` (font-size)
// and `text-ink` (colour) are not treated as conflicting classes.
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
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
