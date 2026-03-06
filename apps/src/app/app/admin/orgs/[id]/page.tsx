import { AdminEntityDetailPage } from "@/app/app/admin/_components/AdminEntityDetailPage";

interface AdminOrgsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminOrgsDetailPage({ params }: AdminOrgsDetailPageProps) {
  const { id } = await params;
  return <AdminEntityDetailPage entityKey="orgs" recordId={id} />;
}
