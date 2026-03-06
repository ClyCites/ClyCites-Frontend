import { ExpertEntityFormPage } from "@/app/app/expert/_components/ExpertEntityFormPage";

interface ExpertEditAssignmentsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ExpertEditAssignmentsPage({ params }: ExpertEditAssignmentsPageProps) {
  const { id } = await params;
  return <ExpertEntityFormPage entityKey="assignments" mode="edit" recordId={id} />;
}
