import { FinanceEntityFormPage } from "@/app/app/finance/_components/FinanceEntityFormPage";

interface FinanceEditInvoicesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FinanceEditInvoicesPage({ params }: FinanceEditInvoicesPageProps) {
  const { id } = await params;
  return <FinanceEntityFormPage entityKey="invoices" mode="edit" recordId={id} />;
}
