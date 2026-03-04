import { PricesEntityFormPage } from "@/app/app/prices/_components/PricesEntityFormPage";

interface PricesEditDataSourcesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PricesEditDataSourcesPage({ params }: PricesEditDataSourcesPageProps) {
  const { id } = await params;
  return <PricesEntityFormPage entityKey="dataSources" mode="edit" recordId={id} />;
}
