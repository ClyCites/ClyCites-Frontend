"use client";
import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NegotiationTimeline } from "@/components/offers/NegotiationTimeline";
import { OfferStatusBadge } from "@/components/offers/OfferStatusBadge";
import { OfferMessagesThread } from "@/components/offers/OfferMessagesThread";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useOffer, useAcceptOffer, useRejectOffer, useWithdrawOffer, useCounterOffer } from "@/lib/query/offers.hooks";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "@/components/ui/use-toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Reveal } from "@/lib/motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const counterSchema = z.object({
  price:    z.coerce.number().positive(),
  quantity: z.coerce.number().positive(),
  message:  z.string().optional(),
});
type CounterForm = z.infer<typeof counterSchema>;

export default function OfferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const { data: offer, isLoading, isError, refetch } = useOffer(id);
  const [showCounter, setShowCounter] = useState(false);

  const { mutate: accept,   isPending: accepting  } = useAcceptOffer(id);
  const { mutate: reject,   isPending: rejecting  } = useRejectOffer(id);
  const { mutate: withdraw, isPending: withdrawing } = useWithdrawOffer(id);
  const { mutate: counter,  isPending: countering } = useCounterOffer(id);

  const { register, handleSubmit, formState: { errors } } = useForm<CounterForm>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(counterSchema) as any,
    defaultValues: { price: offer?.offeredPrice, quantity: offer?.quantity },
  });

  if (isLoading) return <LoadingState text="Loading offer…" className="min-h-[60vh]" />;
  if (isError || !offer) return <ErrorState title="Offer not found" onRetry={refetch} className="min-h-[60vh]" />;

  const buyerId  = typeof offer.buyer  === "string" ? offer.buyer  : (offer.buyer  as { id?: string })?.id;
  const farmerId = typeof offer.seller === "string" ? offer.seller : (offer.seller as { id?: string })?.id;
  const isBuyer  = user?.id === buyerId;
  const isSeller = user?.id === farmerId;

  const canAccept   = isSeller && offer.status === "PENDING";
  const canReject   = isSeller && (offer.status === "PENDING" || offer.status === "COUNTERED");
  const canCounter  = (isSeller || isBuyer) && (offer.status === "PENDING" || offer.status === "COUNTERED");
  const canWithdraw = isBuyer  && (offer.status === "PENDING" || offer.status === "COUNTERED");

  const handleAccept = () => {
    accept({ offerId: id, data: {} }, {
      onSuccess: () => toast({ title: "Offer accepted!", variant: "success" }),
      onError:   (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
    });
  };

  const handleReject = () => {
    reject({ offerId: id, data: {} }, {
      onSuccess: () => toast({ title: "Offer rejected." }),
      onError:   (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
    });
  };

  const handleWithdraw = () => {
    withdraw({ offerId: id, data: {} }, {
      onSuccess: () => toast({ title: "Offer withdrawn." }),
      onError:   (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
    });
  };

  const onCounterSubmit = (data: CounterForm) => {
    counter({ counterPrice: data.price, note: data.message }, {
      onSuccess: () => { toast({ title: "Counter offer sent!", variant: "success" }); setShowCounter(false); },
      onError:   (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
    });
  };

  const listingName = typeof offer.listing === "string" ? offer.listing
    : (offer.listing as { product?: { name?: string } })?.product?.name ?? "Listing";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
        <Link href="/offers"><ArrowLeft className="h-4 w-4" /> Back to Offers</Link>
      </Button>

      <Reveal>
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Offer — {listingName}</h1>
            <p className="text-sm text-muted-foreground mt-1">Submitted {formatDate(offer.createdAt)}</p>
          </div>
          <OfferStatusBadge status={offer.status} />
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Timeline */}
        <div className="md:col-span-3">
          <Reveal>
            <Card>
              <CardHeader><CardTitle className="text-base">Negotiation History</CardTitle></CardHeader>
              <CardContent>
                <NegotiationTimeline offer={offer} />
              </CardContent>
            </Card>
          </Reveal>
        </div>

        {/* Actions */}
        <div className="md:col-span-2 space-y-4">
          <Reveal>
            <Card>
              <CardHeader><CardTitle className="text-base">Offer Details</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-semibold text-primary">{formatCurrency(offer.offeredPrice, offer.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-semibold">{offer.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-bold">{formatCurrency(offer.offeredPrice * offer.quantity, offer.currency)}</span>
                </div>
                {offer.expiresAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expires</span>
                    <span>{formatDate(offer.expiresAt)}</span>
                  </div>
                )}
              </CardContent>
              {(canAccept || canReject || canWithdraw || canCounter) && (
                <CardFooter className="flex-col gap-2 pt-0">
                  <Separator className="mb-2" />
                  {canAccept && (
                    <Button className="w-full" onClick={handleAccept} loading={accepting}>Accept Offer</Button>
                  )}
                  {canCounter && !showCounter && (
                    <Button variant="outline" className="w-full" onClick={() => setShowCounter(true)}>Counter Offer</Button>
                  )}
                  {canWithdraw && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" className="w-full text-muted-foreground" loading={withdrawing}>Withdraw</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Withdraw this offer?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleWithdraw}>Withdraw</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  {canReject && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" className="w-full text-destructive hover:text-destructive" loading={rejecting}>Reject</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reject this offer?</AlertDialogTitle>
                          <AlertDialogDescription>The buyer will be notified.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleReject}>Reject</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </CardFooter>
              )}
            </Card>
          </Reveal>

          {/* Counter form */}
          {showCounter && (
            <Reveal>
              <Card>
                <CardHeader><CardTitle className="text-base">Counter Offer</CardTitle></CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onCounterSubmit)} className="space-y-3">
                    <div className="space-y-1.5">
                      <Label>Price (UGX)</Label>
                      <Input type="number" {...register("price")} />
                      {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label>Quantity</Label>
                      <Input type="number" {...register("quantity")} />
                      {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label>Message</Label>
                      <Textarea rows={2} {...register("message")} />
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setShowCounter(false)}>Cancel</Button>
                      <Button type="submit" className="flex-1" loading={countering}>Send Counter</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </Reveal>
          )}
        </div>
      </div>

      {/* Messages thread */}
      <Reveal>
        <OfferMessagesThread offer={offer} className="mt-6" />
      </Reveal>
    </div>
  );
}
