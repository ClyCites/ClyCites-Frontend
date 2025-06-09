import { UserPlus, Search, ShoppingCart, Truck } from "lucide-react"

export default function HowItWorksPage() {
  const steps = [
    {
      icon: UserPlus,
      title: "Sign Up",
      description: "Create your account as a buyer or farmer in just a few minutes.",
      details: [
        "Choose your account type (Buyer or Farmer)",
        "Verify your phone number and email",
        "Complete your profile information",
        "Start exploring the marketplace",
      ],
    },
    {
      icon: Search,
      title: "Browse Products",
      description: "Explore thousands of fresh agricultural products from verified farmers.",
      details: [
        "Use advanced filters to find what you need",
        "Compare prices from different farmers",
        "Read reviews and ratings",
        "Check product availability and delivery options",
      ],
    },
    {
      icon: ShoppingCart,
      title: "Place Order",
      description: "Add products to cart and checkout securely with multiple payment options.",
      details: [
        "Add products to your shopping cart",
        "Choose delivery date and time",
        "Select payment method (Mobile Money, Card, Cash)",
        "Confirm your order and delivery address",
      ],
    },
    {
      icon: Truck,
      title: "Get Delivered",
      description: "Receive fresh products at your doorstep within 24 hours.",
      details: [
        "Track your order in real-time",
        "Receive SMS/email updates",
        "Get fresh products delivered",
        "Rate and review your experience",
      ],
    },
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
          How <span className="text-orange-600">ClyCites</span> Works
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Getting fresh agricultural products has never been easier. Follow these simple steps to start your journey.
        </p>
      </section>

      {/* Steps Section */}
      <section className="space-y-16">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "md:grid-flow-col-dense" : ""}`}
          >
            <div className={`space-y-6 ${index % 2 === 1 ? "md:col-start-2" : ""}`}>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-orange-600">Step {index + 1}</span>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{step.title}</h3>
                </div>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">{step.description}</p>
              <ul className="space-y-2">
                {step.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-600 dark:text-gray-300">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className={`relative h-80 bg-gray-100 dark:bg-gray-700 rounded-2xl ${index % 2 === 1 ? "md:col-start-1" : ""}`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <step.icon className="w-24 h-24 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-orange-600 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-8 opacity-90">Join thousands of farmers and buyers already using ClyCites</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Sign Up as Buyer
          </button>
          <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
            Join as Farmer
          </button>
        </div>
      </section>
    </div>
  )
}
