import { FinanceEntityFormPage } from "@/app/app/finance/_components/FinanceEntityFormPage";

interface FinanceEditPayoutsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FinanceEditPayoutsPage({ params }: FinanceEditPayoutsPageProps) {
  const { id } = await params;
  return <FinanceEntityFormPage entityKey="payouts" mode="edit" recordId={id} />;
}
