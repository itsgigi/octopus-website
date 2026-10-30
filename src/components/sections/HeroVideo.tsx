"use client";

import { useEffect, useRef, useState } from "react";
import { IconButton } from "@/components/ui/IconButton";

type HeroVideoProps = { src: string; poster?: string };

/** Decorative background video with a pause control (WCAG 2.2.2). Never autoplays with reduced motion. */
export function HeroVideo({ src, poster }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.play().catch(() => {
      /* autoplay blocked: the play button stays available */
    });
  }, []);

  function toggle() {
    const video = ref.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  }

  return (
    <>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 -z-10 size-full object-cover"
      />
      <IconButton
        icon={playing ? "pause" : "play"}
        label={playing ? "Pause video" : "Play video"}
        size="lg"
        onClick={toggle}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      />
    </>
  );
}
