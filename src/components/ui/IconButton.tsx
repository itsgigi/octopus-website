import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import { buttonVariants, type ButtonVariantProps } from "./buttonVariants";
import { Icon, type IconName } from "./Icon";

type IconButtonProps = Omit<ComponentPropsWithoutRef<"button">, "children" | "aria-label"> &
  Pick<ButtonVariantProps, "variant" | "size"> & {
    icon: IconName;
    /** Required accessible name — the button has no visible text. */
    label: string;
  };

/** Circular icon-only button (carousel arrows, menu toggle, video play/pause). */
export function IconButton({
  icon,
  label,
  variant = "secondary",
  size,
  type = "button",
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(buttonVariants({ variant, size, iconOnly: true }), className)}
      {...props}
    >
      <Icon name={icon} />
    </button>
  );
}
