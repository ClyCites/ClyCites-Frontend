"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ResponsiveHeader } from "@/components/layout/responsive-header"
import { MarketPricesChart } from "@/components/dashboard/market-prices-chart"
import { BottomNavigation } from "@/components/dashboard/mobile-navigation"
import { Spinner } from "@/components/ui/spinner"

export default function MarketsPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen bg-background pb-16 md:pb-0">
      <ResponsiveHeader />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 max-w-7xl">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Market Prices</h1>
          <p className="text-muted-foreground">Real-time agricultural commodity prices and trends</p>
        </div>

        <div className="w-full">
          <MarketPricesChart />
        </div>
      </div>
      <BottomNavigation />
    </main>
  )
}
