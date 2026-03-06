import { PricesEntityFormPage } from "@/app/app/prices/_components/PricesEntityFormPage";

interface PricesEditMarketPricesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PricesEditMarketPricesPage({ params }: PricesEditMarketPricesPageProps) {
  const { id } = await params;
  return <PricesEntityFormPage entityKey="marketPrices" mode="edit" recordId={id} />;
}
