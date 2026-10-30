import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

// 24×24 outline icons, stroke = currentColor so they follow the text colour.
const paths = {
  "chevron-left": <path d="M15 18l-6-6 6-6" />,
  "chevron-right": <path d="M9 18l6-6-6-6" />,
  "chevron-down": <path d="M6 9l6 6 6-6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  download: <path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14" />,
  play: <path d="M8 5.5v13l10.5-6.5L8 5.5z" fill="currentColor" />,
  pause: <path d="M8 5v14M16 5v14" />,
  "arrow-right": <path d="M5 12h14m0 0l-6-6m6 6l-6 6" />,
} as const;

export type IconName = keyof typeof paths;

export const iconNames = Object.keys(paths) as IconName[];

type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  name: IconName;
  /** Accessible name. Omit for decorative icons (default) — they are hidden from AT. */
  title?: string;
};

export function Icon({ name, title, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-6 shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  );
}
