import { AnalyticsEntityDetailPage } from "@/app/app/analytics/_components/AnalyticsEntityDetailPage";

interface AnalyticsChartsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AnalyticsChartsDetailPage({ params }: AnalyticsChartsDetailPageProps) {
  const { id } = await params;
  return <AnalyticsEntityDetailPage entityKey="charts" recordId={id} />;
}
