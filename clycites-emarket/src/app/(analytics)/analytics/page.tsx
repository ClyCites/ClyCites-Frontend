"use client";

import { BarChart3, LineChart, PieChart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-purple-600" />
            Analytics & Insights
          </h1>
          <p className="text-muted-foreground mt-1">
            Custom dashboards and data visualization
          </p>
        </div>
        <Button>Create Dashboard</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-blue-600" />
              Sales Trends
            </CardTitle>
            <CardDescription>Monthly revenue analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              Chart preview
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Market Performance
            </CardTitle>
            <CardDescription>Listings and orders KPIs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              Chart preview
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Coming Soon
            </CardTitle>
            <CardDescription>Advanced analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Chart builder, custom dashboards, and data exports
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
