"use client"
import Link from "next/link"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export default function MarketsCarousel({ markets = [] }) {
  // Default markets if none provided
  const defaultMarkets = [
    {
      id: 1,
      title: "Kampala Central Market",
      slug: "kampala-central",
      logoUrl: "/placeholder.svg?height=100&width=100",
      description: "Fresh produce from the heart of Kampala",
    },
    {
      id: 2,
      title: "Nakasero Market",
      slug: "nakasero",
      logoUrl: "/placeholder.svg?height=100&width=100",
      description: "Premium fruits and vegetables",
    },
    {
      id: 3,
      title: "Owino Market",
      slug: "owino",
      logoUrl: "/placeholder.svg?height=100&width=100",
      description: "Affordable agricultural products",
    },
    {
      id: 4,
      title: "Kalerwe Market",
      slug: "kalerwe",
      logoUrl: "/placeholder.svg?height=100&width=100",
      description: "Local farmers market",
    },
  ]

  const displayMarkets = markets.length > 0 ? markets : defaultMarkets

  if (displayMarkets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No markets available</p>
      </div>
    )
  }

  return (
    <div className="px-4">
      <Carousel className="w-full max-w-5xl mx-auto">
        <CarouselContent className="-ml-2 md:-ml-4">
          {displayMarkets.map((market) => (
            <CarouselItem key={market.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <Link href={`/markets/${market.slug}`} target="_blank" rel="noopener noreferrer">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 group">
                  <div className="text-center">
                    <div className="mb-4">
                      <Image
                        src={market.logoUrl || "/placeholder.svg?height=80&width=80"}
                        alt={market.title}
                        width={80}
                        height={80}
                        className="mx-auto rounded-full object-cover border-2 border-lime-200"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-lime-600 transition-colors">
                      {market.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {market.description || "Quality agricultural products"}
                    </p>
                    <div className="inline-flex items-center text-lime-600 text-sm font-medium group-hover:text-lime-700">
                      Visit Market →
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
