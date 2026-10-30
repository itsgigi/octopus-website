"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Logo } from "@/components/ui/Logo";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { cn } from "@/lib/cn";
import type { Link as NavLink } from "@/lib/types";
import { navSurface } from "./navSurface";

type MobileMenuProps = {
  links: NavLink[];
  cta: NavLink;
};

/**
 * Navigation below 1200px: the floating pill expands into a card with stacked links.
 * Disclosure pattern (button + aria-expanded/controls) with focus trap, Escape, outside click.
 */
export function MobileMenu({ links, cta }: MobileMenuProps) {
  const pathname = usePathname();
  // Remember *where* the menu was opened: navigating to another route closes it for free.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const panelId = useId();
  const cardRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useFocusTrap(cardRef, open);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpenOn(null);
      toggleRef.current?.focus();
    }
    function onPointerDown(event: PointerEvent) {
      if (!cardRef.current?.contains(event.target as Node)) setOpenOn(null);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const close = () => setOpenOn(null);

  return (
    <div className="lg:hidden" data-scroll-lock={open ? "" : undefined}>
      <div
        aria-hidden
        className={cn(
          "fixed inset-0 bg-ink/20 transition-opacity duration-200",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <div ref={cardRef} className={cn(navSurface, "relative flex flex-col")}>
        <div className="flex h-16 items-center justify-between py-3 pr-3 pl-5">
          <Link
            href="/"
            aria-label="Octopus home"
            className="rounded-full text-brand"
            onClick={close}
          >
            <Logo variant="mark" className="md:hidden" />
            <Logo variant="full" className="max-md:hidden" />
          </Link>
          <IconButton
            ref={toggleRef}
            icon={open ? "close" : "menu"}
            label="Menu"
            variant="ghost"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpenOn(open ? null : pathname)}
          />
        </div>

        <nav id={panelId} aria-label="Main" hidden={!open} className="px-2 pb-4">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Button
                  href={link.href}
                  variant="ghost"
                  size="lg"
                  fullWidth
                  className="justify-start px-3"
                  onClick={close}
                >
                  {link.label}
                </Button>
              </li>
            ))}
          </ul>
          <Button href={cta.href} fullWidth size="lg" className="mt-4" onClick={close}>
            {cta.label}
          </Button>
        </nav>
      </div>
    </div>
  );
}
