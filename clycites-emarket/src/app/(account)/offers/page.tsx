"use client";
import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, Column } from "@/components/market/DataTable";
import { OfferStatusBadge } from "@/components/offers/OfferStatusBadge";
import { Badge } from "@/components/ui/badge";
import { useOffers } from "@/lib/query/offers.hooks";
import { Offer, OfferFilters, OfferStatus } from "@/lib/api/types/offer.types";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { Reveal } from "@/lib/motion";

const columns: Column<Offer>[] = [
  {
    key: "listing",
    header: "Listing",
    render: (row) => {
      const name = typeof row.listing === "string" ? row.listing
        : (row.listing as { product?: { name?: string } })?.product?.name ?? "Listing";
      return <Link href={`/offers/${row.id}`} className="font-medium hover:text-primary transition-colors">{name}</Link>;
    },
  },
  {
    key: "price",
    header: "Offered Price",
    sortable: true,
    render: (row) => (
      <span className="font-semibold text-primary">{formatCurrency(row.price, row.currency)}</span>
    ),
  },
  {
    key: "quantity",
    header: "Qty",
    sortable: true,
    render: (row) => <span>{row.quantity}</span>,
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <OfferStatusBadge status={row.status} />,
  },
  {
    key: "createdAt",
    header: "Submitted",
    sortable: true,
    render: (row) => <span className="text-muted-foreground text-xs">{formatRelativeTime(row.createdAt)}</span>,
  },
];

export default function OffersPage() {
  const [tab, setTab] = useState<"sent" | "received">("sent");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filters: OfferFilters = {
    role:   tab,
    status: status !== "all" ? (status as OfferStatus) : undefined,
    page,
    limit:  15,
  };

  const { data, isLoading, isError, refetch } = useOffers(filters);
  const offers = Array.isArray(data) ? data : (data as { data?: Offer[] })?.data ?? [];
  const totalPages = (data as { pagination?: { totalPages?: number } })?.pagination?.totalPages ?? 1;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Reveal>
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Offers</h1>
          <p className="text-muted-foreground mt-1">Track your buy and sell negotiations.</p>
        </div>
      </Reveal>

      <Reveal>
        <Tabs value={tab} onValueChange={(v) => { setTab(v as "sent" | "received"); setPage(1); }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="received">Received</TabsTrigger>
            </TabsList>

            <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="COUNTERED">Countered</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
                <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="sent">
            <DataTable
              data={offers}
              columns={columns}
              isLoading={isLoading}
              emptyTitle="No offers sent"
              emptyDescription="Browse the marketplace and make an offer on a listing."
              onRowClick={(row) => window.location.assign(`/offers/${row.id}`)}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </TabsContent>

          <TabsContent value="received">
            <DataTable
              data={offers}
              columns={columns}
              isLoading={isLoading}
              emptyTitle="No offers received"
              emptyDescription="Share your listings to attract buyers."
              onRowClick={(row) => window.location.assign(`/offers/${row.id}`)}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </TabsContent>
        </Tabs>
      </Reveal>
    </div>
  );
}
