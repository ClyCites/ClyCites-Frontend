import { FinanceEntityFormPage } from "@/app/app/finance/_components/FinanceEntityFormPage";

interface FinanceEditWalletsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FinanceEditWalletsPage({ params }: FinanceEditWalletsPageProps) {
  const { id } = await params;
  return <FinanceEntityFormPage entityKey="wallets" mode="edit" recordId={id} />;
}
