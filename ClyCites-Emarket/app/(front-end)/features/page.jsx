import { Truck, Shield, Clock, Users, Smartphone, BarChart3 } from "lucide-react"

export default function FeaturesPage() {
  const features = [
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Get fresh products delivered to your doorstep within 24 hours of ordering.",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900",
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "All products are verified by our quality team before reaching customers.",
      color: "bg-green-100 text-green-600 dark:bg-green-900",
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Track your orders in real-time from farm to your table.",
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900",
    },
    {
      icon: Users,
      title: "Direct from Farmers",
      description: "Buy directly from verified farmers, ensuring fair prices for all.",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900",
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Access our platform from any device, anywhere, anytime.",
      color: "bg-pink-100 text-pink-600 dark:bg-pink-900",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Farmers get detailed analytics to optimize their sales and production.",
      color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900",
    },
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
          Platform <span className="text-orange-600">Features</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Discover the powerful features that make ClyCites the best agricultural marketplace in Uganda.
        </p>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mb-6`}>
              <feature.icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* For Farmers Section */}
      <section className="bg-green-50 dark:bg-gray-800 rounded-2xl p-12">
        <div className="text-center space-y-6 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">For Farmers</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Empower your farming business with our comprehensive tools and features.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Product Management</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Easy product listing with photos</li>
              <li>• Inventory management tools</li>
              <li>• Price optimization suggestions</li>
              <li>• Bulk upload capabilities</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Sales Analytics</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Real-time sales tracking</li>
              <li>• Customer insights and feedback</li>
              <li>• Revenue analytics and reports</li>
              <li>• Market trend analysis</li>
            </ul>
          </div>
        </div>
      </section>

      {/* For Buyers Section */}
      <section className="bg-orange-50 dark:bg-gray-800 rounded-2xl p-12">
        <div className="text-center space-y-6 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">For Buyers</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Enjoy a seamless shopping experience with fresh, quality products.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Shopping Experience</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Advanced search and filtering</li>
              <li>• Product reviews and ratings</li>
              <li>• Wishlist and favorites</li>
              <li>• Multiple payment options</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Order Management</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Order tracking and updates</li>
              <li>• Delivery scheduling</li>
              <li>• Return and refund support</li>
              <li>• Customer support chat</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
