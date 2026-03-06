import { ExpertEntityFormPage } from "@/app/app/expert/_components/ExpertEntityFormPage";

interface ExpertEditAdvisoriesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ExpertEditAdvisoriesPage({ params }: ExpertEditAdvisoriesPageProps) {
  const { id } = await params;
  return <ExpertEntityFormPage entityKey="advisories" mode="edit" recordId={id} />;
}
