import { FinanceEntityFormPage } from "@/app/app/finance/_components/FinanceEntityFormPage";

interface FinanceEditTransactionsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FinanceEditTransactionsPage({ params }: FinanceEditTransactionsPageProps) {
  const { id } = await params;
  return <FinanceEntityFormPage entityKey="transactions" mode="edit" recordId={id} />;
}
