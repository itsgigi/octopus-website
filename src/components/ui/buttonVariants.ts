import { cva, type VariantProps } from "class-variance-authority";

/** Shared by Button and IconButton so both stay in sync with the Figma button states. */
export const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center rounded-full border font-medium whitespace-nowrap select-none",
    "transition-colors duration-150 ease-out",
    "disabled:pointer-events-none aria-disabled:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        primary: [
          "border-brand-border bg-brand text-ink-inverse",
          "hover:bg-brand-hover active:bg-brand-pressed",
          "disabled:border-surface-strong disabled:bg-surface-strong disabled:text-ink-disabled",
        ],
        secondary: [
          "border-line bg-canvas text-ink",
          "hover:bg-surface active:bg-surface-strong",
          "disabled:border-surface-strong disabled:bg-surface-strong disabled:text-ink-disabled",
        ],
        ghost: [
          "border-transparent bg-transparent text-ink-nav",
          "hover:bg-surface-strong hover:text-ink active:bg-line",
          "disabled:text-ink-disabled",
        ],
        "ghost-inverse": [
          "border-transparent bg-transparent text-ink-inverse",
          "hover:bg-overlay-inverse active:bg-overlay-inverse",
          "focus-visible:outline-ink-inverse disabled:opacity-50",
        ],
      },
      size: {
        sm: "h-8 gap-2 px-3 text-small",
        md: "h-10 gap-2.5 px-4 text-cta",
        lg: "h-12 gap-3 px-6 text-cta",
      },
      iconOnly: {
        true: "aspect-square px-0",
        false: "",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: { variant: "primary", size: "md", iconOnly: false, fullWidth: false },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
