import { FinanceEntityDetailPage } from "@/app/app/finance/_components/FinanceEntityDetailPage";

interface FinanceCreditsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FinanceCreditsDetailPage({ params }: FinanceCreditsDetailPageProps) {
  const { id } = await params;
  return <FinanceEntityDetailPage entityKey="credits" recordId={id} />;
}
