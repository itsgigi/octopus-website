"use client";

import { useId, useState } from "react";
import type { Colour } from "@/lib/types";

type ColourSelectorProps = {
  colours: Colour[];
  label?: string;
};

/**
 * Native radio group styled as swatches: arrow keys, roving focus and screen-reader semantics come
 * from the platform. The legend shows the selected colour ("Colour - Black").
 */
export function ColourSelector({ colours, label = "Colour" }: ColourSelectorProps) {
  const [selected, setSelected] = useState(colours[0]?.name ?? "");
  const name = useId();

  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="mb-4 text-body-lg font-book text-ink-muted">
        {label} - <span className="text-ink">{selected}</span>
      </legend>
      <div className="flex flex-wrap gap-3">
        {colours.map((colour) => (
          <label key={colour.name} className="relative cursor-pointer">
            <input
              type="radio"
              name={name}
              value={colour.name}
              checked={selected === colour.name}
              onChange={() => setSelected(colour.name)}
              className="peer sr-only"
            />
            <span className="sr-only">{colour.name}</span>
            <span
              aria-hidden
              // Swatch fill is product data (the colour itself), not a design token.
              style={{ backgroundColor: colour.value }}
              className="block size-7.5 rounded-full border border-line-swatch ring-offset-2 ring-offset-canvas transition-shadow peer-checked:ring-2 peer-checked:ring-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-focus-ring"
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
