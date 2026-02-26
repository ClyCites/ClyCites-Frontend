import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface KpiCardProps {
  title: string;
  value: string;
  trend?: string;
  caption?: string;
}

export function KpiCard({ title, value, trend, caption }: KpiCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-display text-2xl font-bold">{value}</p>
        <div className="mt-2 flex items-center gap-2">
          {trend && (
            <Badge variant="outline" className="text-[11px]">
              {trend}
            </Badge>
          )}
          {caption && <p className="text-xs text-muted-foreground">{caption}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
