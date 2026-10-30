import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { Text } from "@/components/ui/Text";
import { getNavigation } from "@/lib/data/navigation";
import { cn } from "@/lib/cn";

const footerLink =
  "rounded-sm text-cta text-ink-inverse underline-offset-4 hover:underline focus-visible:outline-ink-inverse";

/** Red footer: stacked on mobile, logo + link columns in a row from tablet. */
export async function Footer() {
  const { footer } = await getNavigation();

  return (
    <footer className="border-t border-ink-inverse/20 bg-brand text-ink-inverse">
      <Container className="flex flex-col gap-15 pt-15 pb-6">
        <div className="flex flex-col gap-15 md:flex-row md:justify-between">
          <Link
            href="/"
            aria-label="Octopus home"
            className="self-start rounded-card focus-visible:outline-ink-inverse"
          >
            <Logo variant="stacked" />
          </Link>

          <div className="flex flex-col gap-10 md:flex-row md:gap-20">
            {footer.columns.map((column) => {
              const headingId = `footer-${column.title.toLowerCase().replaceAll(" ", "-")}`;
              return (
                <nav key={column.title} aria-labelledby={headingId} className="flex flex-col gap-6">
                  <h2 id={headingId} className="text-body font-bold">
                    {column.title}
                  </h2>
                  <ul
                    className={cn(
                      "grid gap-4",
                      column.subColumns === 2 && "md:grid-flow-col md:grid-rows-2 md:gap-x-10",
                    )}
                  >
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className={footerLink}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Text as="p" size="small" tone="inverse">
            {footer.copyright}
          </Text>
          <Link href={footer.legal.href} className={cn(footerLink, "text-small")}>
            {footer.legal.label}
          </Link>
        </div>
      </Container>
    </footer>
  );
}
