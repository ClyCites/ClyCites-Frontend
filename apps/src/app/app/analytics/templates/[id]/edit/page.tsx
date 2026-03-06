import { AnalyticsEntityFormPage } from "@/app/app/analytics/_components/AnalyticsEntityFormPage";

interface AnalyticsEditTemplatesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AnalyticsEditTemplatesPage({ params }: AnalyticsEditTemplatesPageProps) {
  const { id } = await params;
  return <AnalyticsEntityFormPage entityKey="templates" mode="edit" recordId={id} />;
}
