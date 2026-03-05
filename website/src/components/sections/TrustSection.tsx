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
    title: "Verified Farmers",
    desc: "All farmers and cooperatives are verified through national ID, phone verification, and geo-validation before participation.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Lock,
    title: "Bank-Level Security",
    desc: "All data is encrypted in transit and at rest using AES-256. Payments are processed through PCI-DSS compliant infrastructure.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Eye,
    title: "Full Audit Logs",
    desc: "Every transaction, advisory interaction, and data modification is logged with immutable audit trails for compliance and accountability.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: FileCheck,
    title: "Data Privacy",
    desc: "Your farm data belongs to you. ClyCites never sells your data. You control what's shared, with whom, and for how long.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: Globe,
    title: "GDPR & Local Compliance",
    desc: "ClyCites complies with GDPR, Uganda Data Protection Act, and relevant national agricultural data frameworks.",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    icon: BadgeCheck,
    title: "Certified Platform",
    desc: "ISO 27001-aligned security practices. Regular third-party penetration testing. Transparent security reporting available on request.",
    color: "text-red-600",
    bg: "bg-red-50",
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
            Farmers trust us with their livelihoods. We take that responsibility seriously with enterprise-grade security, transparent practices, and absolute data sovereignty.
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
                      <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-4`}>
                        <Icon className={`w-6 h-6 ${item.color}`} />
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
