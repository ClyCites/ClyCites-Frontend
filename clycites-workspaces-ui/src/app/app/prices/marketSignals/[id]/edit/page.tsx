import { PricesEntityFormPage } from "@/app/app/prices/_components/PricesEntityFormPage";

interface PricesEditMarketSignalsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PricesEditMarketSignalsPage({ params }: PricesEditMarketSignalsPageProps) {
  const { id } = await params;
  return <PricesEntityFormPage entityKey="marketSignals" mode="edit" recordId={id} />;
}
