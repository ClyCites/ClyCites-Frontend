export const CHART_DATASETS = [
  "platform_health",
  "market_sales_daily",
  "market_sales_weekly",
  "farmer_performance",
  "org_performance",
  "product_demand",
  "price_trends",
  "pest_disease_outbreaks",
  "weather_alerts",
  "user_adoption",
  "order_funnel",
  "advisory_engagement",
  "export_data",
  "dispute_resolution",
  "payment_metrics",
  "listing_analytics",
  "notification_delivery",
] as const;

export const CHART_METRIC_TYPES = [
  "count",
  "sum",
  "avg",
  "min",
  "max",
  "distinct_count",
  "rate",
  "growth_rate",
  "percentile",
  "stddev",
] as const;

export const CHART_DIMENSION_TYPES = [
  "date_day",
  "date_week",
  "date_month",
  "date_quarter",
  "date_year",
  "region",
  "district",
  "product",
  "category",
  "farmer",
  "organization",
  "status",
  "channel",
  "role",
  "crop_type",
  "market",
  "expert",
  "disease_type",
  "alert_type",
  "payment_method",
  "dispute_type",
] as const;

export const CHART_TYPES = [
  "line",
  "bar",
  "area",
  "stacked_bar",
  "pie",
  "donut",
  "scatter",
  "heatmap",
  "funnel",
  "gauge",
  "table",
  "combo",
] as const;

export type ChartDatasetId = (typeof CHART_DATASETS)[number];
export type ChartMetricType = (typeof CHART_METRIC_TYPES)[number];
export type ChartDimensionType = (typeof CHART_DIMENSION_TYPES)[number];
export type SupportedChartType = (typeof CHART_TYPES)[number];

export function toOptionLabel(value: string): string {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
