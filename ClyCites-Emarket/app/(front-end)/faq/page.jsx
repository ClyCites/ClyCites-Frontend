"use client"

import { HelpCircle, ChevronDown } from "lucide-react"
import { useState } from "react"

export default function FAQPage() {
  const [openItems, setOpenItems] = useState({})

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create an account on ClyCites?",
          answer:
            "Click on 'Sign Up' in the top right corner, choose whether you're a buyer or farmer, fill in your details, and verify your phone number. It takes less than 5 minutes!",
        },
        {
          question: "Is ClyCites free to use?",
          answer:
            "Yes! Creating an account and browsing products is completely free. Farmers pay a small commission only when they make a sale, and buyers only pay for products and delivery.",
        },
        {
          question: "What areas do you serve?",
          answer:
            "We currently serve Kampala, Wakiso, Mukono, Entebbe, and surrounding areas. We're expanding to more districts across Uganda regularly.",
        },
      ],
    },
    {
      category: "For Buyers",
      questions: [
        {
          question: "How fresh are the products?",
          answer:
            "All our products are harvested within 24-48 hours before delivery. We work directly with farmers to ensure maximum freshness and quality.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept Mobile Money (MTN, Airtel), credit/debit cards, and cash on delivery in select areas. All payments are secure and encrypted.",
        },
        {
          question: "Can I return products if I'm not satisfied?",
          answer:
            "Yes! We have a 24-hour return policy for fresh products. If you're not satisfied with the quality, contact us immediately for a refund or replacement.",
        },
        {
          question: "How much does delivery cost?",
          answer:
            "Delivery is free for orders above UGX 50,000. For smaller orders, delivery fees range from UGX 5,000 to UGX 15,000 depending on your location.",
        },
      ],
    },
    {
      category: "For Farmers",
      questions: [
        {
          question: "How do I become a seller on ClyCites?",
          answer:
            "Register as a farmer, provide your farm details and certifications, upload photos of your products, and our team will verify your account within 2-3 business days.",
        },
        {
          question: "What commission do you charge?",
          answer:
            "We charge a competitive commission of 8-12% per sale, which includes payment processing, customer support, and platform maintenance. No hidden fees!",
        },
        {
          question: "How do I get paid?",
          answer:
            "Payments are processed within 24-48 hours after successful delivery. You can receive payments via Mobile Money or bank transfer.",
        },
        {
          question: "Can I set my own prices?",
          answer:
            "You have full control over your product pricing. We provide market insights to help you price competitively.",
        },
      ],
    },
    {
      category: "Orders & Delivery",
      questions: [
        {
          question: "How can I track my order?",
          answer:
            "Once your order is confirmed, you'll receive SMS and email updates. You can also track your order in real-time through your account dashboard.",
        },
        {
          question: "What if I'm not home during delivery?",
          answer:
            "Our delivery team will call you 30 minutes before arrival. If you're not available, we can reschedule delivery for the next available slot at no extra cost.",
        },
        {
          question: "Can I change or cancel my order?",
          answer:
            "You can modify or cancel your order within 2 hours of placing it. After that, please contact customer support as the farmer may have already started preparing your order.",
        },
      ],
    },
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
          Frequently Asked <span className="text-orange-600">Questions</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Find answers to common questions about ClyCites. Can't find what you're looking for? Contact our support team.
        </p>
      </section>

      {/* FAQ Categories */}
      <section className="space-y-12">
        {faqs.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b-2 border-orange-600 pb-2">
              {category.category}
            </h2>
            <div className="space-y-4">
              {category.questions.map((faq, questionIndex) => {
                const itemKey = `${categoryIndex}-${questionIndex}`
                const isOpen = openItems[itemKey]

                return (
                  <div key={questionIndex} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <button
                      onClick={() => toggleItem(itemKey)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="font-semibold text-gray-900 dark:text-white pr-4">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-orange-600 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Contact Support */}
      <section className="bg-green-50 dark:bg-gray-800 rounded-2xl p-12 text-center">
        <HelpCircle className="w-16 h-16 text-orange-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Still Have Questions?</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Our customer support team is here to help you with any questions or concerns you may have.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold">
            Contact Support
          </button>
          <button className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 px-8 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-semibold">
            Live Chat
          </button>
        </div>
      </section>
    </div>
  )
}
