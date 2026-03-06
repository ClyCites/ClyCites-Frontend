import { FinanceEntityDetailPage } from "@/app/app/finance/_components/FinanceEntityDetailPage";

interface FinanceEscrowAccountsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FinanceEscrowAccountsDetailPage({ params }: FinanceEscrowAccountsDetailPageProps) {
  const { id } = await params;
  return <FinanceEntityDetailPage entityKey="escrowAccounts" recordId={id} />;
}
