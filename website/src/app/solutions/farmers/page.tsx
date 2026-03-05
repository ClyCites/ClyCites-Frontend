import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2, ArrowRight, Tractor, Bug, Cloud,
  ShoppingCart, BarChart3, MessageSquare, Smartphone
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CTASection from "@/components/sections/CTASection";
import { Reveal, StaggerWrapper, StaggerItem } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Solutions for Farmers — ClyCites",
  description:
    "ClyCites empowers smallholder and commercial farmers with AI pest detection, weather alerts, marketplace access, and expert advisory. Built for African farmers.",
};

const features = [
  { icon: Bug, title: "AI Pest & Disease Detection", desc: "Photo-based crop diagnosis in seconds. 200+ disease library trained on African crops." },
  { icon: Cloud, title: "Weather Alerts", desc: "Hyperlocal 14-day forecasts and extreme weather alerts for your exact farm location." },
  { icon: ShoppingCart, title: "e-Market Access", desc: "List your produce, negotiate prices, and sell directly to verified buyers across Africa." },
  { icon: MessageSquare, title: "Expert Advisory", desc: "Chat or call certified agronomists and extension officers from your smartphone." },
  { icon: BarChart3, title: "Farm Analytics", desc: "Track yields, input costs, income, and profitability from a simple farm dashboard." },
  { icon: Smartphone, title: "Works on Any Phone", desc: "Designed for USSD, SMS, and Android. Works offline and in low-connectivity areas." },
];

const plans = [
  "Get started for free — no credit card required",
  "Set up your farm profile in under 10 minutes",
  "Add your crops and get instant weather data",
  "Your first AI diagnosis is completely free",
  "Join the marketplace and list your first produce",
];

export default function FarmersPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-green-50 to-background border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <Badge className="bg-green-100 text-green-700 mb-4">For Farmers</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-5">
                The digital farm assistant{" "}
                <span className="text-primary">every farmer deserves</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Whether you grow on half an acre or fifty, ClyCites gives you the AI tools, market access, weather intelligence, and expert support to farm smarter — right from your phone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/auth/sign-up">
                    Get Started Free <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/how-it-works">See How It Works</Link>
                </Button>
              </div>
            </Reveal>
            <Reveal>
              <div className="rounded-3xl bg-green-100 border border-green-200 p-10 flex items-center justify-center min-h-[300px]">
                <Tractor className="w-36 h-36 text-green-400 opacity-40" strokeWidth={1} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Everything you need to farm better
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Six tools. One app. Designed for African farming conditions.
            </p>
          </Reveal>
          <StaggerWrapper className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <StaggerItem key={f.title}>
                  <Card className="h-full hover:border-primary/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="w-11 h-11 rounded-2xl bg-green-50 flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="font-semibold mb-2">{f.title}</h3>
                      <p className="text-sm text-muted-foreground">{f.desc}</p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerWrapper>
        </div>
      </section>

      {/* Getting started */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <Reveal>
            <h2 className="text-3xl font-bold mb-8">Getting started is easy</h2>
            <ul className="space-y-4 text-left mb-10">
              {plans.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-foreground/80">{step}</span>
                </li>
              ))}
            </ul>
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">
                Create Your Farmer Account <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Join 10,000+ farmers already using ClyCites"
        subtitle="Free to join. Takes 10 minutes to set up. Start getting AI insights on your farm today."
        primaryCta={{ label: "Sign Up Free", href: "/auth/sign-up" }}
        secondaryCta={{ label: "Learn More", href: "/how-it-works" }}
      />
    </div>
  );
}
