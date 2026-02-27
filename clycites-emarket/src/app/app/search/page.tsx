"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchService } from "@/lib/api/mock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function GlobalSearchPage() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");

  const searchQuery = useQuery({
    queryKey: ["global-search", submitted],
    queryFn: () => searchService.search(submitted),
    enabled: submitted.trim().length > 1,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Search</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(query);
          }}
        >
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search listings, advisories, alerts, orders, shipments" />
          <Button type="submit">Search</Button>
        </form>

        {searchQuery.data?.map((result) => (
          <div key={`${result.entity}-${result.id}`} className="rounded-lg border p-3">
            <div className="flex items-center justify-between">
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
        ))}
      </CardContent>
    </Card>
  );
}
