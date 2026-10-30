import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import type { ButtonVariantProps } from "@/components/ui/buttonVariants";
import { Container } from "@/components/ui/Container";
import { Heading, headingVariants } from "@/components/ui/Heading";
import { Icon, iconNames } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { Logo } from "@/components/ui/Logo";
import { ProductImage } from "@/components/ui/ProductImage";
import { Text } from "@/components/ui/Text";
import { VisuallyHidden } from "@/components/ui/VisuallyHidden";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Styleguide",
  description: "Design tokens and UI primitives of the Octopus website.",
  robots: { index: false, follow: false },
};

// Internal review page: the swatch / sample lists below are documentation, not site content.
const colours = [
  { token: "brand", className: "bg-brand" },
  { token: "brand-hover", className: "bg-brand-hover" },
  { token: "brand-pressed", className: "bg-brand-pressed" },
  { token: "ink", className: "bg-ink" },
  { token: "ink-muted", className: "bg-ink-muted" },
  { token: "ink-nav", className: "bg-ink-nav" },
  { token: "ink-disabled", className: "bg-ink-disabled" },
  { token: "dark", className: "bg-dark" },
  { token: "canvas", className: "bg-canvas" },
  { token: "surface", className: "bg-surface" },
  { token: "surface-strong", className: "bg-surface-strong" },
  { token: "line", className: "bg-line" },
  { token: "focus", className: "bg-focus" },
  { token: "focus-ring", className: "bg-focus-ring" },
] as const;

const headings = [
  { size: "display", label: "Display · 40 / 48 / 60" },
  { size: "h2", label: "H2 · 32 / 40 / 44" },
  { size: "h3", label: "H3 · 24 / 28 / 32" },
  { size: "title-lg", label: "Title bold · 24" },
  { size: "title", label: "Title bold · 20" },
] as const;

const texts = [
  { size: "subtitle", label: "Subtitle · 18 / 20 / 24" },
  { size: "card", label: "Card description · 16 / 18 / 20" },
  { size: "body-lg", label: "Body · 18" },
  { size: "body", label: "Body · 16" },
  { size: "small", label: "Small label · 14" },
  { size: "tiny", label: "Smallest label · 10" },
] as const;

const tones = ["default", "muted", "accent"] as const;

type Variant = NonNullable<ButtonVariantProps["variant"]>;
type PreviewState = "default" | "hover" | "active" | "focus" | "disabled";

const states: PreviewState[] = ["default", "hover", "active", "focus", "disabled"];
const sizes = ["sm", "md", "lg"] as const;

const variantRows: { variant: Variant; surface: string }[] = [
  { variant: "primary", surface: "bg-canvas" },
  { variant: "secondary", surface: "bg-canvas" },
  { variant: "ghost", surface: "bg-canvas" },
  { variant: "ghost-inverse", surface: "bg-brand" },
  { variant: "ghost-inverse", surface: "bg-dark" },
];

const aspects = [
  { aspect: "square", label: "Product tile 1:1" },
  { aspect: "card-medium", label: "Card medium 3:4" },
  { aspect: "pdp-product", label: "PDP product 709:900" },
  { aspect: "pdp-lifestyle", label: "PDP lifestyle 709:945" },
  { aspect: "video", label: "Hero 16:9" },
  { aspect: "card-large", label: "Card large 1344:755" },
  { aspect: "banner", label: "Banner 2.4:1" },
] as const;

function stateProps(state: PreviewState) {
  if (state === "disabled") return { disabled: true };
  if (state === "default") return {};
  return { "data-preview": state };
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section
      aria-labelledby={`sg-${title}`}
      className="flex flex-col gap-6 border-t border-line pt-10"
    >
      <Heading as="h2" size="h3" id={`sg-${title}`}>
        {title}
      </Heading>
      {children}
    </section>
  );
}

function Caption({ children }: { children: ReactNode }) {
  return (
    <Text size="small" tone="muted">
      {children}
    </Text>
  );
}

