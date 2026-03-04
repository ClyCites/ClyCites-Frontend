import { MarketplaceEntityDetailPage } from "@/app/app/marketplace/_components/MarketplaceEntityDetailPage";

interface MarketplaceReviewsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MarketplaceReviewsDetailPage({ params }: MarketplaceReviewsDetailPageProps) {
  const { id } = await params;
  return <MarketplaceEntityDetailPage entityKey="reviews" recordId={id} />;
}
