import { Button } from "@/components/ui/Button";
import type { Link } from "@/lib/types";

/** Mobile-only bottom bar keeping "Where to buy" in reach (DS §6.9). */
export function StickyCta({ cta }: { cta: Link }) {
  return (
    <div
      data-sticky-cta
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line-subtle bg-nav p-4 backdrop-blur-nav md:hidden"
    >
      <Button href={cta.href} fullWidth size="lg">
        {cta.label}
      </Button>
    </div>
  );
}
