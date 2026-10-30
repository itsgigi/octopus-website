import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { getNavigation } from "@/lib/data/navigation";
import { cn } from "@/lib/cn";
import { MobileMenu } from "./MobileMenu";
import { navSurface } from "./navSurface";

/** Fixed floating header. Full navigation from 1200px; below it the MobileMenu island takes over. */
export async function Navbar() {
  const { main, cta } = await getNavigation();

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-2 pt-2 md:px-4 md:pt-4 lg:px-12 lg:pt-6">
      <div
        className={cn(
          navSurface,
          "hidden h-16 items-center justify-between py-3 pr-3 pl-5 lg:flex",
        )}
      >
        <Link href="/" aria-label="Octopus home" className="rounded-full text-brand">
          <Logo variant="full" />
        </Link>
        <nav aria-label="Main" className="flex items-center gap-2">
          <ul className="flex items-center gap-1">
            {main.map((link) => (
              <li key={link.href}>
                <Button href={link.href} variant="ghost">
                  {link.label}
                </Button>
              </li>
            ))}
          </ul>
          <Button href={cta.href}>{cta.label}</Button>
        </nav>
      </div>
      <MobileMenu links={main} cta={cta} />
    </header>
  );
}
