"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";

type CarouselProps = {
  /** Accessible name of the carousel region, e.g. "Best sellers". */
  label: string;
  children: ReactNode;
  /** Width classes of each slide (token-based, per breakpoint). */
  slideClassName?: string;
};

/** `positions` = scroll stops actually reachable (slides minus those visible at once, plus one). */
type ScrollState = { index: number; positions: number; atStart: boolean; atEnd: boolean };

/**
 * Native horizontal scroll with CSS scroll-snap (swipe and trackpad for free), plus arrows that
 * are disabled at the ends and pagination dots. Full-bleed track aligned to the page grid.
 */
export function Carousel({ label, children, slideClassName }: CarouselProps) {
  const slides = Children.toArray(children);
  const trackRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<ScrollState>({
    index: 0,
    positions: slides.length,
    atStart: true,
    atEnd: false,
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;

    function measure() {
      if (!track) return;
      const items = [...track.children] as HTMLElement[];
      const origin = items[0]?.offsetLeft ?? 0;
      const max = track.scrollWidth - track.clientWidth;
      const atStart = track.scrollLeft <= 1;
      const atEnd = track.scrollLeft >= max - 1;
      const first = items[0];
      const step = items[1] && first ? items[1].offsetLeft - first.offsetLeft : track.clientWidth;
      const gap = first ? step - first.offsetWidth : 0;
      const visible = Math.max(1, Math.floor((track.clientWidth + gap) / step + 0.01));
      const positions = Math.max(1, items.length - visible + 1);
      let index = 0;
      let best = Infinity;
      items.forEach((item, i) => {
        const distance = Math.abs(item.offsetLeft - origin - track.scrollLeft);
        if (distance < best) [best, index] = [distance, i];
      });
      index = atEnd ? positions - 1 : Math.min(index, positions - 1);
      setState((prev) =>
        prev.index === index &&
        prev.positions === positions &&
        prev.atStart === atStart &&
        prev.atEnd === atEnd
          ? prev
          : { index, positions, atStart, atEnd },
      );
    }
    function schedule() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    }

    track.addEventListener("scroll", schedule, { passive: true });
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    observer?.observe(track);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", schedule);
      observer?.disconnect();
    };
  }, []);

  function goTo(index: number) {
    const track = trackRef.current;
    const items = track ? ([...track.children] as HTMLElement[]) : [];
    const target = items[Math.max(0, Math.min(index, items.length - 1))];
    if (!track || !target || !items[0]) return;
    // Smoothness comes from CSS `scroll-smooth`, which the reduced-motion reset turns off.
    track.scrollTo({ left: target.offsetLeft - items[0].offsetLeft });
  }

  return (
    // role=group (not a <section>/region): the surrounding section is already the landmark, and two
    // regions with the same name would be announced twice (APG carousel allows either role).
    <div role="group" aria-label={label} aria-roledescription="carousel">
      <div
        ref={trackRef}
        // Scrollable region must be keyboard-focusable (arrow keys scroll it natively).
        tabIndex={0}
        className="relative scrollbar-none flex snap-x snap-mandatory bleed-gutter gap-6 overflow-x-auto scroll-smooth py-1"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            className={cn("shrink-0 snap-start", slideClassName)}
          >
            {slide}
          </div>
        ))}
      </div>

      <Container className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center">
          {Array.from({ length: state.positions }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === state.index ? "true" : undefined}
              onClick={() => goTo(i)}
              className="group grid size-6 place-items-center rounded-full"
            >
              <span
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === state.index ? "w-6 bg-ink" : "w-2 bg-line group-hover:bg-ink-muted",
                )}
              />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <IconButton
            icon="chevron-left"
            label="Previous slide"
            disabled={state.atStart}
            onClick={() => goTo(state.index - 1)}
          />
          <IconButton
            icon="chevron-right"
            label="Next slide"
            disabled={state.atEnd}
            onClick={() => goTo(state.index + 1)}
          />
        </div>
      </Container>
    </div>
  );
}
