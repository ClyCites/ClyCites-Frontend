import { AdminEntityDetailPage } from "@/app/app/admin/_components/AdminEntityDetailPage";

interface AdminApiTokensDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminApiTokensDetailPage({ params }: AdminApiTokensDetailPageProps) {
  const { id } = await params;
  return <AdminEntityDetailPage entityKey="apiTokens" recordId={id} />;
}
