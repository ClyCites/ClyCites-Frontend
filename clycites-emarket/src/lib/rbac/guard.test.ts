import { describe, expect, it } from "vitest";
import { canAccessRoute } from "./guard";

describe("canAccessRoute", () => {
  it("allows access when route has no role constraints", () => {
    expect(canAccessRoute("farmer")).toBe(true);
    expect(canAccessRoute(null)).toBe(true);
  });

  it("denies access when role is missing", () => {
    expect(canAccessRoute(null, ["super_admin"])).toBe(false);
  });

  it("allows access when role is explicitly permitted", () => {
    expect(canAccessRoute("super_admin", ["super_admin", "org_admin"])).toBe(true);
  });

  it("denies access when role is not permitted", () => {
    expect(canAccessRoute("farmer", ["super_admin", "org_admin"])).toBe(false);
  });
});
