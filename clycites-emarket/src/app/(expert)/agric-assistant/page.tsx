"use client";

import { Bot, Sparkles, MessageSquareText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AgricAssistantPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          <Bot className="h-8 w-8 text-amber-600" />
          Agric Assistant
        </h1>
        <p className="mt-1 text-muted-foreground">
          AI-assisted recommendations for crop planning, risk monitoring, and operations.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-blue-600" />
              Advisory Assistant
            </CardTitle>
            <CardDescription>Ask agronomy and operations questions</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Get contextual recommendations for planting, harvesting, and logistics decisions.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-600" />
              Smart Suggestions
            </CardTitle>
            <CardDescription>Actionable guidance from platform signals</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Use weather, price, and market signals to prioritize time-sensitive actions.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-emerald-600" />
              Workflow Copilot
            </CardTitle>
            <CardDescription>Support for routine dashboard tasks</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Draft operational steps and recommendations aligned to your active role.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
