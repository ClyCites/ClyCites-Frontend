import { FinanceEntityFormPage } from "@/app/app/finance/_components/FinanceEntityFormPage";

interface FinanceEditInsurancePoliciesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FinanceEditInsurancePoliciesPage({ params }: FinanceEditInsurancePoliciesPageProps) {
  const { id } = await params;
  return <FinanceEntityFormPage entityKey="insurancePolicies" mode="edit" recordId={id} />;
}
