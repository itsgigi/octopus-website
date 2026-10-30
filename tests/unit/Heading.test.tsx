import { render, screen } from "@testing-library/react";
import { Heading } from "@/components/ui/Heading";
import { Logo } from "@/components/ui/Logo";

describe("Heading", () => {
  it("keeps semantic level independent from visual size", () => {
    render(
      <Heading as="h1" size="h3">
        Best sellers
      </Heading>,
    );
    const heading = screen.getByRole("heading", { level: 1, name: "Best sellers" });
    expect(heading).toHaveClass("text-h3");
  });
});

describe("Logo", () => {
  it.each(["full", "stacked", "mark"] as const)(
    "has the accessible name Octopus (%s)",
    (variant) => {
      render(
        <a href="#top">
          <Logo variant={variant} />
        </a>,
      );
      expect(screen.getByRole("link", { name: "Octopus" })).toBeInTheDocument();
    },
  );
});
