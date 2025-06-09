"use client"
import { useState } from "react"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the email to your backend
    console.log("Newsletter signup:", email)
    setIsSubscribed(true)
    setEmail("")
  }

  return (
    <section className="py-16 bg-lime-600 dark:bg-lime-700">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Stay Updated with Fresh Deals</h2>
        <p className="text-lime-100 text-lg mb-8">
          Get the latest updates on seasonal products, special offers, and agricultural news
        </p>

        {isSubscribed ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <p className="text-white text-lg">Thank you for subscribing! 🎉</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white/50 outline-none"
            />
            <button
              type="submit"
              className="bg-white text-lime-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
