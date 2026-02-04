"use client"
import { useState, useRef } from "react"
import { Badge } from "@/components/ui/badge"

import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { TrendingUp, ShieldCheck, Users, Globe, Leaf, ChevronRight, ChevronLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

const impactData = [
  {
    title: "Economic Impact",
    description: "Empowering farmers with market insights and fair pricing",
    icon: <TrendingUp className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />,
    stats: [
      { value: "32%", label: "Average income increase for farmers" },
      { value: "45%", label: "Reduction in price exploitation" },
      { value: "12K+", label: "Farmers using price monitoring tools" },
    ],
    testimonial: {
      quote:
        "ClyCites has transformed how I sell my produce. I now know the best time to bring my crops to market and can negotiate fair prices.",
      author: "Sarah Namukasa",
      role: "Smallholder Farmer, Uganda",
      avatar: "/images/agri.jpg",
    },
  },
  {
    title: "Social Impact",
    description: "Building stronger agricultural communities through technology",
    icon: <Users className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />,
    stats: [
      { value: "1,500+", label: "Community champions trained" },
      { value: "8", label: "African cities with active communities" },
      { value: "65%", label: "Women participation in digital agriculture" },
    ],
    testimonial: {
      quote:
        "The community aspect of ClyCites has connected me with other farmers facing similar challenges. We share knowledge and support each other.",
      author: "John Muwanga",
      role: "Community Leader, Kampala",
      avatar: "/images/agri.jpg",
    },
  },
  {
    title: "Environmental Impact",
    description: "Promoting sustainable farming practices through data",
    icon: <Leaf className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />,
    stats: [
      { value: "28%", label: "Reduction in crop losses" },
      { value: "18%", label: "Decrease in chemical usage" },
      { value: "3,200", label: "Hectares under sustainable management" },
    ],
    testimonial: {
      quote:
        "With ClyCites' disease detection, I've reduced my pesticide use significantly while maintaining healthy crops. It's better for the environment and saves me money.",
      author: "Grace Akello",
      role: "Organic Farmer, Eastern Uganda",
      avatar: "/images/agri.jpg",
    },
  },
  {
    title: "Policy Impact",
    description: "Informing agricultural policy with data-driven insights",
    icon: <ShieldCheck className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />,
    stats: [
      { value: "5", label: "Policy briefs published" },
      { value: "3", label: "Government partnerships" },
      { value: "12", label: "Research collaborations" },
    ],
    testimonial: {
      quote:
        "The data from ClyCites has been invaluable for our agricultural policy planning. We now have evidence-based insights to support our decisions.",
      author: "Dr. Emmanuel Ssebunya",
      role: "Agricultural Policy Advisor",
      avatar: "/images/agri.jpg",
    },
  },
]
interface TestimonialType {
  quote: string;
  author: string;
  role: string;
  avatar: string; // Assuming this is the image URL
}
const Testimonial = ({ testimonial }: { testimonial: TestimonialType }) => (
  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
    <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-emerald-200 dark:border-emerald-800 flex-shrink-0">
      <img
        src={testimonial.avatar || "/placeholder.svg?height=64&width=64"}
        alt={testimonial.author}
        className="h-full w-full object-cover"
      />
    </div>
    <div>
      <blockquote className="text-lg italic mb-3">"{testimonial.quote}"</blockquote>
      <div>
        <p className="font-semibold">{testimonial.author}</p>
        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
      </div>
    </div>
  </div>
)

export function Impact() {
  const [activeIndex, setActiveIndex] = useState(0)
  const { theme } = useTheme()
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const totalSlides = impactData.length
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
  }

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-bold mb-4">
            Our Impact
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-muted-foreground">
            ClyCites' PricePulse-AI is transforming agricultural markets and empowering communities across Uganda and
            beyond.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
              <Image src="/images/agri.jpg" alt="Impact" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <Badge className="mb-3 bg-emerald-500 hover:bg-emerald-600">{impactData[activeIndex].title}</Badge>
                <h3 className="text-2xl font-bold mb-2">Transforming Agriculture</h3>
                <p className="text-white/80 mb-4 max-w-md">{impactData[activeIndex].description}</p>

                <div className="flex space-x-2">
                  {impactData.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === activeIndex ? "bg-white" : "bg-white/40 hover:bg-white/60"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-card rounded-xl border shadow-md p-4 max-w-xs hidden md:block">
              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 dark:bg-emerald-900 rounded-full p-2 mt-1">
                  <Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Pan-African Vision</h4>
                  <p className="text-sm text-muted-foreground">
                    Our goal is to expand our impact across the African continent, reaching 10+ countries by 2026.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-emerald-100 dark:bg-emerald-900 rounded-full p-3">
                    {impactData[activeIndex].icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{impactData[activeIndex].title}</h3>
                    <p className="text-muted-foreground">{impactData[activeIndex].description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {impactData[activeIndex].stats.map((stat, index) => (
                    <Card key={index} className="border-0 shadow-sm bg-card">
                      <CardContent className="p-4 text-center">
                        <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="border-0 shadow-md bg-card">
                  <CardContent className="p-6">
                  <Testimonial testimonial={impactData[activeIndex].testimonial} />
                  </CardContent>
                </Card>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={prevSlide} className="flex items-center gap-1">
                    <ChevronLeft className="h-4 w-4" />
                    Previous Impact
                  </Button>
                  <Button variant="outline" onClick={nextSlide} className="flex items-center gap-1">
                    Next Impact
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
