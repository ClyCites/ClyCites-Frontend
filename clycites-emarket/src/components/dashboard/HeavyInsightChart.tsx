"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HeavyInsightChartProps {
  title: string;
  series?: number[];
}

export default function HeavyInsightChart({ title, series }: HeavyInsightChartProps) {
  const points = useMemo(() => series ?? [14, 22, 19, 31, 27, 35, 29, 41, 38, 44, 42, 47], [series]);

  const max = Math.max(...points, 1);
  const path = points
    .map((point, idx) => {
      const x = (idx / Math.max(points.length - 1, 1)) * 100;
      const y = 100 - (point / max) * 90;
      return `${idx === 0 ? "M" : "L"} ${x},${y}`;
    })
    .join(" ");

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-56 rounded-xl border border-border/70 bg-card/70 p-3">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.04" />
              </linearGradient>
            </defs>
            <path d={`${path} L 100,100 L 0,100 Z`} fill="url(#lineGradient)" />
            <path d={path} fill="none" stroke="hsl(var(--primary))" strokeWidth="1.8" />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
