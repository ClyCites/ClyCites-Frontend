import type { EntityRecord, FarmerPayload, ListParams } from "@/lib/store/types";

export type FarmerRecord = EntityRecord<"farmers">;
export type FarmerListParams = ListParams;
export type FarmerData = FarmerPayload;

export interface UpsertFarmerInput {
  businessName: string;
  description?: string;
  region: string;
  district: string;
  village?: string;
  latitude?: number;
  longitude?: number;
  farmSize?: number;
  cropTypes?: string[];
  tags?: string[];
  status?: string;
}

export interface FarmerStats {
  totalFarmers: number;
  verifiedFarmers: number;
  totalFarmSize: number;
  averageFarmSize: number;
  byVerificationStatus: Array<{
    status: string;
    count: number;
  }>;
}
