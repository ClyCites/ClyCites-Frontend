import { AnalyticsEntityFormPage } from "@/app/app/analytics/_components/AnalyticsEntityFormPage";

interface AnalyticsEditDashboardsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AnalyticsEditDashboardsPage({ params }: AnalyticsEditDashboardsPageProps) {
  const { id } = await params;
  return <AnalyticsEntityFormPage entityKey="dashboards" mode="edit" recordId={id} />;
}
