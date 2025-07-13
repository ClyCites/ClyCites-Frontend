"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Percent, ChevronRight, ChevronLeft, DollarSign, TrendingUp, Users, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useTheme } from "next-themes"
import { ReactNode } from "react";

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  children: ReactNode;
}

// Replace the Tabs section with a simple button-based navigation
const TabButton = ({ active, onClick, icon, children }: TabButtonProps) => (
  <Button variant={active ? "default" : "outline"} onClick={onClick} className="flex items-center gap-2">
    {icon}
    <span className="hidden sm:inline">{children}</span>
  </Button>
)

const businessModelData = [
  {
    id: "overview",
    title: "Business Model Overview",
    description: "PricePulse-AI operates on a freemium model with premium analytics and forecasting tools.",
    content: (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Revenue Streams</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Institutional Subscriptions</span>
                  <span className="font-medium">60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Analytics Services</span>
                  <span className="font-medium">25%</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Data Licensing</span>
                  <span className="font-medium">15%</span>
                </div>
                <Progress value={15} className="h-2" />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">User Adoption</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Mobile Users</span>
                  <span className="font-medium">70%</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Web-based Users</span>
                  <span className="font-medium">30%</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Growth Projections</h3>
          <div className="relative h-64 bg-muted rounded-lg overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-full">
              <div className="absolute bottom-0 left-0 w-1/5 h-[30%] bg-emerald-500/70 rounded-t-md"></div>
              <div className="absolute bottom-0 left-[20%] w-1/5 h-[45%] bg-emerald-500/70 rounded-t-md"></div>
              <div className="absolute bottom-0 left-[40%] w-1/5 h-[60%] bg-emerald-500/70 rounded-t-md"></div>
              <div className="absolute bottom-0 left-[60%] w-1/5 h-[75%] bg-emerald-500/70 rounded-t-md"></div>
              <div className="absolute bottom-0 left-[80%] w-1/5 h-[90%] bg-emerald-500/70 rounded-t-md"></div>

              <div className="absolute bottom-0 left-0 w-full border-t border-dashed border-foreground/20"></div>
              <div className="absolute bottom-[25%] left-0 w-full border-t border-dashed border-foreground/20"></div>
              <div className="absolute bottom-[50%] left-0 w-full border-t border-dashed border-foreground/20"></div>
              <div className="absolute bottom-[75%] left-0 w-full border-t border-dashed border-foreground/20"></div>

              <div className="absolute bottom-[-10px] left-[10%] text-xs text-foreground/70">Year 1</div>
              <div className="absolute bottom-[-10px] left-[30%] text-xs text-foreground/70">Year 2</div>
              <div className="absolute bottom-[-10px] left-[50%] text-xs text-foreground/70">Year 3</div>
              <div className="absolute bottom-[-10px] left-[70%] text-xs text-foreground/70">Year 4</div>
              <div className="absolute bottom-[-10px] left-[90%] text-xs text-foreground/70">Year 5</div>
            </div>
          </div>
        </div>
      </>
    ),
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    id: "pricing",
    title: "Pricing Strategy",
    description: "Our tiered pricing model caters to different user segments with varying needs.",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-muted">
          <CardHeader className="pb-2">
            <CardTitle>Basic</CardTitle>
            <CardDescription>For individual farmers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">Free</div>
            <ul className="space-y-2">
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-emerald-500" />
                <span>Market price viewing</span>
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-emerald-500" />
                <span>Basic crop calendar</span>
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-emerald-500" />
                <span>Community forums</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Get Started
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-2 border-emerald-500 shadow-lg relative">
          <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            POPULAR
          </div>
          <CardHeader className="pb-2">
            <CardTitle>Pro</CardTitle>
            <CardDescription>For serious farmers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">
              $9.99<span className="text-sm font-normal">/month</span>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-emerald-500" />
                <span>All Basic features</span>
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-emerald-500" />
                <span>Price trend analysis</span>
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-emerald-500" />
                <span>Crop disease detection</span>
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-emerald-500" />
                <span>Weather alerts</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Subscribe Now</Button>
          </CardFooter>
        </Card>

        <Card className="border-2 border-muted">
          <CardHeader className="pb-2">
            <CardTitle>Enterprise</CardTitle>
            <CardDescription>For organizations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">Custom</div>
            <ul className="space-y-2">
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-emerald-500" />
                <span>All Pro features</span>
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-emerald-500" />
                <span>API access</span>
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-emerald-500" />
                <span>Custom analytics</span>
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 text-emerald-500" />
                <span>Dedicated support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Contact Sales
            </Button>
          </CardFooter>
        </Card>
      </div>
    ),
    icon: <Percent className="h-5 w-5" />,
  },
  {
    id: "growth",
    title: "Growth Strategy",
    description: "Our expansion plan focuses on scaling across East Africa with strategic partnerships.",
    content: (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Expansion Timeline</h3>
            <div className="relative pl-8 pb-10 border-l-2 border-emerald-500">
              <div className="mb-8 relative">
                <div className="absolute -left-[25px] h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  1
                </div>
                <h4 className="font-semibold">Phase 1: Uganda (Current)</h4>
                <p className="text-muted-foreground">Establishing market presence and refining product</p>
              </div>
              <div className="mb-8 relative">
                <div className="absolute -left-[25px] h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  2
                </div>
                <h4 className="font-semibold">Phase 2: Kenya & Tanzania (Year 2)</h4>
                <p className="text-muted-foreground">Market entry through strategic partnerships</p>
              </div>
              <div className="mb-8 relative">
                <div className="absolute -left-[25px] h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  3
                </div>
                <h4 className="font-semibold">Phase 3: Rwanda & Ethiopia (Year 3)</h4>
                <p className="text-muted-foreground">Expansion with localized features</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[25px] h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  4
                </div>
                <h4 className="font-semibold">Phase 4: Pan-African (Year 5)</h4>
                <p className="text-muted-foreground">Continent-wide scaling with regional hubs</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Key Growth Drivers</h3>
            <div className="space-y-4">
              <Card>
                <CardHeader className="py-3">
                  <div className="flex items-center">
                    <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-full mr-3">
                      <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <CardTitle className="text-base">Strategic Partnerships</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm">
                    Collaborations with agricultural cooperatives, NGOs, and government agencies
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-3">
                  <div className="flex items-center">
                    <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-full mr-3">
                      <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <CardTitle className="text-base">Product Diversification</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm">Expanding feature set to address broader agricultural challenges</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-3">
                  <div className="flex items-center">
                    <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-full mr-3">
                      <BarChart3 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <CardTitle className="text-base">Data Monetization</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm">Creating valuable agricultural insights for businesses and policymakers</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    ),
    icon: <TrendingUp className="h-5 w-5" />,
  },
]

