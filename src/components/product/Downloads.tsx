import Link from "next/link";
import { Accordion } from "@/components/accordion/Accordion";
import { AccordionItem } from "@/components/accordion/AccordionItem";
import { Icon } from "@/components/ui/Icon";
import type { Download } from "@/lib/types";

/** Separate "Downloads" box (same surface), also an accordion section per the brief. */
export function Downloads({
  downloads,
  title = "Downloads",
}: {
  downloads: Download[];
  title?: string;
}) {
  if (downloads.length === 0) return null;
  return (
    <Accordion>
      <AccordionItem title={title}>
        <ul className="flex flex-col gap-3">
          {downloads.map((download) => (
            <li key={download.href}>
              <Link
                href={download.href}
                className="inline-flex items-center gap-2 rounded-sm text-cta text-ink underline-offset-4 hover:underline"
              >
                <Icon name="download" className="size-5" />
                {download.label}
              </Link>
            </li>
          ))}
        </ul>
      </AccordionItem>
    </Accordion>
  );
}
