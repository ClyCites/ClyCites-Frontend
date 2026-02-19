"use client";
import { useState, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiltersPanel } from "@/components/market/FiltersPanel";
import { ListingGrid } from "@/components/market/ListingGrid";
import { ListingSkeleton } from "@/components/market/ListingSkeleton";
import { OfferDialog } from "@/components/offers/OfferDialog";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { useListingsInfinite } from "@/lib/query/listings.hooks";
import { ListingFilters, Listing } from "@/lib/api/types/listing.types";
import { Reveal } from "@/lib/motion";

const DEFAULT_FILTERS: ListingFilters = { status: "active", limit: 12, page: 1 };

export default function MarketPage() {
  const [filters, setFilters] = useState<ListingFilters>(DEFAULT_FILTERS);
  const [offerTarget, setOfferTarget] = useState<Listing | null>(null);
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useListingsInfinite({ ...filters, status: "active" });

  const allListings = data?.pages.flatMap((p) =>
    Array.isArray(p) ? p : (p as { data?: Listing[] }).data ?? []
  ) ?? [];

  const handleSearch = () => {
    setFilters((f) => ({ ...f, search: searchInput || undefined, page: 1 }));
  };

  const handleFilterChange = useCallback((f: ListingFilters) => {
    setFilters({ ...f, status: "active" });
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <Reveal>
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground mt-1">Browse fresh agricultural produce from farmers across Uganda.</p>
        </div>
      </Reveal>

      {/* Search bar */}
      <Reveal>
        <div className="flex gap-2 mb-6 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search products, crops…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </Reveal>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <FiltersPanel filters={filters} onFilterChange={handleFilterChange} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Mobile filter trigger is rendered inside FiltersPanel */}
          <div className="flex items-center justify-between mb-4">
            <div className="lg:hidden">
              <FiltersPanel filters={filters} onFilterChange={handleFilterChange} />
            </div>
            <p className="text-sm text-muted-foreground ml-auto">
              {allListings.length} listings
            </p>
          </div>

          {isLoading ? (
            <ListingSkeleton count={12} />
          ) : isError ? (
            <ErrorState
              title="Failed to load listings"
              description="Check your connection and try again."
              onRetry={refetch}
            />
          ) : allListings.length === 0 ? (
            <EmptyState
              title="No listings found"
              description="Try adjusting your search or filters."
              action={
                <Button variant="outline" onClick={() => setFilters(DEFAULT_FILTERS)}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <>
              <ListingGrid listings={allListings} onMakeOffer={setOfferTarget} />
              {hasNextPage && (
                <div className="flex justify-center mt-10">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => fetchNextPage()}
                    loading={isFetchingNextPage}
                  >
                    Load more
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Offer dialog */}
      {offerTarget && (
        <OfferDialog
          listing={offerTarget}
          open={!!offerTarget}
          onOpenChange={(o) => !o && setOfferTarget(null)}
        />
      )}
    </div>
  );
}
