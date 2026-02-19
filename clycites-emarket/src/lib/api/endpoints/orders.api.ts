import { api } from "../http";
import type { Order, OrderFilters, OrderCancelRequest } from "../types/order.types";
import type { PaginatedResponse } from "../types/shared.types";

export const ordersApi = {
  /** List orders (buyer + seller view) */
  list: (filters: OrderFilters = {}) => {
    const { page, limit, ...rest } = filters;
    return api.get<PaginatedResponse<Order>>("/v1/orders", {
      page,
      limit,
      ...rest,
    } as Record<string, string | number | boolean | undefined | null>);
  },

  /** Get single order */
  getById: (id: string) =>
    api.get<Order>(`/v1/orders/${id}`),

  /** Cancel order */
  cancel: (id: string, data: OrderCancelRequest) =>
    api.post<Order>(`/v1/orders/${id}/cancel`, data),

  /** Confirm delivery (buyer) */
  confirmDelivery: (id: string) =>
    api.post<Order>(`/v1/orders/${id}/confirm-delivery`),
};
