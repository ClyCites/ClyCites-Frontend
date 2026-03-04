import { PricesEntityFormPage } from "@/app/app/prices/_components/PricesEntityFormPage";

interface PricesEditPricePredictionsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PricesEditPricePredictionsPage({ params }: PricesEditPricePredictionsPageProps) {
  const { id } = await params;
  return <PricesEntityFormPage entityKey="pricePredictions" mode="edit" recordId={id} />;
}
