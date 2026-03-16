"use client";

import { create } from "zustand";
import { authService } from "@/lib/api";
import { hasEntityPermission, hasPermission, hasWorkspaceAccess, listAccessibleWorkspaces } from "@/lib/store";
import type { AuthSession, EntityKey, Permission, WorkspaceId } from "@/lib/store/types";

const LAST_PROFILE_KEY = "clycites.auth.last-profile";

export interface LastSessionProfile {
  name: string;
  email: string;
  workspace: WorkspaceId;
  capturedAt: string;
}

interface AuthStoreState {
  session: AuthSession | null;
  isLoading: boolean;
  hasStaleSession: boolean;
  lastProfile: LastSessionProfile | null;
  initialized: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<AuthSession>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  clearStaleSession: () => Promise<void>;
  switchWorkspace: (workspace: WorkspaceId) => Promise<void>;
  can: (permission: Permission) => boolean;
  canAccessWorkspace: (workspace: WorkspaceId) => boolean;
  canAccessEntity: (entity: EntityKey, action: "read" | "write" | "delete" | "status") => boolean;
  getAvailableWorkspaces: () => WorkspaceId[];
}

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

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  session: null,
  isLoading: true,
  hasStaleSession: false,
  lastProfile: readLastProfile(),
  initialized: false,
  initialize: async () => {
    if (get().initialized && !get().hasStaleSession && get().session) {
      return;
    }
    await get().refresh();
    set({ initialized: true });
  },
  refresh: async () => {
    set({ isLoading: true });
    try {
      const current = await authService.me();
      if (current) {
        set({
          session: current,
          hasStaleSession: false,
          lastProfile: writeLastProfile(current),
        });
      } else {
        set({
          session: null,
          hasStaleSession: authService.hasToken(),
        });
      }
    } catch {
      set({
        session: null,
        hasStaleSession: authService.hasToken(),
      });
    } finally {
      set({ isLoading: false });
    }
  },
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const next = await authService.login(email, password);
      set({
        session: next,
        hasStaleSession: false,
        lastProfile: writeLastProfile(next),
        initialized: true,
      });
      return next;
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    const session = get().session;
    await authService.logout(session?.user.id);
    clearLastProfile();
    set({
      session: null,
      hasStaleSession: false,
      lastProfile: null,
    });
  },
  clearStaleSession: async () => {
    await authService.logout();
    clearLastProfile();
    set({
      session: null,
      hasStaleSession: false,
      lastProfile: null,
    });
  },
  switchWorkspace: async (workspace) => {
    const next = await authService.switchWorkspace(workspace);
    set({
      session: next,
      hasStaleSession: false,
      lastProfile: writeLastProfile(next),
    });
  },
  can: (permission) => {
    const session = get().session;
    return session ? hasPermission(session.user, permission) : false;
  },
  canAccessWorkspace: (workspace) => {
    const session = get().session;
    return session ? hasWorkspaceAccess(session.user, session.organization, workspace) : false;
  },
  canAccessEntity: (entity, action) => {
    const session = get().session;
    return session ? hasEntityPermission(session.user, entity, action) : false;
  },
  getAvailableWorkspaces: () => {
    const session = get().session;
    return session ? listAccessibleWorkspaces(session.user, session.organization) : [];
  },
}));
