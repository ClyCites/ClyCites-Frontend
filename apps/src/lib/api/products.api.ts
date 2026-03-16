import { createEntityResourceApi } from "@/lib/api/create-entity-resource-api";
import type { UpsertProductInput } from "@/lib/types/product.types";

export const productsApi = createEntityResourceApi({
  entityKey: "commodities",
  workspaceId: "prices",
  mapCreateInput: (input: UpsertProductInput) => ({
    title: input.name,
    subtitle: input.description,
    status: input.status,
    tags: input.tags,
    data: {
      category: input.category,
      unit: input.unit,
      grade: input.grade,
    },
  }),
  mapUpdateInput: (input: Partial<UpsertProductInput>) => ({
    title: input.name,
    subtitle: input.description,
    tags: input.tags,
    data: {
      category: input.category,
      unit: input.unit,
      grade: input.grade,
    },
  }),
});
