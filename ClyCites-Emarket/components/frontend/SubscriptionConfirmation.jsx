"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, CreditCard, Calendar, Star, Zap, Crown, Rocket } from "lucide-react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

const packageDetails = {
  free: {
    name: "Starter",
    price: 0,
    icon: Star,
    color: "from-gray-500 to-gray-600",
    features: ["Up to 10 products", "Basic product listing", "Email support", "Basic analytics", "5% transaction fee"],
  },
  basic: {
    name: "Growth",
    price: 29,
    icon: Zap,
    color: "from-green-500 to-green-600",
    features: [
      "Up to 100 products",
      "Enhanced listings",
      "Priority chat support",
      "Advanced analytics",
      "3% transaction fee",
      "Marketing tools",
    ],
  },
  pro: {
    name: "Professional",
    price: 79,
    icon: Crown,
    color: "from-blue-500 to-blue-600",
    features: [
      "Up to 500 products",
      "Premium features",
      "24/7 phone support",
      "Professional analytics",
      "2% transaction fee",
      "Advanced marketing suite",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: 199,
    icon: Rocket,
    color: "from-purple-500 to-purple-600",
    features: [
      "Unlimited products",
      "White-label solution",
      "Dedicated support team",
      "Custom analytics",
      "1% transaction fee",
      "Custom integrations",
    ],
  },
}

export default function SubscriptionConfirmation({ userId, selectedPackage }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const packageInfo = packageDetails[selectedPackage]
  const IconComponent = packageInfo.icon

  const handleSubscription = async () => {
    setLoading(true)

    try {
      if (selectedPackage === "free") {
        // For free package, just activate the account
        const response = await fetch("/api/subscriptions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            packageId: selectedPackage,
            status: "active",
          }),
        })

        if (response.ok) {
          toast.success("Welcome to ClyCites! Your free account is ready.")
          router.push("/farmer-dashboard")
        } else {
          throw new Error("Failed to activate account")
        }
      } else {
        // For paid packages, redirect to payment
        router.push(`/payment?userId=${userId}&package=${selectedPackage}`)
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to ClyCites! 🌱</h1>
        <p className="text-xl text-gray-600">You're one step away from starting your farming journey</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Package Summary */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-500 to-lime-500 text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Your Selected Package</CardTitle>
                <CardDescription className="text-green-100">Perfect choice for your farming business</CardDescription>
              </div>
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-r ${packageInfo.color} flex items-center justify-center`}
              >
                <IconComponent className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-gray-900">{packageInfo.name}</h3>
              <div className="text-4xl font-bold text-green-600 mt-2">
                ${packageInfo.price}
                <span className="text-lg text-gray-500 font-normal">
                  {packageInfo.price === 0 ? "/forever" : "/month"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
              {packageInfo.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Confirmation Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-green-500" />
              Subscription Details
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Package:</span>
                <span className="font-semibold">{packageInfo.name}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Billing:</span>
                <span className="font-semibold">{packageInfo.price === 0 ? "Free Forever" : "Monthly"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total:</span>
                <span className="text-2xl font-bold text-green-600">${packageInfo.price}</span>
              </div>
            </div>

            {selectedPackage === "free" ? (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-green-800 text-sm">
                    🎉 Great choice! Your free account will be activated immediately.
                  </p>
                </div>
                <Button
                  onClick={handleSubscription}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white py-3 text-lg"
                >
                  {loading ? "Activating Account..." : "Activate Free Account"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                    <p className="text-blue-800 text-sm">Secure payment required to activate your subscription</p>
                  </div>
                </div>
                <Button
                  onClick={handleSubscription}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 text-lg"
                >
                  {loading ? "Processing..." : "Proceed to Payment"}
                </Button>
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-500">
                You can upgrade or downgrade your plan anytime from your dashboard
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits Section */}
      <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose ClyCites?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Setup</h3>
            <p className="text-gray-600">Get your farm store online in minutes, not days</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Powerful Tools</h3>
            <p className="text-gray-600">Advanced analytics and marketing tools to grow your business</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
            <p className="text-gray-600">Get help from our team of agricultural ecommerce experts</p>
          </div>
        </div>
      </div>
    </div>
  )
}
