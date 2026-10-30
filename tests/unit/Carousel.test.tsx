import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Carousel } from "@/components/carousel/Carousel";

const SLIDE = 300;

/** jsdom has no layout: fake a 3-slide track, 300px per slide, showing one slide at a time. */
function fakeLayout(track: HTMLElement) {
  Object.defineProperty(track, "clientWidth", { value: SLIDE, configurable: true });
  Object.defineProperty(track, "scrollWidth", { value: SLIDE * 3, configurable: true });
  [...track.children].forEach((slide, i) =>
    Object.defineProperties(slide, {
      offsetLeft: { value: i * SLIDE, configurable: true },
      offsetWidth: { value: SLIDE, configurable: true },
    }),
  );
  track.scrollTo = vi.fn(({ left }: ScrollToOptions) => {
    track.scrollLeft = left ?? 0;
    track.dispatchEvent(new Event("scroll"));
  }) as unknown as typeof track.scrollTo;
}

function setup() {
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
    cb(0);
    return 0;
  });
  const user = userEvent.setup();
  render(
    <Carousel label="Best sellers">
      <p>Air Fryer</p>
      <p>Indoor Camera</p>
      <p>Hair Dryer</p>
    </Carousel>,
  );
  const region = screen.getByRole("group", { name: "Best sellers" });
  const track = screen.getByRole("group", { name: "1 of 3" }).parentElement!;
  fakeLayout(track);
  return {
    user,
    region,
    track,
    prev: screen.getByRole("button", { name: "Previous slide" }),
    next: screen.getByRole("button", { name: "Next slide" }),
  };
}

afterEach(() => vi.restoreAllMocks());

describe("Carousel", () => {
  it("is a labelled carousel group with numbered slides", () => {
    const { region } = setup();
    expect(region).toHaveAttribute("aria-roledescription", "carousel");
    expect(screen.getByRole("group", { name: "1 of 3" })).toHaveAttribute(
      "aria-roledescription",
      "slide",
    );
  });

  it("starts with Previous disabled and has no pagination dots", () => {
    const { prev, next } = setup();
    expect(prev).toBeDisabled();
    expect(next).toBeEnabled();
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("moves to the next slide and enables Previous", async () => {
    const { user, track, prev, next } = setup();
    await user.click(next);
    expect(track.scrollTo).toHaveBeenCalledWith({ left: SLIDE });
    expect(prev).toBeEnabled();
  });

  it("disables Next at the end", async () => {
    const { user, track, next } = setup();
    await user.click(next);
    await user.click(next);
    expect(track.scrollTo).toHaveBeenLastCalledWith({ left: SLIDE * 2 });
    expect(next).toBeDisabled();
  });

  it("follows native scrolling (swipe / trackpad)", async () => {
    const { user, track, prev } = setup();
    act(() => {
      track.scrollLeft = SLIDE;
      track.dispatchEvent(new Event("scroll"));
    });
    expect(prev).toBeEnabled();
    // Arrows continue from where the user scrolled to.
    await user.click(prev);
    expect(track.scrollTo).toHaveBeenLastCalledWith({ left: 0 });
  });

  it("keeps the track keyboard-focusable", () => {
    const { track } = setup();
    expect(track).toHaveAttribute("tabindex", "0");
  });
});

describe("Carousel with several slides visible", () => {
  it("stops Next at the last reachable position, not the last slide", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0);
      return 0;
    });
    render(
      <Carousel label="Best sellers">
        {["A", "B", "C", "D"].map((name) => (
          <p key={name}>{name}</p>
        ))}
      </Carousel>,
    );
    const track = screen.getByRole("group", { name: "1 of 4" }).parentElement!;
    // 4 slides of 100px with a 20px gap in a 340px track → 3 visible → 2 positions.
    Object.defineProperty(track, "clientWidth", { value: 340, configurable: true });
    Object.defineProperty(track, "scrollWidth", { value: 460, configurable: true });
    [...track.children].forEach((slide, i) =>
      Object.defineProperties(slide, {
        offsetLeft: { value: i * 120, configurable: true },
        offsetWidth: { value: 100, configurable: true },
      }),
    );
    track.scrollTo = vi.fn(({ left }: ScrollToOptions) => {
      track.scrollLeft = Math.min(left ?? 0, 120);
      track.dispatchEvent(new Event("scroll"));
    }) as unknown as typeof track.scrollTo;
    act(() => track.dispatchEvent(new Event("scroll")));
    const next = screen.getByRole("button", { name: "Next slide" });
    await user.click(next);
    expect(track.scrollTo).toHaveBeenLastCalledWith({ left: 120 });
    expect(next).toBeDisabled();
  });
});
