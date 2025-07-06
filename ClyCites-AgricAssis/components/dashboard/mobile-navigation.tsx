"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Menu, Home, BarChart3, Cloud, MessageSquare, Settings, Bell, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    badge: null,
  },
  {
    title: "Markets",
    href: "/markets",
    icon: BarChart3,
    badge: null,
  },
  {
    title: "Weather",
    href: "/weather",
    icon: Cloud,
    badge: null,
  },
  {
    title: "Advisory",
    href: "/advisory",
    icon: MessageSquare,
    badge: "3",
  },
  {
    title: "Alerts",
    href: "/alerts",
    icon: Bell,
    badge: "2",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    badge: null,
  },
]

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] sm:w-[300px]">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center space-x-2 px-2 py-4 border-b">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CA</span>
                </div>
                <div>
                  <h2 className="font-semibold text-sm">ClyCites Agric</h2>
                  <p className="text-xs text-muted-foreground">Assistant</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4">
              <div className="space-y-1 px-2">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent",
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge variant={isActive ? "secondary" : "default"} className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}
              </div>
            </nav>

            {/* User Profile */}
            <div className="border-t p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">John Farmer</p>
                  <p className="text-xs text-muted-foreground truncate">john@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

// Bottom navigation for mobile
export function BottomNavigation() {
  const pathname = usePathname()

  const quickNavItems = [
    { title: "Home", href: "/", icon: Home },
    { title: "Markets", href: "/markets", icon: BarChart3 },
    { title: "Weather", href: "/weather", icon: Cloud },
    { title: "Advisory", href: "/advisory", icon: MessageSquare },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="grid grid-cols-4 h-16">
        {quickNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.title}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
