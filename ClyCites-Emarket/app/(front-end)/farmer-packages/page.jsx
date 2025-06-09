"use client"
import { useState } from "react"
import Link from "next/link"
import { Check, Star, Zap, Crown, Rocket, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

const packages = [
  {
    id: "free",
    name: "Starter",
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: Star,
    description: "Perfect for getting started",
    color: "from-gray-500 to-gray-600",
    popular: false,
    features: [
      "Up to 10 products",
      "Basic product listing",
      "Standard support",
      "Basic analytics",
      "5% transaction fee",
      "Community access",
    ],
    limitations: {
      products: 10,
      images_per_product: 3,
      categories: 2,
      monthly_orders: 50,
      support: "email",
      analytics: "basic",
    },
  },
  {
    id: "basic",
    name: "Growth",
    monthlyPrice: 29,
    yearlyPrice: 290, // 2 months free
    icon: Zap,
    description: "For growing farm businesses",
    color: "from-green-500 to-green-600",
    popular: true,
    features: [
      "Up to 100 products",
      "Enhanced product listings",
      "Priority support",
      "Advanced analytics",
      "3% transaction fee",
      "Marketing tools",
      "Bulk upload",
      "Custom branding",
    ],
    limitations: {
      products: 100,
      images_per_product: 10,
      categories: 10,
      monthly_orders: 500,
      support: "chat",
      analytics: "advanced",
    },
  },
  {
    id: "pro",
    name: "Professional",
    monthlyPrice: 79,
    yearlyPrice: 790, // 2 months free
    icon: Crown,
    description: "For established farm operations",
    color: "from-blue-500 to-blue-600",
    popular: false,
    features: [
      "Up to 500 products",
      "Premium product features",
      "24/7 priority support",
      "Professional analytics",
      "2% transaction fee",
      "Advanced marketing suite",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
    ],
    limitations: {
      products: 500,
      images_per_product: 20,
      categories: "unlimited",
      monthly_orders: 2000,
      support: "24/7",
      analytics: "professional",
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: 199,
    yearlyPrice: 1990, // 2 months free
    icon: Rocket,
    description: "For large-scale operations",
    color: "from-purple-500 to-purple-600",
    popular: false,
    features: [
      "Unlimited products",
      "White-label solution",
      "Dedicated support team",
      "Custom analytics dashboard",
      "1% transaction fee",
      "Full marketing automation",
      "Custom API development",
      "Multi-location support",
      "Advanced reporting",
      "Custom training",
    ],
    limitations: {
      products: "unlimited",
      images_per_product: "unlimited",
      categories: "unlimited",
      monthly_orders: "unlimited",
      support: "dedicated",
      analytics: "custom",
    },
  },
]

export default function FarmerPackagesPage() {
  const [isYearly, setIsYearly] = useState(false)

  const calculateSavings = (monthlyPrice, yearlyPrice) => {
    if (monthlyPrice === 0) return 0
    const monthlyCost = monthlyPrice * 12
    const savings = monthlyCost - yearlyPrice
    return Math.round((savings / monthlyCost) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-lime-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-lime-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Choose Your <span className="text-lime-200">Farming</span> Package
          </h1>
          <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-8">
            Start selling your agricultural products online with packages designed for every farm size
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 bg-white/10 backdrop-blur-sm rounded-full p-2 max-w-md mx-auto">
            <span className={`text-sm font-medium ${!isYearly ? "text-white" : "text-green-200"}`}>Monthly</span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} className="data-[state=checked]:bg-lime-500" />
            <span className={`text-sm font-medium ${isYearly ? "text-white" : "text-green-200"}`}>
              Yearly
              <Badge className="ml-2 bg-lime-500 text-white text-xs">Save up to 17%</Badge>
            </span>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map((pkg) => {
            const IconComponent = pkg.icon
            const currentPrice = isYearly ? pkg.yearlyPrice : pkg.monthlyPrice
            const savings = calculateSavings(pkg.monthlyPrice, pkg.yearlyPrice)

            return (
              <Card
                key={pkg.id}
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  pkg.popular ? "ring-2 ring-green-500 shadow-xl" : ""
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-green-500 to-lime-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                    Most Popular
                  </div>
                )}

                {isYearly && savings > 0 && (
                  <div className="absolute top-0 left-0 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 text-xs font-semibold rounded-br-lg">
                    Save {savings}%
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${pkg.color} flex items-center justify-center mb-4`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{pkg.name}</CardTitle>
                  <CardDescription className="text-gray-600">{pkg.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">${currentPrice}</span>
                    <span className="text-gray-600 ml-2">
                      /{isYearly ? "year" : "month"}
                      {isYearly && pkg.monthlyPrice > 0 && (
                        <div className="text-sm text-gray-500 line-through">${pkg.monthlyPrice * 12}/year</div>
                      )}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="px-6">
                  <ul className="space-y-3">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="px-6 pb-6">
                  <Link
                    href={`/register-farmer?package=${pkg.id}&billing=${isYearly ? "yearly" : "monthly"}`}
                    className="w-full"
                  >
                    <Button
                      className={`w-full py-3 text-lg font-semibold transition-all duration-300 ${
                        pkg.popular
                          ? "bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                      }`}
                    >
                      {pkg.monthlyPrice === 0 ? "Start Free" : "Choose Plan"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Billing Benefits */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Monthly Billing</h3>
                <p className="text-gray-600">Flexible payments, cancel anytime</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Yearly Billing</h3>
                <p className="text-gray-600">Save up to 17% with annual plans</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Features Comparison Table */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">Package Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-green-500 to-lime-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Features</th>
                  {packages.map((pkg) => (
                    <th key={pkg.id} className="px-6 py-4 text-center">
                      {pkg.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 font-semibold">Product Limit</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="px-6 py-4 text-center">
                      {pkg.limitations.products}
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-semibold">Images per Product</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="px-6 py-4 text-center">
                      {pkg.limitations.images_per_product}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold">Monthly Orders</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="px-6 py-4 text-center">
                      {pkg.limitations.monthly_orders}
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-semibold">Support Type</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="px-6 py-4 text-center capitalize">
                      {pkg.limitations.support}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
