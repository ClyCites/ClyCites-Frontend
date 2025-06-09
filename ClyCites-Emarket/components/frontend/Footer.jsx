import Image from "next/image"
import Link from "next/link"
import { Twitter, Facebook, Instagram, Github, Phone, Mail, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <Image src="/images/logo.jpeg" alt="ClyCites" width={50} height={50} className="rounded-full" />
              <div>
                <span className="text-2xl font-bold text-orange-400">ClyCites</span>
                <p className="text-sm text-green-200">Agricultural Marketplace</p>
              </div>
            </div>
            <p className="text-green-100 leading-relaxed">
              ClyCites is Uganda's leading agricultural marketplace connecting farmers directly with consumers. We
              provide fresh, quality agricultural products from verified local farmers to your doorstep.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-green-200">
                <Phone className="w-4 h-4" />
                <span>+256 700 123 456</span>
              </div>
              <div className="flex items-center space-x-2 text-green-200">
                <Mail className="w-4 h-4" />
                <span>info@clycites.com</span>
              </div>
              <div className="flex items-center space-x-2 text-green-200">
                <MapPin className="w-4 h-4" />
                <span>Kampala, Uganda</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="text-green-200 hover:text-orange-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-green-200 hover:text-orange-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-green-200 hover:text-orange-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-green-200 hover:text-orange-400 transition-colors">
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-400">COMPANY</h3>
            <div className="space-y-3">
              <Link href="/about" className="block text-green-200 hover:text-white transition-colors">
                About ClyCites
              </Link>
              <Link href="/features" className="block text-green-200 hover:text-white transition-colors">
                Our Features
              </Link>
              <Link href="/how-it-works" className="block text-green-200 hover:text-white transition-colors">
                How It Works
              </Link>
              <Link href="/careers" className="block text-green-200 hover:text-white transition-colors">
                Careers
              </Link>
              <Link href="/farmers" className="block text-green-200 hover:text-white transition-colors">
                For Farmers
              </Link>
            </div>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-400">HELP & SUPPORT</h3>
            <div className="space-y-3">
              <Link href="/customer-support" className="block text-green-200 hover:text-white transition-colors">
                Customer Support
              </Link>
              <Link href="/delivery-details" className="block text-green-200 hover:text-white transition-colors">
                Delivery Information
              </Link>
              <Link href="/terms-conditions" className="block text-green-200 hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/privacy-policy" className="block text-green-200 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/faq" className="block text-green-200 hover:text-white transition-colors">
                FAQ
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-400">STAY UPDATED</h3>
            <p className="text-green-200 text-sm mb-4">
              Subscribe to get updates on fresh products, seasonal offers, and farming tips.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium">
                Subscribe Now
              </button>
            </div>
            <div className="mt-4 p-3 bg-green-700 rounded-lg">
              <p className="text-sm text-green-100">🌱 Join 10,000+ farmers and buyers in our community!</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-green-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-green-200 text-sm">© 2024 ClyCites Agricultural Marketplace. All Rights Reserved.</p>
            <div className="flex space-x-6 text-sm">
              <Link href="/sitemap" className="text-green-200 hover:text-white">
                Sitemap
              </Link>
              <Link href="/accessibility" className="text-green-200 hover:text-white">
                Accessibility
              </Link>
              <Link href="/security" className="text-green-200 hover:text-white">
                Security
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
