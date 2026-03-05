import type { Metadata } from "next";
import Link from "next/link";
import { Leaf, Heart, Globe, Target, Users, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  { name: "Emin Nassar", role: "CEO & Co-founder", initials: "EN", bio: "Former FAO digital agriculture specialist with 12 years in Africa." },
  { name: "Amara Sow", role: "CTO & Co-founder", initials: "AS", bio: "Ex-Google engineer. Built data platforms across East and West Africa." },
  { name: "Dr. Lydia Namukasa", role: "Head of Agronomy", initials: "LN", bio: "PhD in Plant Pathology. Built ClyCites's AI disease detection engine." },
  { name: "Ibrahim Musa", role: "Head of Partnerships", initials: "IM", bio: "10+ years in agri-development. Manages ClyCites's NGO and government programme." },
  { name: "Patience Owusu", role: "Head of Design", initials: "PO", bio: "Product designer specializing in low-literacy, multilingual UX for emerging markets." },
  { name: "Chidi Obi", role: "Head of Markets", initials: "CO", bio: "Agricultural economics expert. Designed the e-Market pricing and verification systems." },
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
                Today we serve 10,000+ farmers, 500+ cooperatives, and hundreds of buyers across 15 African countries, and we're just getting started.
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
              "To give every African farmer digital tools, market access, and intelligent guidance — so farming is not just a subsistence — it's a thriving business."
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
            <h2 className="text-3xl font-bold mb-4">The team behind ClyCites</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A diverse team of engineers, agronomists, designers, and agricultural economists united by a shared mission.
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
