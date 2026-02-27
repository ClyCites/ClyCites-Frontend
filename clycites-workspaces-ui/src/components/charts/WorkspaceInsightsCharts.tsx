"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { chartSeriesPalette } from "@/styles/design-system";

interface WorkspaceMetricDatum {
  name: string;
  total: number;
}

interface WorkspaceTrendDatum {
  period: string;
  records: number;
  alerts: number;
}

interface WorkspaceInsightsChartsProps {
  metrics: WorkspaceMetricDatum[];
  trend: WorkspaceTrendDatum[];
}

const palette = chartSeriesPalette;

export function WorkspaceInsightsCharts({ metrics, trend }: WorkspaceInsightsChartsProps) {
  const pieData = metrics.slice(0, 6).map((item) => ({
    name: item.name,
    value: item.total,
  }));

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 xl:col-span-8">
        <CardHeader>
          <CardTitle>Operational Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px] pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ top: 16, right: 18, left: -8, bottom: 10 }}>
              <CartesianGrid stroke="hsl(var(--border) / 0.5)" strokeDasharray="3 3" />
              <XAxis dataKey="period" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="records" stroke={palette[0]} strokeWidth={2.5} dot={false} name="Records" />
              <Line type="monotone" dataKey="alerts" stroke={palette[1]} strokeWidth={2.5} dot={false} name="Alerts" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-12 xl:col-span-4">
        <CardHeader>
          <CardTitle>Module Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px] pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={54}
                outerRadius={90}
                paddingAngle={3}
                stroke="hsl(var(--card))"
              >
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={palette[index % palette.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-12">
        <CardHeader>
          <CardTitle>Entity Volume Comparison</CardTitle>
        </CardHeader>
        <CardContent className="h-[260px] pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics} margin={{ top: 12, right: 16, left: -8, bottom: 8 }}>
              <CartesianGrid stroke="hsl(var(--border) / 0.45)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickLine={false} axisLine={false} interval={0} angle={-20} textAnchor="end" height={52} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted) / 0.25)" }}
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                {metrics.map((item, index) => (
                  <Cell key={item.name} fill={palette[index % palette.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
