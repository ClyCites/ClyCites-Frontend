import { ExpertEntityDetailPage } from "@/app/app/expert/_components/ExpertEntityDetailPage";

interface ExpertAdvisoriesDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ExpertAdvisoriesDetailPage({ params }: ExpertAdvisoriesDetailPageProps) {
  const { id } = await params;
  return <ExpertEntityDetailPage entityKey="advisories" recordId={id} />;
}
