import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ColourSelector } from "@/components/product/ColourSelector";

const colours = [
  { name: "Black", value: "#1b1b1b" },
  { name: "Silver", value: "#c9cacc" },
  { name: "Red", value: "#de2027" },
];

describe("ColourSelector", () => {
  it("is a radio group labelled with the selected colour, first one selected", () => {
    render(<ColourSelector colours={colours} />);
    expect(screen.getByRole("group", { name: "Colour - Black" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Black" })).toBeChecked();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("updates the selected state and the label on click", async () => {
    const user = userEvent.setup();
    render(<ColourSelector colours={colours} />);
    await user.click(screen.getByRole("radio", { name: "Silver" }));

    expect(screen.getByRole("radio", { name: "Silver" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Black" })).not.toBeChecked();
    expect(screen.getByRole("group", { name: "Colour - Silver" })).toBeInTheDocument();
  });

  it("moves the selection with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<ColourSelector colours={colours} />);
    await user.tab();
    expect(screen.getByRole("radio", { name: "Black" })).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Silver" })).toBeChecked();
    expect(screen.getByRole("group", { name: "Colour - Silver" })).toBeInTheDocument();
  });
});
