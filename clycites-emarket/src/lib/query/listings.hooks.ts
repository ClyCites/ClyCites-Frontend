import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  type InfiniteData,
} from "@tanstack/react-query";
import { listingsApi } from "@/lib/api/endpoints/listings.api";
import type { ListingFilters, ListingCreateRequest, ListingUpdateRequest } from "@/lib/api/types/listing.types";
import type { PaginatedResponse } from "@/lib/api/types/shared.types";
import type { Listing } from "@/lib/api/types/listing.types";
import { queryKeys } from "./keys";

// ── Browse listings (buyer) ───────────────────────────────────────────────────

export function useListings(filters: ListingFilters = {}) {
  return useQuery({
    queryKey: queryKeys.listings(filters),
    queryFn: () => listingsApi.list(filters),
  });
}

export function useListingsInfinite(filters: Omit<ListingFilters, "page"> = {}) {
  return useInfiniteQuery<
    PaginatedResponse<Listing>,
    Error,
    InfiniteData<PaginatedResponse<Listing>>,
    ReturnType<typeof queryKeys.listings>,
    number
  >({
    queryKey: queryKeys.listings(filters),
    queryFn: ({ pageParam }) =>
      listingsApi.list({ ...filters, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.pagination.hasNextPage ? last.pagination.page + 1 : undefined,
  });
}

// ── Single listing ────────────────────────────────────────────────────────────

export function useListing(id: string) {
  return useQuery({
    queryKey: queryKeys.listing(id),
    queryFn: () => listingsApi.getById(id),
    enabled: !!id,
  });
}

// ── Seller: my listings ───────────────────────────────────────────────────────

export function useMyListings(filters: ListingFilters = {}) {
  return useQuery({
    queryKey: queryKeys.myListings(filters),
    queryFn: () => listingsApi.myListings(filters),
  });
}

// ── Create listing ────────────────────────────────────────────────────────────

export function useCreateListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ListingCreateRequest) => listingsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.myListings() });
      qc.invalidateQueries({ queryKey: queryKeys.listings() });
    },
  });
}

// ── Update listing ────────────────────────────────────────────────────────────

export function useUpdateListing(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ListingUpdateRequest) => listingsApi.update(id, data),
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.listing(id), updated);
      qc.invalidateQueries({ queryKey: queryKeys.myListings() });
    },
  });
}

// ── Quick status mutations (optimistic) ──────────────────────────────────────

function useListingStatusMutation(
  action: (id: string) => Promise<Listing>,
  id: string
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => action(id),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: queryKeys.listing(id) });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.listing(id) });
      qc.invalidateQueries({ queryKey: queryKeys.myListings() });
    },
  });
}

export const usePublishListing  = (id: string) => useListingStatusMutation(listingsApi.publish, id);
export const usePauseListing    = (id: string) => useListingStatusMutation(listingsApi.pause, id);
export const useExpireListing   = (id: string) => useListingStatusMutation(listingsApi.expire, id);

// ── Delete listing ────────────────────────────────────────────────────────────

export function useDeleteListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => listingsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.myListings() });
      qc.invalidateQueries({ queryKey: queryKeys.listings() });
    },
  });
}
