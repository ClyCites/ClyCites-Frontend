"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  heroVariants,
  heroSubVariants,
  heroCtaVariants,
  staggerContainer,
  fadeInUp,
} from "@/lib/motion";

const highlights = [
  "AI Pest & Disease Detection",
  "Real-time Weather Alerts",
  "e-Market Access",
  "Expert Advisory",
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/8 rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-6"
          >
            <Badge variant="success" className="text-xs px-4 py-1.5 rounded-full">
              🌱 Trusted by 10,000+ farmers across Africa
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6"
          >
            Digital agriculture infrastructure{" "}
            <span className="text-primary">for farmers</span>{" "}
            and markets
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={heroSubVariants}
            initial="hidden"
            animate="visible"
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            ClyCites combines AI-powered pest detection, weather intelligence, e-market access, expert advisory, and farm analytics — in one platform built for Africa.
          </motion.p>

          {/* Highlights */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center justify-center gap-3 mb-10"
          >
            {highlights.map((h) => (
              <motion.div
                key={h}
                variants={fadeInUp}
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                {h}
              </motion.div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={heroCtaVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <Button size="xl" asChild className="group">
              <Link href="/auth/sign-up">
                Get Started as Farmer
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild className="group">
              <Link href="/contact">
                <Play className="w-5 h-5" />
                Request a Demo
              </Link>
            </Button>
          </motion.div>

          {/* Trust signal */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-8 text-xs text-muted-foreground"
          >
            No credit card required · Free setup · GDPR compliant
          </motion.p>
        </div>

        {/* Stats */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
        >
          {[
            { value: "10K+", label: "Active Farmers" },
            { value: "500+", label: "Cooperatives" },
            { value: "15+", label: "Countries" },
            { value: "98%", label: "Satisfaction Rate" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              className="text-center"
            >
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
