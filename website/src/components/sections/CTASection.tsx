"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/lib/motion";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  dark?: boolean;
}

export default function CTASection({
  title = "Ready to transform your farm?",
  subtitle = "Join 10,000+ farmers, cooperatives, and market players already on ClyCites. Free setup. No credit card required.",
  primaryCta = { label: "Get Started Free", href: "/auth/sign-up" },
  secondaryCta = { label: "Request a Demo", href: "/contact" },
  dark = true,
}: CTASectionProps) {
  return (
    <section className={`py-24 relative overflow-hidden ${dark ? "bg-foreground text-background" : "bg-primary text-primary-foreground"}`}>
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
        <Reveal>
          <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5 leading-tight">
            {title}
          </h2>
          <p className={`text-lg max-w-2xl mx-auto mb-10 ${dark ? "text-background/60" : "text-primary-foreground/70"}`}>
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="xl"
                asChild
                className={dark ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-background text-foreground hover:bg-background/90"}
              >
                <Link href={primaryCta.href}>
                  {primaryCta.label}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="xl"
                variant="outline"
                asChild
                className={dark ? "border-background/20 text-background hover:bg-background/10" : "border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"}
              >
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
