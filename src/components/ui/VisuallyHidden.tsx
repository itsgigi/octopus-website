import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/** Text for screen readers only (e.g. extra link context). */
export function VisuallyHidden({ className, ...props }: ComponentPropsWithoutRef<"span">) {
  return <span className={cn("sr-only", className)} {...props} />;
}
