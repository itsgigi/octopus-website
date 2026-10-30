import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import type { Link, Product } from "@/lib/types";
import { ColourSelector } from "./ColourSelector";

type ProductInfoProps = { product: Product; cta: Link };

/** Title, description, colour selector and "Where to buy" (sticky beside the gallery on desktop). */
export function ProductInfo({ product, cta }: ProductInfoProps) {
  return (
    <div className="flex flex-col gap-8 lg:sticky lg:top-30 lg:mx-auto lg:w-full lg:max-w-pdp-info lg:pt-20">
      <div className="flex flex-col gap-4">
        <Heading as="h1" size="h2">
          {product.name}
        </Heading>
        <Text tone="muted">{product.description ?? product.shortDescription}</Text>
      </div>
      {product.colours.length > 0 ? <ColourSelector colours={product.colours} /> : null}
      {/* On mobile the same CTA lives in the sticky bottom bar instead. */}
      <Button href={cta.href} fullWidth className="max-md:hidden">
        {cta.label}
      </Button>
    </div>
  );
}
