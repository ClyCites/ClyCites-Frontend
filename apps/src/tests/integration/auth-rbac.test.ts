import { describe, expect, it } from "vitest";
import { authService } from "@/lib/api/mock/auth";
import { hasWorkspaceAccess, listAccessibleWorkspaces } from "@/lib/store";

describe("Auth and RBAC", () => {
  it("logs in, switches workspace, and preserves session token", async () => {
    const session = await authService.login("ops@clycites.com", "ops12345");

    expect(session.user.email).toBe("ops@clycites.com");
    expect(authService.hasToken()).toBe(true);

    const switched = await authService.switchWorkspace("analytics");
    expect(switched.activeWorkspace).toBe("analytics");

    const current = await authService.me();
    expect(current?.activeWorkspace).toBe("analytics");
  });

  it("enforces role workspace boundaries", async () => {
    const farmerSession = await authService.login("farmer@clycites.com", "farmer123");
    expect(listAccessibleWorkspaces(farmerSession.user, farmerSession.organization)).toEqual(["farmer"]);
    expect(hasWorkspaceAccess(farmerSession.user, farmerSession.organization, "farmer")).toBe(true);
    expect(hasWorkspaceAccess(farmerSession.user, farmerSession.organization, "admin")).toBe(false);
  });

  it("blocks switching into a workspace outside the user's role permissions", async () => {
    await authService.login("farmer@clycites.com", "farmer123");
    await expect(authService.switchWorkspace("admin")).rejects.toThrow(/access/i);
  });

  it("returns reminder policy when MFA is not enabled and rejects bad credentials", async () => {
    const policy = authService.getMfaPolicy("unknown@clycites.com");
    expect(policy.requiresMfa).toBe(false);
    expect(policy.challengeHint.toLowerCase()).toContain("disabled");

    await expect(authService.login("ops@clycites.com", "bad-password")).rejects.toThrow();
  });
});
