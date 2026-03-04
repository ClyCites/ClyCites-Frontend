import { PricesEntityFormPage } from "@/app/app/prices/_components/PricesEntityFormPage";

interface PricesEditPriceEstimationsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PricesEditPriceEstimationsPage({ params }: PricesEditPriceEstimationsPageProps) {
  const { id } = await params;
  return <PricesEntityFormPage entityKey="priceEstimations" mode="edit" recordId={id} />;
}
