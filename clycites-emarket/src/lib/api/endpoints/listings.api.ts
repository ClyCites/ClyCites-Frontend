import { api } from "../http";
import type { Listing, ListingCreateRequest, ListingUpdateRequest, ListingFilters } from "../types/listing.types";
import type { PaginatedResponse } from "../types/shared.types";

// Raw API response may use '_id' (MongoDB) instead of 'id'
type RawListing = Omit<Listing, "id"> & { id?: string; _id?: string };
type RawListingResponse = RawListing[] | PaginatedResponse<RawListing>;

// Normalize listing data: ensure 'id' field exists (API may use '_id')
function normalizeListing(listing: RawListing): Listing {
  return {
    ...listing,
    id: listing.id || listing._id || "",
  };
}

function normalizeListings(data: RawListingResponse): Listing[] | PaginatedResponse<Listing> {
  if (Array.isArray(data)) {
    return data.map(normalizeListing);
  }
  if (data.data && Array.isArray(data.data)) {
    return {
      ...data,
      data: data.data.map(normalizeListing),
    };
  }
  return data as PaginatedResponse<Listing>;
}

export const listingsApi = {
  /** Public — browse all active listings */
  list: async (filters: ListingFilters = {}) => {
    const { page, limit, ...rest } = filters;
    const response = await api.get<RawListingResponse>("/v1/listings", {
      page,
      limit,
      ...rest,
    } as Record<string, string | number | boolean | undefined | null>);
    return normalizeListings(response);
  },

  /** Get single listing by ID */
  getById: async (id: string) => {
    const response = await api.get<RawListing>(`/v1/listings/${id}`);
    return normalizeListing(response);
  },

  /** Create new listing (seller) */
  create: async (data: ListingCreateRequest) => {
    const response = await api.post<RawListing>("/v1/listings", data);
    return normalizeListing(response);
  },

  /** Update listing (seller) */
  update: async (id: string, data: ListingUpdateRequest) => {
    const response = await api.put<RawListing>(`/v1/listings/${id}`, data);
    return normalizeListing(response);
  },

  /** Delete listing */
  delete: (id: string) =>
    api.delete<{ message: string }>(`/v1/listings/${id}`),

  /** Seller's own listings */
  myListings: async (filters: ListingFilters = {}) => {
    const { page, limit, ...rest } = filters;
    const response = await api.get<RawListingResponse>("/v1/listings/my", {
      page,
      limit,
      ...rest,
    } as Record<string, string | number | boolean | undefined | null>);
    return normalizeListings(response);
  },

  /** Publish (set status = active) */
  publish: async (id: string) => {
    const response = await api.patch<RawListing>(`/v1/listings/${id}`, { status: "active" });
    return normalizeListing(response);
  },

  /** Pause listing */
  pause: async (id: string) => {
    const response = await api.patch<RawListing>(`/v1/listings/${id}`, { status: "draft" });
    return normalizeListing(response);
  },

  /** Expire listing */
  expire: async (id: string) => {
    const response = await api.patch<RawListing>(`/v1/listings/${id}`, { status: "expired" });
    return normalizeListing(response);
  },

  /** Get offers on a specific listing */
  getOffers: (id: string, filters: { page?: number; limit?: number } = {}) =>
    api.get<PaginatedResponse<unknown>>(`/v1/listings/${id}/offers`, filters as Record<string, string | number | boolean | undefined | null>),
};
