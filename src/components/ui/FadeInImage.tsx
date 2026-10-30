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
