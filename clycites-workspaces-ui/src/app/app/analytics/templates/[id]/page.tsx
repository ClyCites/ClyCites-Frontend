import { AnalyticsEntityDetailPage } from "@/app/app/analytics/_components/AnalyticsEntityDetailPage";

interface AnalyticsTemplatesDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AnalyticsTemplatesDetailPage({ params }: AnalyticsTemplatesDetailPageProps) {
  const { id } = await params;
  return <AnalyticsEntityDetailPage entityKey="templates" recordId={id} />;
}
