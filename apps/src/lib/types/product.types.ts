import type { CommodityPayload, EntityRecord, ListParams } from "@/lib/store/types";

export type ProductRecord = EntityRecord<"commodities">;
export type ProductListParams = ListParams;
export type ProductData = CommodityPayload;

export interface UpsertProductInput {
  name: string;
  description?: string;
  category?: string;
  unit: string;
  grade: string;
  tags?: string[];
  status?: string;
}
