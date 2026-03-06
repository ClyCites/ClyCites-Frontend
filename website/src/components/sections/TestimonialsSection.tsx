"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Layers3, Workflow, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal, StaggerWrapper, StaggerItem } from "@/lib/motion";

const outcomes = [
  {
    icon: Workflow,
    title: "Consistent user journeys",
    description:
      "Website messaging, onboarding, and workspace actions now follow one flow from discovery to execution.",
    points: ["Aligned navigation paths", "Clear cross-product calls to action", "Role-based entry points"],
  },
  {
    icon: Layers3,
    title: "Shared product language",
    description:
      "The website now reflects the same visual system, components, and interaction style used in ClyCites Workspaces.",
    points: ["Unified tokens and typography", "Consistent component variants", "Common surface and spacing system"],
  },
  {
    icon: Shield,
    title: "Higher trust quality",
    description:
      "Unverified or placeholder statements were removed and replaced with precise, product-grounded trust messaging.",
    points: ["No fake social placeholders", "No fabricated testimonials", "Security copy tied to platform capabilities"],
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-muted/25">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Reveal className="text-center mb-16">
          <Badge variant="outline" className="mb-4">What Improved</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Website now aligns with{" "}
            <span className="text-primary">workspace standards</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Key improvements that make the website cleaner, more credible, and operationally aligned with the workspace app.
          </p>
        </Reveal>

        <StaggerWrapper className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {outcomes.map((item) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.title}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Card className="h-full border-border/60 transition-colors hover:border-primary/30">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {item.points.map((point) => (
                        <li key={point} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerWrapper>
      </div>
    </section>
  );
}
