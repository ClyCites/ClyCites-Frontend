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
    <Card className="group flex h-full flex-col overflow-hidden border-border/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_34px_-28px_hsl(var(--foreground)/0.72)]">
      {/* Image */}
      <Link href={`/market/listings/${listing.id}`} className="relative block aspect-4/3 overflow-hidden bg-muted">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={productName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Package className="h-12 w-12 opacity-35" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-foreground/35 via-transparent to-transparent opacity-80" />

        <div className="absolute top-2 left-2">
          <Badge variant={statusVariant[listing.status] ?? "muted"} className="capitalize text-xs">
            {listing.status}
          </Badge>
        </div>

        <div className="absolute bottom-2 right-2 rounded-full border border-primary/25 bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm backdrop-blur">
          {formatCurrency(listing.price, listing.currency)}
        </div>
      </Link>

      <CardContent className="flex-1 space-y-3 p-4">
        {/* Product name */}
        <Link href={`/market/listings/${listing.id}`}>
          <h3 className="font-display text-base leading-tight hover:text-primary transition-colors line-clamp-2">
            {productName}
          </h3>
        </Link>

        {/* Price */}
        <div className="rounded-xl border border-border/70 bg-muted/45 px-3 py-2">
          <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
            Asking price
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-primary">
              {formatCurrency(listing.price, listing.currency)}
            </span>
            <span className="text-xs text-muted-foreground">/ {listing.unit ?? "kg"}</span>
          </div>
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

      <CardFooter className="gap-2 p-4 pt-0">
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
