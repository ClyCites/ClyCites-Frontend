"use client";

import { EntityManager, type EntityManagerFeatureFlags } from "@/components/entities/EntityManager";
import type { EntityKey } from "@/lib/store/types";

interface ProductionEntityPageProps {
  entityKey: EntityKey;
  features?: EntityManagerFeatureFlags;
}

export function ProductionEntityPage({ entityKey, features }: ProductionEntityPageProps) {
  return <EntityManager workspaceId="production" entityKey={entityKey} features={features} />;
}
