import type { Metadata } from "next";
import Link from "next/link";
import { UserPlus, BrainCircuit, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CTASection from "@/components/sections/CTASection";
import { Reveal, StaggerWrapper, StaggerItem } from "@/lib/motion";

export const metadata: Metadata = {
  title: "How It Works — ClyCites",
  description:
    "Learn how ClyCites works: sign up, capture farm data, get AI and expert guidance, and sell smarter via the e-market. A 3-step journey from farm to market.",
};

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Sign up & capture your farm",
    color: "green",
    details: [
      "Create your free account in under 2 minutes",
      "Add your farm location, crops, and field sizes",
      "ClyCites auto-imports hyperlocal weather data for your GPS coordinates",
      "Set your notification preferences and language",
      "Invite cooperative members or staff if applicable",
    ],
    quote: "The setup was so fast. In 10 minutes I had weather alerts on my maize fields.",
    quoteAuthor: "Grace Nakitto, Farmer — Luwero",
  },
  {
    step: "02",
    icon: BrainCircuit,
    title: "Get AI + expert guidance",
    color: "blue",
    details: [
      "Upload a photo of any crop symptom — get an AI diagnosis in under 10 seconds",
      "Receive daily weather briefings and extreme weather early warnings",
      "Browse the expert advisory portal for certified agronomists",
      "View AI-powered planting recommendations based on your weather data",
      "Access your farm analytics dashboard to track performance",
    ],
    quote: "The AI correctly identified late blight on my tomatoes before it spread to the whole field.",
    quoteAuthor: "Fatima Diallo, Farmer — Senegal",
  },
  {
    step: "03",
    icon: TrendingUp,
    title: "Sell smarter via e-Market",
    color: "orange",
    details: [
      "List your produce with grades, quantity, and preferred price",
      "Receive direct enquiries from verified buyers across Africa",
      "Negotiate and confirm orders securely within the platform",
      "Coordinate pickup or delivery logistics",
      "Receive payment securely via mobile money or bank transfer",
    ],
    quote: "I got 35% more than my usual market price by selling directly through ClyCites.",
    quoteAuthor: "Samuel Ochieng, Farmer — Kenya",
  },
];

const colorMap: Record<string, { bg: string; border: string; icon: string; badge: string }> = {
  green: { bg: "bg-green-50", border: "border-green-200", icon: "text-green-600", badge: "bg-green-100 text-green-700" },
  blue: { bg: "bg-blue-50", border: "border-blue-200", icon: "text-blue-600", badge: "bg-blue-100 text-blue-700" },
  orange: { bg: "bg-orange-50", border: "border-orange-200", icon: "text-orange-600", badge: "bg-orange-100 text-orange-700" },
};

export default function HowItWorksPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-b from-primary/5 to-background border-b border-border/40 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <Reveal>
            <Badge variant="outline" className="mb-4">How It Works</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
              From farm to market{" "}
              <span className="text-primary">in 3 steps</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              ClyCites is designed to be as simple as possible for any farmer — while being powerful enough to run enterprise cooperatives.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-20">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const colors = colorMap[s.color];
            return (
              <Reveal key={s.step}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                  <div className={i % 2 !== 0 ? "lg:order-2" : ""}>
                    <div className="flex items-center gap-4 mb-5">
                      <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center relative`}>
                        <Icon className={`w-7 h-7 ${colors.icon}`} />
                        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                      </div>
                      <span className={`text-3xl font-bold opacity-20`}>{s.step}</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">{s.title}</h2>
                    <ul className="space-y-3 mb-6">
                      {s.details.map((d) => (
                        <li key={d} className="flex items-start gap-3 text-sm text-foreground/80">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`${i % 2 !== 0 ? "lg:order-1" : ""} rounded-3xl ${colors.bg} border ${colors.border} p-8`}>
                    <blockquote className="text-foreground/70 italic text-base leading-relaxed mb-4">
                      "{s.quote}"
                    </blockquote>
                    <cite className="text-sm font-medium not-italic text-primary">— {s.quoteAuthor}</cite>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <CTASection
        title="Ready to take the first step?"
        subtitle="Sign up free, set up your farm profile, and start getting AI insights within minutes."
        primaryCta={{ label: "Get Started Free", href: "/auth/sign-up" }}
        secondaryCta={{ label: "See Pricing", href: "/pricing" }}
      />
    </div>
  );
}
