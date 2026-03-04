import { AdminEntityDetailPage } from "@/app/app/admin/_components/AdminEntityDetailPage";

interface AdminRolesDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminRolesDetailPage({ params }: AdminRolesDetailPageProps) {
  const { id } = await params;
  return <AdminEntityDetailPage entityKey="roles" recordId={id} />;
}
