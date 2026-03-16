import { apiRequest, unwrapApiData } from "@/lib/api/real/http";
import { createEntityResourceApi } from "@/lib/api/create-entity-resource-api";
import type { FarmerStats, UpsertFarmerInput } from "@/lib/types/farmer.types";

export const farmersApi = {
  ...createEntityResourceApi({
    entityKey: "farmers",
    workspaceId: "farmer",
    mapCreateInput: (input: UpsertFarmerInput) => ({
      title: input.businessName,
      subtitle: input.description,
      status: input.status,
      tags: input.tags,
      data: {
        location: {
          region: input.region,
          district: input.district,
          village: input.village,
          coordinates:
            input.latitude !== undefined || input.longitude !== undefined
              ? {
                  lat: input.latitude,
                  lng: input.longitude,
                }
              : undefined,
        },
        farmSize: input.farmSize,
        cropTypes: input.cropTypes ?? [],
      },
    }),
    mapUpdateInput: (input: Partial<UpsertFarmerInput>) => ({
      title: input.businessName,
      subtitle: input.description,
      tags: input.tags,
      data: {
        location:
          input.region || input.district || input.village || input.latitude !== undefined || input.longitude !== undefined
            ? {
                region: input.region,
                district: input.district,
                village: input.village,
                coordinates:
                  input.latitude !== undefined || input.longitude !== undefined
                    ? {
                        lat: input.latitude,
                        lng: input.longitude,
                      }
                    : undefined,
              }
            : undefined,
        farmSize: input.farmSize,
        cropTypes: input.cropTypes,
      },
    }),
  }),
  async getStats(): Promise<FarmerStats> {
    const payload = await apiRequest<unknown>("/api/v1/farmers/stats", { method: "GET" }, { auth: true });
    const unwrapped = unwrapApiData<unknown>(payload);
    const source = (typeof unwrapped === "object" && unwrapped !== null ? unwrapped : {}) as Record<string, unknown>;

    return {
      totalFarmers: Number(source.totalFarmers ?? 0),
      verifiedFarmers: Number(source.verifiedFarmers ?? 0),
      totalFarmSize: Number(source.totalFarmSize ?? 0),
      averageFarmSize: Number(source.averageFarmSize ?? 0),
      byVerificationStatus: Array.isArray(source.byVerificationStatus)
        ? source.byVerificationStatus.map((item) => {
            const row = (typeof item === "object" && item !== null ? item : {}) as Record<string, unknown>;
            return {
              status: String(row.status ?? "unknown"),
              count: Number(row.count ?? 0),
            };
          })
        : [],
    };
  },
};
