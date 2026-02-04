import { Hero } from "@/components/Hero"
import { Features } from "@/components/Features"
import { ProblemSolution } from "@/components/problem-solution"
// import { Team } from "@/components/team"
import { BusinessModel } from "@/components/business-model"
import { Impact } from "@/components/impact"
import { CTA } from "@/components/cta"

export default function Home() {
  return (
    <div className="pt-20 md:pt-24">
      <Hero />
      <Features />
      <ProblemSolution />
      <BusinessModel />
      <Impact />
      <CTA />
    </div>
  )
}
