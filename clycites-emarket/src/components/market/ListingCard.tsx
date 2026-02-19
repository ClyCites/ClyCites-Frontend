"use client";
import Image from "next/image";
import Link from "next/link";
import { MapPin, User, Calendar, Package } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Listing } from "@/lib/api/types/listing.types";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

interface ListingCardProps {
  listing: Listing;
  onMakeOffer?: (listing: Listing) => void;
}

const statusVariant: Record<string, "success" | "muted" | "warning" | "destructive"> = {
  active:  "success",
  draft:   "muted",
  expired: "destructive",
  sold:    "warning",
};

export function ListingCard({ listing, onMakeOffer }: ListingCardProps) {
  const productName = typeof listing.product === "string"
    ? "Product"
    : listing.product?.name ?? "Product";

  const farmerName = typeof listing.farmer === "string"
    ? "Farmer"
    : (listing.farmer as { name?: string })?.name ?? "Farmer";

  const imageSrc = listing.images?.[0] ?? null;

  return (
    <Card className="group overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      {/* Image */}
      <Link href={`/market/listings/${listing.id}`} className="relative block aspect-[4/3] bg-muted overflow-hidden">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={productName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Package className="h-12 w-12 opacity-30" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge variant={statusVariant[listing.status] ?? "muted"} className="capitalize text-xs">
            {listing.status}
          </Badge>
        </div>
      </Link>

      <CardContent className="flex-1 p-4 space-y-2">
        {/* Product name */}
        <Link href={`/market/listings/${listing.id}`}>
          <h3 className="font-semibold text-sm leading-tight hover:text-primary transition-colors line-clamp-2">
            {productName}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-primary">
            {formatCurrency(listing.price, listing.currency)}
          </span>
          <span className="text-xs text-muted-foreground">/ {listing.unit ?? "kg"}</span>
        </div>

        {/* Quantity */}
        <p className="text-xs text-muted-foreground">
          Available: <span className="text-foreground font-medium">{listing.quantity} {listing.unit ?? "kg"}</span>
        </p>

        {/* Location */}
        {listing.location && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {[listing.location.district, listing.location.region].filter(Boolean).join(", ")}
            </span>
          </div>
        )}

        {/* Farmer */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <User className="h-3 w-3 shrink-0" />
          <span className="truncate">{farmerName}</span>
        </div>

        {/* Harvest date */}
        {listing.harvestDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>Harvested {formatRelativeTime(listing.harvestDate)}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/market/listings/${listing.id}`}>View</Link>
        </Button>
        {listing.status === "active" && onMakeOffer && (
          <Button size="sm" className="flex-1" onClick={() => onMakeOffer(listing)}>
            Make Offer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
