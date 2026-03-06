import { FinanceEntityDetailPage } from "@/app/app/finance/_components/FinanceEntityDetailPage";

interface FinanceInvoicesDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FinanceInvoicesDetailPage({ params }: FinanceInvoicesDetailPageProps) {
  const { id } = await params;
  return <FinanceEntityDetailPage entityKey="invoices" recordId={id} />;
}
