import { ExpertEntityDetailPage } from "@/app/app/expert/_components/ExpertEntityDetailPage";

interface ExpertFieldCasesDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ExpertFieldCasesDetailPage({ params }: ExpertFieldCasesDetailPageProps) {
  const { id } = await params;
  return <ExpertEntityDetailPage entityKey="fieldCases" recordId={id} />;
}
