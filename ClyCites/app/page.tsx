import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { ProblemSolution } from "@/components/problem-solution"
import { Team } from "@/components/team"
import { BusinessModel } from "@/components/business-model"
import { Impact } from "@/components/impact"
import { CTA } from "@/components/cta"

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <ProblemSolution />
      <Team />
      <BusinessModel />
      <Impact />
      <CTA />
    </>
  )
}
