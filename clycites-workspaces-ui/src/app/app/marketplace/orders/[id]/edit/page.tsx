import { MarketplaceEntityFormPage } from "@/app/app/marketplace/_components/MarketplaceEntityFormPage";

interface MarketplaceEditOrdersPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MarketplaceEditOrdersPage({ params }: MarketplaceEditOrdersPageProps) {
  const { id } = await params;
  return <MarketplaceEntityFormPage entityKey="orders" mode="edit" recordId={id} />;
}
