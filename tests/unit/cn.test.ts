import { cn } from "@/lib/cn";

describe("cn", () => {
  it("keeps a custom font-size token next to a colour token", () => {
    expect(cn("text-h2", "text-ink")).toBe("text-h2 text-ink");
  });

  it("lets later classes override earlier ones", () => {
    expect(cn("px-4", false, "px-6")).toBe("px-6");
  });
});

describe("cn with custom aspect tokens", () => {
  it("lets a later aspect token override an earlier one at the same breakpoint", () => {
    expect(cn("md:aspect-card-large", "md:aspect-card-tall")).toBe("md:aspect-card-tall");
  });
});
