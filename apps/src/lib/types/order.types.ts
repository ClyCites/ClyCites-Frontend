import type { EntityRecord, ListParams, OrderPayload } from "@/lib/store/types";

export type OrderRecord = EntityRecord<"orders">;
export type OrderListParams = ListParams;
export type OrderData = OrderPayload;

export interface UpsertOrderInput {
  name: string;
  description?: string;
  listingId: string;
  buyer: string;
  seller: string;
  quantity: number;
  amount: number;
  tags?: string[];
  status?: string;
}
