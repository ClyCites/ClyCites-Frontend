import { FinanceEntityFormPage } from "@/app/app/finance/_components/FinanceEntityFormPage";

interface FinanceEditEscrowAccountsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FinanceEditEscrowAccountsPage({ params }: FinanceEditEscrowAccountsPageProps) {
  const { id } = await params;
  return <FinanceEntityFormPage entityKey="escrowAccounts" mode="edit" recordId={id} />;
}
