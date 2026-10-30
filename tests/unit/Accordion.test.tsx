import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SpecsAccordion } from "@/components/product/SpecsAccordion";

const specs = [
  { title: "Technical specifications", items: [{ label: "Power", value: "1500W" }] },
  { title: "Dimensions & weight", items: [{ label: "Weight", value: "4.6 kg" }] },
];

describe("Accordion", () => {
  it("renders every section collapsed, with aria-controls pointing at its region", () => {
    render(<SpecsAccordion specs={specs} />);
    const button = screen.getByRole("button", { name: "Technical specifications" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    const panel = document.getElementById(button.getAttribute("aria-controls")!);
    expect(panel).toHaveAttribute("role", "region");
    expect(panel).toHaveAttribute("inert");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("expands and collapses a section on click", async () => {
    const user = userEvent.setup();
    render(<SpecsAccordion specs={specs} />);
    const button = screen.getByRole("button", { name: "Technical specifications" });

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    const region = screen.getByRole("region", { name: "Technical specifications" });
    expect(region).not.toHaveAttribute("inert");
    expect(region).toHaveTextContent("Power:1500W");

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles sections independently and works from the keyboard", async () => {
    const user = userEvent.setup();
    render(<SpecsAccordion specs={specs} />);
    const first = screen.getByRole("button", { name: "Technical specifications" });
    const second = screen.getByRole("button", { name: "Dimensions & weight" });

    await user.click(first);
    second.focus();
    await user.keyboard("{Enter}");
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(second).toHaveAttribute("aria-expanded", "true");

    await user.keyboard(" ");
    expect(second).toHaveAttribute("aria-expanded", "false");
    expect(first).toHaveAttribute("aria-expanded", "true");
  });

  it("is a heading-wrapped button (navigable by heading)", () => {
    render(<SpecsAccordion specs={specs} />);
    expect(screen.getByRole("heading", { name: "Dimensions & weight" })).toBeInTheDocument();
  });
});
