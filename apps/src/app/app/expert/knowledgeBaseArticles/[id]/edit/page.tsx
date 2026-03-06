import { ExpertEntityFormPage } from "@/app/app/expert/_components/ExpertEntityFormPage";

interface ExpertEditKnowledgeBaseArticlesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ExpertEditKnowledgeBaseArticlesPage({ params }: ExpertEditKnowledgeBaseArticlesPageProps) {
  const { id } = await params;
  return <ExpertEntityFormPage entityKey="knowledgeBaseArticles" mode="edit" recordId={id} />;
}
