import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/lib/motion";
import SolutionsSection from "@/components/sections/SolutionsSection";
import CTASection from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Solutions — ClyCites",
  description:
    "Explore ClyCites solutions for farmers, cooperatives, buyers, and ecosystem partners.",
};

export default function SolutionsPage() {
  return (
    <div className="pt-16">
      <section className="border-b border-border/40 bg-gradient-to-b from-primary/5 to-background py-24 text-center">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Badge variant="outline" className="mb-4">
              Solutions
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Solutions mapped to your role
            </h1>
            <p className="mt-5 text-xl text-muted-foreground">
              Choose the operating model that fits your work, then move into the right workspace flow.
            </p>
          </Reveal>
        </div>
      </section>

      <SolutionsSection />

      <CTASection
        title="Pick a solution and launch faster"
        subtitle="Start with your role today, then expand across workspaces as your operations grow."
        primaryCta={{ label: "Get Started", href: "/auth/sign-up" }}
        secondaryCta={{ label: "Talk to Team", href: "/contact" }}
      />
    </div>
  );
}

