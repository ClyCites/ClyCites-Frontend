"use client"
import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Mail, Phone, MapPin, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="bg-gradient-to-br from-gray-900 to-gray-950 text-white"
    >
      {/* Newsletter Section */}
      <div className="relative px-4 md:px-8">
        <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl bg-gray-800 p-8 md:p-10">
          <div className="absolute inset-0 bg-[url('/pattern.png')] bg-center opacity-10"></div>
          <div className="relative grid gap-6 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold tracking-tight">Subscribe to our newsletter</h3>
              <p className="mt-2 text-gray-300">
                Get the latest updates on agricultural trends, market prices, and ClyCites features.
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                />
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Subscribe</Button>
              </div>
              <p className="text-xs text-gray-400">
                By subscribing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Footer */}
      <div className="relative px-4 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src="/images/logo.jpeg"
                alt="ClyCites"
                width={60}
                height={60}
                className="rounded-full border-2 border-emerald-500"
              />
              <span className="font-bold text-2xl">ClyCites</span>
            </Link>
            <p className="mt-4 text-gray-300 max-w-md">
              An opensource platform that helps professional and upcoming farmers to get into the trade digitally,
              market and sell their farm produces, and communicate with potential customers.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="https://facebook.com/ClyCites"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-300 transition-colors hover:bg-emerald-600 hover:text-white"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="https://twitter.com/ClyCites"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-300 transition-colors hover:bg-emerald-600 hover:text-white"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="https://instagram.com/ClyCites"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-300 transition-colors hover:bg-emerald-600 hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="https://linkedin.com/company/ClyCites"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-300 transition-colors hover:bg-emerald-600 hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                href="https://youtube.com/ClyCites"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-300 transition-colors hover:bg-emerald-600 hover:text-white"
              >
                <Youtube className="h-4 w-4" />
              </Link>
              <Link
                href="https://github.com/ClyCites"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-300 transition-colors hover:bg-emerald-600 hover:text-white"
              >
                <Github className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-lg mb-4 text-emerald-400">Products</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products/analytics"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Analytics Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/products/mobile-app"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Mobile App
                </Link>
              </li>
              <li>
                <Link
                  href="/products/e-market"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  E-Market
                </Link>
              </li>
              <li>
                <Link
                  href="/products/pest-detection"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Pest Detection
                </Link>
              </li>
              <li>
                <Link
                  href="/products/soil-detection"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Soil Analysis
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-lg mb-4 text-emerald-400">Solutions</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/disease"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Disease Control
                </Link>
              </li>
              <li>
                <Link
                  href="/nutrition"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Nutrition Monitoring
                </Link>
              </li>
              <li>
                <Link
                  href="/price-monitoring"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Price Monitoring
                </Link>
              </li>
              <li>
                <Link
                  href="/market-intelligence"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Market Intelligence
                </Link>
              </li>
              <li>
                <Link
                  href="/expert-portal"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Expert Portal
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-lg mb-4 text-emerald-400">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">
                  Bugema University
                  <br />
                  Kampala, Uganda
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <a href="mailto:info@clycites.com" className="text-gray-300 hover:text-emerald-400 transition-colors">
                  info@clycites.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <a href="tel:+256123456789" className="text-gray-300 hover:text-emerald-400 transition-colors">
                  +256 123 456 789
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <Badge variant="outline" className="mb-2 border-emerald-500 text-emerald-400">
                We're Hiring!
              </Badge>
              <p className="text-sm text-gray-300">Join our team and help transform agriculture in Africa.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                asChild
              >
                <Link href="/careers">
                  View Careers <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Footer */}
      <motion.div variants={itemVariants} className="border-t border-gray-800">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} ClyCites. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.footer>
  )
}
