import { ExpertEntityFormPage } from "@/app/app/expert/_components/ExpertEntityFormPage";

interface ExpertEditFieldCasesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ExpertEditFieldCasesPage({ params }: ExpertEditFieldCasesPageProps) {
  const { id } = await params;
  return <ExpertEntityFormPage entityKey="fieldCases" mode="edit" recordId={id} />;
}
