import { FinanceEntityDetailPage } from "@/app/app/finance/_components/FinanceEntityDetailPage";

interface FinanceTransactionsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FinanceTransactionsDetailPage({ params }: FinanceTransactionsDetailPageProps) {
  const { id } = await params;
  return <FinanceEntityDetailPage entityKey="transactions" recordId={id} />;
}
