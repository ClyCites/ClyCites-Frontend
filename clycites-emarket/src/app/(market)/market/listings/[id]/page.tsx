"use client";
import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Package, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OfferDialog } from "@/components/offers/OfferDialog";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { useListing } from "@/lib/query/listings.hooks";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Reveal } from "@/lib/motion";

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: listing, isLoading, isError, refetch } = useListing(id);
  const [offerOpen, setOfferOpen] = useState(false);

  if (isLoading) return <LoadingState text="Loading listing…" className="min-h-[60vh]" />;
  if (isError || !listing)
    return <ErrorState title="Listing not found" onRetry={refetch} className="min-h-[60vh]" />;

  const productName = typeof listing.product === "string" ? "Product" : listing.product?.name ?? "Product";
  const farmerName  = typeof listing.farmer  === "string" ? listing.farmer : (listing.farmer as { name?: string })?.name ?? "Farmer";
  const imageSrc    = listing.images?.[0] ?? null;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
        <Link href="/market"><ArrowLeft className="h-4 w-4" /> Back to Market</Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: image + details */}
        <div className="lg:col-span-3 space-y-6">
          <Reveal>
            {/* Image */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-muted border">
              {imageSrc ? (
                <Image src={imageSrc} alt={productName} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <Package className="h-16 w-16 opacity-20" />
                </div>
              )}
            </div>
          </Reveal>

          <Reveal>
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold">{productName}</h1>
                <Badge variant={listing.status === "active" ? "success" : "muted"} className="capitalize shrink-0">
                  {listing.status}
                </Badge>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                {listing.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {[listing.location.district, listing.location.region].filter(Boolean).join(", ")}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {farmerName}
                </span>
                {listing.harvestDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Harvested {formatDate(listing.harvestDate)}
                  </span>
                )}
              </div>
            </div>
          </Reveal>

          <Separator />

          <Reveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Quantity available</p>
                <p className="font-semibold text-foreground mt-0.5">{listing.quantity} {listing.unit ?? "kg"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Listed price</p>
                <p className="font-semibold text-primary mt-0.5">{formatCurrency(listing.price, listing.currency)} / {listing.unit ?? "kg"}</p>
              </div>
              {listing.expiryDate && (
                <div>
                  <p className="text-muted-foreground">Listing expires</p>
                  <p className="font-semibold mt-0.5">{formatDate(listing.expiryDate)}</p>
                </div>
              )}
            </div>
          </Reveal>
        </div>

        {/* Right: offer sidebar */}
        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <Reveal>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Make an Offer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Listed price</span>
                      <span className="font-semibold">{formatCurrency(listing.price, listing.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity</span>
                      <span className="font-semibold">{listing.quantity} {listing.unit ?? "kg"}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total value</span>
                      <span className="text-primary">{formatCurrency(listing.price * listing.quantity, listing.currency)}</span>
                    </div>
                  </div>

                  {listing.status === "active" ? (
                    <Button className="w-full" size="lg" onClick={() => setOfferOpen(true)}>
                      Make an Offer
                    </Button>
                  ) : (
                    <Button className="w-full" size="lg" disabled>
                      Listing Unavailable
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground text-center">
                    Offers are non-binding until both parties agree.
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </div>

      {offerOpen && (
        <OfferDialog listing={listing} open={offerOpen} onOpenChange={setOfferOpen} />
      )}
    </div>
  );
}
