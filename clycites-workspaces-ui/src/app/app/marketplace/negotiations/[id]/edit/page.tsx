import { MarketplaceEntityFormPage } from "@/app/app/marketplace/_components/MarketplaceEntityFormPage";

interface MarketplaceEditNegotiationsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MarketplaceEditNegotiationsPage({ params }: MarketplaceEditNegotiationsPageProps) {
  const { id } = await params;
  return <MarketplaceEntityFormPage entityKey="negotiations" mode="edit" recordId={id} />;
}
