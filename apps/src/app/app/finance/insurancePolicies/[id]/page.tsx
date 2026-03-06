import { FinanceEntityDetailPage } from "@/app/app/finance/_components/FinanceEntityDetailPage";

interface FinanceInsurancePoliciesDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FinanceInsurancePoliciesDetailPage({ params }: FinanceInsurancePoliciesDetailPageProps) {
  const { id } = await params;
  return <FinanceEntityDetailPage entityKey="insurancePolicies" recordId={id} />;
}
