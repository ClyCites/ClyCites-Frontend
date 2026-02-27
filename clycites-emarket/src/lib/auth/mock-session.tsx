"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authService } from "@/lib/api/mock";
import { WORKSPACES } from "@/lib/store/catalog";
import { hasEntityPermission, hasPermission, hasWorkspaceAccess } from "@/lib/store";
import type { AuthSession, EntityKey, Permission, WorkspaceId } from "@/lib/store/types";

interface SessionContextValue {
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  availableWorkspaces: WorkspaceId[];
  activeWorkspace: WorkspaceId | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  switchWorkspace: (workspace: WorkspaceId) => Promise<void>;
  can: (permission: Permission) => boolean;
  canAccessWorkspace: (workspace: WorkspaceId) => boolean;
  canAccessEntity: (entity: EntityKey, action: "read" | "write" | "delete" | "status") => boolean;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function MockSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const current = await authService.me();
      setSession(current);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const next = await authService.login(email, password);
      setSession(next);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    if (session) {
      await authService.logout(session.user.id);
    }
    setSession(null);
  }, [session]);

  const switchWorkspace = useCallback(async (workspace: WorkspaceId) => {
    const next = await authService.switchWorkspace(workspace);
    setSession(next);
  }, []);

  const availableWorkspaces = useMemo(() => {
    if (!session) return [];

    return WORKSPACES
      .map((workspace) => workspace.id)
      .filter((workspace) => hasWorkspaceAccess(session.user, session.organization, workspace));
  }, [session]);

  const value = useMemo<SessionContextValue>(() => {
    return {
      session,
      isLoading,
      isAuthenticated: Boolean(session),
      availableWorkspaces,
      activeWorkspace: session?.activeWorkspace ?? null,
      login,
      logout,
      refresh,
      switchWorkspace,
      can: (permission) => (session ? hasPermission(session.user, permission) : false),
      canAccessWorkspace: (workspace) => (session ? hasWorkspaceAccess(session.user, session.organization, workspace) : false),
      canAccessEntity: (entity, action) => (session ? hasEntityPermission(session.user, entity, action) : false),
    };
  }, [availableWorkspaces, isLoading, login, logout, refresh, session, switchWorkspace]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useMockSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useMockSession must be used within MockSessionProvider");
  }
  return context;
}
