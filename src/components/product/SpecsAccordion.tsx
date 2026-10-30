import { Accordion } from "@/components/accordion/Accordion";
import { AccordionItem } from "@/components/accordion/AccordionItem";
import type { SpecSection } from "@/lib/types";

/** Technical specifications · Dimensions & weight · Product information — each toggles on its own. */
export function SpecsAccordion({ specs }: { specs: SpecSection[] }) {
  if (specs.length === 0) return null;
  return (
    <Accordion>
      {specs.map((section) => (
        <AccordionItem key={section.title} title={section.title}>
          <dl className="flex flex-col gap-3 text-body font-book text-ink-muted">
            {section.items.map((item) => (
              <div key={item.label} className="flex gap-2">
                <span aria-hidden>•</span>
                <dt>{item.label}:</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
