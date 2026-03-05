"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Tractor, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const options = [
  {
    id: "farmer",
    icon: Tractor,
    title: "I'm a Farmer",
    desc: "Set up your individual farm profile, add your crops, and start using AI tools, weather alerts, and the marketplace.",
    color: "border-green-200 hover:border-green-400",
    selectedColor: "border-green-500 bg-green-50",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    href: "/auth/sign-up?type=farmer",
  },
  {
    id: "organization",
    icon: Building2,
    title: "I'm a Cooperative or Organization",
    desc: "Set up an organization account to manage multiple member farmers, aggregate produce, and run cooperative operations.",
    color: "border-blue-200 hover:border-blue-400",
    selectedColor: "border-blue-500 bg-blue-50",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    href: "/auth/sign-up?type=cooperative",
  },
];

export default function OnboardingPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const handleContinue = () => {
    const choice = options.find((o) => o.id === selected);
    if (choice) {
      router.push(choice.href);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl">
              Cly<span className="text-primary">Cites</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold mt-6 mb-2">How will you use ClyCites?</h1>
          <p className="text-muted-foreground">Choose the option that best describes you to get personalized setup.</p>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-8">
          {options.map((option) => {
            const Icon = option.icon;
            const isSelected = selected === option.id;
            return (
              <motion.button
                key={option.id}
                onClick={() => setSelected(option.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={cn(
                  "w-full p-6 rounded-2xl border-2 text-left transition-all",
                  isSelected ? option.selectedColor : `bg-card ${option.color}`
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${option.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${option.iconColor}`} />
                  </div>
                  <div>
                    <p className="font-bold text-lg mb-1">{option.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{option.desc}</p>
                  </div>
                  {isSelected && (
                    <div className="ml-auto flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        <Button
          size="lg"
          className="w-full"
          disabled={!selected}
          onClick={handleContinue}
        >
          Continue <ArrowRight className="w-4 h-4" />
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
