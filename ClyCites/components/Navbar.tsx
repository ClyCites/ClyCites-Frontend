"use client";

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeSwitcher } from "@/components/theme-switcher"

const NavItems = [
  { name: "Home", href: "/" },
  { name: "Features", href: "#features" },
  { name: "Products", href: "#products" },
  { name: "Solutions", href: "#solutions" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-orange-500/50 transition-shadow">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="hidden sm:inline font-bold text-lg bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              ClyCites
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors font-medium text-sm relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeSwitcher />
            <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-orange-600/50 transition-shadow">
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-900 dark:text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-800 py-4 px-4 space-y-2 animate-slide-up">
            {NavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 py-2 px-4 rounded-lg transition-colors hover:bg-orange-50 dark:hover:bg-orange-950/20"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white mt-4">
              Get Started
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
