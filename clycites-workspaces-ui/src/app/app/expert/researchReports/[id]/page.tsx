import { ExpertEntityDetailPage } from "@/app/app/expert/_components/ExpertEntityDetailPage";

interface ExpertResearchReportsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ExpertResearchReportsDetailPage({ params }: ExpertResearchReportsDetailPageProps) {
  const { id } = await params;
  return <ExpertEntityDetailPage entityKey="researchReports" recordId={id} />;
}
