"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Autoplay from "embla-carousel-autoplay"

import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

const carouselSlides = [
  {
    id: 1,
    title: "Transform Agriculture with Digital Solutions",
    description: "ClyCites empowers farmers with cutting-edge tools for better farming and marketplace access.",
    image: "/images/agri.jpg",
    cta: "Start Your Journey",
    link: "/get-started",
  },
  {
    id: 2,
    title: "Real-time Market Insights",
    description: "Get accurate and up-to-date information on market prices to maximize your profits.",
    image: "/images/agr.avif",
    cta: "Explore PricePulse-AI",
    link: "/products/analytics",
  },
  {
    id: 3,
    title: "Detect Crop Diseases Early",
    description: "Our AI-powered disease detection helps protect your crops before problems spread.",
    image: "/images/agri.jpg",
    cta: "Learn More",
    link: "/disease",
  },
]

export function HeroCarousel() {
  const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }))

  return (
    <section className="relative w-full min-h-screen">
      <Carousel
        className="w-full h-screen"
        plugins={[plugin.current]}
        onMouseEnter={() => {
          if (plugin.current) plugin.current.stop()
        }}
        onMouseLeave={() => {
          if (plugin.current) plugin.current.play()
        }}
      >
        <CarouselContent>
          {carouselSlides.map((slide) => (
            <CarouselItem key={slide.id} className="relative">
              <div className="h-screen w-full">
                <div className="absolute inset-0 bg-black/30 z-10" />
                <Image
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute z-20 inset-0 flex items-center">
                  <div className="container">
                    <div className="max-w-2xl text-white">
                      <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl leading-tight mb-6">{slide.title}</h1>
                      <p className="text-xl opacity-90 mb-8">{slide.description}</p>
                      <Button asChild size="lg" className="rounded-full bg-emerald-600 hover:bg-emerald-700">
                        <Link href={slide.link}>
                          {slide.cta}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-5 z-30 opacity-70 hover:opacity-100" />
        <CarouselNext className="right-5 z-30 opacity-70 hover:opacity-100" />

        {/* Indicators */}
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center space-x-2">
          {carouselSlides.map((_, index) => (
            <div
              key={index}
              className="w-3 h-3 rounded-full bg-white/50 transition-all duration-300 cursor-pointer"
              onClick={() => plugin.current?.embla?.scrollTo(index)}
            />
          ))}
        </div>
      </Carousel>
    </section>
  )
}
