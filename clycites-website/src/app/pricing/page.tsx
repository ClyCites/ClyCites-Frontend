import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CTASection from "@/components/sections/CTASection";
import { Reveal, StaggerWrapper, StaggerItem } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Pricing — ClyCites",
  description:
    "Simple, transparent pricing for farmers, cooperatives, and enterprise organisations. Start free. Scale as you grow.",
};

const plans = [
  {
    name: "Farmer Free",
    price: "$0",
    period: "forever",
    desc: "For individual farmers getting started with digital agriculture.",
    badge: null,
    featured: false,
    features: [
      "1 farm profile",
      "AI pest diagnosis (5/month)",
      "Basic weather alerts",
      "Marketplace listing (up to 3)",
      "Community forum access",
      "Mobile app (Android)",
    ],
    cta: "Get Started Free",
    href: "/auth/sign-up",
  },
  {
    name: "Farmer Pro",
    price: "$4",
    period: "/ month",
    desc: "For serious smallholder farmers who want the full ClyCites experience.",
    badge: "Most Popular",
    featured: true,
    features: [
      "Unlimited farm profiles & fields",
      "Unlimited AI pest diagnoses",
      "Hyperlocal 14-day weather + SMS alerts",
      "Unlimited marketplace listings",
      "Expert advisory consultations (3/month)",
      "Farm analytics dashboard",
      "Yield & income tracker",
      "Priority support",
    ],
    cta: "Start Free Trial",
    href: "/auth/sign-up",
  },
  {
    name: "Cooperative",
    price: "$49",
    period: "/ month",
    desc: "For cooperatives and farmer groups managing multiple farmers.",
    badge: "Enterprise",
    featured: false,
    features: [
      "Up to 500 member farmers",
      "All Farmer Pro features for each member",
      "Cooperative dashboard & analytics",
      "Produce aggregation & bulk sales",
      "Payment disbursement system",
      "Compliance & audit reporting",
      "Member communication tools",
      "Dedicated account manager",
      "Custom onboarding",
    ],
    cta: "Request Demo",
    href: "/contact",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For large cooperatives, NGOs, government agencies, and commercial agribusinesses.",
    badge: "Custom",
    featured: false,
    features: [
      "Unlimited member farmers",
      "All Cooperative features",
      "White-label options",
      "REST API & webhook access",
      "Custom integrations",
      "Data export & BI tools",
      "SLA-backed uptime",
      "On-site training",
      "24/7 enterprise support",
    ],
    cta: "Contact Sales",
    href: "/contact",
  },
];

const faqs = [
  {
    q: "Is ClyCites really free for farmers?",
    a: "Yes. The Farmer Free plan is permanently free with no time limit. Individual farmers can access basic AI diagnosis, weather alerts, and marketplace features without paying anything.",
  },
  {
    q: "What currencies do you support for payments?",
    a: "We accept payments in USD via card, as well as mobile money (MTN, Airtel) and bank transfers in UGX, KES, TZS, and GHS. More currencies are added regularly.",
  },
  {
    q: "Can I switch plans at any time?",
    a: "Yes. You can upgrade or downgrade your plan at any time. If you upgrade, you're billed pro-rata for the remainder of the month. Downgrades take effect at the next billing cycle.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "Farmer Pro has a 30-day free trial. No credit card is required to start. Cooperative plans include a 14-day trial with full access.",
  },
  {
    q: "How are cooperative member seats priced?",
    a: "The Cooperative plan includes up to 500 member farmers. For larger cooperatives, we offer custom enterprise pricing that scales with your member count. Contact our sales team.",
  },
  {
    q: "Are there discounts for NGOs and government programmes?",
    a: "Yes. We offer significant discounts for non-profit organisations, development agencies, and government extension programmes. Contact us for impact pricing.",
  },
];

export default function PricingPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-b from-primary/5 to-background border-b border-border/40 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <Reveal>
            <Badge variant="outline" className="mb-4">Pricing</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-muted-foreground">
              Start free. Upgrade as you grow. No hidden fees. Built to be affordable for African farmers.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Plans */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <StaggerWrapper className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <StaggerItem key={plan.name}>
                <Card className={`h-full relative flex flex-col ${plan.featured ? "border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20" : "border-border/60"}`}>
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge
                        className={plan.featured ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}
                      >
                        {plan.featured && <Zap className="w-3 h-3 mr-1" />}
                        {plan.badge}
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4 pt-8">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && (
                        <span className="text-muted-foreground ml-1 text-sm">{plan.period}</span>
                      )}
                    </div>
                    <CardDescription className="mt-2">{plan.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    <ul className="space-y-2.5 mb-6 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      variant={plan.featured ? "default" : "outline"}
                      className="w-full"
                    >
                      <Link href={plan.href}>
                        {plan.cta} <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerWrapper>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently asked questions</h2>
            <p className="text-muted-foreground">Everything you need to know about ClyCites pricing.</p>
          </Reveal>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-background rounded-xl border border-border/60 px-6">
                <AccordionTrigger className="text-left font-medium hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CTASection
        title="Start free. Upgrade when you're ready."
        subtitle="No risk. No credit card. Join thousands of farmers and cooperatives already on ClyCites."
        primaryCta={{ label: "Get Started Free", href: "/auth/sign-up" }}
        secondaryCta={{ label: "Talk to Sales", href: "/contact" }}
      />
    </div>
  );
}
