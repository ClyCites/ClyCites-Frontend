import { createEntityResourceApi } from "@/lib/api/create-entity-resource-api";
import type { UpsertOrderInput } from "@/lib/types/order.types";

export const ordersApi = createEntityResourceApi({
  entityKey: "orders",
  workspaceId: "marketplace",
  mapCreateInput: (input: UpsertOrderInput) => ({
    title: input.name,
    subtitle: input.description,
    status: input.status,
    tags: input.tags,
    data: {
      listingId: input.listingId,
      buyer: input.buyer,
      seller: input.seller,
      quantity: input.quantity,
      amount: input.amount,
    },
  }),
  mapUpdateInput: (input: Partial<UpsertOrderInput>) => ({
    title: input.name,
    subtitle: input.description,
    tags: input.tags,
    data: {
      listingId: input.listingId,
      buyer: input.buyer,
      seller: input.seller,
      quantity: input.quantity,
      amount: input.amount,
    },
  }),
});
