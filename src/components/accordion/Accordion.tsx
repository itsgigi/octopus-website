import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Surface that groups AccordionItems (Figma "Specifics" box). */
export function Accordion({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-specifics bg-surface px-5 py-1", className)}>{children}</div>;
}
