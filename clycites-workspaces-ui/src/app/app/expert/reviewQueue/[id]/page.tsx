import { ExpertEntityDetailPage } from "@/app/app/expert/_components/ExpertEntityDetailPage";

interface ExpertReviewQueueDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ExpertReviewQueueDetailPage({ params }: ExpertReviewQueueDetailPageProps) {
  const { id } = await params;
  return <ExpertEntityDetailPage entityKey="reviewQueue" recordId={id} />;
}
