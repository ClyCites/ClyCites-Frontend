"use client";
import { useState } from "react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, Column } from "@/components/market/DataTable";
import { Badge } from "@/components/ui/badge";
import { useOrders } from "@/lib/query/orders.hooks";
import { Order, OrderFilters, OrderStatus } from "@/lib/api/types/order.types";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { Reveal } from "@/lib/motion";
import { cn } from "@/lib/utils";

const statusVariant: Record<OrderStatus, string> = {
  pending:    "warning",
  confirmed:  "secondary",
  processing: "secondary",
  shipped:    "secondary",
  delivered:  "success",
  completed:  "success",
  cancelled:  "destructive",
};

const columns: Column<Order>[] = [
  {
    key: "id",
    header: "Order ID",
    render: (row) => (
      <Link href={`/orders/${row.id}`} className="font-mono text-xs font-medium hover:text-primary transition-colors">
        #{row.id.slice(-8).toUpperCase()}
      </Link>
    ),
  },
  {
    key: "product",
    header: "Product",
    render: (row) => {
      const name = typeof row.product === "string" ? row.product : (row.product as { name?: string })?.name ?? "—";
      return <span className="font-medium">{name}</span>;
    },
  },
  {
    key: "quantity",
    header: "Qty",
    sortable: true,
    render: (row) => <span>{row.quantity}</span>,
  },
  {
    key: "finalAmount",
    header: "Amount",
    sortable: true,
    render: (row) => (
      <span className="font-semibold text-primary">{formatCurrency(row.finalAmount ?? row.totalAmount, row.currency)}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <Badge variant={statusVariant[row.status] as "warning" | "secondary" | "success" | "destructive" ?? "muted"} className="capitalize">
        {row.status}
      </Badge>
    ),
  },
  {
    key: "createdAt",
    header: "Placed",
    sortable: true,
    render: (row) => <span className="text-muted-foreground text-xs">{formatRelativeTime(row.createdAt)}</span>,
  },
];

export default function OrdersPage() {
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filters: OrderFilters = {
    status: status !== "all" ? (status as OrderStatus) : undefined,
    page,
    limit:  15,
  };

  const { data, isLoading } = useOrders(filters);
  const orders = Array.isArray(data) ? data : (data as { data?: Order[] })?.data ?? [];
  const totalPages = (data as { pagination?: { totalPages?: number } })?.pagination?.totalPages ?? 1;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Reveal>
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">Track all your purchases and sales.</p>
        </div>
      </Reveal>

      <Reveal>
        <div className="flex justify-end mb-4">
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All statuses" />
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
        </div>

        <DataTable
          data={orders}
          columns={columns}
          isLoading={isLoading}
          emptyTitle="No orders yet"
          emptyDescription="Browse the marketplace and accept an offer to create an order."
          onRowClick={(row) => window.location.assign(`/orders/${row.id}`)}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </Reveal>
    </div>
  );
}
