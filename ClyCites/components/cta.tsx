"use client"
import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ArrowRight, Check, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"

const faqs = [
  {
    question: "How does ClyCites help farmers increase their income?",
    answer:
      "ClyCites provides real-time market price information, allowing farmers to sell their produce at the optimal time and negotiate fair prices. Our disease detection tools also help reduce crop losses, while our e-marketplace connects farmers directly with buyers, eliminating middlemen and increasing profit margins.",
  },
  {
    question: "Is ClyCites available offline?",
    answer:
      "Yes, the ClyCites mobile app has offline capabilities that allow farmers to access previously downloaded information even without an internet connection. Once connectivity is restored, the app automatically syncs with our servers to update with the latest data.",
  },
  {
    question: "How accurate is the disease detection feature?",
    answer:
      "Our AI-powered disease detection has an accuracy rate of over 90% for common crop diseases in East Africa. The system is continuously learning and improving through feedback from agricultural experts and users.",
  },
  {
    question: "What makes ClyCites different from other agricultural platforms?",
    answer:
      "ClyCites stands out through its comprehensive approach that combines market intelligence, disease detection, and community building. We're also deeply focused on the specific challenges of African agriculture, with solutions designed for local contexts and infrastructure limitations.",
  },
]

const ctaThemes = {
  default: {
    bg: "bg-emerald-900 text-white",
    button: "bg-white text-emerald-900 hover:bg-emerald-100",
    secondaryButton: "text-white border-white hover:bg-emerald-800",
    card: "bg-emerald-800/50 border-emerald-700",
    highlight: "text-emerald-300",
  },
  modern: {
    bg: "bg-gradient-to-br from-emerald-800 via-emerald-900 to-blue-900 text-white",
    button: "bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white",
    secondaryButton: "bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20",
    card: "bg-white/10 backdrop-blur-sm border-white/10",
    highlight: "text-emerald-300",
  },
  minimal: {
    bg: "bg-background border-t border-b",
    button: "bg-emerald-600 hover:bg-emerald-700 text-white",
    secondaryButton: "text-foreground border-input hover:bg-muted",
    card: "bg-card",
    highlight: "text-emerald-600 dark:text-emerald-400",
  },
}

export function CTA() {
  const [ctaTheme, setCtaTheme] = useState<keyof typeof ctaThemes>("default")
  const { theme } = useTheme()
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const cycleTheme = () => {
    const themes = Object.keys(ctaThemes) as Array<keyof typeof ctaThemes>
    const currentIndex = themes.indexOf(ctaTheme)
    const nextIndex = (currentIndex + 1) % themes.length
    setCtaTheme(themes[nextIndex])
  }

  const currentTheme = ctaThemes[ctaTheme]

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <section className={`py-20 sm:py-32 ${currentTheme.bg} duration-500`}>
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
          <Button
            variant="outline"
            size="sm"
            onClick={cycleTheme}
            className={`${currentTheme.secondaryButton} text-xs`}
          >
            Change Theme
          </Button>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Agriculture?</h2>
          <p className="text-lg opacity-90 mb-8">
            Join thousands of farmers already using ClyCites to increase yields, access fair markets, and build
            sustainable agricultural businesses.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className={`${currentTheme.button} rounded-full text-base`} asChild>
              <Link href="/get-started">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className={`${currentTheme.secondaryButton} rounded-full text-base`}
              asChild
            >
              <Link href="/demo">Request Demo</Link>
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className={`${currentTheme.card} border shadow-lg`}>
              <CardHeader>
                <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
                <CardDescription className="opacity-80">
                  Common questions about ClyCites and our services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b pb-2">
                      <button
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="flex justify-between items-center w-full text-left py-2"
                      >
                        <span className="font-medium">{faq.question}</span>
                        <ChevronRight
                          className={`h-4 w-4 transition-transform ${openFaq === index ? "rotate-90" : ""}`}
                        />
                      </button>
                      {openFaq === index && <div className="py-2 text-muted-foreground">{faq.answer}</div>}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="px-0" asChild>
                  <Link href="/faq">
                    View all FAQs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className={`${currentTheme.card} border shadow-lg`}>
              <CardHeader>
                <CardTitle className="text-xl">Why Invest In Us?</CardTitle>
                <CardDescription className="opacity-80">
                  ClyCites offers both social impact and commercial potential
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Check className={`h-4 w-4 ${currentTheme.highlight}`} />
                  </div>
                  <div>
                    <p className="font-medium">Real Problem, Real Solution</p>
                    <p className="text-sm opacity-80">
                      Addressing critical market visibility issues affecting millions
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Check className={`h-4 w-4 ${currentTheme.highlight}`} />
                  </div>
                  <div>
                    <p className="font-medium">Proven Traction</p>
                    <p className="text-sm opacity-80">Growing user base with strong retention metrics</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Check className={`h-4 w-4 ${currentTheme.highlight}`} />
                  </div>
                  <div>
                    <p className="font-medium">Scalable Model</p>
                    <p className="text-sm opacity-80">Technology platform designed for rapid expansion across Africa</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Check className={`h-4 w-4 ${currentTheme.highlight}`} />
                  </div>
                  <div>
                    <p className="font-medium">Dual Impact</p>
                    <p className="text-sm opacity-80">Strong social impact with sustainable revenue model</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className={`w-full ${currentTheme.button}`} asChild>
                  <Link href="/investors">
                    Investor Information
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
