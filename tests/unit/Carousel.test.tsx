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
  const region = screen.getByRole("region", { name: "Best sellers" });
  const track = screen.getAllByRole("group")[0]!.parentElement!;
  fakeLayout(track);
  return {
    user,
    region,
    track,
    prev: screen.getByRole("button", { name: "Previous slide" }),
    next: screen.getByRole("button", { name: "Next slide" }),
    dots: screen.getAllByRole("button", { name: /Go to slide/ }),
  };
}

afterEach(() => vi.restoreAllMocks());

describe("Carousel", () => {
  it("is a labelled carousel region with numbered slides", () => {
    const { region } = setup();
    expect(region).toHaveAttribute("aria-roledescription", "carousel");
    expect(screen.getByRole("group", { name: "1 of 3" })).toHaveAttribute(
      "aria-roledescription",
      "slide",
    );
  });

  it("starts with Previous disabled and the first dot current", () => {
    const { prev, next, dots } = setup();
    expect(prev).toBeDisabled();
    expect(next).toBeEnabled();
    expect(dots).toHaveLength(3);
    expect(dots[0]).toHaveAttribute("aria-current", "true");
  });

  it("moves to the next slide and enables Previous", async () => {
    const { user, track, prev, next, dots } = setup();
    await user.click(next);
    expect(track.scrollTo).toHaveBeenCalledWith({ left: SLIDE });
    expect(prev).toBeEnabled();
    expect(dots[1]).toHaveAttribute("aria-current", "true");
  });

  it("disables Next at the end", async () => {
    const { user, next, dots } = setup();
    await user.click(dots[2]!);
    expect(next).toBeDisabled();
    expect(dots[2]).toHaveAttribute("aria-current", "true");
  });

  it("follows native scrolling (swipe / trackpad)", () => {
    const { track, prev, dots } = setup();
    act(() => {
      track.scrollLeft = SLIDE;
      track.dispatchEvent(new Event("scroll"));
    });
    expect(prev).toBeEnabled();
    expect(dots[1]).toHaveAttribute("aria-current", "true");
  });

  it("keeps the track keyboard-focusable", () => {
    const { track } = setup();
    expect(track).toHaveAttribute("tabindex", "0");
  });
});

describe("Carousel with several slides visible", () => {
  it("shows one dot per reachable position, not per slide", () => {
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
    const track = screen.getAllByRole("group")[0]!.parentElement!;
    // 4 slides of 100px with a 20px gap in a 340px track → 3 visible → 2 positions.
    Object.defineProperty(track, "clientWidth", { value: 340, configurable: true });
    Object.defineProperty(track, "scrollWidth", { value: 460, configurable: true });
    [...track.children].forEach((slide, i) =>
      Object.defineProperties(slide, {
        offsetLeft: { value: i * 120, configurable: true },
        offsetWidth: { value: 100, configurable: true },
      }),
    );
    act(() => track.dispatchEvent(new Event("scroll")));
    expect(screen.getAllByRole("button", { name: /Go to slide/ })).toHaveLength(2);
  });
});
