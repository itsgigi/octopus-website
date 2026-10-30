import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { VisuallyHidden } from "./VisuallyHidden";

const logoVariants = cva("inline-flex items-center font-bold text-current", {
  variants: {
    variant: {
      full: "gap-2 text-title",
      stacked: "flex-col gap-3 text-h3",
      mark: "",
    },
  },
  defaultVariants: { variant: "full" },
});

const markSizes = {
  full: "size-8",
  stacked: "size-20 md:size-24",
  mark: "size-8",
} as const;

type LogoProps = VariantProps<typeof logoVariants> & { className?: string };

/** Octopus mark (approximation — Figma export disabled) + wordmark. Colour = currentColor. */
export function Logo({ variant, className }: LogoProps) {
  const v = variant ?? "full";
  return (
    <span className={cn(logoVariants({ variant: v }), className)}>
      <LogoMark className={markSizes[v]} />
      {v === "mark" ? <VisuallyHidden>Octopus</VisuallyHidden> : <span>Octopus</span>}
    </span>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("shrink-0", className)} aria-hidden focusable="false">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M16 3a10 10 0 0 0-10 10v5h20v-5A10 10 0 0 0 16 3Zm-3 9.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm9 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        d="M8 18c0 4.5-2.5 6-4 9M13 18c0 5-1 7-2 10M19 18c0 5 1 7 2 10M24 18c0 4.5 2.5 6 4 9"
      />
    </svg>
  );
}
