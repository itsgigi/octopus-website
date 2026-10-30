// One IntersectionObserver shared by every <Reveal>: cheaper than one observer per element.
let observer: IntersectionObserver | null = null;

function getObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        // Set on the DOM directly: the reveal is pure CSS, no React re-render needed.
        (entry.target as HTMLElement).dataset.visible = "";
        observer?.unobserve(entry.target); // no replay (DS §8)
      }
    },
    // Fire a bit after the top edge enters the viewport.
    { rootMargin: "0px 0px -10% 0px" },
  );
  return observer;
}

/** Starts observing `element`; returns the cleanup. No-op where IntersectionObserver is missing. */
export function observeReveal(element: HTMLElement) {
  if (typeof IntersectionObserver === "undefined") {
    element.dataset.visible = "";
    return () => {};
  }
  const io = getObserver();
  io.observe(element);
  return () => io.unobserve(element);
}
