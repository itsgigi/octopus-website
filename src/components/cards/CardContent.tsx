import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { VisuallyHidden } from "@/components/ui/VisuallyHidden";
import { cn } from "@/lib/cn";

const contentVariants = cva("flex flex-col gap-8", {
  variants: {
    align: {
      start: "items-start text-left",
      center: "items-center text-center",
    },
  },
  defaultVariants: { align: "start" },
});

type CardContentProps = VariantProps<typeof contentVariants> & {
  eyebrow?: string;
  title: string;
  description: string;
  href: string;
  titleSize?: "h3" | "title-lg";
  ctaLabel?: string;
  className?: string;
};

/** Text block shared by every product card: eyebrow · name · description · "Learn more". */
export function CardContent({
  eyebrow,
  title,
  description,
  href,
  titleSize = "h3",
  ctaLabel = "Learn more",
  align,
  className,
}: CardContentProps) {
  return (
    <div className={cn(contentVariants({ align }), className)}>
      <div className="flex flex-col gap-4">
        {eyebrow ? (
          <Text size="body-lg" tone="accent">
            {eyebrow}
          </Text>
        ) : null}
        <Heading as="h3" size={titleSize}>
          {title}
        </Heading>
        <Text size="card" tone="muted">
          {description}
        </Text>
      </div>
      <Button href={href}>
        {ctaLabel}
        {/* Unique link names for screen readers: "Learn more about Octopus Kettle 1.7 L" */}
        <VisuallyHidden> about {title}</VisuallyHidden>
      </Button>
    </div>
  );
}