export default function StyleguidePage() {
  return (
    <main id="main" className="py-16">
      <Container className="flex flex-col gap-16">
        <header className="flex flex-col gap-4">
          <Text size="body-lg" tone="accent">
            Internal · not indexed
          </Text>
          <Heading as="h1" size="display">
            Styleguide
          </Heading>
          <Text size="subtitle" tone="muted" className="max-w-copy">
            Tokens from globals.css and every UI primitive in every state. Forced states use the
            data-preview attribute; Tab through the page to see the real focus ring.
          </Text>
        </header>

        <Section title="Colours">
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
            {colours.map(({ token, className }) => (
              <li key={token} className="flex flex-col gap-2">
                <span
                  className={cn("aspect-square rounded-card border border-line-swatch", className)}
                />
                <Caption>{token}</Caption>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Typography">
          <div className="flex flex-col gap-6">
            {headings.map(({ size, label }) => (
              <div key={size} className="flex flex-col gap-1">
                <Caption>{label}</Caption>
                <p className={headingVariants({ size })}>Octopus Countertop Blender</p>
              </div>
            ))}
            {texts.map(({ size, label }) => (
              <div key={size} className="flex flex-col gap-1">
                <Caption>{label}</Caption>
                <Text size={size}>A powerful blender that crushes ice and blends smooth.</Text>
              </div>
            ))}
            <div className="flex flex-col gap-1">
              <Caption>Tones</Caption>
              <div className="flex flex-wrap gap-6">
                {tones.map((tone) => (
                  <Text key={tone} size="body-lg" tone={tone}>
                    {tone}
                  </Text>
                ))}
                <Text size="body-lg" tone="inverse" className="bg-brand px-2">
                  inverse
                </Text>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Button">
          <div className="flex flex-col gap-4 overflow-x-auto">
            {variantRows.map(({ variant, surface }) => (
              <div
                key={`${variant}-${surface}`}
                className={cn("flex flex-col gap-3 rounded-card p-6", surface)}
              >
                <Text size="small" tone={variant === "ghost-inverse" ? "inverse" : "muted"}>
                  {variant}
                </Text>
                <div className="flex flex-wrap items-center gap-4">
                  {states.map((state) => (
                    <Button key={state} variant={variant} {...stateProps(state)}>
                      {state}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <Caption>Sizes · icons · link · full width</Caption>
            <div className="flex flex-wrap items-center gap-4">
              {sizes.map((size) => (
                <Button key={size} size={size}>
                  Size {size}
                </Button>
              ))}
              <Button variant="secondary" trailingIcon="arrow-right">
                Explore all products
              </Button>
              <Button variant="secondary" leadingIcon="download">
                User manual
              </Button>
              <Button href="/styleguide#sg-Button">Learn more (link)</Button>
            </div>
            <div className="max-w-sm">
              <Button fullWidth>Where to buy</Button>
            </div>
          </div>
        </Section>

        <Section title="IconButton">
          <div className="flex flex-col gap-4">
            {variantRows.map(({ variant, surface }) => (
              <div
                key={`${variant}-${surface}`}
                className={cn("flex flex-wrap items-center gap-4 rounded-card p-6", surface)}
              >
                {states.map((state) => (
                  <IconButton
                    key={state}
                    icon="chevron-right"
                    label={`Next (${variant}, ${state})`}
                    variant={variant}
                    {...stateProps(state)}
                  />
                ))}
              </div>
            ))}
            <div className="flex items-center gap-4">
              <IconButton icon="chevron-left" label="Previous (small)" size="sm" />
              <IconButton icon="menu" label="Open menu" variant="ghost" />
              <IconButton icon="close" label="Close menu" variant="ghost" />
              <IconButton icon="pause" label="Pause video" size="lg" />
            </div>
          </div>
        </Section>

        <Section title="Icon">
          <ul className="flex flex-wrap gap-6">
            {iconNames.map((name) => (
              <li key={name} className="flex w-24 flex-col items-center gap-2">
                <Icon name={name} />
                <Caption>{name}</Caption>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Logo">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center justify-center rounded-card bg-surface p-10 text-brand">
              <Logo variant="full" />
            </div>
            <div className="flex items-center justify-center rounded-card bg-brand p-10 text-ink-inverse">
              <Logo variant="stacked" />
            </div>
            <div className="flex items-center justify-center rounded-card bg-surface p-10 text-brand">
              <Logo variant="mark" />
            </div>
          </div>
        </Section>

        <Section title="ProductImage">
          <Text tone="muted">
            Placeholders reserve each slot&apos;s ratio; dropping a file in /public/images and
            passing src swaps in next/image with no layout shift.
          </Text>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {aspects.map(({ aspect, label }) => (
              <figure
                key={aspect}
                className={cn(
                  "flex flex-col gap-2",
                  (aspect === "video" || aspect === "card-large" || aspect === "banner") &&
                    "col-span-2",
                )}
              >
                <ProductImage aspect={aspect} alt={label} sizes="(min-width: 810px) 50vw, 100vw" />
                <figcaption>
                  <Caption>{label}</Caption>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>

        <Section title="Container & VisuallyHidden">
          <div className="rounded-card bg-surface py-6">
            <Container>
              <div className="rounded-card border border-dashed border-ink-muted p-4">
                <Text size="small" tone="muted">
                  Container · max 1344 · gutter 16 / 32 / 48
                </Text>
              </div>
            </Container>
          </div>
          <Text>
            This sentence ends with screen-reader-only text.
            <VisuallyHidden> (Hidden context for assistive technology.)</VisuallyHidden>
          </Text>
        </Section>
      </Container>
    </main>
  );
}
