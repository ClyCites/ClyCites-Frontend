import { api } from "../http";
import type { Listing, ListingCreateRequest, ListingUpdateRequest, ListingFilters } from "../types/listing.types";
import type { PaginatedResponse } from "../types/shared.types";

export const listingsApi = {
  /** Public — browse all active listings */
  list: (filters: ListingFilters = {}) => {
    const { page, limit, ...rest } = filters;
    return api.get<PaginatedResponse<Listing>>("/v1/listings", {
      page,
      limit,
      ...rest,
    } as Record<string, string | number | boolean | undefined | null>);
  },

  /** Get single listing by ID */
  getById: (id: string) =>
    api.get<Listing>(`/v1/listings/${id}`),

  /** Create new listing (seller) */
  create: (data: ListingCreateRequest) =>
    api.post<Listing>("/v1/listings", data),

  /** Update listing (seller) */
  update: (id: string, data: ListingUpdateRequest) =>
    api.put<Listing>(`/v1/listings/${id}`, data),

  /** Delete listing */
  delete: (id: string) =>
    api.delete<{ message: string }>(`/v1/listings/${id}`),

  /** Seller's own listings */
  myListings: (filters: ListingFilters = {}) => {
    const { page, limit, ...rest } = filters;
    return api.get<PaginatedResponse<Listing>>("/v1/listings/my", {
      page,
      limit,
      ...rest,
    } as Record<string, string | number | boolean | undefined | null>);
  },

  /** Publish (set status = active) */
  publish: (id: string) =>
    api.patch<Listing>(`/v1/listings/${id}`, { status: "active" }),

  /** Pause listing */
  pause: (id: string) =>
    api.patch<Listing>(`/v1/listings/${id}`, { status: "draft" }),

  /** Expire listing */
  expire: (id: string) =>
    api.patch<Listing>(`/v1/listings/${id}`, { status: "expired" }),

  /** Get offers on a specific listing */
  getOffers: (id: string, filters: { page?: number; limit?: number } = {}) =>
    api.get<PaginatedResponse<unknown>>(`/v1/listings/${id}/offers`, filters as Record<string, string | number | boolean | undefined | null>),
};
