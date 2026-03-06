import { FinanceEntityDetailPage } from "@/app/app/finance/_components/FinanceEntityDetailPage";

interface FinanceWalletsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FinanceWalletsDetailPage({ params }: FinanceWalletsDetailPageProps) {
  const { id } = await params;
  return <FinanceEntityDetailPage entityKey="wallets" recordId={id} />;
}
