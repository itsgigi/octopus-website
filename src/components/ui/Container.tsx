import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/cn";

type ContainerProps<T extends ElementType> = {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/** Page grid: content max 1344 (content-box, so the gutter sits outside it), gutter 16 / 32 / 48. */
export function Container<T extends ElementType = "div">({
  as,
  className,
  ...props
}: ContainerProps<T>) {
  const Component: ElementType = as ?? "div";
  return (
    <Component
      className={cn("mx-auto box-content max-w-content px-4 md:px-8 lg:px-12", className)}
      {...props}
    />
  );
}
