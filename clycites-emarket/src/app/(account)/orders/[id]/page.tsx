"use client";
import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OrderStatusStepper } from "@/components/orders/OrderStatusStepper";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { useOrder, useCancelOrder, useConfirmDelivery } from "@/lib/query/orders.hooks";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "@/components/ui/use-toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Reveal } from "@/lib/motion";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const { data: order, isLoading, isError, refetch } = useOrder(id);
  const { mutate: cancelOrder,    isPending: cancelling  } = useCancelOrder(id);
  const { mutate: confirmDelivery, isPending: confirming } = useConfirmDelivery(id);

  if (isLoading) return <LoadingState text="Loading order…" className="min-h-[60vh]" />;
  if (isError || !order) return <ErrorState title="Order not found" onRetry={refetch} className="min-h-[60vh]" />;

  const buyerId = typeof order.buyer === "string" ? order.buyer : (order.buyer as { id?: string })?.id;
  const isBuyer = user?.id === buyerId;

  const canCancel  = isBuyer && ["pending", "confirmed"].includes(order.status);
  const canConfirm = isBuyer && order.status === "delivered";

  const productName = typeof order.product === "string" ? order.product : (order.product as { name?: string })?.name ?? "Product";

  const paymentVariant: Record<string, "success" | "warning" | "destructive"> = {
    paid:    "success",
    pending: "warning",
    failed:  "destructive",
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
        <Link href="/orders"><ArrowLeft className="h-4 w-4" /> Back to Orders</Link>
      </Button>

      <Reveal>
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold">Order <span className="font-mono">#{id.slice(-8).toUpperCase()}</span></h1>
            <p className="text-sm text-muted-foreground mt-1">Placed {formatDate(order.createdAt)}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Badge variant={paymentVariant[order.paymentStatus] ?? "muted"} className="capitalize">
              {order.paymentStatus}
            </Badge>
          </div>
        </div>
      </Reveal>

      {/* Status stepper */}
      <Reveal>
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-base">Order Status</CardTitle></CardHeader>
          <CardContent>
            <OrderStatusStepper status={order.status} />
          </CardContent>
        </Card>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary */}
        <Reveal>
          <Card>
            <CardHeader><CardTitle className="text-base">Order Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product</span>
                <span className="font-medium">{productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity</span>
                <span className="font-medium">{order.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unit price</span>
                <span>{formatCurrency(order.unitPrice, order.currency)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(order.finalAmount ?? order.totalAmount, order.currency)}</span>
              </div>
            </CardContent>
          </Card>
        </Reveal>

        {/* Delivery */}
        <Reveal>
          <Card>
            <CardHeader><CardTitle className="text-base">Delivery Address</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              {order.deliveryAddress ? (
                <>
                  {order.deliveryAddress.address && <p className="text-muted-foreground">{order.deliveryAddress.address}</p>}
                  <p className="text-muted-foreground">{[order.deliveryAddress.city, order.deliveryAddress.region].filter(Boolean).join(", ")}</p>
                </>
              ) : (
                <p className="text-muted-foreground">No delivery address provided.</p>
              )}
            </CardContent>
          </Card>
        </Reveal>
      </div>

      {/* Actions */}
      {(canCancel || canConfirm) && (
        <Reveal>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {canConfirm && (
              <Button className="flex-1" onClick={() => {
                confirmDelivery(undefined, {
                  onSuccess: () => toast({ title: "Delivery confirmed!", variant: "success" }),
                  onError:   (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
                });
              }} loading={confirming}>
                Confirm Delivery Received
              </Button>
            )}
            {canCancel && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="flex-1 text-destructive hover:text-destructive" loading={cancelling}>
                    Cancel Order
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                    <AlertDialogDescription>This cannot be undone. A cancellation request will be sent.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Order</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => cancelOrder({ reason: "Buyer requested cancellation" }, {
                        onSuccess: () => toast({ title: "Order cancellation requested." }),
                        onError:   (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
                      })}
                    >
                      Cancel Order
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </Reveal>
      )}
    </div>
  );
}
