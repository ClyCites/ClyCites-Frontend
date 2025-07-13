"use client"
import { useRef } from "react"
import Image from "next/image"
import { CheckCircle, ArrowRight } from "lucide-react"
import { motion, useInView } from "framer-motion"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ProblemSolution() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-white to-emerald-50 dark:from-gray-950 dark:to-emerald-950/30 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#smallGrid)" />
        </svg>
      </div>

      <div className="max-container padding-container relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            {/* Problem Section */}
            <motion.div variants={itemVariants}>
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-sm font-medium mb-4">
                The Challenge
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">The Problem</h2>
              <div className="space-y-8">
                <Card className="border-0 shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300"></div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="bg-amber-100 dark:bg-amber-900/50 rounded-full p-2">
                        <span className="text-amber-600 dark:text-amber-400 font-bold text-xl">80%</span>
                      </div>
                      <span>Informal Market Reliance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      In Uganda, over 80% of the population relies on informal markets for their daily food and
                      household needs. Yet, these markets operate without a centralized system for tracking real-time
                      prices.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300"></div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="bg-amber-100 dark:bg-amber-900/50 rounded-full p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-amber-600 dark:text-amber-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span>Lack of Price Visibility</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      Farmers, traders, and consumers often depend on word-of-mouth or outdated information, making it
                      difficult to make well-informed financial decisions. This lack of price visibility fuels market
                      inefficiencies and increases vulnerability to exploitation and price shocks.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300"></div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="bg-amber-100 dark:bg-amber-900/50 rounded-full p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-amber-600 dark:text-amber-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span>No Centralized Data Platform</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      There is no centralized platform for collecting and analyzing historical market data. Without
                      trends or forecasts, businesses and households are left vulnerable to sudden price hikes or
                      losses.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Solution Section */}
            <motion.div variants={itemVariants}>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-sm font-medium mb-4">
                Our Approach
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">Our Solution</h2>
              <div className="space-y-8">
                <Card className="border-0 shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300"></div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="bg-emerald-100 dark:bg-emerald-900/50 rounded-full p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      <span>PricePulse-AI</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      PricePulse-AI is a price monitoring platform built to bridge the information gap. It allows
                      authorized agents to collect real-time price data from local markets and upload it via our mobile
                      or web platform.
                    </p>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div className="flex gap-3 group">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Price Comparison</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Consumers and businesses can access this data, compare prices across different regions, and make
                        more informed choices. This empowers them to buy or sell at the right time, improving economic
                        outcomes.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 group">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">AI-Powered Forecasting</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        PricePulse-AI uses AI to analyze trends and predict future prices, giving users a forecasting
                        tool that helps them plan ahead and reduce financial risks.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 group">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Digital Marketplace</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Our platform connects farmers directly with buyers, eliminating middlemen and ensuring fair
                        prices for agricultural products.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative rounded-lg overflow-hidden h-64 shadow-lg group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4.PNG-XxD0yJmZk7WvrjXY5IbJII5OGQ2ryV.png"
                    alt="PricePulse-AI Solution"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <Button
                      asChild
                      variant="outline"
                      className="bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30"
                    >
                      <Link href="/products/pricepulse">
                        Learn more about PricePulse-AI
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
