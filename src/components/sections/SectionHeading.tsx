import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import type { Link } from "@/lib/types";

type SectionHeadingProps = {
  id: string;
  title: string;
  subtitle?: string;
  cta?: Link;
};

/**
 * Figma "Heading 2": centred title + muted subtitle + secondary CTA. Category titles use the
 * H1 scale (60 / 48 / 40) as in the Figma frames, not H2/L.
 */
export function SectionHeading({ id, title, subtitle, cta }: SectionHeadingProps) {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <Heading as="h2" size="display" id={id}>
          {title}
        </Heading>
        {subtitle ? (
          <Text size="subtitle" tone="muted" className="max-w-copy">
            {subtitle}
          </Text>
        ) : null}
      </div>
      {cta ? (
        <Button href={cta.href} variant="secondary">
          {cta.label}
        </Button>
      ) : null}
    </div>
  );
}
