import { Listing } from "@/lib/api/types/listing.types";
import { ListingCard } from "./ListingCard";
import { cn } from "@/lib/utils";

interface ListingGridProps {
  listings: Listing[];
  onMakeOffer?: (listing: Listing) => void;
  className?: string;
}

export function ListingGrid({ listings, onMakeOffer, className }: ListingGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} onMakeOffer={onMakeOffer} />
      ))}
    </div>
  );
}
