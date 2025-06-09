"use client"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, AlertTriangle, CheckCircle, ArrowUp } from "lucide-react"
import Link from "next/link"

export default function PackageOverview({ subscription, currentUsage }) {
  const { packageId, packageLimits, status, endDate } = subscription
  const { products, orders, revenue } = currentUsage

  const getUsagePercentage = (current, limit) => {
    if (limit === "unlimited") return 0
    return Math.min((current / limit) * 100, 100)
  }

  const isNearLimit = (current, limit) => {
    if (limit === "unlimited") return false
    return (current / limit) * 100 > 80
  }

  const usageItems = [
    {
      label: "Products",
      current: products,
      limit: packageLimits.products,
      icon: "📦",
    },
    {
      label: "Monthly Orders",
      current: orders,
      limit: packageLimits.monthly_orders,
      icon: "🛒",
    },
  ]

  const getPackageFeatures = () => {
    const features = {
      free: ["10 Products", "3 Images per Product", "Email Support", "Basic Analytics"],
      growth: ["100 Products", "10 Images per Product", "Chat Support", "Advanced Analytics", "Marketing Tools"],
      pro: ["500 Products", "20 Images per Product", "24/7 Support", "Professional Analytics", "Priority Listing"],
      enterprise: ["Unlimited Products", "Unlimited Images", "Dedicated Support", "Custom Analytics", "White Label"],
    }
    return features[packageId] || features.free
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Package Info */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Package</span>
            <Badge variant={status === "active" ? "success" : "secondary"}>{status}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold capitalize text-green-600">{packageId} Plan</h3>
            {endDate && <p className="text-sm text-gray-500">Renews on {new Date(endDate).toLocaleDateString()}</p>}
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Package Features:</h4>
            {getPackageFeatures().map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <Link href="/farmer-packages">
              <Button className="w-full" variant="outline">
                <ArrowUp className="h-4 w-4 mr-2" />
                Upgrade Package
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Usage Overview */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Usage Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {usageItems.map((item, index) => {
              const percentage = getUsagePercentage(item.current, item.limit)
              const nearLimit = isNearLimit(item.current, item.limit)
              const atLimit = percentage >= 100

              return (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <Badge variant={atLimit ? "destructive" : nearLimit ? "warning" : "success"}>
                      {item.limit === "unlimited" ? "Unlimited" : `${item.current}/${item.limit}`}
                    </Badge>
                  </div>

                  {item.limit !== "unlimited" && (
                    <div className="space-y-2">
                      <Progress
                        value={percentage}
                        className={`h-2 ${atLimit ? "bg-red-200" : nearLimit ? "bg-yellow-200" : "bg-green-200"}`}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{Math.round(percentage)}% used</span>
                        <span>{item.limit - item.current} remaining</span>
                      </div>
                    </div>
                  )}

                  {atLimit && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Limit reached - upgrade to add more</span>
                    </div>
                  )}

                  {nearLimit && !atLimit && (
                    <div className="flex items-center space-x-2 text-yellow-600 text-sm">
                      <Zap className="h-4 w-4" />
                      <span>Approaching limit - consider upgrading</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Revenue Tracking */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Monthly Revenue</h4>
                <p className="text-2xl font-bold text-green-600">UGX {revenue.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Transaction Fee</p>
                <p className="font-semibold">{(packageLimits.transaction_fee * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
