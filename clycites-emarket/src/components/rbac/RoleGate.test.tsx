import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { RoleGate } from "./RoleGate";
import { useAuth } from "@/lib/auth/auth-context";

const replaceSpy = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceSpy,
    push: vi.fn(),
  }),
}));

vi.mock("@/lib/auth/auth-context", () => ({
  useAuth: vi.fn(),
}));

describe("RoleGate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders protected content when role is allowed", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: true,
      role: "super_admin",
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
      hasRole: vi.fn(),
      hasAnyRole: vi.fn(),
    });

    render(
      <RoleGate allowedRoles={["super_admin"]}>
        <div>Protected content</div>
      </RoleGate>
    );

    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });

  it("shows access error when role is not allowed", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: true,
      role: "farmer",
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
      hasRole: vi.fn(),
      hasAnyRole: vi.fn(),
    });

    render(
      <RoleGate allowedRoles={["super_admin"]}>
        <div>Protected content</div>
      </RoleGate>
    );

    expect(screen.getByText("Insufficient permissions")).toBeInTheDocument();
  });
});
