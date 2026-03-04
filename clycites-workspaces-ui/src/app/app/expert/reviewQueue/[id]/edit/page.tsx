import { ExpertEntityFormPage } from "@/app/app/expert/_components/ExpertEntityFormPage";

interface ExpertEditReviewQueuePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ExpertEditReviewQueuePage({ params }: ExpertEditReviewQueuePageProps) {
  const { id } = await params;
  return <ExpertEntityFormPage entityKey="reviewQueue" mode="edit" recordId={id} />;
}
