"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { searchService } from "@/lib/api";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";

export default function GlobalSearchPage() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");

  const searchQuery = useQuery({
    queryKey: ["global-search", submitted],
    queryFn: () => searchService.search(submitted),
    enabled: submitted.trim().length > 1,
  });

  const results = searchQuery.data ?? [];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Global Search"
        subtitle="Search products, advisories, alerts, orders, and shipments across workspaces."
        breadcrumbs={[{ label: "App", href: "/app" }, { label: "Search" }]}
      />

      <Card>
        <CardContent className="space-y-4 pt-6">
          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(query);
            }}
          >
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search listings, advisories, alerts, orders, shipments"
            />
            <Button type="submit" className="sm:min-w-[120px]">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>

          {submitted.trim().length > 1 && results.length === 0 && !searchQuery.isLoading ? (
            <EmptyState title="No matching records" description="Try broader keywords or switch to another workspace." />
          ) : (
            results.map((result) => (
              <div key={`${result.entity}-${result.id}`} className="rounded-xl border border-border/60 bg-background/60 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{result.title}</p>
                    <p className="text-xs text-muted-foreground">{result.entity}</p>
                  </div>
                  <Badge variant="outline">{result.status}</Badge>
                </div>
                <div className="mt-2 text-sm">
                  <Link className="text-primary hover:underline" href={result.route}>
                    Open in {result.workspace}
                  </Link>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
