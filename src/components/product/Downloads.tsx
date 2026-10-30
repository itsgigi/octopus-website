import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { Download } from "@/lib/types";

/** Static "Downloads" box (same surface as the specs accordion): title left, files right. */
export function Downloads({
  downloads,
  title = "Downloads",
}: {
  downloads: Download[];
  title?: string;
}) {
  if (downloads.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-specifics bg-surface px-5 py-4">
      <h3 className="text-body font-bold text-ink">{title}</h3>
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {downloads.map((download) => (
          <li key={download.href}>
            <Link
              href={download.href}
              className="inline-flex items-center gap-2 rounded-sm text-body text-ink-muted underline-offset-4 hover:text-ink hover:underline"
            >
              <Icon name="download" className="size-5" />
              {download.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
