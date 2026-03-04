import { AnalyticsEntityDetailPage } from "@/app/app/analytics/_components/AnalyticsEntityDetailPage";

interface AnalyticsDashboardsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AnalyticsDashboardsDetailPage({ params }: AnalyticsDashboardsDetailPageProps) {
  const { id } = await params;
  return <AnalyticsEntityDetailPage entityKey="dashboards" recordId={id} />;
}
