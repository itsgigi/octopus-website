import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";

describe("Button", () => {
  it("renders a link when href is set", () => {
    render(<Button href="/products/octopus-countertop-blender">Learn more</Button>);
    expect(screen.getByRole("link", { name: "Learn more" })).toHaveAttribute(
      "href",
      "/products/octopus-countertop-blender",
    );
  });

  it("renders a type=button by default and fires onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Where to buy</Button>);
    const button = screen.getByRole("button", { name: "Where to buy" });
    expect(button).toHaveAttribute("type", "button");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Sold out
      </Button>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Sold out" }));
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("IconButton", () => {
  it("exposes its label as the accessible name and hides the icon", () => {
    const { container } = render(<IconButton icon="chevron-right" label="Next slide" />);
    expect(screen.getByRole("button", { name: "Next slide" })).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});
