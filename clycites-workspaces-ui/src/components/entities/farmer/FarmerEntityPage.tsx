"use client";

import { EntityManager, type EntityManagerFeatureFlags } from "@/components/entities/EntityManager";
import type { EntityKey } from "@/lib/store/types";

interface FarmerEntityPageProps {
  entityKey: EntityKey;
  features?: EntityManagerFeatureFlags;
}

export function FarmerEntityPage({ entityKey, features }: FarmerEntityPageProps) {
  return <EntityManager workspaceId="farmer" entityKey={entityKey} features={features} />;
}

