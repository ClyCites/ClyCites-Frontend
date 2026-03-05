"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserPlus, BrainCircuit, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Reveal, StaggerWrapper, StaggerItem } from "@/lib/motion";

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Capture farm data",
    desc: "Sign up, create your farm profile, add your fields, crops, and location. ClyCites automatically enriches your profile with weather data and soil benchmarks for your region.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    step: "02",
    icon: BrainCircuit,
    title: "Get AI + expert guidance",
    desc: "Receive instant AI alerts for pests and diseases from crop photos, hyperlocal weather forecasts, and personalized recommendations from certified agronomists.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    step: "03",
    icon: TrendingUp,
    title: "Sell smarter via e-Market",
    desc: "List your produce on the ClyCites marketplace, connect with verified buyers, get fair prices, track orders, and receive secure payments — directly to your account.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Reveal className="text-center mb-16">
          <Badge variant="outline" className="mb-4">How It Works</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            From farm to market{" "}
            <span className="text-primary">in 3 steps</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            ClyCites is designed to be simple enough for any farmer to use, yet powerful enough for enterprise cooperatives.
          </p>
        </Reveal>

        <StaggerWrapper className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 z-0" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <StaggerItem key={step.step}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="relative text-center group"
                >
                  {/* Step number */}
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <div className={`w-20 h-20 rounded-3xl ${step.bg} flex items-center justify-center`}>
                      <Icon className={`w-10 h-10 ${step.color}`} />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {step.desc}
                  </p>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerWrapper>
      </div>
    </section>
  );
}
