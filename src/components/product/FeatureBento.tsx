import { VisuallyHidden } from "@/components/ui/VisuallyHidden";
import type { Feature } from "@/lib/types";
import { FeatureCard } from "./FeatureCard";

/** Figma bento: wide · tall + tall · wide, repeating. Single column below desktop. */
const shapeAt = (index: number) => (index % 4 === 0 || index % 4 === 3 ? "wide" : "tall");

export function FeatureBento({ features }: { features: Feature[] }) {
  if (features.length === 0) return null;
  return (
    <section aria-labelledby="features-title">
      <VisuallyHidden>
        <h2 id="features-title">Features</h2>
      </VisuallyHidden>
      <div className="grid gap-4 lg:grid-cols-2">
        {features.map((feature, i) => (
          <FeatureCard key={feature.title} feature={feature} shape={shapeAt(i)} />
        ))}
      </div>
    </section>
  );
}
