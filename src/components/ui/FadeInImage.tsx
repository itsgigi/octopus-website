"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

/** next/image that fades in once loaded. Only used when a real file exists (see ProductImage). */
export function FadeInImage({ alt, className, onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      {...props}
      alt={alt}
      // An image can finish loading before hydration, so `onLoad` never fires for it:
      // check `complete` when the element is attached, otherwise it would stay invisible.
      ref={(img) => {
        if (img?.complete && img.naturalWidth > 0) setLoaded(true);
      }}
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
      className={cn(
        "transition-opacity duration-500 ease-out",
        // The LCP image is never hidden: it must paint as soon as possible.
        loaded || props.priority ? "opacity-100" : "opacity-0",
        className,
      )}
    />
  );
}
