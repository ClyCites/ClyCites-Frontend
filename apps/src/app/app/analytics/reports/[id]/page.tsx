import { AnalyticsEntityDetailPage } from "@/app/app/analytics/_components/AnalyticsEntityDetailPage";

interface AnalyticsReportsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AnalyticsReportsDetailPage({ params }: AnalyticsReportsDetailPageProps) {
  const { id } = await params;
  return <AnalyticsEntityDetailPage entityKey="reports" recordId={id} />;
}
