"use client";

import { DollarSign, TrendingUp, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PricesPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          <DollarSign className="h-8 w-8 text-lime-600" />
          Price Board
        </h1>
        <p className="mt-1 text-muted-foreground">
          Commodity prices, market trends, and pricing intelligence.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Live Commodity Rates
            </CardTitle>
            <CardDescription>Current market price snapshots</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Use this view to monitor current rates across major commodities.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Historical Trends
            </CardTitle>
            <CardDescription>Track movement over time</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Compare daily, weekly, and monthly shifts for better pricing decisions.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-amber-600" />
              Price Alerts
            </CardTitle>
            <CardDescription>Threshold-driven notifications</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Configure alerts for sudden changes in market prices and volatility.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
