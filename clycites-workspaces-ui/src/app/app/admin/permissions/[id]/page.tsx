import { AdminEntityDetailPage } from "@/app/app/admin/_components/AdminEntityDetailPage";

interface AdminPermissionsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminPermissionsDetailPage({ params }: AdminPermissionsDetailPageProps) {
  const { id } = await params;
  return <AdminEntityDetailPage entityKey="permissions" recordId={id} />;
}
