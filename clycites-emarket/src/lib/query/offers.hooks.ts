import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { offersApi } from "@/lib/api/endpoints/offers.api";
import type { OfferFilters, OfferCreateRequest, OfferCounterRequest } from "@/lib/api/types/offer.types";
import { queryKeys } from "./keys";

export function useOffers(filters: OfferFilters = {}) {
  return useQuery({
    queryKey: queryKeys.offers(filters),
    queryFn: () => offersApi.list(filters),
  });
}

export function useOffer(id: string) {
  return useQuery({
    queryKey: queryKeys.offer(id),
    queryFn: () => offersApi.getById(id),
    enabled: !!id,
  });
}

export function useOfferMessages(offerId: string) {
  return useQuery({
    queryKey: queryKeys.offerMessages(offerId),
    queryFn: () => offersApi.getMessages(offerId),
    enabled: !!offerId,
    refetchInterval: 15_000, // poll every 15s for new messages
  });
}

// ── Create offer (buyer) ──────────────────────────────────────────────────────

export function useCreateOffer(listingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: OfferCreateRequest) =>
      offersApi.createOnListing(listingId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.offers() });
      qc.invalidateQueries({ queryKey: queryKeys.listingOffers(listingId) });
    },
  });
}

// ── Offer actions (optimistic invalidation) ───────────────────────────────────

function useOfferAction(
  action: (id: string, data?: unknown) => Promise<unknown>,
  offerId: string
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data?: unknown) => action(offerId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.offer(offerId) });
      qc.invalidateQueries({ queryKey: queryKeys.offers() });
    },
  });
}

export const useAcceptOffer  = (id: string) =>
  useOfferAction(offersApi.accept  as (id: string, d?: unknown) => Promise<unknown>, id);
export const useRejectOffer  = (id: string) =>
  useOfferAction(offersApi.reject  as (id: string, d?: unknown) => Promise<unknown>, id);
export const useWithdrawOffer = (id: string) =>
  useOfferAction(offersApi.withdraw as (id: string) => Promise<unknown>, id);

export function useCounterOffer(offerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: OfferCounterRequest) => offersApi.counter(offerId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.offer(offerId) });
      qc.invalidateQueries({ queryKey: queryKeys.offers() });
    },
  });
}

export function useSendOfferMessage(offerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => offersApi.sendMessage(offerId, content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.offerMessages(offerId) });
    },
  });
}

export function useMarkMessagesRead(offerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => offersApi.markMessagesRead(offerId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.offerMessages(offerId) });
    },
  });
}

export function useOfferStats() {
  return useQuery({
    queryKey: queryKeys.offerStats,
    queryFn: () => offersApi.stats(),
  });
}
