"use client";

import { ordersApi } from "@/lib/api/orders.api";
import { useEntityResource } from "@/lib/hooks/useEntityResource";
import type { OrderListParams } from "@/lib/types/order.types";

export function useOrders(options?: { listParams?: OrderListParams; orderId?: string; enabled?: boolean }) {
  return useEntityResource(ordersApi, {
    listParams: options?.listParams,
    recordId: options?.orderId,
    listEnabled: options?.enabled,
    recordEnabled: options?.enabled,
  });
}
