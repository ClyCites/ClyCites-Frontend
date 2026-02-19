"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Bug,
  Cloud,
  Users,
  BarChart3,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StaggerWrapper, StaggerItem, Reveal } from "@/lib/motion";

const modules = [
  {
    icon: ShoppingCart,
    title: "e-Market",
    desc: "Connect directly with buyers, list produce, negotiate prices, and get paid faster through our digital marketplace — designed for African markets.",
    badge: "Marketplace",
    color: "text-green-600",
    bg: "bg-green-50",
    href: "/product#e-market",
  },
  {
    icon: Bug,
    title: "AI Pest & Disease Detection",
    desc: "Upload farm images and get instant AI-powered diagnosis of crop diseases and pests, with actionable treatment recommendations from agronomists.",
    badge: "AI-Powered",
    color: "text-red-600",
    bg: "bg-red-50",
    href: "/product#ai-detection",
  },
  {
    icon: Cloud,
    title: "Weather Intelligence",
    desc: "Hyperlocal weather forecasts, planting advisories, and extreme weather alerts tailored for each farm's GPS location.",
    badge: "Real-time",
    color: "text-blue-600",
    bg: "bg-blue-50",
    href: "/product#weather",
  },
  {
    icon: MessageSquare,
    title: "Expert Advisory Portal",
    desc: "Access certified agronomists, veterinarians, and extension officers for direct consultations, advisory notes, and training resources.",
    badge: "Expert Network",
    color: "text-purple-600",
    bg: "bg-purple-50",
    href: "/product#advisory",
  },
  {
    icon: BarChart3,
    title: "Analytics & Dashboards",
    desc: "Comprehensive farm performance dashboards, yield tracking, input cost analysis, and market price intelligence for data-driven decisions.",
    badge: "Analytics",
    color: "text-orange-600",
    bg: "bg-orange-50",
    href: "/product#analytics",
  },
  {
    icon: Users,
    title: "Cooperative Management",
    desc: "Manage member farmers, aggregate produce, track contributions, handle payments, and run cooperative operations from one central dashboard.",
    badge: "Cooperative",
    color: "text-teal-600",
    bg: "bg-teal-50",
    href: "/solutions/organizations",
  },
];

export default function ProductModules() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Reveal className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Product Modules</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Everything a farm needs,{" "}
            <span className="text-primary">in one platform</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Six integrated modules built specifically for African agricultural conditions, farmers, cooperatives, and supply chains.
          </p>
        </Reveal>

        <StaggerWrapper className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <StaggerItem key={mod.title}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.12)" }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="h-full group cursor-pointer border-border/60 hover:border-primary/30 transition-colors">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-2xl ${mod.bg} flex items-center justify-center mb-4`}>
                        <Icon className={`w-6 h-6 ${mod.color}`} />
                      </div>
                      <Badge variant="outline" className="text-xs mb-3">
                        {mod.badge}
                      </Badge>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {mod.desc}
                      </p>
                      <Link
                        href={mod.href}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
                      >
                        Learn more <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerWrapper>

        <Reveal className="text-center mt-12">
          <Button size="lg" variant="outline" asChild>
            <Link href="/product">
              Explore Full Product <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
