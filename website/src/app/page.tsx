import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import ProductModules from "@/components/sections/ProductModules";
import SolutionsSection from "@/components/sections/SolutionsSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import TrustSection from "@/components/sections/TrustSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "ClyCites — Digital Agriculture Infrastructure for Farmers & Markets",
  description:
    "AI-powered agritech platform for African farmers, cooperatives, and buyers. Pest detection, weather intelligence, e-market, expert advisory, and farm analytics.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductModules />
      <SolutionsSection />
      <HowItWorksSection />
      <TrustSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
