import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { buttonVariants, type ButtonVariantProps } from "./buttonVariants";
import { Icon, type IconName } from "./Icon";

type BaseProps = Omit<ButtonVariantProps, "iconOnly"> & {
  children: ReactNode;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  className?: string;
};

type ButtonAsLink = BaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof BaseProps> & {
    href: string;
  };

type ButtonAsButton = BaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof BaseProps> & {
    href?: never;
  };

export type ButtonProps = ButtonAsLink | ButtonAsButton;

/** Pill button. Renders a `next/link` when `href` is set, a `<button>` otherwise. */
export function Button(props: ButtonProps) {
  const { variant, size, fullWidth, leadingIcon, trailingIcon, className, children, ...rest } =
    props;
  const classes = cn(buttonVariants({ variant, size, fullWidth }), className);
  const content = (
    <>
      {leadingIcon ? <Icon name={leadingIcon} className="size-5" /> : null}
      {children}
      {trailingIcon ? <Icon name={trailingIcon} className="size-5" /> : null}
    </>
  );

  if (typeof rest.href === "string") {
    return (
      <Link className={classes} {...(rest as Omit<ButtonAsLink, keyof BaseProps>)}>
        {content}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = rest as Omit<ButtonAsButton, keyof BaseProps>;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
