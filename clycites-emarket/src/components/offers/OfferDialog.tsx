"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateOffer } from "@/lib/query/offers.hooks";
import { toast } from "@/components/ui/use-toast";
import { Listing } from "@/lib/api/types/listing.types";
import { formatCurrency } from "@/lib/utils";

const offerSchema = z.object({
  quantity:   z.coerce.number().positive("Quantity must be positive"),
  price:      z.coerce.number().positive("Price must be positive"),
  message:    z.string().optional(),
  expiresAt:  z.string().optional(),
});

type OfferForm = z.infer<typeof offerSchema>;

interface OfferDialogProps {
  listing: Listing;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OfferDialog({ listing, open, onOpenChange }: OfferDialogProps) {
  const { mutate: createOffer, isPending } = useCreateOffer(listing.id);

  const productName = typeof listing.product === "string" ? "Product" : (listing.product?.name ?? "Product");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<OfferForm>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(offerSchema) as any,
    defaultValues: { quantity: listing.quantity, price: listing.price },
  });

  const onSubmit = (data: OfferForm) => {
    createOffer(
      {
        offeredPrice: data.price,
        quantity:     data.quantity,
        message:      data.message,
        expiresAt:    data.expiresAt || undefined,
      },
      {
        onSuccess: () => {
          toast({ title: "Offer submitted!", description: "The seller will be notified.", variant: "success" });
          reset();
          onOpenChange(false);
        },
        onError: (err) => {
          toast({ title: "Failed to submit offer", description: err.message, variant: "destructive" });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Make an Offer</DialogTitle>
          <DialogDescription>
            Negotiate price and quantity for <strong>{productName}</strong>.
            Listed at {formatCurrency(listing.price, listing.currency)} / {listing.unit ?? "kg"}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Quantity ({listing.unit ?? "kg"})</Label>
              <Input type="number" step="0.01" {...register("quantity")} />
              {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Your Price (UGX)</Label>
              <Input type="number" step="1" {...register("price")} />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Message <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Textarea placeholder="Introduce yourself or mention collection details…" rows={3} {...register("message")} />
          </div>

          <div className="space-y-1.5">
            <Label>Offer Expiry <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Input type="datetime-local" {...register("expiresAt")} />
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" loading={isPending}>Submit Offer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
