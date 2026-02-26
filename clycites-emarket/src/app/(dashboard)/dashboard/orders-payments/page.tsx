"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreditCard, ReceiptText, ShoppingBag } from "lucide-react";
import { ordersApi } from "@/lib/api/endpoints/orders.api";
import { paymentsApi, type PaymentRecord } from "@/lib/api/endpoints/platform.api";
import type { Order } from "@/lib/api/types/order.types";
import { createIdempotencyKey } from "@/lib/api/http";
import { ApiErrorPanel } from "@/components/shared/ApiErrorPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable, type Column } from "@/components/market/DataTable";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatCurrency } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

export default function OrdersPaymentsPage() {
  const qc = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [orderForm, setOrderForm] = useState({
    listingId: "",
    quantity: "",
    deliveryRegion: "",
    deliveryDistrict: "",
    deliveryAddress: "",
  });
  const [paymentForm, setPaymentForm] = useState({
    orderId: "",
    amount: "",
    method: "wallet",
  });
  const [orderIdempotencyKey, setOrderIdempotencyKey] = useState(createIdempotencyKey());
  const [paymentIdempotencyKey, setPaymentIdempotencyKey] = useState(createIdempotencyKey());

  const ordersQuery = useQuery({
    queryKey: ["dashboard", "orders"],
    queryFn: () => ordersApi.list({ limit: 25 }),
  });

  const paymentsQuery = useQuery({
    queryKey: ["dashboard", "payments"],
    queryFn: () => paymentsApi.list({ limit: 25 }),
  });

  const createOrderMutation = useMutation({
    mutationFn: () =>
      ordersApi.create(
        {
          listingId: orderForm.listingId,
          quantity: Number(orderForm.quantity),
          deliveryAddress: {
            region: orderForm.deliveryRegion,
            district: orderForm.deliveryDistrict,
            address: orderForm.deliveryAddress,
          },
        },
        { idempotencyKey: orderIdempotencyKey }
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dashboard", "orders"] });
      setOrderForm({
        listingId: "",
        quantity: "",
        deliveryRegion: "",
        deliveryDistrict: "",
        deliveryAddress: "",
      });
      setOrderIdempotencyKey(createIdempotencyKey());
      toast({ title: "Order placed", variant: "success" });
    },
  });

  const createPaymentMutation = useMutation({
    mutationFn: () =>
      paymentsApi.create(
        {
          orderId: paymentForm.orderId,
          amount: Number(paymentForm.amount),
          method: paymentForm.method,
        },
        { idempotencyKey: paymentIdempotencyKey }
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dashboard", "payments"] });
      setPaymentForm({ orderId: "", amount: "", method: "wallet" });
      setPaymentIdempotencyKey(createIdempotencyKey());
      toast({ title: "Payment initiated", variant: "success" });
    },
  });

  const orderRows = useMemo(() => {
    const source = ordersQuery.data as { data?: Order[] } | Order[] | undefined;
    return Array.isArray(source) ? source : source?.data ?? [];
  }, [ordersQuery.data]);

  const paymentRows = useMemo(() => {
    const source = paymentsQuery.data as { data?: PaymentRecord[] } | PaymentRecord[] | undefined;
    return Array.isArray(source) ? source : source?.data ?? [];
  }, [paymentsQuery.data]);

  const orderColumns: Column<Order>[] = [
    { key: "id", header: "Order", render: (row) => <span className="font-mono text-xs">{row.id}</span> },
    { key: "status", header: "Status", render: (row) => <Badge variant="outline" className="capitalize">{row.status}</Badge> },
    { key: "paymentStatus", header: "Payment", render: (row) => <Badge variant="outline" className="capitalize">{row.paymentStatus}</Badge> },
    { key: "totalAmount", header: "Amount", render: (row) => formatCurrency(row.finalAmount ?? row.totalAmount, row.currency) },
    { key: "createdAt", header: "Created", render: (row) => <span className="text-xs text-muted-foreground">{row.createdAt}</span> },
  ];

  const paymentColumns: Column<PaymentRecord>[] = [
    { key: "id", header: "Payment", render: (row) => <span className="font-mono text-xs">{row.id}</span> },
    { key: "orderId", header: "Order", render: (row) => <span className="font-mono text-xs">{row.orderId ?? "N/A"}</span> },
    { key: "status", header: "Status", render: (row) => <Badge variant="outline" className="capitalize">{row.status}</Badge> },
    { key: "amount", header: "Amount", render: (row) => formatCurrency(row.amount, row.currency ?? "UGX") },
    { key: "method", header: "Method", render: (row) => row.method ?? "N/A" },
  ];

  return (
    <div className="space-y-6">
      {(ordersQuery.error || paymentsQuery.error || createOrderMutation.error || createPaymentMutation.error) && (
        <div className="grid gap-3">
          {ordersQuery.error && <ApiErrorPanel error={ordersQuery.error} />}
          {paymentsQuery.error && <ApiErrorPanel error={paymentsQuery.error} compact />}
          {createOrderMutation.error && <ApiErrorPanel error={createOrderMutation.error} compact />}
          {createPaymentMutation.error && <ApiErrorPanel error={createPaymentMutation.error} compact />}
        </div>
      )}

      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Place Order (Idempotent)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Listing ID</Label>
              <Input value={orderForm.listingId} onChange={(e) => setOrderForm((prev) => ({ ...prev, listingId: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Quantity</Label>
              <Input type="number" min={1} value={orderForm.quantity} onChange={(e) => setOrderForm((prev) => ({ ...prev, quantity: e.target.value }))} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Region</Label>
                <Input value={orderForm.deliveryRegion} onChange={(e) => setOrderForm((prev) => ({ ...prev, deliveryRegion: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>District</Label>
                <Input value={orderForm.deliveryDistrict} onChange={(e) => setOrderForm((prev) => ({ ...prev, deliveryDistrict: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Address</Label>
              <Input value={orderForm.deliveryAddress} onChange={(e) => setOrderForm((prev) => ({ ...prev, deliveryAddress: e.target.value }))} />
            </div>
            <div className="space-y-1.5 rounded-xl border border-border/70 bg-card/70 p-3">
              <Label className="text-xs text-muted-foreground">Idempotency-Key</Label>
              <Input value={orderIdempotencyKey} onChange={(e) => setOrderIdempotencyKey(e.target.value)} />
            </div>
            <Button
              onClick={() => createOrderMutation.mutate()}
              loading={createOrderMutation.isPending}
              disabled={!orderForm.listingId || Number(orderForm.quantity) <= 0}
            >
              Submit Order
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Initiate Payment (Idempotent)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Order ID</Label>
              <Input value={paymentForm.orderId} onChange={(e) => setPaymentForm((prev) => ({ ...prev, orderId: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Amount</Label>
              <Input type="number" min={1} value={paymentForm.amount} onChange={(e) => setPaymentForm((prev) => ({ ...prev, amount: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Method</Label>
              <Input value={paymentForm.method} onChange={(e) => setPaymentForm((prev) => ({ ...prev, method: e.target.value }))} />
            </div>
            <div className="space-y-1.5 rounded-xl border border-border/70 bg-card/70 p-3">
              <Label className="text-xs text-muted-foreground">Idempotency-Key</Label>
              <Input value={paymentIdempotencyKey} onChange={(e) => setPaymentIdempotencyKey(e.target.value)} />
            </div>
            <Button
              onClick={() => createPaymentMutation.mutate()}
              loading={createPaymentMutation.isPending}
              disabled={!paymentForm.orderId || Number(paymentForm.amount) <= 0}
            >
              Create Payment
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ReceiptText className="h-4 w-4" />
              Order Workflow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={orderRows}
              columns={orderColumns}
              isLoading={ordersQuery.isLoading}
              onRowClick={(row) => setSelectedOrder(row)}
              emptyTitle="No orders yet"
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Payment Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={paymentRows}
              columns={paymentColumns}
              isLoading={paymentsQuery.isLoading}
              onRowClick={(row) => setSelectedPayment(row)}
              emptyTitle="No payments yet"
            />
          </CardContent>
        </Card>
      </section>

      <Sheet open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Order Detail</SheetTitle>
            <SheetDescription>Request correlation and lifecycle detail</SheetDescription>
          </SheetHeader>
          {selectedOrder && (
            <div className="mt-4 space-y-2 text-sm">
              <p><span className="font-medium">Order ID:</span> {selectedOrder.id}</p>
              <p><span className="font-medium">Status:</span> {selectedOrder.status}</p>
              <p><span className="font-medium">Payment:</span> {selectedOrder.paymentStatus}</p>
              <p><span className="font-medium">Amount:</span> {formatCurrency(selectedOrder.finalAmount ?? selectedOrder.totalAmount, selectedOrder.currency)}</p>
              <p><span className="font-medium">Created:</span> {selectedOrder.createdAt}</p>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={!!selectedPayment} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Payment Detail</SheetTitle>
            <SheetDescription>Payment state and source order mapping</SheetDescription>
          </SheetHeader>
          {selectedPayment && (
            <div className="mt-4 space-y-2 text-sm">
              <p><span className="font-medium">Payment ID:</span> {selectedPayment.id}</p>
              <p><span className="font-medium">Order ID:</span> {selectedPayment.orderId ?? "N/A"}</p>
              <p><span className="font-medium">Status:</span> {selectedPayment.status}</p>
              <p><span className="font-medium">Method:</span> {selectedPayment.method ?? "N/A"}</p>
              <p><span className="font-medium">Amount:</span> {formatCurrency(selectedPayment.amount, selectedPayment.currency ?? "UGX")}</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
