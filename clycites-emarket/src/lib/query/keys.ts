import type { ListingFilters } from "@/lib/api/types/listing.types";
import type { OfferFilters } from "@/lib/api/types/offer.types";
import type { OrderFilters } from "@/lib/api/types/order.types";

export const queryKeys = {
  // Auth
  me: () => ["me"] as const,

  // Listings — buyer
  listings: (filters?: ListingFilters) =>
    filters ? (["listings", filters] as const) : (["listings"] as const),
  listing: (id: string) => ["listing", id] as const,
  listingOffers: (listingId: string) => ["listing", listingId, "offers"] as const,

  // Listings — seller
  myListings: (filters?: ListingFilters) =>
    filters ? (["myListings", filters] as const) : (["myListings"] as const),

  // Offers
  offers: (filters?: OfferFilters) =>
    filters ? (["offers", filters] as const) : (["offers"] as const),
  offer: (id: string) => ["offer", id] as const,
  offerMessages: (id: string) => ["offer", id, "messages"] as const,
  offerStats: ["offerStats"] as const,

  // Orders
  orders: (filters?: OrderFilters) =>
    filters ? (["orders", filters] as const) : (["orders"] as const),
  order: (id: string) => ["order", id] as const,
} as const;
