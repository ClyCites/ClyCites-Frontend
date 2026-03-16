"use client";

import { useQuery } from "@tanstack/react-query";
import { farmersApi } from "@/lib/api/farmers.api";
import { useEntityResource } from "@/lib/hooks/useEntityResource";
import { queryKeys } from "@/lib/query/keys";
import type { FarmerListParams } from "@/lib/types/farmer.types";

export function useFarmers(options?: { listParams?: FarmerListParams; farmerId?: string; enabled?: boolean }) {
  return useEntityResource(farmersApi, {
    listParams: options?.listParams,
    recordId: options?.farmerId,
    listEnabled: options?.enabled,
    recordEnabled: options?.enabled,
  });
}

export function useFarmerStats(enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.entity.scope("farmer", "farmers"), "stats"],
    queryFn: () => farmersApi.getStats(),
    staleTime: 60_000,
    enabled,
  });
}
