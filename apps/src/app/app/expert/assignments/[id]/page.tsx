import { ExpertEntityDetailPage } from "@/app/app/expert/_components/ExpertEntityDetailPage";

interface ExpertAssignmentsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ExpertAssignmentsDetailPage({ params }: ExpertAssignmentsDetailPageProps) {
  const { id } = await params;
  return <ExpertEntityDetailPage entityKey="assignments" recordId={id} />;
}
