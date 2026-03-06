import { FinanceEntityDetailPage } from "@/app/app/finance/_components/FinanceEntityDetailPage";

interface FinancePayoutsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FinancePayoutsDetailPage({ params }: FinancePayoutsDetailPageProps) {
  const { id } = await params;
  return <FinanceEntityDetailPage entityKey="payouts" recordId={id} />;
}
