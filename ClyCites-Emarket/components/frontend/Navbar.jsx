import ThemeSwitcherBtn from "../ThemeSwitcherBtn"
import Image from "next/image"
import Link from "next/link"
import logo from "../../public/images/logo.jpeg"
import SearchForm from "./SearchForm"
import { HelpCircle, ShoppingCart, User, X, Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Navbar() {
  return (
    <div className="bg-gradient-to-r from-green-50 via-lime-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 shadow-lg border-b border-green-100 dark:border-slate-700">
      {/* Top Bar */}
      <div className="bg-green-600 dark:bg-slate-900 text-white py-2">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span>📞 +1 (555) 123-4567</span>
              <span className="hidden sm:inline">📧 support@clycites.com</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline">🚚 Free Delivery on Orders $50+</span>
              <Link href="/register-farmer" className="hover:text-green-200 transition-colors">
                Sell on ClyCites
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 gap-4">
          {/* Logo */}
          <Link className="flex items-center space-x-2 flex-shrink-0" href="/">
            <div className="relative">
              <Image
                src={logo || "/placeholder.svg"}
                alt="ClyCites logo"
                className="w-12 h-12 rounded-full border-2 border-green-200 shadow-md hover:shadow-lg transition-shadow"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-green-800 dark:text-green-400">ClyCites</h1>
              <p className="text-xs text-green-600 dark:text-green-300">Fresh & Organic</p>
            </div>
          </Link>

          {/* Search - Hidden on mobile, shown in sheet */}
          <div className="hidden md:flex flex-grow max-w-2xl">
            <SearchForm />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/login"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-300 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-slate-700 border border-green-200 dark:border-slate-600"
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Login</span>
            </Link>

            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-300 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-slate-700 border border-green-200 dark:border-slate-600">
              <HelpCircle className="w-5 h-5" />
              <span className="font-medium">Help</span>
            </button>

            {/* Cart Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-medium">Cart</span>
                  <div className="absolute -top-2 -right-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full animate-bounce">
                    3
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-4 bg-white dark:bg-slate-800 shadow-2xl border border-green-100 dark:border-slate-700">
                <DropdownMenuLabel className="text-lg font-semibold text-green-800 dark:text-green-400">
                  Shopping Cart
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Cart Items */}
                {[1, 2, 3].map((item) => (
                  <DropdownMenuItem key={item} className="p-0 mb-3">
                    <div className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-green-50 dark:hover:bg-slate-700 transition-colors">
                      <Image
                        src="/placeholder.svg?height=50&width=50"
                        alt="Product"
                        width={50}
                        height={50}
                        className="w-12 h-12 rounded-lg object-cover border border-green-200"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-800 dark:text-gray-200">Organic Tomatoes</p>
                        <div className="flex items-center justify-between">
                          <p className="text-green-600 dark:text-green-400 font-semibold">$12.99</p>
                          <p className="text-xs text-gray-500">Qty: 2</p>
                        </div>
                      </div>
                      <button className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-colors">
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                <div className="flex justify-between items-center pt-2">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Total: $38.97</span>
                  <Link
                    href="/cart"
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    View Cart
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeSwitcherBtn />
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Mobile Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
                3
              </div>
            </Link>

            <ThemeSwitcherBtn />

            {/* Mobile Menu Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white dark:bg-slate-900">
                <div className="flex flex-col space-y-6 pt-6">
                  {/* Mobile Search */}
                  <div className="md:hidden">
                    <SearchForm />
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="flex flex-col space-y-4">
                    <Link
                      href="/login"
                      className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 dark:bg-slate-800 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">Login / Register</span>
                    </Link>

                    <button className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 dark:bg-slate-800 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-slate-700 transition-colors">
                      <HelpCircle className="w-5 h-5" />
                      <span className="font-medium">Help & Support</span>
                    </button>

                    <Link
                      href="/register-farmer"
                      className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-green-500 to-lime-500 text-white hover:from-green-600 hover:to-lime-600 transition-all"
                    >
                      <span className="font-medium">🌱 Become a Seller</span>
                    </Link>
                  </div>

                  {/* Quick Links */}
                  <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Quick Links</h3>
                    <div className="flex flex-col space-y-2">
                      <Link
                        href="/products"
                        className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      >
                        All Products
                      </Link>
                      <Link
                        href="/categories"
                        className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      >
                        Categories
                      </Link>
                      <Link
                        href="/markets"
                        className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      >
                        Markets
                      </Link>
                      <Link
                        href="/about"
                        className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      >
                        About Us
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="bg-white dark:bg-slate-800 border-t border-green-100 dark:border-slate-700 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 py-3 overflow-x-auto scrollbar-hide">
            {[
              "🥬 Vegetables",
              "🍎 Fruits",
              "🌾 Grains",
              "🥛 Dairy",
              "🍯 Organic",
              "🌿 Herbs",
              "🥜 Nuts",
              "🍄 Mushrooms",
            ].map((category) => (
              <Link
                key={category}
                href={`/categories/${category.split(" ")[1].toLowerCase()}`}
                className="whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors py-2 px-3 rounded-lg hover:bg-green-50 dark:hover:bg-slate-700"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
