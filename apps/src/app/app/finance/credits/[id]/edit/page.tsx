import { FinanceEntityFormPage } from "@/app/app/finance/_components/FinanceEntityFormPage";

interface FinanceEditCreditsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FinanceEditCreditsPage({ params }: FinanceEditCreditsPageProps) {
  const { id } = await params;
  return <FinanceEntityFormPage entityKey="credits" mode="edit" recordId={id} />;
}
