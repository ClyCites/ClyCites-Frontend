import type { PaginationParams } from "./shared.types";
import type { Listing } from "./listing.types";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "in_escrow";

export interface OrderDeliveryAddress {
  address: string;
  city: string;
  region?: string;
  country: string;
  coordinates?: { lat: number; lng: number };
}

export interface Order {
  id: string;
  buyer: string | { id: string; firstName: string; lastName: string; profilePhoto?: string };
  farmer: string | { id: string; firstName: string; lastName: string; profilePhoto?: string };
  listing: string | Listing;
  offer?: string;
  product: string | { id: string; name: string; unit: string };
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  finalAmount: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryAddress?: OrderDeliveryAddress;
  trackingNumber?: string;
  notes?: string;
  cancelReason?: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderFilters extends PaginationParams {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  role?: "buyer" | "seller";
  search?: string;
}

export interface OrderCancelRequest {
  reason: string;
}
