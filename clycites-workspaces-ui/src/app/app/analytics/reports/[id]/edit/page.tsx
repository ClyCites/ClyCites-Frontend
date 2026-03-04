import { AnalyticsEntityFormPage } from "@/app/app/analytics/_components/AnalyticsEntityFormPage";

interface AnalyticsEditReportsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AnalyticsEditReportsPage({ params }: AnalyticsEditReportsPageProps) {
  const { id } = await params;
  return <AnalyticsEntityFormPage entityKey="reports" mode="edit" recordId={id} />;
}
