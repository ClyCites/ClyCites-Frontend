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
    return api.get<PaginatedResponse<Offer>>("/offers", {
      page,
      limit,
      ...rest,
    } as Record<string, string | number | boolean | undefined | null>);
  },

  /** Get single offer */
  getById: (offerId: string) =>
    api.get<Offer>(`/offers/${offerId}`),

  /** Create offer on a listing (buyer -> seller) */
  createOnListing: (listingId: string, data: OfferCreateRequest) =>
    api.post<Offer>(`/listings/${listingId}/offers`, data),

  /** Accept offer */
  accept: (offerId: string, data?: OfferActionRequest) =>
    api.post<Offer>(`/offers/${offerId}/accept`, data),

  /** Counter offer (seller or buyer) */
  counter: (offerId: string, data: OfferCounterRequest) =>
    api.post<Offer>(`/offers/${offerId}/counter`, data),

  /** Reject offer */
  reject: (offerId: string, data?: OfferActionRequest) =>
    api.post<Offer>(`/offers/${offerId}/reject`, data),

  /** Withdraw offer (buyer only) */
  withdraw: (offerId: string) =>
    api.post<Offer>(`/offers/${offerId}/withdraw`),

  /** Get message thread for offer */
  getMessages: (offerId: string) =>
    api.get<OfferMessage[]>(`/offers/${offerId}/messages`),

  /** Send message in offer thread */
  sendMessage: (offerId: string, content: string) =>
    api.post<OfferMessage>(`/offers/${offerId}/messages`, { content }),

  /** Mark messages as read */
  markMessagesRead: (offerId: string) =>
    api.put<void>(`/offers/${offerId}/messages/read`),

  /** Get offer stats for current user */
  stats: () => api.get<OfferStats>("/offers/stats"),
};
