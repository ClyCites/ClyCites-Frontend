import Camp from "@/components/Camp";
import Features from "@/components/Features";
import GetApp from "@/components/GetApp";
import Guide from "@/components/Guide";
import Hero from "@/components/Hero";
import Contact from "@/components/Contact";
import ScrollToTop from "@/components/ScrollToTop";
import Brands from "@/components/Brands";
import BelowHero from "@/components/BelowHero";

export default function Home() {
  return (
    <>
      <Hero />
      <Brands />
      <Guide />
      <BelowHero />
      <Camp />
      <Features />
      <GetApp />
      <Contact />
      <ScrollToTop />
    </>
  )
}
