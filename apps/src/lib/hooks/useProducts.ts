"use client";

import { productsApi } from "@/lib/api/products.api";
import { useEntityResource } from "@/lib/hooks/useEntityResource";
import type { ProductListParams } from "@/lib/types/product.types";

export function useProducts(options?: { listParams?: ProductListParams; productId?: string; enabled?: boolean }) {
  return useEntityResource(productsApi, {
    listParams: options?.listParams,
    recordId: options?.productId,
    listEnabled: options?.enabled,
    recordEnabled: options?.enabled,
  });
}
