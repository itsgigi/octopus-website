import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { categoryHref } from "@/lib/data/categories";
import type { Category } from "@/lib/types";

/** Square tile + centred label; the whole tile is one link. */
export function CategoryTile({ category }: { category: Category }) {
  return (
    <Link href={categoryHref(category.slug)} className="group flex flex-col gap-4 rounded-card">
      <ProductImage
        src={category.image.src}
        alt={category.image.alt}
        sizes="(min-width: 810px) 25vw, 50vw"
        className="transition-transform duration-300 group-hover:scale-[1.02]"
      />
      <span className="text-center text-body-lg font-medium text-ink group-hover:underline">
        {category.name}
      </span>
    </Link>
  );
}
