import Image from "next/image"
import Link from "next/link"
import { Mail, Phone, MapPin, Clock, Send, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 sm:py-24 bg-emerald-50 dark:bg-emerald-950/30 flex justify-center">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">Contact Us</h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
              Have questions about ClyCites? We're here to help. Reach out to our team and we'll get back to you as soon
              as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 sm:py-24 bg-white dark:bg-gray-950 flex justify-center">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <div className="order-2 lg:order-1">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send Us a Message</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        First Name
                      </label>
                      <Input id="firstName" placeholder="Enter your first name" className="w-full" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Last Name
                      </label>
                      <Input id="lastName" placeholder="Enter your last name" className="w-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address
                    </label>
                    <Input id="email" type="email" placeholder="Enter your email address" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Subject
                    </label>
                    <Input id="subject" placeholder="What is this regarding?" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Message
                    </label>
                    <Textarea id="message" placeholder="How can we help you?" rows={5} className="w-full" />
                  </div>
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="order-1 lg:order-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Our Location</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      Bugema University
                      <br />
                      Kampala, Uganda
                    </p>
                    <Link
                      href="https://maps.google.com"
                      target="_blank"
                      className="inline-flex items-center text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 mt-2"
                    >
                      View on map
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Us</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      For general inquiries:
                      <br />
                      <a
                        href="mailto:info@clycites.com"
                        className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                      >
                        info@clycites.com
                      </a>
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      For support:
                      <br />
                      <a
                        href="mailto:support@clycites.com"
                        className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                      >
                        support@clycites.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Phone className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Call Us</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      Main Office:
                      <br />
                      <a
                        href="tel:+256123456789"
                        className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                      >
                        +256 123 456 789
                      </a>
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      Support Hotline:
                      <br />
                      <a
                        href="tel:+256987654321"
                        className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                      >
                        +256 987 654 321
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Working Hours</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      Monday - Friday: 8:00 AM - 5:00 PM
                      <br />
                      Saturday: 9:00 AM - 1:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Map or Image */}
              <div className="mt-10 rounded-xl overflow-hidden h-64 relative">
                <Image src="/images/agri.jpg" alt="Office Location" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-semibold">ClyCites Headquarters</p>
                  <p className="text-sm">Kampala, Uganda</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 bg-emerald-50 dark:bg-gray-900 flex justify-center">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Frequently Asked Questions
            </h2>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">How can I get started with ClyCites?</AccordionTrigger>
                <AccordionContent>
                  Getting started with ClyCites is easy. Simply create an account on our platform, and you'll have
                  access to our basic features. For more advanced features, you can upgrade to our premium plans. Our
                  onboarding process will guide you through setting up your profile and exploring our tools.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">What areas does ClyCites currently serve?</AccordionTrigger>
                <AccordionContent>
                  ClyCites currently operates in 8+ African cities, with a focus on Uganda, Kenya, and Tanzania. We're
                  rapidly expanding to other regions across Africa. Check our coverage map on the platform to see if
                  your area is currently served.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">How accurate is the price monitoring system?</AccordionTrigger>
                <AccordionContent>
                  Our PricePulse-AI system provides market price data with over 95% accuracy. We achieve this through a
                  combination of on-the-ground data collection by our community champions and advanced AI algorithms
                  that verify and analyze the data. Prices are updated daily for most commodities.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">Can I use ClyCites on my mobile device?</AccordionTrigger>
                <AccordionContent>
                  Yes, ClyCites is fully optimized for mobile use. You can download our mobile app from the Google Play
                  Store or Apple App Store. The app offers most of the features available on our web platform and is
                  designed to work efficiently even in areas with limited internet connectivity.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">How can I become a community champion?</AccordionTrigger>
                <AccordionContent>
                  To become a ClyCites Community Champion, you can apply through our platform. We look for individuals
                  who are passionate about agriculture and technology, with good knowledge of their local markets.
                  Champions receive training and tools to collect data and support farmers in their communities.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-10 text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-4">Still have questions? Contact our support team.</p>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="mailto:support@clycites.com">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
