"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Moon, Sun, Bell } from "lucide-react"
import { useTheme } from "next-themes"
import { MobileNav } from "@/components/mobile-nav"
import { MainNav } from "@/components/main-nav"
import { SearchCommand } from "@/components/search-command"
import { Badge } from "@/components/ui/badge"
import { GetStartedDialog } from "@/components/get-started-dialog"

export function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const { setTheme, theme } = useTheme()
  const [showGetStartedDialog, setShowGetStartedDialog] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className={cn("w-full fixed top-0 z-50 bg-white dark:bg-gray-900 border-b shadow-sm")}> 
      {/* Top Bar */}
      <div className="bg-emerald-900 dark:bg-emerald-950 text-white py-1.5 px-3">
        <div className="container flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <Badge variant="success" className="text-xs font-normal">
              New
            </Badge>
            <span className="hidden md:inline-block">Introducing PricePulse-AI: Real-time market price monitoring</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-emerald-100 hover:text-white transition-colors">
              Login
            </Link>
            <span className="text-emerald-500">|</span>
            <Link href="/signup" className="text-emerald-100 hover:text-white transition-colors">
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo Section - Left */}
        <div className="flex items-center gap-2">
          <MobileNav />
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.jpeg"
              alt="ClyCites"
              width={40}
              height={40}
              className="rounded-full border-2 border-emerald-500"
            />
            <div className="flex flex-col">
              <span className="font-bold text-xl text-emerald-800 dark:text-emerald-300">ClyCites</span>
              <span className="text-[10px] -mt-1 text-emerald-600 dark:text-emerald-400">
                Digital Agriculture Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links - Center */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <MainNav />
        </div>

        {/* Actions - Right */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <SearchCommand className="bg-gray-100 dark:bg-gray-800" />

            {/* Theme Switcher */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {/* Render both icons and toggle visibility via CSS to avoid SSR/CSR mismatch */}
                  <Sun className="h-4 w-4 text-yellow-500 hidden dark:block" />
                  <Moon className="h-4 w-4 text-gray-700 block dark:hidden" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Change theme</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Notifications</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
            <div className="hidden md:flex items-center gap-4">
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/login">Login</Link>
              </Button>
              <Button
                className="rounded-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600"
                onClick={() => setShowGetStartedDialog(true)}
              >
                Get Started
              </Button>
            </div>
          </TooltipProvider>
        </div>
      </div>

      {/* Get Started Dialog */}
      <GetStartedDialog open={showGetStartedDialog} onOpenChange={setShowGetStartedDialog} />
    </header>
  )
}
