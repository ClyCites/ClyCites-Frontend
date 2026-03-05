"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Tractor, Building2, ShoppingBag, Handshake, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal, fadeInUp } from "@/lib/motion";

const solutions = [
  {
    id: "farmers",
    icon: Tractor,
    label: "Farmers",
    title: "Built for the African smallholder farmer",
    desc: "Whether you farm half an acre or fifty, ClyCites gives you the digital tools to increase yields, reduce crop losses, access fair markets, and connect with experts — in any language, on any phone.",
    points: [
      "AI-powered crop disease diagnosis in seconds",
      "Real-time weather alerts for your exact location",
      "Sell directly to buyers at fair prices",
      "Access expert agronomists via chat or call",
      "Track your farm performance and income",
    ],
    href: "/solutions/farmers",
    cta: "Start Farming Smarter",
    badge: "Most Popular",
    color: "green",
  },
  {
    id: "organizations",
    icon: Building2,
    label: "Cooperatives",
    title: "Manage your cooperative at scale",
    desc: "Aggregate produce, manage hundreds of member farmers, streamline payments, and access bulk market channels — with full visibility and control from your cooperative dashboard.",
    points: [
      "Onboard and manage unlimited member farmers",
      "Aggregate produce and coordinate bulk sales",
      "Track member contributions and payments",
      "Generate compliance reports and audits",
      "Access data analytics across your network",
    ],
    href: "/solutions/organizations",
    cta: "Onboard Your Cooperative",
    badge: "Enterprise",
    color: "blue",
  },
  {
    id: "buyers",
    icon: ShoppingBag,
    label: "Buyers",
    title: "Source quality produce with confidence",
    desc: "Connect with verified farmers and cooperatives, browse real-time inventory, place orders, and manage supply chain logistics through our secure buyer portal.",
    points: [
      "Search verified, grade-certified produce",
      "Real-time inventory from thousands of farms",
      "Secure payments and escrow protection",
      "Track orders from farm to delivery",
      "Build long-term supplier relationships",
    ],
    href: "/solutions/buyers",
    cta: "Access the Marketplace",
    badge: "B2B",
    color: "orange",
  },
  {
    id: "partners",
    icon: Handshake,
    label: "Partners",
    title: "Partner with us to scale impact",
    desc: "NGOs, government agencies, research institutions, and impact investors can leverage the ClyCites platform to run programmes, collect data, and reach farming communities at scale.",
    points: [
      "Programme management and farmer targeting",
      "Data collection, surveys, and analytics",
      "API integrations and white-label options",
      "Impact reporting and monitoring dashboards",
      "Access to verified farmer database",
    ],
    href: "/solutions/partners",
    cta: "Explore Partnership",
    badge: "Impact",
    color: "purple",
  },
];

const colorMap: Record<string, { badge: string; button: string; accent: string }> = {
  green: { badge: "bg-green-100 text-green-700", button: "bg-green-600 hover:bg-green-700", accent: "text-green-600" },
  blue: { badge: "bg-blue-100 text-blue-700", button: "bg-blue-600 hover:bg-blue-700", accent: "text-blue-600" },
  orange: { badge: "bg-orange-100 text-orange-700", button: "bg-orange-600 hover:bg-orange-700", accent: "text-orange-600" },
  purple: { badge: "bg-purple-100 text-purple-700", button: "bg-purple-600 hover:bg-purple-700", accent: "text-purple-600" },
};

export default function SolutionsSection() {
  const [active, setActive] = useState("farmers");
  const current = solutions.find((s) => s.id === active)!;
  const Icon = current.icon;
  const colors = colorMap[current.color];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Reveal className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Solutions</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Designed for every{" "}
            <span className="text-primary">stakeholder</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            From individual farmers to national cooperatives, buyers, and development partners.
          </p>
        </Reveal>

        {/* Tab selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {solutions.map((s) => {
            const SIcon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                  active === s.id
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                    : "border-border hover:border-primary/40 hover:bg-muted"
                }`}
              >
                <SIcon className="w-4 h-4" />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Content panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center rounded-3xl border border-border/60 bg-card p-8 sm:p-12 shadow-sm"
          >
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colors.badge}`}>
                  {current.badge}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
                {current.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">{current.desc}</p>
              <ul className="space-y-3 mb-8">
                {current.points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm">
                    <span className={`text-primary font-bold mt-0.5`}>✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg">
                <Link href={current.href}>
                  {current.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <div className={`w-full aspect-square max-w-sm mx-auto rounded-3xl flex items-center justify-center 
                ${current.color === "green" ? "bg-green-50" : 
                  current.color === "blue" ? "bg-blue-50" : 
                  current.color === "orange" ? "bg-orange-50" : "bg-purple-50"}`}>
                <Icon
                  strokeWidth={1}
                  className={`w-40 h-40 opacity-20 ${
                    current.color === "green" ? "text-green-600" :
                    current.color === "blue" ? "text-blue-600" :
                    current.color === "orange" ? "text-orange-600" : "text-purple-600"
                  }`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-8">
                    <Icon className={`w-16 h-16 mx-auto mb-4 ${colors.accent}`} />
                    <p className="font-semibold text-lg">{current.label}</p>
                    <p className="text-sm text-muted-foreground">Solution</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
