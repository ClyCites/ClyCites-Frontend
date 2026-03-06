import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2, ArrowRight, Users, BarChart3,
  DollarSign, ShoppingCart, FileText, Bell
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CTASection from "@/components/sections/CTASection";
import { Reveal, StaggerWrapper, StaggerItem } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Solutions for Cooperatives & Organizations — ClyCites",
  description:
    "Manage farmer cooperatives, aggregate produce, coordinate bulk sales, track payments, and run compliance reporting with ClyCites's cooperative management platform.",
};

const capabilities = [
  {
    icon: Users,
    title: "Member Farmer Management",
    desc: "Onboard unlimited member farmers. Maintain digital profiles with farm details, history, and performance metrics for every member.",
  },
  {
    icon: ShoppingCart,
    title: "Produce Aggregation & Bulk Sales",
    desc: "Aggregate produce from all members, manage quality grading, and list bulk volumes on the marketplace for higher prices.",
  },
  {
    icon: DollarSign,
    title: "Payment Disbursement",
    desc: "Automatically calculate and disburse payments to member farmers based on their contribution. Supports mobile money and bank transfers.",
  },
  {
    icon: BarChart3,
    title: "Cooperative Analytics",
    desc: "Full financial and operational dashboards across your entire cooperative network. Exportable reports for board meetings and funders.",
  },
  {
    icon: FileText,
    title: "Compliance & Reporting",
    desc: "Generate compliance reports, audit trails, and member contribution records for regulatory requirements or donor reporting.",
  },
  {
    icon: Bell,
    title: "Member Communication",
    desc: "Broadcast advisories, weather alerts, market prices, and programme updates to all members via push notification, SMS, or in-app.",
  },
];

export default function OrganizationsPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-background border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <Badge className="bg-blue-100 text-blue-700 mb-4">For Cooperatives & Organizations</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-5">
                Manage your cooperative{" "}
                <span className="text-primary">at enterprise scale</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                ClyCites gives cooperatives, farmer groups, and agribusinesses a complete digital operations platform — from member management and produce aggregation to bulk sales and payment disbursements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/contact">
                    Onboard Your Cooperative <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/pricing">View Enterprise Pricing</Link>
                </Button>
              </div>
            </Reveal>
            <Reveal>
              <div className="rounded-3xl bg-blue-50 border border-blue-200 p-10 flex items-center justify-center min-h-[300px]">
                <Building2 className="w-36 h-36 text-blue-400 opacity-40" strokeWidth={1} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Built for cooperative operations
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Replace spreadsheets and manual processes with a purpose-built cooperative management platform.
            </p>
          </Reveal>
          <StaggerWrapper className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((f) => {
              const Icon = f.icon;
              return (
                <StaggerItem key={f.title}>
                  <Card className="h-full hover:border-primary/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="font-semibold mb-2">{f.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerWrapper>
        </div>
      </section>

      <CTASection
        title="Ready to modernize your cooperative?"
        subtitle="100+ cooperatives across Africa already run on ClyCites. Custom onboarding included."
        primaryCta={{ label: "Request Demo", href: "/contact" }}
        secondaryCta={{ label: "View Pricing", href: "/pricing" }}
      />
    </div>
  );
}
