import { ExpertEntityDetailPage } from "@/app/app/expert/_components/ExpertEntityDetailPage";

interface ExpertKnowledgeBaseArticlesDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ExpertKnowledgeBaseArticlesDetailPage({ params }: ExpertKnowledgeBaseArticlesDetailPageProps) {
  const { id } = await params;
  return <ExpertEntityDetailPage entityKey="knowledgeBaseArticles" recordId={id} />;
}
