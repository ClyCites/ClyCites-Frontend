import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api/endpoints/orders.api";
import type { OrderFilters, OrderCancelRequest } from "@/lib/api/types/order.types";
import { queryKeys } from "./keys";

export function useOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: queryKeys.orders(filters),
    queryFn: () => ordersApi.list(filters),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  });
}

export function useCancelOrder(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: OrderCancelRequest) => ordersApi.cancel(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.order(id) });
      qc.invalidateQueries({ queryKey: queryKeys.orders() });
    },
  });
}

export function useConfirmDelivery(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => ordersApi.confirmDelivery(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.order(id) });
      qc.invalidateQueries({ queryKey: queryKeys.orders() });
    },
  });
}

export function useUpdateOrderStatus(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { status: string; note?: string }) => ordersApi.updateStatus(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.order(id) });
      qc.invalidateQueries({ queryKey: queryKeys.orders() });
    },
  });
}
