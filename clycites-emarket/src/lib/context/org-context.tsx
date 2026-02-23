"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export interface Organization {
  id: string;
  name: string;
  type: "personal" | "cooperative" | "enterprise" | "ngo";
  tier: "free" | "premium" | "enterprise";
  role: string;
  permissions?: string[];
}

interface OrgContextValue {
  organizations: Organization[];
  currentOrg: Organization | null;
  currentOrgId: string | null;
  switchOrg: (orgId: string) => void;
  isLoading: boolean;
}

const OrgContext = createContext<OrgContextValue | null>(null);

const STORAGE_KEY = "clycites_current_org";

// Mock organizations for development
const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: "org_personal_001",
    name: "My Farm",
    type: "personal",
    tier: "free",
    role: "owner",
    permissions: ["market.listing.create", "farmers.farm.create"],
  },
  {
    id: "org_coop_001",
    name: "Kampala Farmers Cooperative",
    type: "cooperative",
    tier: "premium",
    role: "member",
    permissions: [
      "market.listing.create",
      "farmers.farm.create",
      "analytics.dashboard.read",
    ],
  },
  {
    id: "org_enterprise_001",
    name: "Uganda Agro Enterprises",
    type: "enterprise",
    tier: "enterprise",
    role: "admin",
    permissions: [
      "market.listing.create",
      "farmers.farm.read",
      "analytics.dashboard.read",
      "analytics.dashboard.create",
      "admin.user.read",
      "research.dataset.read",
    ],
  },
];

export function OrgProvider({ children }: { children: ReactNode }) {
  const [organizations] = useState<Organization[]>(MOCK_ORGANIZATIONS);
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved org from localStorage on mount
  useEffect(() => {
    const savedOrgId = localStorage.getItem(STORAGE_KEY);
    if (savedOrgId && organizations.some((org) => org.id === savedOrgId)) {
      setCurrentOrgId(savedOrgId);
    } else if (organizations.length > 0) {
      // Default to first org
      setCurrentOrgId(organizations[0].id);
    }
    setIsLoading(false);
  }, [organizations]);

  const switchOrg = useCallback((orgId: string) => {
    setCurrentOrgId(orgId);
    localStorage.setItem(STORAGE_KEY, orgId);
    // In production, this would trigger data refresh for new org context
  }, []);

  const currentOrg = organizations.find((org) => org.id === currentOrgId) ?? null;

  return (
    <OrgContext.Provider
      value={{
        organizations,
        currentOrg,
        currentOrgId,
        switchOrg,
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
