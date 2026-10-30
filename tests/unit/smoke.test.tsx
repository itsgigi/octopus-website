import { render, screen } from "@testing-library/react";

describe("test setup", () => {
  it("renders with jest-dom matchers", () => {
    render(<p>Octopus</p>);
    expect(screen.getByText("Octopus")).toBeInTheDocument();
  });
});
