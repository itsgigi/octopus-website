import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FadeInImage } from "@/components/ui/FadeInImage";

describe("FadeInImage", () => {
  it("starts hidden and fades in on load", async () => {
    render(<FadeInImage src="/images/a.png" alt="Kettle" width={10} height={10} />);
    const img = screen.getByRole("img", { name: "Kettle" });
    expect(img).toHaveClass("opacity-0");
    fireEvent.load(img);
    // next/image calls onLoad after img.decode(), i.e. asynchronously.
    await waitFor(() => expect(img).toHaveClass("opacity-100"));
  });

  it("is visible when the image already loaded before hydration (no load event)", () => {
    const complete = vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true);
    const width = vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(10);
    render(<FadeInImage src="/images/a.png" alt="Kettle" width={10} height={10} />);
    expect(screen.getByRole("img", { name: "Kettle" })).toHaveClass("opacity-100");
    complete.mockRestore();
    width.mockRestore();
  });

  it("never hides the priority (LCP) image", () => {
    render(<FadeInImage src="/images/a.png" alt="Hero" width={10} height={10} priority />);
    expect(screen.getByRole("img", { name: "Hero" })).toHaveClass("opacity-100");
  });
});
