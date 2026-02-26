"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { authApi } from "@/lib/api/endpoints/auth.api";
import { getToken, registerUnauthorizedHandler, removeToken } from "@/lib/api/http";
import type { User, AuthTokens, UserRole } from "@/lib/api/types/shared.types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const me = await authApi.me();
      setUser(me);
    } catch {
      setUser(null);
      removeToken();
    }
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      removeToken();
      setUser(null);
    });

    return () => registerUnauthorizedHandler(null);
  }, []);

  // On mount — if token exists, load user
  useEffect(() => {
    let isMounted = true;
    
    const loadUser = async () => {
      const token = getToken();
      if (token) {
        try {
          const me = await authApi.me();
          if (isMounted) setUser(me);
        } catch {
          if (isMounted) {
            setUser(null);
            removeToken();
          }
        }
      }
      if (isMounted) setIsLoading(false);
    };
    
    loadUser();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    if ((res as AuthTokens & { user?: User }).user) {
      setUser((res as AuthTokens & { user?: User }).user ?? null);
    } else {
      await refreshUser();
    }
  }, [refreshUser]);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const hasRole = useCallback((role: UserRole) => user?.role === role, [user]);

  const hasAnyRole = useCallback(
    (roles: UserRole[]) => (user?.role ? roles.includes(user.role) : false),
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        role: user?.role ?? null,
        login,
        logout,
        refreshUser,
        hasRole,
        hasAnyRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
