import { PricesEntityFormPage } from "@/app/app/prices/_components/PricesEntityFormPage";

interface PricesEditCommoditiesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PricesEditCommoditiesPage({ params }: PricesEditCommoditiesPageProps) {
  const { id } = await params;
  return <PricesEntityFormPage entityKey="commodities" mode="edit" recordId={id} />;
}
