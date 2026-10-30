import { z } from "zod";

/*
 * Content model. The zod schemas validate the JSON in src/data at build time (a typo fails the
 * build, not the page) and the TypeScript types are inferred from them — one source of truth.
 * Shape follows the brief's sample `Product`, extended for what the two pages render.
 */

export const categorySlugs = ["kitchen", "home-security", "hair-care", "accessories"] as const;
export const CategorySlugSchema = z.enum(categorySlugs);
export type CategorySlug = z.infer<typeof CategorySlugSchema>;

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "kebab-case slug");

/** `src` is a path under /public; the loader drops it when the file is missing → placeholder. */
export const ImageRefSchema = z.object({
  src: z.string().startsWith("/images/").optional(),
  alt: z.string(),
  /** Landscape crop of the same photo, for slots that turn landscape (Card Large on tablet). */
  srcLandscape: z.string().startsWith("/images/").optional(),
  /** Subject position kept in view when the image is cropped (CSS object-position, e.g. "70% 50%"). */
  focus: z
    .string()
    .regex(/^\d{1,3}% \d{1,3}%$/)
    .optional(),
});
export type ImageRef = z.infer<typeof ImageRefSchema>;

export const ColourSchema = z.object({
  name: z.string(),
  /** Swatch fill — content data (a product colour), not a design token. */
  value: z.string().regex(/^#[0-9a-f]{6}$/i),
});
export type Colour = z.infer<typeof ColourSchema>;

export const SpecSectionSchema = z.object({
  title: z.string(),
  items: z.array(z.object({ label: z.string(), value: z.string() })).min(1),
});
export type SpecSection = z.infer<typeof SpecSectionSchema>;

export const FeatureSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: ImageRefSchema,
});
export type Feature = z.infer<typeof FeatureSchema>;

export const DownloadSchema = z.object({
  label: z.string(),
  href: z.string(),
});
export type Download = z.infer<typeof DownloadSchema>;

export const ProductSchema = z.object({
  id: z.string(),
  slug,
  name: z.string(),
  category: CategorySlugSchema,
  shortDescription: z.string(),
  /** Long copy for the PDP; falls back to `shortDescription`. */
  description: z.string().optional(),
  /** Product cut-out on the light tile. */
  image: ImageRefSchema,
  /** Lifestyle photography: large home cards, PDP gallery. */
  lifestyleImages: z.array(ImageRefSchema).default([]),
  bestSeller: z.boolean(),
  /** Order inside best-seller carousels (lower first). */
  bestSellerRank: z.number().int().positive().optional(),
  /** Shown in its category section on the homepage, in this order; the first one is the large card. */
  featured: z.number().int().positive().optional(),
  colours: z.array(ColourSchema).default([]),
  features: z.array(FeatureSchema).default([]),
  specs: z.array(SpecSectionSchema).default([]),
  downloads: z.array(DownloadSchema).default([]),
});
export type Product = z.infer<typeof ProductSchema>;

export const CategorySchema = z.object({
  slug: CategorySlugSchema,
  name: z.string(),
  tagline: z.string(),
  image: ImageRefSchema,
});
export type Category = z.infer<typeof CategorySchema>;

const LinkSchema = z.object({ label: z.string(), href: z.string() });
export type Link = z.infer<typeof LinkSchema>;

/** Homepage = ordered list of sections. Products are referenced by slug, or selected by rule. */
export const HomeSectionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("hero"),
    id: slug,
    product: slug,
    subtitle: z.string(),
    cta: LinkSchema.optional(),
    poster: ImageRefSchema,
    video: z.string().optional(),
  }),
  z.object({
    type: z.literal("best-sellers"),
    id: slug,
    title: z.string(),
    /** Editorial pick for the big home carousel; omitted → every best seller by rank. */
    products: z.array(slug).optional(),
  }),
  z.object({
    type: z.literal("category"),
    id: slug,
    category: CategorySlugSchema,
    /** Bento layout from Figma (each category section has its own arrangement). */
    layout: z.enum(["large-first", "large-side", "small-row"]),
    cta: LinkSchema,
  }),
  z.object({
    type: z.literal("banner"),
    id: slug,
    product: slug,
    title: z.string(),
    text: z.string(),
    image: ImageRefSchema,
    /** Portrait crop for < 810px with room for the text on top (art direction). */
    imageMobile: ImageRefSchema.optional(),
  }),
  z.object({
    type: z.literal("explore-categories"),
    id: slug,
    title: z.string(),
  }),
  z.object({
    type: z.literal("find-us"),
    id: slug,
    title: z.string(),
    retailer: z.string(),
    /** Retailer lockup (white on transparent); `retailer` is its alt text and the fallback. */
    retailerLogo: z.string().startsWith("/images/").optional(),
    cta: LinkSchema,
    image: ImageRefSchema,
  }),
]);
export type HomeSection = z.infer<typeof HomeSectionSchema>;

export const HomePageSchema = z.object({
  title: z.string(),
  description: z.string(),
  sections: z.array(HomeSectionSchema).min(1),
});
export type HomePage = z.infer<typeof HomePageSchema>;

export const NavigationSchema = z.object({
  main: z.array(LinkSchema).min(1),
  cta: LinkSchema,
  footer: z.object({
    columns: z.array(
      z.object({
        title: z.string(),
        links: z.array(LinkSchema).min(1),
        /** Links split into this many sub-columns from tablet up (Figma "Our Products"). */
        subColumns: z.union([z.literal(1), z.literal(2)]).default(1),
      }),
    ),
    copyright: z.string(),
    legal: LinkSchema,
  }),
});
export type Navigation = z.infer<typeof NavigationSchema>;

export const PlaceholderPageSchema = z.object({
  eyebrow: z.string(),
  text: z.string(),
  primaryCta: LinkSchema,
  secondaryCta: LinkSchema,
});
export type PlaceholderPage = z.infer<typeof PlaceholderPageSchema>;
