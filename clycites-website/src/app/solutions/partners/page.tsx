import type { Metadata } from "next";
import Link from "next/link";
import { Handshake, ArrowRight, Globe, Database, BarChart3, Code2, Target, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CTASection from "@/components/sections/CTASection";
import { Reveal, StaggerWrapper, StaggerItem } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Solutions for Partners, NGOs & Government — ClyCites",
  description:
    "NGOs, government agencies, research institutions, and investors can leverage ClyCites for programme delivery, data collection, farmer targeting, and impact reporting.",
};

const partnerTypes = [
  {
    label: "NGOs & Development Organisations",
    desc: "Run farmer-facing programmes at scale, reach beneficiaries in remote areas, and generate impact data for donor reporting.",
    icon: Globe,
  },
  {
    label: "Government & Extension Services",
    desc: "Digitize extension officer workflows, distribute government advisories to farmers, and collect field data from rural regions.",
    icon: Target,
  },
  {
    label: "Research Institutions",
    desc: "Conduct farmer surveys, collect agronomic data, and run research programmes on the ClyCites platform with full consent management.",
    icon: Database,
  },
  {
    label: "Investors & Impact Funders",
    desc: "Access portfolio-level analytics, impact metrics, and farm performance data for investment monitoring and ESG reporting.",
    icon: BarChart3,
  },
  {
    label: "Technology Partners",
    desc: "Integrate with ClyCites via our REST APIs and webhooks. White-label options available for agri-fintech and insurtech platforms.",
    icon: Code2,
  },
  {
    label: "Community Partners",
    desc: "Farmer unions, producer associations, and community organizations can use ClyCites to organize and empower their members.",
    icon: Users,
  },
];

export default function PartnersPage() {
  return (
    <div className="pt-16">
      <section className="py-24 bg-gradient-to-br from-purple-50 to-background border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <Badge className="bg-purple-100 text-purple-700 mb-4">For Partners</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-5">
                Scale your agricultural{" "}
                <span className="text-primary">impact across Africa</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                ClyCites is the infrastructure layer for agricultural development. NGOs, governments, researchers, and investors use our platform to reach, serve, and track farming communities at scale.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/contact">
                    Explore Partnership <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Book a Technical Call</Link>
                </Button>
              </div>
            </Reveal>
            <Reveal>
              <div className="rounded-3xl bg-purple-50 border border-purple-200 p-10 flex items-center justify-center min-h-[300px]">
                <Handshake className="w-36 h-36 text-purple-400 opacity-40" strokeWidth={1} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Who we partner with</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              A flexible platform built for impact organisations, technology partners, and public sector agencies.
            </p>
          </Reveal>
          <StaggerWrapper className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerTypes.map((p) => {
              const Icon = p.icon;
              return (
                <StaggerItem key={p.label}>
                  <Card className="h-full hover:border-primary/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="w-11 h-11 rounded-2xl bg-purple-50 flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="font-semibold mb-2">{p.label}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerWrapper>
        </div>
      </section>

      <CTASection
        title="Let's build agricultural infrastructure together"
        subtitle="Trusted by international NGOs, government programmes, and development banks. Enquire about our partner programme."
        primaryCta={{ label: "Become a Partner", href: "/contact" }}
        secondaryCta={{ label: "API Documentation", href: "/contact" }}
      />
    </div>
  );
}
