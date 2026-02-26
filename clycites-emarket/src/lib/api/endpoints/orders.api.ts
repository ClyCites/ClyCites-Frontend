import { api } from "../http";
import type { Order, OrderFilters, OrderCancelRequest } from "../types/order.types";
import type { PaginatedResponse } from "../types/shared.types";

export const ordersApi = {
  /** Place order directly */
  create: (
    data: { listingId: string; quantity: number; deliveryAddress?: Record<string, unknown> },
    options?: { idempotencyKey?: string }
  ) => api.post<Order>("/orders", data, options),

  /** List orders (buyer + seller view) */
  list: (filters: OrderFilters = {}) => {
    const { page, limit, ...rest } = filters;
    return api.get<PaginatedResponse<Order>>("/orders/my-orders", {
      page,
      limit,
      ...rest,
    } as Record<string, string | number | boolean | undefined | null>);
  },

  /** Get single order */
  getById: (id: string) =>
    api.get<Order>(`/orders/${id}`),

  /** Cancel order */
  cancel: (id: string, data: OrderCancelRequest) =>
    api.post<Order>(`/orders/${id}/cancel`, data),

  /** Confirm delivery (buyer) */
  confirmDelivery: (id: string) =>
    api.post<Order>(`/orders/${id}/confirm-delivery`),

  /** Update order status (seller) */
  updateStatus: (id: string, data: { status: string; note?: string }) =>
    api.patch<Order>(`/orders/${id}/status`, data),

  /** Admin: list all orders */
  adminListAll: (filters: OrderFilters = {}) => {
    const { page, limit, ...rest } = filters;
    return api.get<PaginatedResponse<Order>>("/orders", {
      page,
      limit,
      ...rest,
    } as Record<string, string | number | boolean | undefined | null>);
  },
};
