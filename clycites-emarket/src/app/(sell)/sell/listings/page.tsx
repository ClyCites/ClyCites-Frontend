"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, Eye, Pencil, Play, Pause, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, Column } from "@/components/market/DataTable";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useMyListings, usePublishListing, usePauseListing, useDeleteListing } from "@/lib/query/listings.hooks";
import { Listing, ListingStatus } from "@/lib/api/types/listing.types";
import { toast } from "@/components/ui/use-toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Reveal } from "@/lib/motion";

const statusVariant: Record<ListingStatus, "success" | "muted" | "warning" | "destructive"> = {
  active:  "success",
  draft:   "muted",
  expired: "destructive",
  sold:    "warning",
};

export default function MyListingsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyListings({ page, limit: 15 });
  const listings = Array.isArray(data) ? data : (data as { data?: Listing[] })?.data ?? [];
  const totalPages = (data as { pagination?: { totalPages?: number } })?.pagination?.totalPages ?? 1;

  const { mutate: publish } = usePublishListing();
  const { mutate: pause   } = usePauseListing();
  const { mutate: del     } = useDeleteListing();

  const act = (fn: (id: string) => void, id: string, successMsg: string) => {
    fn(id);
    toast({ title: successMsg, variant: "success" });
  };

  const columns: Column<Listing>[] = [
    {
      key: "product",
      header: "Product",
      render: (row) => {
        const name = typeof row.product === "string" ? row.product : row.product?.name ?? "Product";
        return <span className="font-medium">{name}</span>;
      },
    },
    {
      key: "price",
      header: "Price",
      sortable: true,
      render: (row) => <span className="text-primary font-semibold">{formatCurrency(row.price, row.currency)}</span>,
    },
    {
      key: "quantity",
      header: "Qty",
      sortable: true,
      render: (row) => <span>{row.quantity} {row.unit ?? "kg"}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={statusVariant[row.status] ?? "muted"} className="capitalize">{row.status}</Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      render: (row) => <span className="text-xs text-muted-foreground">{formatDate(row.createdAt)}</span>,
    },
    {
      key: "id",
      header: "Actions",
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
              <span className="sr-only">Actions</span>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem asChild>
              <Link href={`/market/listings/${row.id}`}><Eye className="h-4 w-4" /> View</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/sell/listings/${row.id}/edit`}><Pencil className="h-4 w-4" /> Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {row.status === "draft" && (
              <DropdownMenuItem onClick={() => act(publish, row.id, "Listing published!")}>
                <Play className="h-4 w-4" /> Publish
              </DropdownMenuItem>
            )}
            {row.status === "active" && (
              <DropdownMenuItem onClick={() => act(pause, row.id, "Listing paused.")}>
                <Pause className="h-4 w-4" /> Pause
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                  <Trash2 className="h-4 w-4" /> Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
                  <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => del(row.id, { onSuccess: () => toast({ title: "Listing deleted." }) })}
                  >Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Reveal>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Listings</h1>
            <p className="text-muted-foreground mt-1">Manage your agricultural produce listings.</p>
          </div>
          <Button asChild>
            <Link href="/sell/listings/new"><Plus className="h-4 w-4" /> New Listing</Link>
          </Button>
        </div>
      </Reveal>

      <Reveal>
        <DataTable
          data={listings}
          columns={columns}
          isLoading={isLoading}
          emptyTitle="No listings yet"
          emptyDescription="Create your first listing to start selling."
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </Reveal>
    </div>
  );
}
