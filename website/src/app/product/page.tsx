import type { Metadata } from "next";
import Link from "next/link";
import {
  ShoppingCart, Bug, Cloud, MessageSquare, BarChart3, Users,
  CheckCircle2, ArrowRight, Smartphone, Globe, Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CTASection from "@/components/sections/CTASection";
import { Reveal, StaggerWrapper, StaggerItem } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Product — ClyCites Platform Modules",
  description:
    "Explore ClyCites's full product suite: e-Market, AI pest detection, weather intelligence, expert advisory, analytics, and cooperative management.",
};

const modules = [
  {
    id: "e-market",
    icon: ShoppingCart,
    title: "e-Market",
    tagline: "Sell smarter. Earn more.",
    desc: "The ClyCites e-Market is a digital produce marketplace connecting verified farmers directly to buyers, processors, and exporters across Africa. Cut out the middleman. Get fair prices.",
    features: [
      "Real-time produce listings with grade certification",
      "Direct buyer-seller messaging and negotiation",
      "Escrow payment protection",
      "Delivery tracking and logistics coordination",
      "Market price intelligence and trends",
      "Bulk order management for cooperatives",
    ],
    color: "green",
    badge: "Marketplace",
  },
  {
    id: "ai-detection",
    icon: Bug,
    title: "AI Pest & Disease Detection",
    tagline: "Protect crops before damage spreads.",
    desc: "Upload a photo of your crop and within seconds our AI model — trained on millions of African crop disease images — identifies the problem, severity, and recommends the best treatment.",
    features: [
      "Identifies 200+ crop diseases and pests",
      "Works offline on low-bandwidth devices",
      "Treatment cost estimation and product suggestions",
      "Automatic alert routing to your agronomist",
      "Historical crop health record for each field",
      "Community heatmap of crop disease spread",
    ],
    color: "red",
    badge: "AI-Powered",
  },
  {
    id: "weather",
    icon: Cloud,
    title: "Weather Intelligence",
    tagline: "Plan every season around accurate forecasts.",
    desc: "Hyperlocal weather forecasts, 14-day outlooks, and AI-driven planting calendars personalized for each farm's GPS coordinates and microclimate zone.",
    features: [
      "Hourly & 14-day forecasts by farm GPS",
      "Frost, drought, and flood early warning alerts",
      "AI planting advisory based on weather outlook",
      "Irrigation scheduling recommendations",
      "Seasonal climate trend analysis",
      "SMS & push notification alerts",
    ],
    color: "blue",
    badge: "Real-time",
  },
  {
    id: "advisory",
    icon: MessageSquare,
    title: "Expert Advisory Portal",
    tagline: "Certified experts, always within reach.",
    desc: "Access a network of certified agronomists, veterinarians, soil scientists, and extension officers for live consultations, voice notes, and written advisory reports.",
    features: [
      "Certified expert directory by specialization",
      "Chat, voice, and video consultations",
      "Structured advisory reports and farm plans",
      "Advisory history and follow-up reminders",
      "Expert ratings and review system",
      "Multilingual support across 12+ languages",
    ],
    color: "purple",
    badge: "Expert Network",
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Analytics & Dashboards",
    tagline: "Decisions backed by data, not guesswork.",
    desc: "Comprehensive farm performance dashboards that track yield history, input costs, weather correlations, income statements, and market price trends.",
    features: [
      "Yield vs. input cost profitability tracker",
      "Season-over-season performance comparison",
      "Market price trend analysis by crop/location",
      "Farm carbon footprint scoring",
      "Exportable reports for banks and insurers",
      "Portfolio view for cooperative managers",
    ],
    color: "orange",
    badge: "Analytics",
  },
  {
    id: "cooperative",
    icon: Users,
    title: "Cooperative Management",
    tagline: "Run your cooperative like a modern enterprise.",
    desc: "All the tools a cooperative or farmer group needs: member management, produce aggregation, bulk selling, internal payments, compliance reporting, and member communication.",
    features: [
      "Unlimited member farmer profiles",
      "Produce contribution tracking and aggregation",
      "Bulk marketplace listings on behalf of members",
      "Digital payment disbursements to members",
      "Audit trails and compliance reporting",
      "Member communication and announcements",
    ],
    color: "teal",
    badge: "Cooperative",
  },
];

const colorMap: Record<string, { icon: string; bg: string; border: string }> = {
  green: { icon: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  red: { icon: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  blue: { icon: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  purple: { icon: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
  orange: { icon: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  teal: { icon: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200" },
};

export default function ProductPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-b from-primary/5 to-background border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
          <Reveal>
            <Badge variant="outline" className="mb-4">Product Overview</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
              Six modules. One platform.{" "}
              <span className="text-primary">Infinite potential.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              ClyCites gives every stakeholder in African agriculture a complete digital toolkit — from smallholder farmers to enterprise cooperatives.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              {[
                { icon: Smartphone, label: "Works on any phone" },
                { icon: Globe, label: "Available in 12+ languages" },
                { icon: Zap, label: "Offline-first design" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" /> {label}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Modules */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <StaggerWrapper className="space-y-24">
            {modules.map((mod, i) => {
              const Icon = mod.icon;
              const colors = colorMap[mod.color];
              return (
                <StaggerItem key={mod.id}>
                  <div
                    id={mod.id}
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start ${
                      i % 2 !== 0 ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    <div className={i % 2 !== 0 ? "lg:order-2" : ""}>
                      <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center mb-5`}>
                        <Icon className={`w-7 h-7 ${colors.icon}`} />
                      </div>
                      <Badge variant="outline" className="mb-3">{mod.badge}</Badge>
                      <h2 className="text-3xl font-bold mb-2">{mod.title}</h2>
                      <p className="text-primary font-medium mb-4 italic">{mod.tagline}</p>
                      <p className="text-muted-foreground leading-relaxed mb-6">{mod.desc}</p>
                      <ul className="space-y-2.5 mb-8">
                        {mod.features.map((f) => (
                          <li key={f} className="flex items-start gap-3 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <Button asChild>
                        <Link href="/contact">
                          Get Started <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>

                    <div className={`${i % 2 !== 0 ? "lg:order-1" : ""} rounded-3xl ${colors.bg} border ${colors.border} p-8 flex items-center justify-center min-h-[300px]`}>
                      <Icon className={`w-32 h-32 ${colors.icon} opacity-20`} strokeWidth={1} />
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerWrapper>
        </div>
      </section>

      <CTASection
        title="Start with the modules you need"
        subtitle="Pick one module or use the full platform. Scale as you grow. No long-term contracts."
        primaryCta={{ label: "View Pricing", href: "/pricing" }}
        secondaryCta={{ label: "Request a Demo", href: "/contact" }}
      />
    </div>
  );
}
