import rawHome from "@/data/pages/home.json";
import rawNavigation from "@/data/navigation.json";
import rawProducts from "@/data/products.json";
import rawPlaceholder from "@/data/pages/placeholder.json";
import { PlaceholderPageSchema, type PlaceholderPage } from "@/lib/types";

const PREFIX = "/placeholder/";

function collectHrefs(value: unknown, out: Set<string>) {
  if (Array.isArray(value)) value.forEach((v) => collectHrefs(v, out));
  else if (value && typeof value === "object") {
    for (const [key, v] of Object.entries(value)) {
      if (key === "href" && typeof v === "string" && v.startsWith(PREFIX)) out.add(v);
      else collectHrefs(v, out);
    }
  }
}

/** Every out-of-scope link in the content, so the placeholder route can prerender them all. */
export async function getPlaceholderPaths(): Promise<string[][]> {
  "use cache";
  const hrefs = new Set<string>();
  [rawHome, rawNavigation, rawProducts].forEach((source) => collectHrefs(source, hrefs));
  return [...hrefs].map((href) => href.slice(PREFIX.length).split("/"));
}

const placeholderPage = PlaceholderPageSchema.parse(rawPlaceholder);

export async function getPlaceholderPage(): Promise<PlaceholderPage> {
  "use cache";
  return placeholderPage;
}

/** "where-to-buy" → "Where to buy" (title for an out-of-scope link). */
export function placeholderTitle(segments: string[]) {
  const words = (segments.at(-1) ?? "").replaceAll("-", " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}
