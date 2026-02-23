"use client";
import { useState } from "react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, Column } from "@/components/market/DataTable";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api/endpoints/orders.api";
import { Order, OrderStatus, PaymentStatus } from "@/lib/api/types/order.types";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { Reveal } from "@/lib/motion";
import { ShieldCheck } from "lucide-react";

const statusVariant: Record<OrderStatus, string> = {
  pending: "warning",
  confirmed: "secondary",
  processing: "default",
  shipped: "default",
  delivered: "success",
  cancelled: "destructive",
  completed: "success",
};

const paymentVariant: Record<PaymentStatus, string> = {
  pending: "warning",
  paid: "success",
  failed: "destructive",
  refunded: "secondary",
  in_escrow: "default",
};

const columns: Column<Order>[] = [
  {
    key: "id",
    header: "Order ID",
    render: (order) => (
      <Link href={`/orders/${order.id}`} className="font-mono text-xs hover:underline">
        {order.id.slice(0, 8)}...
      </Link>
    ),
  },
  {
    key: "listing",
    header: "Product",
    render: (order) => {
      const listing = order.listing as { product?: { name?: string } };
      return listing?.product?.name ?? "Unknown Product";
    },
  },
  {
    key: "buyer",
    header: "Buyer",
    render: (order) => {
      const buyer = order.buyer as { firstName?: string; lastName?: string; email?: string };
      return `${buyer.firstName || ""} ${buyer.lastName || ""}`.trim() || buyer.email || "Unknown";
    },
  },
  {
    key: "seller",
    header: "Seller",
    render: (order) => {
      const seller = (order.listing as { farmer?: { name?: string; email?: string } })?.farmer;
      return seller?.name || seller?.email || "Unknown";
    },
  },
  {
    key: "total",
    header: "Total",
    render: (order) => (
      <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (order) => (
      <Badge variant={statusVariant[order.status] as "default"}>
        {order.status}
      </Badge>
    ),
  },
  {
    key: "paymentStatus",
    header: "Payment",
    render: (order) => (
      <Badge variant={paymentVariant[order.paymentStatus] as "default"}>
        {order.paymentStatus}
      </Badge>
    ),
  },
  {
    key: "createdAt",
    header: "Created",
    render: (order) => formatRelativeTime(order.createdAt),
  },
];

export default function AdminOrdersPage() {
  const [status, setStatus] = useState<string>("all");
  const [paymentStatus, setPaymentStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filters = {
    status: status !== "all" ? (status as OrderStatus) : undefined,
    paymentStatus: paymentStatus !== "all" ? (paymentStatus as PaymentStatus) : undefined,
    page,
    limit: 20,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "orders", filters],
    queryFn: () => ordersApi.adminListAll(filters),
  });

  const orders = Array.isArray(data) ? data : (data as { data?: Order[] })?.data ?? [];
  const totalPages = (data as { pagination?: { totalPages?: number } })?.pagination?.totalPages ?? 1;

  // Client-side search filter
  const filteredOrders = search
    ? orders.filter((order) => {
        const searchLower = search.toLowerCase();
        const listing = order.listing as { product?: { name?: string } };
        const buyer = order.buyer as { firstName?: string; lastName?: string; email?: string };
        const seller = (order.listing as { farmer?: { name?: string; email?: string } })?.farmer;
        
        return (
          order.id.toLowerCase().includes(searchLower) ||
          listing?.product?.name?.toLowerCase().includes(searchLower) ||
          buyer.firstName?.toLowerCase().includes(searchLower) ||
          buyer.lastName?.toLowerCase().includes(searchLower) ||
          buyer.email?.toLowerCase().includes(searchLower) ||
          seller?.name?.toLowerCase().includes(searchLower) ||
          seller?.email?.toLowerCase().includes(searchLower)
        );
      })
    : orders;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Reveal>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Admin: All Orders</h1>
          </div>
          <p className="text-muted-foreground">Manage all orders across the platform</p>
        </div>
      </Reveal>

      <Reveal>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <CardTitle className="text-base flex-1">Orders</CardTitle>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-60"
                />
                <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={paymentStatus} onValueChange={(v) => { setPaymentStatus(v); setPage(1); }}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All payments</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={filteredOrders}
              isLoading={isLoading}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
