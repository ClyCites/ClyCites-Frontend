"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Crown, Rocket } from "lucide-react"
import Link from "next/link"

const packages = [
  {
    id: "free",
    name: "Starter",
    price: 0,
    duration: "Forever",
    icon: Star,
    description: "Perfect for getting started",
    color: "from-gray-500 to-gray-600",
    features: ["10 products", "Basic support", "5% transaction fee"],
    popular: false,
  },
  {
    id: "basic",
    name: "Growth",
    price: 29,
    duration: "per month",
    icon: Zap,
    description: "For growing businesses",
    color: "from-green-500 to-green-600",
    features: ["100 products", "Priority support", "3% transaction fee"],
    popular: true,
  },
  {
    id: "pro",
    name: "Professional",
    price: 79,
    duration: "per month",
    icon: Crown,
    description: "For established farms",
    color: "from-blue-500 to-blue-600",
    features: ["500 products", "24/7 support", "2% transaction fee"],
    popular: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    duration: "per month",
    icon: Rocket,
    description: "For large operations",
    color: "from-purple-500 to-purple-600",
    features: ["Unlimited products", "Dedicated support", "1% transaction fee"],
    popular: false,
  },
]

export default function PackageSelector({ selectedPackage }) {
  const [selected, setSelected] = useState(selectedPackage)

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Package</h2>
        <p className="text-gray-600">Select the perfect plan for your farming business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {packages.map((pkg) => {
          const IconComponent = pkg.icon
          const isSelected = selected === pkg.id

          return (
            <Link key={pkg.id} href={`/register-farmer?package=${pkg.id}`}>
              <Card
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  isSelected ? "ring-2 ring-green-500 shadow-lg" : "hover:shadow-md"
                } ${pkg.popular ? "border-green-500" : ""}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white">Most Popular</Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-2">
                  <div
                    className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${pkg.color} flex items-center justify-center mb-2`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{pkg.name}</CardTitle>
                  <div className="text-2xl font-bold">
                    ${pkg.price}
                    <span className="text-sm text-gray-500 font-normal">/{pkg.duration}</span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-1">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="w-3 h-3 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {selected && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-800 text-center">
            <strong>Selected:</strong> {packages.find((p) => p.id === selected)?.name} Package
          </p>
        </div>
      )}
    </div>
  )
}
