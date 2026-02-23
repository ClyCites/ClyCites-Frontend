"use client";

import { FlaskConical, Database, FileText, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResearchPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FlaskConical className="h-8 w-8 text-indigo-600" />
          Research & Expert Portal
        </h1>
        <p className="text-muted-foreground mt-1">
          Agricultural datasets, research reports, and knowledge base
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Datasets
            </CardTitle>
            <CardDescription>Browse agricultural data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Coming soon: crop yields, market prices, climate data
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Reports
            </CardTitle>
            <CardDescription>Research publications</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Coming soon: research papers, policy briefs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              Knowledge Base
            </CardTitle>
            <CardDescription>Best practices & guides</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Coming soon: farming guides, pest management
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
