import { render, screen } from "@testing-library/react";

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;
let trigger: Callback = () => {};
const unobserve = vi.fn();

beforeAll(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: Callback) {
        trigger = callback;
      }
      observe = vi.fn();
      unobserve = unobserve;
      disconnect = vi.fn();
    },
  );
});
afterAll(() => vi.unstubAllGlobals());

describe("Reveal", () => {
  it("marks its content visible once, when it intersects", async () => {
    const { Reveal } = await import("@/components/motion/Reveal");
    render(
      <Reveal travel="md">
        <p>Kitchen</p>
      </Reveal>,
    );
    const wrapper = screen.getByText("Kitchen").parentElement!;
    expect(wrapper).toHaveAttribute("data-reveal", "md");
    expect(wrapper).not.toHaveAttribute("data-visible");

    trigger([{ isIntersecting: false, target: wrapper }]);
    expect(wrapper).not.toHaveAttribute("data-visible");

    trigger([{ isIntersecting: true, target: wrapper }]);
    expect(wrapper).toHaveAttribute("data-visible");
    expect(unobserve).toHaveBeenCalledWith(wrapper);
  });
});
