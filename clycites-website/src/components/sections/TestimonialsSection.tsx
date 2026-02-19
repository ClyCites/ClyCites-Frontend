"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal, StaggerWrapper, StaggerItem } from "@/lib/motion";

const testimonials = [
  {
    name: "Grace Nakitto",
    role: "Maize Farmer",
    location: "Luwero, Uganda",
    avatar: "GN",
    rating: 5,
    quote:
      "ClyCites helped me identify fall armyworm on my maize within minutes. The AI gave me the exact treatment, and I saved 80% of my harvest. Before this, I would have lost everything.",
  },
  {
    name: "Samuel Ochieng",
    role: "Cooperative Manager",
    location: "Kisumu, Kenya",
    avatar: "SO",
    rating: 5,
    quote:
      "Managing 400+ member farmers used to require three staff and lots of paperwork. Now our entire cooperative runs on ClyCites. Payments, produce tracking, compliance — all automated.",
  },
  {
    name: "Dr. Amina Yusuf",
    role: "Agronomist, Expert Network",
    location: "Dar es Salaam, Tanzania",
    avatar: "AY",
    rating: 5,
    quote:
      "I joined ClyCites as an expert advisor and now consult with farmers in three countries without traveling. The platform is professional, the farmers are engaged, and the impact is real.",
  },
  {
    name: "James Mwangi",
    role: "Produce Buyer",
    location: "Nairobi, Kenya",
    avatar: "JM",
    rating: 5,
    quote:
      "Sourcing quality, verified produce used to take weeks. On ClyCites, I find what I need in hours, negotiate directly, and the escrow payment system gives me complete confidence.",
  },
  {
    name: "Fatima Diallo",
    role: "Tomato Farmer",
    location: "Dakar, Senegal",
    avatar: "FD",
    rating: 5,
    quote:
      "The weather alerts on ClyCites saved my greenhouse twice this season. The AI predicted hail before any weather service did. Incredible. I recommended it to every farmer in my village.",
  },
  {
    name: "Patrick Onyango",
    role: "NGO Programme Officer",
    location: "Entebbe, Uganda",
    avatar: "PO",
    rating: 5,
    quote:
      "We rolled out ClyCites to 2,000 farmers in our programme. The data dashboards give us real-time impact reporting that funders love. Integration took less than a week.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Reveal className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Testimonials</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Trusted by farmers{" "}
            <span className="text-primary">across Africa</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Don't take our word for it. Here's what the people using ClyCites every day say about it.
          </p>
        </Reveal>

        <StaggerWrapper className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Card className="h-full border-border/60 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Quote className="w-5 h-5 text-primary/30 mb-3" />
                    <p className="text-sm leading-relaxed text-foreground/80 mb-5 italic">
                      "{t.quote}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role} · {t.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerWrapper>
      </div>
    </section>
  );
}
