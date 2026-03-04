import { AnalyticsEntityDetailPage } from "@/app/app/analytics/_components/AnalyticsEntityDetailPage";

interface AnalyticsDatasetsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AnalyticsDatasetsDetailPage({ params }: AnalyticsDatasetsDetailPageProps) {
  const { id } = await params;
  return <AnalyticsEntityDetailPage entityKey="datasets" recordId={id} />;
}
