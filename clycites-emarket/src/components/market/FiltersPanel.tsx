"use client";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ListingFilters } from "@/lib/api/types/listing.types";
import { cn } from "@/lib/utils";

interface FiltersPanelProps {
  filters: ListingFilters;
  onFilterChange: (filters: ListingFilters) => void;
  className?: string;
}

function FiltersContent({ filters, onFilterChange }: FiltersPanelProps) {
  const update = (key: keyof ListingFilters, value: string | number | undefined) =>
    onFilterChange({ ...filters, [key]: value || undefined });

  const clearAll = () => onFilterChange({ page: 1, limit: filters.limit });

  const hasActiveFilters = !!(filters.search || filters.region || filters.district || filters.minPrice || filters.maxPrice || filters.sortBy);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground">
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Search</Label>
        <Input
          placeholder="Search products…"
          value={filters.search ?? ""}
          onChange={(e) => update("search", e.target.value)}
        />
      </div>

      <Separator />

      {/* Sort */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Sort by</Label>
        <Select value={filters.sortBy ?? ""} onValueChange={(v) => update("sortBy", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt_desc">Newest first</SelectItem>
            <SelectItem value="createdAt_asc">Oldest first</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Price range */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Price range (UGX)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ""}
            onChange={(e) => update("minPrice", e.target.value ? Number(e.target.value) : undefined)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ""}
            onChange={(e) => update("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
      </div>

      <Separator />

      {/* Location */}
      <div className="space-y-3">
        <Label className="text-xs font-medium">Location</Label>
        <Input
          placeholder="Region"
          value={filters.region ?? ""}
          onChange={(e) => update("region", e.target.value)}
        />
        <Input
          placeholder="District"
          value={filters.district ?? ""}
          onChange={(e) => update("district", e.target.value)}
        />
      </div>
    </div>
  );
}

export function FiltersPanel({ filters, onFilterChange, className }: FiltersPanelProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={cn("hidden lg:block w-64 shrink-0", className)}>
        <div className="sticky top-24 rounded-xl border bg-background p-5">
          <FiltersContent filters={filters} onFilterChange={onFilterChange} />
        </div>
      </aside>

      {/* Mobile sheet trigger */}
      <div className="lg:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FiltersContent filters={filters} onFilterChange={(f) => { onFilterChange(f); }} />
            </div>
            <div className="mt-6">
              <Button className="w-full" onClick={() => setSheetOpen(false)}>Apply Filters</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
