"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOfferStats } from "@/lib/query/offers.hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, MessageCircle, CheckCircle, XCircle } from "lucide-react";
import type { ComponentProps } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<ComponentProps<"svg">>;
  variant?: "default" | "success" | "warning" | "danger";
}

function StatCard({ title, value, icon: Icon, variant = "default" }: StatCardProps) {
  const colors = {
    default: "text-muted-foreground bg-muted/50",
    success: "text-green-700 bg-green-100",
    warning: "text-orange-700 bg-orange-100",
    danger: "text-red-700 bg-red-100",
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`rounded-lg p-2.5 ${colors[variant]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="text-xl font-bold tracking-tight mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export function OfferStatsWidget({ className }: { className?: string }) {
  const { data: stats, isLoading } = useOfferStats();

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Offer Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-12" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Offer Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard title="Sent" value={stats.sent} icon={TrendingUp} variant="default" />
          <StatCard title="Received" value={stats.received} icon={TrendingDown} variant="default" />
          <StatCard title="Pending" value={stats.pending} icon={MessageCircle} variant="warning" />
          <StatCard title="Accepted" value={stats.accepted} icon={CheckCircle} variant="success" />
          <StatCard title="Rejected" value={stats.rejected} icon={XCircle} variant="danger" />
          <StatCard 
            title="Total Value" 
            value={stats.totalValue > 0 ? formatCurrency(stats.totalValue) : "—"} 
            icon={TrendingUp} 
            variant="success" 
          />
        </div>
      </CardContent>
    </Card>
  );
}
