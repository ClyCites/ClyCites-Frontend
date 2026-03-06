import { MarketplaceEntityFormPage } from "@/app/app/marketplace/_components/MarketplaceEntityFormPage";

interface MarketplaceEditReviewsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MarketplaceEditReviewsPage({ params }: MarketplaceEditReviewsPageProps) {
  const { id } = await params;
  return <MarketplaceEntityFormPage entityKey="reviews" mode="edit" recordId={id} />;
}
