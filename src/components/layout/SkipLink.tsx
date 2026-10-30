import { cn } from "@/lib/cn";
import { buttonVariants } from "@/components/ui/buttonVariants";

/** First focusable element on every page: jumps past the navigation to <main>. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className={cn(
        buttonVariants({ variant: "secondary" }),
        "sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60",
      )}
    >
      Skip to content
    </a>
  );
}
