"use client";
import { useState, useCallback } from "react";
import { LogIn, Search, ShieldCheck, Sprout, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FiltersPanel } from "@/components/market/FiltersPanel";
import { ListingGrid } from "@/components/market/ListingGrid";
import { ListingSkeleton } from "@/components/market/ListingSkeleton";
import { OfferDialog } from "@/components/offers/OfferDialog";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { useListingsInfinite } from "@/lib/query/listings.hooks";
import { ListingFilters, Listing } from "@/lib/api/types/listing.types";
import { Reveal } from "@/lib/motion";
import { HttpError } from "@/lib/api/http";

const DEFAULT_FILTERS: ListingFilters = { status: "active", limit: 12, page: 1 };

const highlights = [
  {
    title: "Trusted Produce",
    description: "Farm-direct listings with clear status and quality signals.",
    icon: ShieldCheck,
  },
  {
    title: "Fresh Supply",
    description: "Discover seasonal crops from cooperatives across Uganda.",
    icon: Sprout,
  },
  {
    title: "Reliable Delivery",
    description: "Match nearby suppliers and streamline your logistics.",
    icon: Truck,
  },
];

export default function MarketPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<ListingFilters>(DEFAULT_FILTERS);
  const [offerTarget, setOfferTarget] = useState<Listing | null>(null);
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, isError, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useListingsInfinite({ ...filters, status: "active" });

  const allListings = data?.pages.flatMap((page) => {
    if (Array.isArray(page)) return page;
    return (page as { data?: Listing[] })?.data ?? [];
  }) ?? [];

  const isAuthError = error instanceof HttpError && (error.status === 401 || error.status === 403);
  const activeFilterCount = [filters.search, filters.region, filters.district, filters.minPrice, filters.maxPrice, filters.sort].filter(Boolean).length;

  const handleSearch = () => {
    setFilters((f) => ({ ...f, search: searchInput || undefined, page: 1 }));
  };

  const handleFilterChange = useCallback((f: ListingFilters) => {
    setFilters({ ...f, status: "active" });
  }, []);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <Reveal>
        <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-[linear-gradient(140deg,hsl(var(--card)/0.96)_0%,hsl(var(--accent)/0.46)_54%,hsl(var(--card)/0.88)_100%)] p-6 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -left-12 -top-20 h-52 w-52 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-14 right-0 h-52 w-52 rounded-full bg-secondary/20 blur-3xl" />

          <div className="relative z-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <Badge variant="outline" className="mb-3 border-primary/30 bg-primary/12 text-primary">
                Live agricultural marketplace
              </Badge>
              <h1 className="font-display text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">
                Source high-quality produce faster, with visibility from listing to delivery.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Browse active listings, compare pricing, and negotiate offers in one unified workspace.
              </p>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative w-full sm:max-w-lg">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="h-11 rounded-xl pl-9"
                    placeholder="Search crops, produce types, suppliers..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button size="lg" className="h-11" onClick={handleSearch}>
                  Search Market
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {highlights.map(({ title, description, icon: Icon }) => (
                <div key={title} className="panel-surface rounded-2xl p-4">
                  <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/12 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="font-display text-sm font-semibold">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <div className="mt-8 flex flex-col gap-6 lg:flex-row">
        <FiltersPanel filters={filters} onFilterChange={handleFilterChange} />

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-card/70">
              {allListings.length} listings
            </Badge>
            {activeFilterCount > 0 && (
              <Badge variant="secondary">
                {activeFilterCount} filters applied
              </Badge>
            )}
          </div>

          {isLoading ? (
            <ListingSkeleton count={12} />
          ) : isError ? (
            isAuthError ? (
              <EmptyState
                title="Sign in to browse listings"
                description="Create an account or sign in to access the marketplace and connect with farmers."
                action={
                  <div className="flex gap-3">
                    <Button onClick={() => router.push("/login")}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/register")}>
                      Create Account
                    </Button>
                  </div>
                }
              />
            ) : (
              <ErrorState
                title="Failed to load listings"
                description="Check your connection and try again."
                onRetry={refetch}
              />
            )
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
                <div className="mt-10 flex justify-center">
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
