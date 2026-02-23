"use client";
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
import { useCreateListing } from "@/lib/query/listings.hooks";
import { toast } from "@/components/ui/use-toast";
import { Reveal } from "@/lib/motion";

const schema = z.object({
  productId:   z.string().min(1, "Product is required"),
  quantity:    z.coerce.number().positive("Must be positive"),
  unit:        z.string().min(1, "Unit is required"),
  price:       z.coerce.number().positive("Must be positive"),
  currency:    z.string().default("UGX"),
  harvestDate: z.string().min(1, "Harvest date is required"),
  expiryDate:  z.string().optional(),
  region:      z.string().optional(),
  district:    z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewListingPage() {
  const router = useRouter();
  const { mutate: createListing, isPending } = useCreateListing();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: { currency: "UGX", unit: "kg" },
  });

  const onSubmit = (data: FormData) => {
    createListing(
      {
        product:     data.productId,
        quantity:    data.quantity,
        unit:        data.unit,
        price:       data.price,
        currency:    data.currency,
        harvestDate: data.harvestDate,
        expiryDate:  data.expiryDate || undefined,
        location:    (data.region || data.district)
          ? { region: data.region || "", district: data.district || "" }
          : undefined,
      },
      {
        onSuccess: () => {
          toast({ title: "Listing created!", description: "Published to the marketplace.", variant: "success" });
          router.push(`/sell/listings`);
        },
        onError: (e) => {
          toast({ title: "Failed to create listing", description: e.message, variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
        <Link href="/sell/listings"><ArrowLeft className="h-4 w-4" /> Back to Listings</Link>
      </Button>

      <Reveal>
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">New Listing</h1>
          <p className="text-muted-foreground mt-1">List your produce on the ClyCites marketplace.</p>
        </div>
      </Reveal>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Product info */}
        <Reveal>
          <Card>
            <CardHeader><CardTitle className="text-base">Product Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Product ID <span className="text-destructive">*</span></Label>
                <Input placeholder="Enter product ID" {...register("productId")} />
                {errors.productId && <p className="text-xs text-destructive">{errors.productId.message}</p>}
                <p className="text-xs text-muted-foreground">The ID of the crop/product from the product catalog.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Quantity <span className="text-destructive">*</span></Label>
                  <Input type="number" step="0.01" placeholder="100" {...register("quantity")} />
                  {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Unit <span className="text-destructive">*</span></Label>
                  <Select defaultValue="kg" onValueChange={(v) => setValue("unit", v)}>
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
              </div>
            </CardContent>
          </Card>
        </Reveal>

        {/* Pricing */}
        <Reveal>
          <Card>
            <CardHeader><CardTitle className="text-base">Pricing</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Price per unit <span className="text-destructive">*</span></Label>
                  <Input type="number" step="0.01" placeholder="5000" {...register("price")} />
                  {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Currency</Label>
                  <Select defaultValue="UGX" onValueChange={(v) => setValue("currency", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UGX">UGX</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="KES">KES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                <Label>Harvest Date <span className="text-destructive">*</span></Label>
                <Input type="date" {...register("harvestDate")} />
                {errors.harvestDate && <p className="text-xs text-destructive">{errors.harvestDate.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Listing Expiry <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input type="date" {...register("expiryDate")} />
              </div>
            </CardContent>
          </Card>
        </Reveal>

        {/* Location */}
        <Reveal>
          <Card>
            <CardHeader><CardTitle className="text-base">Location <span className="text-muted-foreground font-normal text-sm">(optional)</span></CardTitle></CardHeader>
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
            <Button type="submit" loading={isPending}>Create Listing</Button>
          </div>
        </Reveal>
      </form>
    </div>
  );
}
