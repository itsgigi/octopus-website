import { existsSync } from "node:fs";
import path from "node:path";
import type { ImageRef } from "@/lib/types";

const publicDir = path.join(process.cwd(), "public");

/**
 * Keep `src` only when the file exists in /public. Missing assets (Figma export is disabled)
 * fall back to the ratio-correct placeholder in `ProductImage`; dropping the real file in
 * /public/images is enough for it to show up on the next build — no JSON or code change.
 */
export function resolveImage(image: ImageRef): ImageRef {
  if (!image.src) return image;
  return existsSync(path.join(publicDir, image.src)) ? image : { alt: image.alt };
}
