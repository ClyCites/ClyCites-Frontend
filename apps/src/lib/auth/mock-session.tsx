"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authService } from "@/lib/api";
import { WORKSPACES } from "@/lib/store/catalog";
import { hasEntityPermission, hasPermission, hasWorkspaceAccess } from "@/lib/store";
import type { AuthSession, EntityKey, Permission, WorkspaceId } from "@/lib/store/types";

const LAST_PROFILE_KEY = "clycites.auth.last-profile";

interface LastSessionProfile {
  name: string;
  email: string;
  workspace: WorkspaceId;
  capturedAt: string;
}

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

const SessionContext = createContext<SessionContextValue | null>(null);

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readLastProfile(): LastSessionProfile | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(LAST_PROFILE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LastSessionProfile;
  } catch {
    return null;
  }
}

function writeLastProfile(session: AuthSession): LastSessionProfile {
  const profile: LastSessionProfile = {
    name: session.user.name,
    email: session.user.email,
    workspace: session.activeWorkspace,
    capturedAt: new Date().toISOString(),
  };
  if (isBrowser()) {
    window.localStorage.setItem(LAST_PROFILE_KEY, JSON.stringify(profile));
  }
  return profile;
}

function clearLastProfile(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(LAST_PROFILE_KEY);
}

export function MockSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [hasStaleSession, setHasStaleSession] = useState(false);
  const [lastProfile, setLastProfile] = useState<LastSessionProfile | null>(() => readLastProfile());
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const current = await authService.me();
      setSession(current);
      if (current) {
        setHasStaleSession(false);
        setLastProfile(writeLastProfile(current));
      } else {
        setHasStaleSession(authService.hasToken());
      }
    } catch {
      setSession(null);
      setHasStaleSession(authService.hasToken());
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
      setHasStaleSession(false);
      setLastProfile(writeLastProfile(next));
      return next;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout(session?.user.id);
    setSession(null);
    setHasStaleSession(false);
    setLastProfile(null);
    clearLastProfile();
  }, [session]);

  const clearStaleSession = useCallback(async () => {
    await authService.logout();
    setSession(null);
    setHasStaleSession(false);
    setLastProfile(null);
    clearLastProfile();
  }, []);

  const switchWorkspace = useCallback(async (workspace: WorkspaceId) => {
    const next = await authService.switchWorkspace(workspace);
    setSession(next);
    setHasStaleSession(false);
    setLastProfile(writeLastProfile(next));
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
  }, [
    availableWorkspaces,
    clearStaleSession,
    hasStaleSession,
    isLoading,
    lastProfile,
    login,
    logout,
    refresh,
    session,
    switchWorkspace,
  ]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useMockSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useMockSession must be used within MockSessionProvider");
  }
  return context;
}