export function BusinessModel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { theme } = useTheme()
  const controls = useAnimation()
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const totalSlides = businessModelData.length
  const slideInterval = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
  }

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  useEffect(() => {
    slideInterval.current = setInterval(() => {
      nextSlide()
    }, 10000)

    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current)
      }
    }
  }, [])

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-br from-background to-muted">
      <div className="container px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: "easeOut" },
            },
          }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Business & Revenue Model</h2>
          <p className="text-lg text-muted-foreground">
            Our innovative business model combines freemium services with premium analytics, creating sustainable
            revenue while maximizing agricultural impact across Africa.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
              },
            }}
            className="lg:col-span-1"
          >
            <div className="w-full">
              <div className="flex gap-2 mb-8">
                {businessModelData.map((item, index) => (
                  <TabButton
                    key={item.id}
                    active={currentSlide === index}
                    onClick={() => setCurrentSlide(index)}
                    icon={item.icon}
                  >
                    {item.title.split(" ")[0]}
                  </TabButton>
                ))}
              </div>

              <div className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold mb-2">{businessModelData[currentSlide].title}</h3>
                    <p className="text-muted-foreground mb-6">{businessModelData[currentSlide].description}</p>

                    <div className="relative h-64 overflow-hidden rounded-lg mb-4">
                      <Image
                        src={`/images/agri.jpg`}
                        alt={businessModelData[currentSlide].title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h4 className="text-white font-medium">{businessModelData[currentSlide].title}</h4>
                      </div>
                    </div>

                    <div className="flex justify-between mt-4">
                      <Button variant="outline" size="sm" onClick={prevSlide} className="flex items-center gap-1">
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button variant="outline" size="sm" onClick={nextSlide} className="flex items-center gap-1">
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.6, ease: "easeOut", delay: 0.4 },
              },
            }}
            className="lg:col-span-2"
          >
            <div className="bg-card rounded-xl border shadow-sm p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {businessModelData[currentSlide].content}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
