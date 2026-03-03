"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ChartWorkbench } from "@/components/charts/ChartWorkbench";
import { AccessDenied } from "@/components/common/AccessDenied";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { useMockSession } from "@/lib/auth/mock-session";
import { fadeIn, staggerContainer } from "@/lib/motion";

export default function AnalyticsChartsWorkbenchPage() {
  const { canAccessWorkspace, canAccessEntity } = useMockSession();
  const reducedMotion = useReducedMotion();

  const canOpen = canAccessWorkspace("analytics") && canAccessEntity("charts", "read");
  if (!canOpen) {
    return <AccessDenied />;
  }

  const canWrite = canAccessEntity("charts", "write");

  return (
    <motion.div
      variants={staggerContainer(Boolean(reducedMotion), 0.05)}
      initial="hidden"
      animate="show"
      className="space-y-5"
    >
      <PageHeader
        title="Charts Workbench"
        subtitle="Real dataflow for chart preview, persistence, and export."
        breadcrumbs={[
          { label: "App", href: "/app" },
          { label: "Analytics", href: "/app/analytics" },
          { label: "Charts" },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link href="/app/analytics">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Analytics
            </Link>
          </Button>
        }
      />

      <motion.section variants={fadeIn(Boolean(reducedMotion))}>
        <ChartWorkbench workspaceLabel="Analytics" canSave={canWrite} canExport={canOpen} />
      </motion.section>
    </motion.div>
  );
}
