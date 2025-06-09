import Link from "next/link"
import Hero from "@/components/frontend/Hero"
import MarketList from "@/components/frontend/MarketList"
import FeaturedProducts from "@/components/frontend/FeaturedProducts"
import CategoriesShowcase from "@/components/frontend/CategoriesShowcase"
import PopularProducts from "@/components/frontend/PopularProducts"
import SeasonalProducts from "@/components/frontend/SeasonalProducts"
import NewsletterSignup from "@/components/frontend/NewsletterSignup"
import Testimonials from "@/components/frontend/Testimonials"

export default function page() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50/30 via-lime-50/30 to-emerald-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section - Full Width */}
      <Hero />

      {/* Main Content Sections */}
      <div className="w-full space-y-16 pb-16">
        {/* Featured Products */}
        <section className="w-full px-4 sm:px-6 lg:px-8">
          <FeaturedProducts />
        </section>

        {/* Categories Showcase */}
        <section className="w-full bg-white/50 dark:bg-slate-800/30 py-16">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <CategoriesShowcase />
          </div>
        </section>

        {/* Markets List */}
        <section className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-lime-600 bg-clip-text text-transparent mb-4">
              Explore Local Markets
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover fresh produce from trusted local farmers and markets in your area
            </p>
          </div>
          <MarketList />
        </section>

        {/* Popular Products */}
        <section className="w-full bg-gradient-to-r from-green-50 to-lime-50 dark:from-slate-800 dark:to-slate-700 py-16">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <PopularProducts />
          </div>
        </section>

        {/* Seasonal Products */}
        <section className="w-full px-4 sm:px-6 lg:px-8">
          <SeasonalProducts />
        </section>

        {/* Testimonials */}
        <section className="w-full bg-white/50 dark:bg-slate-800/30 py-16">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <Testimonials />
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-600 via-lime-600 to-emerald-600 rounded-3xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Selling?</h2>
            <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
              Join thousands of farmers and vendors already selling on ClyCites. Start your journey to reach millions of
              customers today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register-farmer"
                className="px-8 py-4 bg-white text-green-600 font-bold rounded-xl hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🌱 Become a Seller
              </Link>
              <Link
                href="/how-it-works"
                className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-green-600 transition-all duration-300"
              >
                Learn How It Works
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="w-full px-4 sm:px-6 lg:px-8">
          <NewsletterSignup />
        </section>
      </div>
    </div>
  )
}
