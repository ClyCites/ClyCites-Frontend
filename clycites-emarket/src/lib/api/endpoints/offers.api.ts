import { api } from "../http";
import type {
  Offer,
  OfferCreateRequest,
  OfferCounterRequest,
  OfferActionRequest,
  OfferFilters,
  OfferMessage,
  OfferStats,
} from "../types/offer.types";
import type { PaginatedResponse } from "../types/shared.types";

export const offersApi = {
  /** List offers (sent + received, filtered by direction / status) */
  list: (filters: OfferFilters = {}) => {
    const { page, limit, ...rest } = filters;
    return api.get<PaginatedResponse<Offer>>("/v1/offers", {
      page,
      limit,
      ...rest,
    } as Record<string, string | number | boolean | undefined | null>);
  },

  /** Get single offer */
  getById: (offerId: string) =>
    api.get<Offer>(`/v1/offers/${offerId}`),

  /** Create offer on a listing (buyer -> seller) */
  createOnListing: (listingId: string, data: OfferCreateRequest) =>
    api.post<Offer>(`/v1/listings/${listingId}/offers`, data),

  /** Accept offer */
  accept: (offerId: string, data?: OfferActionRequest) =>
    api.post<Offer>(`/v1/offers/${offerId}/accept`, data),

  /** Counter offer (seller or buyer) */
  counter: (offerId: string, data: OfferCounterRequest) =>
    api.post<Offer>(`/v1/offers/${offerId}/counter`, data),

  /** Reject offer */
  reject: (offerId: string, data?: OfferActionRequest) =>
    api.post<Offer>(`/v1/offers/${offerId}/reject`, data),

  /** Withdraw offer (buyer only) */
  withdraw: (offerId: string) =>
    api.post<Offer>(`/v1/offers/${offerId}/withdraw`),

  /** Get message thread for offer */
  getMessages: (offerId: string) =>
    api.get<OfferMessage[]>(`/v1/offers/${offerId}/messages`),

  /** Send message in offer thread */
  sendMessage: (offerId: string, content: string) =>
    api.post<OfferMessage>(`/v1/offers/${offerId}/messages`, { content }),

  /** Mark messages as read */
  markMessagesRead: (offerId: string) =>
    api.put<void>(`/v1/offers/${offerId}/messages/read`),

  /** Get offer stats for current user */
  stats: () => api.get<OfferStats>("/v1/offers/stats"),
};
