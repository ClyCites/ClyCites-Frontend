import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag, ArrowRight, Search, ShieldCheck, Truck, BarChart3, RefreshCw, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CTASection from "@/components/sections/CTASection";
import { Reveal, StaggerWrapper, StaggerItem } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Solutions for Buyers & Processors — ClyCites",
  description:
    "Source verified, quality-certified produce from thousands of farms and cooperatives across Africa through the ClyCites marketplace.",
};

const features = [
  { icon: Search, title: "Search Verified Produce", desc: "Browse real-time listings from thousands of verified, grade-certified farms and cooperatives." },
  { icon: ShieldCheck, title: "Quality Guarantee", desc: "All listed produce is graded and certified. Dispute protection available on every order." },
  { icon: Truck, title: "Order & Logistics", desc: "Place orders, coordinate pickup or delivery, and track your shipment from farm to your facility." },
  { icon: ShieldCheck, title: "Escrow Payments", desc: "Pay into escrow. Funds release only when you confirm receipt of quality produce." },
  { icon: BarChart3, title: "Supply Intelligence", desc: "Historical supply trends, seasonal availability forecasts, and price analytics for procurement planning." },
  { icon: RefreshCw, title: "Repeat Sourcing", desc: "Set up recurring orders from trusted farm suppliers. Get notified when their next harvest is ready." },
];

export default function BuyersPage() {
  return (
    <div className="pt-16">
      <section className="py-24 bg-gradient-to-br from-orange-50 to-background border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <Badge className="bg-orange-100 text-orange-700 mb-4">For Buyers & Processors</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-5">
                Source quality African produce{" "}
                <span className="text-primary">with confidence</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                ClyCites connects buyers, processors, exporters, and retailers directly with verified farmers and cooperatives across Africa — eliminating intermediaries and ensuring supply chain transparency.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/auth/sign-up">
                    Access the Marketplace <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Request a Demo</Link>
                </Button>
              </div>
            </Reveal>
            <Reveal>
              <div className="rounded-3xl bg-orange-50 border border-orange-200 p-10 flex items-center justify-center min-h-[300px]">
                <ShoppingBag className="w-36 h-36 text-orange-400 opacity-40" strokeWidth={1} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything a serious buyer needs</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              From discovery to delivery — one platform for all your agricultural sourcing.
            </p>
          </Reveal>
          <StaggerWrapper className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <StaggerItem key={f.title}>
                  <Card className="h-full hover:border-primary/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="w-11 h-11 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-orange-600" />
                      </div>
                      <h3 className="font-semibold mb-2">{f.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerWrapper>
        </div>
      </section>

      <CTASection
        title="Start sourcing smarter today"
        subtitle="Access Africa's largest network of verified farm produce. Register free as a buyer."
        primaryCta={{ label: "Register as Buyer", href: "/auth/sign-up" }}
        secondaryCta={{ label: "Contact Sales", href: "/contact" }}
      />
    </div>
  );
}
