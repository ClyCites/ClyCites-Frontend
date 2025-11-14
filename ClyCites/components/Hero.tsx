"use client"
import Link from "next/link"
import { useEffect } from "react"
import { ArrowRight, ChevronDown } from "lucide-react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"

import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/Search"

export function Hero() {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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

  const videoVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.4 },
    },
  }

  // Animated background elements
  const floatingCircleControls = useAnimation()
  const floatingSquareControls = useAnimation()
  const floatingTriangleControls = useAnimation()

  useEffect(() => {
    // Animate floating elements
    floatingCircleControls.start({
      y: [0, -15, 0],
      x: [0, 10, 0],
      transition: { repeat: Number.POSITIVE_INFINITY, duration: 5, ease: "easeInOut" },
    })

    floatingSquareControls.start({
      y: [0, 20, 0],
      x: [0, -15, 0],
      rotate: [0, 10, 0],
      transition: { repeat: Number.POSITIVE_INFINITY, duration: 7, ease: "easeInOut" },
    })

    floatingTriangleControls.start({
      y: [0, -10, 0],
      x: [0, -5, 0],
      rotate: [0, -5, 0],
      transition: { repeat: Number.POSITIVE_INFINITY, duration: 6, ease: "easeInOut" },
    })
  }, [floatingCircleControls, floatingSquareControls, floatingTriangleControls])

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white py-20 sm:py-28 lg:py-32 ">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 right-[10%] w-24 h-24 rounded-full bg-emerald-200 opacity-20 blur-xl"
        animate={floatingCircleControls}
      />
      <motion.div
        className="absolute bottom-40 left-[15%] w-32 h-32 bg-blue-200 opacity-20 blur-xl"
        animate={floatingSquareControls}
      />
      <motion.div
        className="absolute top-[40%] left-[5%] w-20 h-20 bg-amber-200 opacity-20 blur-xl"
        animate={floatingTriangleControls}
      />
      <motion.div
        className="absolute bottom-[10%] right-[20%] w-16 h-16 rounded-full bg-purple-200 opacity-20 blur-xl"
        animate={{
          y: [0, 15, 0],
          x: [0, -10, 0],
          transition: { repeat: Number.POSITIVE_INFINITY, duration: 4, ease: "easeInOut" },
        }}
      />

      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg className="h-full w-full" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 mt-0 md:mt-[-120px] px-4 md:px-8">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div className="max-w-xl">
            <motion.div variants={itemVariants}>
              <span className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 font-medium text-sm mb-6">
                Digital Agriculture Platform
              </span>
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight"
            >
              Agriculture in your{" "}
              <span className="text-emerald-600 relative">
                community
                <span className="absolute -bottom-2 left-0 w-full h-2 bg-emerald-200 opacity-50 rounded-full"></span>
              </span>
            </motion.h1>
            <motion.p variants={itemVariants} className="mt-6 text-lg text-gray-600">
              ClyCites is an opensource platform that helps professional and upcoming farmers to get into the trade
              digitally. It helps farmers to market and sell their farm produces digitally at the comfort of their farm
              and communicate with potential customers.
            </motion.p>
            <motion.div variants={itemVariants} className="mt-6 max-w-xl">
              <SearchBar />
            </motion.div>
            <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-full group">
                <Link href="/get-started">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link href="/explore">Explore Data</Link>
              </Button>
            </motion.div>
            <motion.div variants={itemVariants} className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="inline-block h-10 w-10 rounded-full border-2 border-white overflow-hidden">
                    <img src={`/person-${i}.png`} alt={`User ${i}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">1,500+</span> farmers already joined
              </div>
            </motion.div>
          </div>
          <motion.div variants={videoVariants} className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent z-10 pointer-events-none"></div>

              {/* YouTube Video Embed */}
              <div className="aspect-video w-full">
              {/* <iframe width="560" height="315" src="https://www.youtube.com/embed/CaIL9Ep5z1E?si=piLyVGyWfdv5RVFU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
              </iframe> */}
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/CaIL9Ep5z1E?si=piLyVGyWfdv5RVFU"
                  title="Agriculture Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 max-w-xs"
            >
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 rounded-full p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">PricePulse-AI</h3>
                  <p className="text-sm text-gray-600">Real-time market price monitoring</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -top-6 -right-6 bg-white rounded-lg shadow-lg p-4"
            >
              <div className="flex items-center gap-2">
                <div className="bg-amber-100 rounded-full p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-900">32%</span> income increase
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-sm text-gray-500 mb-2">Scroll to explore</span>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
            <ChevronDown className="h-6 w-6 text-emerald-500" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
