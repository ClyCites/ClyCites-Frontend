"use client"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { BarChart3, ShoppingCart, Users, LineChart, CloudSun, Bug, ArrowRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const features = [
  {
    name: "E-Market",
    description: "Connect directly with buyers and sell your produce at fair market prices without intermediaries.",
    icon: ShoppingCart,
    link: "/products/e-market",
    color: "bg-emerald-100 dark:bg-emerald-900",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "Expert Portal",
    description: "Access agricultural experts for advice on crop management, disease control, and best practices.",
    icon: Users,
    link: "/products/expert-portal",
    color: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    name: "Agric Assistant",
    description: "AI-powered assistant to help with farming decisions, crop planning, and market timing.",
    icon: LineChart,
    link: "/products/assistant",
    color: "bg-purple-100 dark:bg-purple-900",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    name: "Price Monitoring",
    description: "Track real-time market prices to make informed decisions about when to sell your produce.",
    icon: BarChart3,
    link: "https://price-monitoring-three.vercel.app/",
    color: "bg-amber-100 dark:bg-amber-900",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    name: "Weather Detection",
    description: "Get accurate weather forecasts and alerts to protect your crops from adverse conditions.",
    icon: CloudSun,
    link: "/products/weather",
    color: "bg-sky-100 dark:bg-sky-900",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
  {
    name: "Pest & Disease Detection",
    description: "Identify and manage crop diseases and pests early with AI-powered image recognition.",
    icon: Bug,
    link: "/disease",
    color: "bg-red-100 dark:bg-red-900",
    iconColor: "text-red-600 dark:text-red-400",
  },
]

export function Features() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section id="features" className="py-12 sm:py-20 bg-white dark:bg-gray-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-100 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-100 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={titleVariants}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 text-sm font-medium mb-4">
            Our Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Comprehensive Digital Agriculture Tools
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            ClyCites provides a comprehensive suite of tools to help farmers succeed in the digital agricultural
            marketplace.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={feature.name} variants={itemVariants}>
              <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 h-full group">
                <CardHeader>
                  <div
                    className={`${feature.color} rounded-full w-12 h-12 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}
                  >
                    <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>
                  <CardTitle>{feature.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" asChild className="p-0 h-auto">
                    <Link
                      href={feature.link}
                      className="flex items-center text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 group-hover:underline"
                    >
                      Learn more
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <Button asChild size="lg" className="rounded-full">
            <Link href="/products">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
