import { CREDENTIAL_HINTS } from "@/lib/store/catalog";
import { login as loginStore, logout as logoutStore, resolveSession, updateSessionWorkspace } from "@/lib/store";
import type { AuthSession, WorkspaceId } from "@/lib/store/types";

const SESSION_TOKEN_KEY = "clycites.session.token";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readToken(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(SESSION_TOKEN_KEY);
}

function writeToken(token: string): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(SESSION_TOKEN_KEY, token);
}

function clearToken(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(SESSION_TOKEN_KEY);
}

export const authService = {
  async login(email: string, password: string): Promise<AuthSession> {
    const loginResult = await loginStore(email, password);
    writeToken(loginResult.token);
    return resolveSession(loginResult.token);
  },

  async me(): Promise<AuthSession | null> {
    const token = readToken();
    if (!token) return null;

    try {
      return await resolveSession(token);
    } catch {
      clearToken();
      return null;
    }
  },

  async logout(actorId: string): Promise<void> {
    const token = readToken();
    if (!token) return;

    try {
      await logoutStore(token, actorId);
    } finally {
      clearToken();
    }
  },

  async switchWorkspace(workspace: WorkspaceId): Promise<AuthSession> {
    const token = readToken();
    if (!token) {
      throw new Error("No active session token");
    }

    return updateSessionWorkspace(token, workspace);
  },

  getCredentials() {
    return CREDENTIAL_HINTS;
  },

  hasToken(): boolean {
    return Boolean(readToken());
  },
};
