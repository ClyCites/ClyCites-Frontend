import { Phone, Mail, MessageCircle, Clock, HelpCircle } from "lucide-react"

export default function CustomerSupportPage() {
  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us for immediate assistance",
      contact: "+256 700 123 456",
      hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-4PM",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours",
      contact: "support@clycites.com",
      hours: "24/7 Response",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      contact: "Available on website",
      hours: "Mon-Fri: 8AM-8PM",
    },
  ]

  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "Simply browse our products, add items to your cart, and proceed to checkout. You can pay using mobile money, card, or cash on delivery.",
    },
    {
      question: "What are the delivery charges?",
      answer:
        "Delivery is free for orders above UGX 50,000. For smaller orders, delivery charges range from UGX 5,000 to UGX 15,000 depending on your location.",
    },
    {
      question: "How fresh are the products?",
      answer:
        "All our products are harvested within 24-48 hours before delivery. We work directly with farmers to ensure maximum freshness.",
    },
    {
      question: "Can I return products?",
      answer:
        "Yes, we have a 24-hour return policy for fresh products. If you're not satisfied, contact us immediately for a refund or replacement.",
    },
    {
      question: "How do I become a farmer on ClyCites?",
      answer:
        "Visit our 'For Farmers' page and fill out the registration form. Our team will verify your farm and help you get started with selling.",
    },
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
          Customer <span className="text-orange-600">Support</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          We're here to help! Get in touch with our support team for any questions or assistance.
        </p>
      </section>

      {/* Contact Methods */}
      <section className="grid md:grid-cols-3 gap-8">
        {contactMethods.map((method, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <method.icon className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{method.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{method.description}</p>
            <p className="font-semibold text-orange-600 mb-2">{method.contact}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{method.hours}</p>
          </div>
        ))}
      </section>

      {/* FAQ Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <HelpCircle className="w-5 h-5 text-orange-600 mr-2" />
                {faq.question}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 pl-7">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Support Hours */}
      <section className="bg-green-50 dark:bg-gray-800 rounded-2xl p-12">
        <div className="text-center space-y-6">
          <Clock className="w-16 h-16 text-orange-600 mx-auto" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Support Hours</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Phone & Live Chat</h3>
              <p className="text-gray-600 dark:text-gray-300">Monday - Friday: 8:00 AM - 8:00 PM</p>
              <p className="text-gray-600 dark:text-gray-300">Saturday: 9:00 AM - 4:00 PM</p>
              <p className="text-gray-600 dark:text-gray-300">Sunday: Closed</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email Support</h3>
              <p className="text-gray-600 dark:text-gray-300">24/7 - We respond within 24 hours</p>
              <p className="text-gray-600 dark:text-gray-300">Emergency issues: Within 2 hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Send Us a Message</h2>
        <form className="max-w-2xl mx-auto space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="your@email.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="How can we help you?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
            <textarea
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Please describe your issue or question in detail..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
          >
            Send Message
          </button>
        </form>
      </section>
    </div>
  )
}
