"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { observeReveal } from "./revealObserver";

type RevealProps = {
  children: ReactNode;
  /** Travel distance: `lg` 60px (cards, images), `md` 30px (text-only blocks). */
  travel?: "lg" | "md";
  className?: string;
};

/** Fades and lifts its content in once, when it scrolls into view. Styles live in globals.css. */
export function Reveal({ children, travel = "lg", className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return observeReveal(ref.current);
  }, []);

  return (
    <div ref={ref} data-reveal={travel} className={className}>
      {children}
    </div>
  );
}
