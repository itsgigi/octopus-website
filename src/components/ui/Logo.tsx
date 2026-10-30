import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { VisuallyHidden } from "./VisuallyHidden";

const logoVariants = cva("inline-flex items-center font-bold text-current", {
  variants: {
    variant: {
      full: "gap-[0.2em] text-title",
      stacked: "flex-col gap-[0.45em] text-title",
      mark: "",
    },
  },
  defaultVariants: { variant: "full" },
});

// Mark height relative to the wordmark size, measured on the brand artwork.
const markSizes = {
  full: "h-[1.25em]",
  stacked: "h-[3.2em]",
  mark: "h-8",
} as const;

type LogoProps = VariantProps<typeof logoVariants> & { className?: string };

/** Octopus mark (traced from the brand artwork) + wordmark. Colour = currentColor. */
export function Logo({ variant, className }: LogoProps) {
  const v = variant ?? "full";
  return (
    <span className={cn(logoVariants({ variant: v }), className)}>
      <LogoMark className={markSizes[v]} />
      {v === "mark" ? <VisuallyHidden>Octopus</VisuallyHidden> : <span>Octopus</span>}
    </span>
  );
}

/** One continuous stroke: two tentacle curls joined by the head loop. */
const LOGO_MARK_PATH =
  "M75 154C106 154 131 170 131 204V244.5A58 58 0 0 0 247 244.5V236C247 200 197.5 180 197.5 138.5A78 78 0 0 1 353.5 138.5C353.5 180 304 200 304 236V244.5A58 58 0 0 0 420 244.5V204C420 170 445 154 476 154";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="75 38 401 287"
      className={cn("aspect-[401/287] w-auto shrink-0", className)}
      aria-hidden
      focusable="false"
    >
      <path d={LOGO_MARK_PATH} fill="none" stroke="currentColor" strokeWidth={45} />
    </svg>
  );
}
