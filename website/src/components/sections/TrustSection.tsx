"use client";

import React from "react";
import { ShieldCheck, Lock, Eye, FileCheck, Globe, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal, StaggerWrapper, StaggerItem } from "@/lib/motion";
import { motion } from "framer-motion";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Identity & Membership Controls",
    desc: "Workspace-level onboarding supports structured user identities, role assignment, and organization boundaries.",
  },
  {
    icon: Lock,
    title: "Secure Data Handling",
    desc: "Traffic encryption, protected secrets, and controlled access are built into core platform workflows.",
  },
  {
    icon: Eye,
    title: "Audit Visibility",
    desc: "Key actions across entities and workflows are traceable for accountability and operational review.",
  },
  {
    icon: FileCheck,
    title: "Data Governance",
    desc: "Workspace permissions and data ownership boundaries help teams control who can view or modify records.",
  },
  {
    icon: Globe,
    title: "Regional Readiness",
    desc: "The platform design supports localization, policy alignment, and adaptation to regional operating requirements.",
  },
  {
    icon: BadgeCheck,
    title: "Operational Reliability",
    desc: "Monitoring, alerts, and repeatable release processes support stable usage across website and workspace experiences.",
  },
];

export default function TrustSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Reveal className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Trust & Security</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Built on a foundation of{" "}
            <span className="text-primary">trust</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Security and governance are treated as product capabilities, not afterthoughts, across all ClyCites touchpoints.
          </p>
        </Reveal>

        <StaggerWrapper className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.title}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                  <Card className="h-full border-border/60 hover:border-primary/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
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
