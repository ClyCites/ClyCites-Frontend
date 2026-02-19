"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/lib/motion";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  organization: z.string().optional(),
  role: z.string().min(1, "Please select your role"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const roles = [
  { value: "farmer", label: "Farmer / Farm Manager" },
  { value: "cooperative", label: "Cooperative / Organization" },
  { value: "buyer", label: "Buyer / Processor / Exporter" },
  { value: "ngo", label: "NGO / Development Partner" },
  { value: "government", label: "Government Agency" },
  { value: "investor", label: "Investor" },
  { value: "other", label: "Other" },
];

export default function ContactPageClient() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    console.log("Form submitted:", data);
    setSubmitted(true);
    reset();
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center pt-16">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Message received!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for reaching out. Our team will get back to you within 1 business day.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline">
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <Reveal>
            <Badge variant="outline" className="mb-4">Contact Us</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Let's start a conversation
            </h1>
            <p className="text-lg text-muted-foreground">
              Request a demo, ask a question, or discuss a partnership. Our team responds within 1 business day.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <Reveal>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Grace Nakitto"
                        className={cn(errors.name && "border-destructive")}
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive">{errors.name.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="grace@example.com"
                        className={cn(errors.email && "border-destructive")}
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organisation (optional)</Label>
                      <Input
                        id="organization"
                        placeholder="Nakitto Farmers Cooperative"
                        {...register("organization")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Your Role *</Label>
                      <select
                        id="role"
                        className={cn(
                          "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                          errors.role && "border-destructive"
                        )}
                        {...register("role")}
                      >
                        <option value="">Select role...</option>
                        {roles.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                      {errors.role && (
                        <p className="text-xs text-destructive">{errors.role.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="Requesting a platform demo for our cooperative"
                      className={cn(errors.subject && "border-destructive")}
                      {...register("subject")}
                    />
                    {errors.subject && (
                      <p className="text-xs text-destructive">{errors.subject.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your organisation, your needs, and how we can help..."
                      rows={6}
                      className={cn(errors.message && "border-destructive")}
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="text-xs text-destructive">{errors.message.message}</p>
                    )}
                  </div>

                  <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Reveal>
            </div>

            {/* Sidebar info */}
            <div className="lg:col-span-2 space-y-6">
              <Reveal>
                <Card className="border-border/60">
                  <CardContent className="p-6 space-y-5">
                    <h3 className="font-semibold text-lg">Contact Information</h3>
                    <div className="space-y-4">
                      {[
                        { icon: Mail, label: "Email", value: "hello@clycites.com" },
                        { icon: Phone, label: "Phone", value: "+256 000 000 000" },
                        { icon: MapPin, label: "Location", value: "Kampala, Uganda" },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">{label}</p>
                            <p className="text-sm font-medium">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/60 bg-primary/5">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">Response time</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        Demo requests: within 24 hours
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        Partnership enquiries: 2–3 business days
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        Technical support: same day
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
