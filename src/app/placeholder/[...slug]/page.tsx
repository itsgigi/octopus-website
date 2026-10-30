import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { getPlaceholderPage, getPlaceholderPaths, placeholderTitle } from "@/lib/data/placeholders";

/** Landing page for every link outside the two pages in scope (brief: "placeholder route"). */
export async function generateStaticParams() {
  return (await getPlaceholderPaths()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/placeholder/[...slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: placeholderTitle(slug), robots: { index: false, follow: true } };
}

export default async function PlaceholderPage({ params }: PageProps<"/placeholder/[...slug]">) {
  const { slug } = await params;
  const page = await getPlaceholderPage();

  return (
    <Container className="flex flex-col items-center gap-8 pt-40 pb-30 text-center lg:pt-48">
      <div className="flex flex-col items-center gap-4">
        <Text size="body-lg" tone="accent">
          {page.eyebrow}
        </Text>
        <Heading as="h1" size="h2">
          {placeholderTitle(slug)}
        </Heading>
        <Text size="subtitle" tone="muted" className="max-w-copy">
          {page.text}
        </Text>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <Button href={page.primaryCta.href}>{page.primaryCta.label}</Button>
        <Button href={page.secondaryCta.href} variant="secondary">
          {page.secondaryCta.label}
        </Button>
      </div>
    </Container>
  );
}
