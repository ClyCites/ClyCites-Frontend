"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { hasEntityPermission, hasPermission, hasWorkspaceAccess, listAccessibleWorkspaces } from "@/lib/store";
import { useAuthStore, type LastSessionProfile } from "@/lib/store/auth.store";
import type { AuthSession, EntityKey, Permission, WorkspaceId } from "@/lib/store/types";

interface SessionContextValue {
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasStaleSession: boolean;
  lastProfile: LastSessionProfile | null;
  availableWorkspaces: WorkspaceId[];
  activeWorkspace: WorkspaceId | null;
  login: (email: string, password: string) => Promise<AuthSession>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  clearStaleSession: () => Promise<void>;
  switchWorkspace: (workspace: WorkspaceId) => Promise<void>;
  can: (permission: Permission) => boolean;
  canAccessWorkspace: (workspace: WorkspaceId) => boolean;
  canAccessEntity: (entity: EntityKey, action: "read" | "write" | "delete" | "status") => boolean;
}

export function MockSessionProvider({ children }: { children: ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return <>{children}</>;
}

export function useMockSession(): SessionContextValue {
  const session = useAuthStore((state) => state.session);
  const isLoading = useAuthStore((state) => state.isLoading);
  const hasStaleSession = useAuthStore((state) => state.hasStaleSession);
  const lastProfile = useAuthStore((state) => state.lastProfile);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const refresh = useAuthStore((state) => state.refresh);
  const clearStaleSession = useAuthStore((state) => state.clearStaleSession);
  const switchWorkspace = useAuthStore((state) => state.switchWorkspace);

  const availableWorkspaces = useMemo(() => {
    if (!session) return [];
    return listAccessibleWorkspaces(session.user, session.organization);
  }, [session]);

  return {
    session,
    isLoading,
    isAuthenticated: Boolean(session),
    hasStaleSession,
    lastProfile,
    availableWorkspaces,
    activeWorkspace: session?.activeWorkspace ?? null,
    login,
    logout,
    refresh,
    clearStaleSession,
    switchWorkspace,
    can: (permission) => (session ? hasPermission(session.user, permission) : false),
    canAccessWorkspace: (workspace) => (session ? hasWorkspaceAccess(session.user, session.organization, workspace) : false),
    canAccessEntity: (entity, action) => (session ? hasEntityPermission(session.user, entity, action) : false),
  };
}
