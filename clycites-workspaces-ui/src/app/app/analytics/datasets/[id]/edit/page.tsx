import { AnalyticsEntityFormPage } from "@/app/app/analytics/_components/AnalyticsEntityFormPage";

interface AnalyticsEditDatasetsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AnalyticsEditDatasetsPage({ params }: AnalyticsEditDatasetsPageProps) {
  const { id } = await params;
  return <AnalyticsEntityFormPage entityKey="datasets" mode="edit" recordId={id} />;
}
