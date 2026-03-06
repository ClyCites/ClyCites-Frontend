import type { Metadata } from "next";
import { Leaf, Heart, Globe, Target, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import CTASection from "@/components/sections/CTASection";
import { Reveal, StaggerWrapper, StaggerItem } from "@/lib/motion";

export const metadata: Metadata = {
  title: "About Us — ClyCites",
  description:
    "ClyCites is an African agritech company building digital infrastructure for farmers and agricultural markets. Learn about our mission, values, and team.",
};

const values = [
  {
    icon: Heart,
    title: "Farmer-Centered",
    desc: "Every product decision starts with the question: does this make a real farmer's life better? If not, we don't build it.",
  },
  {
    icon: Globe,
    title: "Africa-First",
    desc: "We build for African conditions: intermittent connectivity, feature phones, local languages, and the real context of African agriculture.",
  },
  {
    icon: Target,
    title: "Impact-Driven",
    desc: "We measure success in yield improvements, income increases, and market access — not just downloads or signups.",
  },
  {
    icon: Users,
    title: "Community-Built",
    desc: "We co-create with farmers and cooperatives. Our product is shaped by thousands of hours of field research across the continent.",
  },
];

const team = [
  { name: "Product", role: "Platform Experience", initials: "PX", bio: "Owns end-to-end journeys from website entry points to workspace execution flows." },
  { name: "Engineering", role: "Application Platform", initials: "EN", bio: "Builds the website, workspaces, and shared component systems across modules." },
  { name: "Agronomy", role: "Domain Intelligence", initials: "AG", bio: "Translates agricultural expertise into usable workflows and advisory structures." },
  { name: "Operations", role: "Programme Delivery", initials: "OP", bio: "Supports implementation with cooperatives, partners, and field teams." },
  { name: "Security", role: "Trust & Governance", initials: "SG", bio: "Drives access control, auditability, and responsible data handling patterns." },
  { name: "Design", role: "System Language", initials: "DS", bio: "Maintains coherent visual and interaction standards across all ClyCites surfaces." },
];

export default function AboutPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-b from-primary/5 to-background border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <Badge variant="outline" className="mb-4">About ClyCites</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-5">
                Building digital infrastructure for{" "}
                <span className="text-primary">African farming</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                ClyCites was founded in 2021 with a single conviction: African smallholder farmers deserve the same quality of digital tools as farmers in the EU or the US — built for the realities of African agriculture.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today we focus on building dependable product foundations that scale from individual farms to multi-workspace operations.
              </p>
            </Reveal>
            <Reveal>
              <div className="rounded-3xl bg-primary/10 border border-primary/20 p-10 flex items-center justify-center min-h-[260px]">
                <div className="text-center">
                  <Leaf className="w-20 h-20 text-primary mx-auto mb-4" />
                  <p className="font-bold text-2xl">ClyCites</p>
                  <p className="text-muted-foreground text-sm">Founded 2021 · Kampala, Uganda</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-background/40 mb-4">Our Mission</p>
            <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-medium leading-snug text-background/90">
              &ldquo;To give every African farmer digital tools, market access, and intelligent guidance, so farming is not just subsistence, but a thriving business.&rdquo;
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What drives us</h2>
          </Reveal>
          <StaggerWrapper className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <StaggerItem key={v.title}>
                  <Card className="h-full text-center hover:border-primary/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{v.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerWrapper>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Core disciplines behind ClyCites</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Cross-functional groups that align product quality, agricultural relevance, and operational reliability.
            </p>
          </Reveal>
          <StaggerWrapper className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <StaggerItem key={member.name}>
                <Card className="h-full hover:border-primary/30 transition-colors">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                      {member.initials}
                    </div>
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-xs text-primary mb-2">{member.role}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerWrapper>
        </div>
      </section>

      <CTASection
        title="Join us in transforming African agriculture"
        subtitle="Whether you're a farmer, partner, investor, or just believe in the mission — there's a role for you at ClyCites."
        primaryCta={{ label: "Join ClyCites", href: "/auth/sign-up" }}
        secondaryCta={{ label: "Contact Us", href: "/contact" }}
      />
    </div>
  );
}
