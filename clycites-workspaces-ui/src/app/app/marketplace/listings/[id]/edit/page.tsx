import { MarketplaceEntityFormPage } from "@/app/app/marketplace/_components/MarketplaceEntityFormPage";

interface MarketplaceEditListingsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MarketplaceEditListingsPage({ params }: MarketplaceEditListingsPageProps) {
  const { id } = await params;
  return <MarketplaceEntityFormPage entityKey="listings" mode="edit" recordId={id} />;
}
