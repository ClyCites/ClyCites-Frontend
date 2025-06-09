"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingBag, DollarSign, TrendingUp, Users, Eye, Star, AlertCircle } from "lucide-react"

export default function QuickStats({ products, orders, subscription }) {
  const totalProducts = products.length
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Advanced stats for higher tier packages
  const totalViews = products.reduce((sum, product) => sum + (product.views || Math.floor(Math.random() * 100)), 0)
  const avgRating = products.reduce((sum, product) => sum + (product.rating || 4.2), 0) / products.length || 0
  const lowStockProducts = products.filter((product) => (product.stock || 10) < 5).length
  const activeCustomers = new Set(orders.map((order) => order.customerId)).size

  const baseStats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "bg-blue-500",
      change: "+3 this month",
      changeType: "positive",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "bg-green-500",
      change: "+12% from last month",
      changeType: "positive",
    },
    {
      title: "Total Revenue",
      value: `UGX ${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-purple-500",
      change: "+18% from last month",
      changeType: "positive",
    },
    {
      title: "Avg Order Value",
      value: `UGX ${Math.round(avgOrderValue).toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-orange-500",
      change: "+5% from last month",
      changeType: "positive",
    },
  ]

  const advancedStats = [
    {
      title: "Product Views",
      value: totalViews.toLocaleString(),
      icon: Eye,
      color: "bg-cyan-500",
      change: "+25% this week",
      changeType: "positive",
    },
    {
      title: "Active Customers",
      value: activeCustomers,
      icon: Users,
      color: "bg-indigo-500",
      change: "+8 new customers",
      changeType: "positive",
    },
    {
      title: "Average Rating",
      value: avgRating.toFixed(1),
      icon: Star,
      color: "bg-yellow-500",
      change: "+0.2 this month",
      changeType: "positive",
    },
    {
      title: "Low Stock Alerts",
      value: lowStockProducts,
      icon: AlertCircle,
      color: "bg-red-500",
      change: lowStockProducts > 0 ? "Needs attention" : "All good",
      changeType: lowStockProducts > 0 ? "negative" : "positive",
    },
  ]

  // Determine which stats to show based on subscription level
  const getStatsToShow = () => {
    if (subscription.packageId === "free") {
      return baseStats.slice(0, 4) // Show only basic stats
    } else if (subscription.packageId === "growth") {
      return [...baseStats, ...advancedStats.slice(0, 2)] // Show basic + 2 advanced
    } else {
      return [...baseStats, ...advancedStats] // Show all stats
    }
  }

  const statsToShow = getStatsToShow()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsToShow.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant={stat.changeType === "positive" ? "success" : "destructive"} className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Package Upgrade Prompt for Free Users */}
      {subscription.packageId === "free" && (
        <Card className="md:col-span-2 lg:col-span-4 border-2 border-dashed border-gray-300 hover:border-green-400 transition-colors">
          <CardContent className="p-6 text-center">
            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Unlock Advanced Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Upgrade to Growth or Pro plan to access detailed customer insights, product performance metrics, and
                advanced reporting tools.
              </p>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Available in Growth Plan - Starting at UGX 99,000/month
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
