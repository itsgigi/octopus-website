import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MobileMenu } from "@/components/layout/MobileMenu";

const navigation = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => navigation.pathname }));

const links = [
  { label: "Kitchen", href: "/#kitchen" },
  { label: "Accessories", href: "/#accessories" },
];
const cta = { label: "Where to buy", href: "/placeholder/where-to-buy" };

function setup() {
  const user = userEvent.setup();
  const view = render(<MobileMenu links={links} cta={cta} />);
  const toggle = screen.getByRole("button", { name: "Menu" });
  return { user, toggle, ...view };
}

beforeEach(() => {
  navigation.pathname = "/";
});

describe("MobileMenu", () => {
  it("starts closed with the links hidden", () => {
    const { toggle } = setup();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "Kitchen" })).not.toBeInTheDocument();
  });

  it("opens on click and points aria-controls at the panel", async () => {
    const { user, toggle } = setup();
    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const panel = document.getElementById(toggle.getAttribute("aria-controls")!);
    expect(panel).toBeVisible();
    expect(screen.getByRole("link", { name: "Kitchen" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Where to buy" })).toBeVisible();
  });

  it("closes on Escape and returns focus to the toggle", async () => {
    const { user, toggle } = setup();
    await user.click(toggle);
    await user.tab();
    await user.keyboard("{Escape}");

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("works with the keyboard alone", async () => {
    const { user, toggle } = setup();
    toggle.focus();
    await user.keyboard("{Enter}");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await user.keyboard(" ");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("traps focus inside the open menu", async () => {
    const { user, toggle } = setup();
    await user.click(toggle);

    screen.getByRole("link", { name: "Where to buy" }).focus();
    await user.tab();
    expect(screen.getByRole("link", { name: "Octopus home" })).toHaveFocus();

    await user.tab({ shift: true });
    expect(screen.getByRole("link", { name: "Where to buy" })).toHaveFocus();
  });

  it("closes when a link is chosen", async () => {
    const { user, toggle } = setup();
    await user.click(toggle);
    await user.click(screen.getByRole("link", { name: "Kitchen" }));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("closes when the route changes", async () => {
    const { user, toggle, rerender } = setup();
    await user.click(toggle);

    navigation.pathname = "/products/octopus-countertop-blender";
    rerender(<MobileMenu links={links} cta={cta} />);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on a click outside", async () => {
    const { user, toggle } = setup();
    await user.click(toggle);
    await act(async () => {
      document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
