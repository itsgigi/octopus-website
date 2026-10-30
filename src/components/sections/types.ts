import type { ResolvedHomeSection } from "@/lib/data/home";

/** Props type of one resolved homepage section, e.g. `SectionOf<"hero">`. */
export type SectionOf<T extends ResolvedHomeSection["type"]> = Extract<
  ResolvedHomeSection,
  { type: T }
>;
