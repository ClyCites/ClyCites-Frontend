import { AnalyticsEntityFormPage } from "@/app/app/analytics/_components/AnalyticsEntityFormPage";

interface AnalyticsEditChartsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AnalyticsEditChartsPage({ params }: AnalyticsEditChartsPageProps) {
  const { id } = await params;
  return <AnalyticsEntityFormPage entityKey="charts" mode="edit" recordId={id} />;
}
