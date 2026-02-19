"use client";
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { useListing, useUpdateListing } from "@/lib/query/listings.hooks";
import { toast } from "@/components/ui/use-toast";
import { Reveal } from "@/lib/motion";

const schema = z.object({
  quantity:    z.coerce.number().positive("Must be positive"),
  unit:        z.string().min(1, "Unit is required"),
  price:       z.coerce.number().positive("Must be positive"),
  currency:    z.string().default("UGX"),
  harvestDate: z.string().optional(),
  expiryDate:  z.string().optional(),
  region:      z.string().optional(),
  district:    z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: listing, isLoading, isError } = useListing(id);
  const { mutate: updateListing, isPending } = useUpdateListing();

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Pre-fill form once listing loads
  useEffect(() => {
    if (listing) {
      reset({
        quantity:    listing.quantity,
        unit:        listing.unit ?? "kg",
        price:       listing.price,
        currency:    listing.currency ?? "UGX",
        harvestDate: listing.harvestDate ? listing.harvestDate.slice(0, 10) : "",
        expiryDate:  listing.expiryDate  ? listing.expiryDate.slice(0, 10)  : "",
        region:      listing.location?.region   ?? "",
        district:    listing.location?.district ?? "",
      });
    }
  }, [listing, reset]);

  if (isLoading) return <LoadingState text="Loading listing…" className="min-h-[60vh]" />;
  if (isError || !listing) return <ErrorState title="Listing not found" className="min-h-[60vh]" />;

  const onSubmit = (data: FormData) => {
    updateListing(
      {
        id,
        data: {
          quantity:    data.quantity,
          unit:        data.unit,
          price:       data.price,
          currency:    data.currency,
          harvestDate: data.harvestDate || undefined,
          expiryDate:  data.expiryDate  || undefined,
          location:    (data.region || data.district)
            ? { region: data.region || "", district: data.district || "" }
            : undefined,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Listing updated!", variant: "success" });
          router.push("/sell/listings");
        },
        onError: (e) => {
          toast({ title: "Failed to update", description: e.message, variant: "destructive" });
        },
      }
    );
  };

  const productName = typeof listing.product === "string" ? listing.product : listing.product?.name ?? "Listing";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
        <Link href="/sell/listings"><ArrowLeft className="h-4 w-4" /> Back to Listings</Link>
      </Button>

      <Reveal>
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Edit Listing</h1>
          <p className="text-muted-foreground mt-1">{productName}</p>
        </div>
      </Reveal>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Quantity & Unit */}
        <Reveal>
          <Card>
            <CardHeader><CardTitle className="text-base">Quantity</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Quantity <span className="text-destructive">*</span></Label>
                <Input type="number" step="0.01" {...register("quantity")} />
                {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Unit</Label>
                <Select defaultValue={listing.unit ?? "kg"} onValueChange={(v) => setValue("unit", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="ton">ton</SelectItem>
                    <SelectItem value="bag">bag</SelectItem>
                    <SelectItem value="crate">crate</SelectItem>
                    <SelectItem value="bunch">bunch</SelectItem>
                    <SelectItem value="piece">piece</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </Reveal>

        {/* Pricing */}
        <Reveal>
          <Card>
            <CardHeader><CardTitle className="text-base">Pricing</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Price per unit <span className="text-destructive">*</span></Label>
                <Input type="number" step="0.01" {...register("price")} />
                {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Currency</Label>
                <Select defaultValue={listing.currency ?? "UGX"} onValueChange={(v) => setValue("currency", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UGX">UGX</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="KES">KES</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </Reveal>

        {/* Dates */}
        <Reveal>
          <Card>
            <CardHeader><CardTitle className="text-base">Harvest &amp; Expiry</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Harvest Date</Label>
                <Input type="date" {...register("harvestDate")} />
              </div>
              <div className="space-y-1.5">
                <Label>Listing Expiry</Label>
                <Input type="date" {...register("expiryDate")} />
              </div>
            </CardContent>
          </Card>
        </Reveal>

        {/* Location */}
        <Reveal>
          <Card>
            <CardHeader><CardTitle className="text-base">Location</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Region</Label>
                <Input placeholder="e.g. Central" {...register("region")} />
              </div>
              <div className="space-y-1.5">
                <Label>District</Label>
                <Input placeholder="e.g. Kampala" {...register("district")} />
              </div>
            </CardContent>
          </Card>
        </Reveal>

        <Reveal>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" asChild>
              <Link href="/sell/listings">Cancel</Link>
            </Button>
            <Button type="submit" loading={isPending}>Save Changes</Button>
          </div>
        </Reveal>
      </form>
    </div>
  );
}
