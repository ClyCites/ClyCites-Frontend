"use client"
import Link from "next/link"
import Image from "next/image"
import HeroCarousel from "./HeroCarousel"
import { HelpCircle, FolderSync, CircleDollarSign, Star, Truck, Shield, Clock } from "lucide-react"
import advert from "../../public/images/adv.gif"

export default function Hero() {
  const categories = [
    { name: "Fresh Vegetables", image: "/placeholder.svg?height=40&width=40", count: "150+ items" },
    { name: "Organic Fruits", image: "/placeholder.svg?height=40&width=40", count: "200+ items" },
    { name: "Dairy Products", image: "/placeholder.svg?height=40&width=40", count: "80+ items" },
    { name: "Grains & Cereals", image: "/placeholder.svg?height=40&width=40", count: "120+ items" },
    { name: "Herbs & Spices", image: "/placeholder.svg?height=40&width=40", count: "90+ items" },
    { name: "Nuts & Seeds", image: "/placeholder.svg?height=40&width=40", count: "60+ items" },
    { name: "Honey & Syrups", image: "/placeholder.svg?height=40&width=40", count: "40+ items" },
    { name: "Mushrooms", image: "/placeholder.svg?height=40&width=40", count: "30+ items" },
  ]

  const features = [
    { icon: <Truck className="w-5 h-5" />, title: "Free Delivery", desc: "On orders over $50" },
    { icon: <Shield className="w-5 h-5" />, title: "100% Organic", desc: "Certified products" },
    { icon: <Clock className="w-5 h-5" />, title: "Fresh Daily", desc: "Farm to table" },
    { icon: <Star className="w-5 h-5" />, title: "Top Quality", desc: "Premium selection" },
  ]

  return (
    <div className="w-full bg-gradient-to-br from-green-50 via-lime-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Main Hero Section */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-3 bg-white/80 backdrop-blur-sm border border-green-200/50 rounded-2xl dark:bg-slate-800/80 dark:border-slate-700/50 text-slate-800 overflow-hidden shadow-xl">
            <div className="bg-gradient-to-r from-green-600 to-lime-600 py-4 px-6 text-white">
              <h2 className="font-bold text-lg flex items-center">🛒 Shop By Category</h2>
            </div>
            <div className="py-4 px-2 max-h-[400px] overflow-y-auto custom-scrollbar">
              {categories.map((category, i) => (
                <Link
                  key={i}
                  href={`/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center gap-4 hover:bg-green-50 dark:hover:bg-slate-700 duration-300 transition-all dark:text-slate-300 rounded-xl p-3 mx-2 mb-2 group"
                >
                  <div className="relative">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover border-2 border-green-200 group-hover:border-green-400 transition-colors"
                    />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-sm text-gray-800 dark:text-gray-200 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {category.name}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{category.count}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Hero Carousel */}
          <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-2xl">
            <HeroCarousel />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm p-6 dark:bg-slate-800/80 rounded-2xl shadow-xl border border-green-200/50 dark:border-slate-700/50">
              <Link href="/customer-support" className="flex items-center space-x-3 mb-6 group">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                  <HelpCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    Help Center
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">24/7 Customer Support</p>
                </div>
              </Link>

              <Link href="/delivery-details" className="flex items-center space-x-3 mb-6 group">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                  <FolderSync className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Easy Returns
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">30-day return policy</p>
                </div>
              </Link>

              <Link href="/register-farmer" className="flex items-center space-x-3 mb-6 group">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800 transition-colors">
                  <CircleDollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                    Sell on ClyCites
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Join 10,000+ sellers</p>
                </div>
              </Link>
            </div>

            {/* Advertisement */}
            <div className="bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 p-6 rounded-2xl shadow-xl border border-orange-200/50 dark:border-orange-700/50">
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg text-orange-800 dark:text-orange-200">🎉 Special Offer!</h3>
                <p className="text-sm text-orange-600 dark:text-orange-300">Get 20% off on first order</p>
              </div>
              <Image src={advert || "/placeholder.svg"} alt="Special Offer" className="w-full rounded-lg shadow-md" />
              <button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                Claim Offer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-y border-green-200/50 dark:border-slate-700/50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="p-4 bg-gradient-to-br from-green-100 to-lime-100 dark:from-green-900 dark:to-lime-900 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <div className="text-green-600 dark:text-green-400">{feature.icon}</div>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-green-600 via-lime-600 to-emerald-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="group">
              <div className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform">10K+</div>
              <div className="text-green-100">Happy Customers</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform">500+</div>
              <div className="text-green-100">Local Farmers</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform">1000+</div>
              <div className="text-green-100">Fresh Products</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform">50+</div>
              <div className="text-green-100">Cities Served</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
