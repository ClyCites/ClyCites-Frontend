"use client";

import { ExpertEntityPage } from "@/components/entities/expert/ExpertEntityPage";

export function KnowledgeBaseArticlesEntityPage() {
  return (
    <ExpertEntityPage
      entityKey="knowledgeBaseArticles"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: false,
        allowStatus: true,
        enabledWorkflowActionIds: ["submit-review", "approve", "reject", "publish"],
      }}
    />
  );
}
