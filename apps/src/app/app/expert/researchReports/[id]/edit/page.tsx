import { ExpertEntityFormPage } from "@/app/app/expert/_components/ExpertEntityFormPage";

interface ExpertEditResearchReportsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ExpertEditResearchReportsPage({ params }: ExpertEditResearchReportsPageProps) {
  const { id } = await params;
  return <ExpertEntityFormPage entityKey="researchReports" mode="edit" recordId={id} />;
}
