"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import { api, setCurrentOrgId } from "@/lib/api/http";
import { useAuth } from "@/lib/auth/auth-context";

export interface Organization {
  id: string;
  name: string;
  type: "personal" | "cooperative" | "enterprise" | "ngo" | "company" | "association";
  tier: "free" | "premium" | "enterprise";
  role: string;
  permissions?: string[];
}

interface OrgContextValue {
  organizations: Organization[];
  currentOrg: Organization | null;
  currentOrgId: string | null;
  switchOrg: (orgId: string) => void;
  refreshOrganizations: () => Promise<void>;
  isLoading: boolean;
}

const OrgContext = createContext<OrgContextValue | null>(null);

const STORAGE_KEY = "clycites_current_org";

type RawOrganization = {
  id?: string;
  _id?: string;
  name: string;
  type?: Organization["type"];
  role?: string;
  tier?: Organization["tier"];
};

function inferTier(type: RawOrganization["type"]): Organization["tier"] {
  if (type === "company") return "enterprise";
  if (type === "cooperative" || type === "association") return "premium";
  return "free";
}

function normalizeOrganizations(raw: RawOrganization[]): Organization[] {
  return raw
    .filter((org) => !!(org.id ?? org._id))
    .map((org) => ({
      id: org.id ?? org._id ?? "",
      name: org.name,
      type: (org.type ?? "company") as Organization["type"],
      tier: org.tier ?? inferTier(org.type),
      role: org.role ?? "member",
      permissions: [],
    }));
}

export function OrgProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrgId, setOrgId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshOrganizations = useCallback(async () => {
    if (!isAuthenticated) {
      setOrganizations([]);
      setOrgId(null);
      setCurrentOrgId(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const result = await api.get<RawOrganization[]>("/organizations/me");
      const normalized = normalizeOrganizations(result);

      const fallbackOrg: Organization = {
        id: `org-personal-${user?.id ?? "default"}`,
        name: "Personal Workspace",
        type: "personal",
        tier: "free",
        role: user?.role ?? "member",
        permissions: [],
      };

      const merged = normalized.length > 0 ? normalized : [fallbackOrg];
      setOrganizations(merged);

      const savedOrg = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      const nextOrg = merged.find((org) => org.id === savedOrg)?.id ?? merged[0]?.id ?? null;
      setOrgId(nextOrg);
      setCurrentOrgId(nextOrg);
    } catch {
      const fallbackOrg: Organization = {
        id: `org-personal-${user?.id ?? "default"}`,
        name: "Personal Workspace",
        type: "personal",
        tier: "free",
        role: user?.role ?? "member",
        permissions: [],
      };
      setOrganizations([fallbackOrg]);
      setOrgId(fallbackOrg.id);
      setCurrentOrgId(fallbackOrg.id);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    refreshOrganizations();
  }, [refreshOrganizations]);

  const switchOrg = useCallback((orgId: string) => {
    setOrgId(orgId);
    setCurrentOrgId(orgId);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, orgId);
    }
  }, []);

  const currentOrg = useMemo(
    () => organizations.find((org) => org.id === currentOrgId) ?? null,
    [organizations, currentOrgId]
  );

  return (
    <OrgContext.Provider
      value={{
        organizations,
        currentOrg,
        currentOrgId,
        switchOrg,
        refreshOrganizations,
        isLoading,
      }}
    >
      {children}
    </OrgContext.Provider>
  );
}

export function useOrg(): OrgContextValue {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error("useOrg must be used inside <OrgProvider>");
  return ctx;
}
