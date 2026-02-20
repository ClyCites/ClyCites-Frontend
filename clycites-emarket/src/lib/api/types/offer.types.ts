import type { PaginationParams } from "./shared.types";
import type { Listing } from "./listing.types";

export type OfferStatus =
  | "PENDING"
  | "COUNTERED"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED"
  | "WITHDRAWN";

export interface OfferMessage {
  id: string;
  senderId: string;
  senderName?: string;
  content: string;
  createdAt: string;
}

export interface OfferHistoryEvent {
  id: string;
  action: "CREATED" | "COUNTERED" | "ACCEPTED" | "REJECTED" | "EXPIRED" | "WITHDRAWN" | "MESSAGE";
  actorId: string;
  actorName?: string;
  price?: number;
  note?: string;
  createdAt: string;
}

export interface Offer {
  id: string;
  listing: string | Listing;
  buyer: string | { id: string; firstName: string; lastName: string; profilePhoto?: string };
  seller: string | { id: string; firstName: string; lastName: string; profilePhoto?: string };
  offeredPrice: number;
  counterPrice?: number;
  quantity: number;
  currency: string;
  status: OfferStatus;
  message?: string;
  note?: string;
  history: OfferHistoryEvent[];
  messages: OfferMessage[];
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

export interface OfferCreateRequest {
  offeredPrice: number;
  quantity: number;
  currency?: string;
  message?: string;
  expiresAt?: string;
}

export interface OfferCounterRequest {
  counterPrice: number;
  note?: string;
}

export interface OfferActionRequest {
  note?: string;
}

export interface OfferFilters extends PaginationParams {
  status?: OfferStatus;
  direction?: "sent" | "received";
  listingId?: string;
}

export interface OfferStats {
  sent: number;
  received: number;
  pending: number;
  accepted: number;
  rejected: number;
  totalValue: number;
}
