"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Users,
  MessageSquare,
  Settings,
  CreditCard,
  Truck,
  Star,
  TrendingUp,
  Warehouse,
  ExternalLink,
  LogOut,
  Bell,
  HelpCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function FarmerSidebar({ subscription = { packageId: "pro" } }) {
  const pathname = usePathname()

  const sidebarLinks = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/farmer-dashboard/dashboard",
      badge: null,
    },
    {
      title: "Products",
      icon: Package,
      href: "/farmer-dashboard/products",
      badge: "12",
    },
    {
      title: "Orders",
      icon: ShoppingBag,
      href: "/farmer-dashboard/orders",
      badge: "3",
      badgeColor: "bg-red-500",
    },
    {
      title: "Customers",
      icon: Users,
      href: "/farmer-dashboard/customers",
      badge: null,
      premium: subscription.packageId === "free",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/farmer-dashboard/analytics",
      badge: null,
      premium: subscription.packageId === "free",
    },
    {
      title: "Marketing",
      icon: TrendingUp,
      href: "/farmer-dashboard/marketing",
      badge: "New",
      badgeColor: "bg-green-500",
      premium: subscription.packageId === "free",
    },
    {
      title: "Inventory",
      icon: Warehouse,
      href: "/farmer-dashboard/inventory",
      badge: null,
    },
    {
      title: "Reviews",
      icon: Star,
      href: "/farmer-dashboard/reviews",
      badge: "2",
      badgeColor: "bg-yellow-500",
    },
    {
      title: "Messages",
      icon: MessageSquare,
      href: "/farmer-dashboard/messages",
      badge: "5",
      badgeColor: "bg-blue-500",
    },
    {
      title: "Shipping",
      icon: Truck,
      href: "/farmer-dashboard/shipping",
      badge: null,
    },
    {
      title: "Billing",
      icon: CreditCard,
      href: "/farmer-dashboard/billing",
      badge: null,
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/farmer-dashboard/settings",
      badge: null,
    },
  ]

  const quickLinks = [
    {
      title: "Online Store",
      icon: ExternalLink,
      href: "/",
      external: true,
    },
    {
      title: "Help Center",
      icon: HelpCircle,
      href: "/farmer-dashboard/help",
    },
    {
      title: "Notifications",
      icon: Bell,
      href: "/farmer-dashboard/notifications",
      badge: "8",
      badgeColor: "bg-red-500",
    },
  ]

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 shadow-lg z-40 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      {/* Profile Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-lime-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">JF</span>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-white">John Farmer</p>
            <div className="flex items-center space-x-2">
              <Badge
                variant="secondary"
                className={`text-xs ${
                  subscription.packageId === "free"
                    ? "bg-gray-100 text-gray-600"
                    : subscription.packageId === "basic"
                      ? "bg-green-100 text-green-600"
                      : subscription.packageId === "pro"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-purple-100 text-purple-600"
                }`}
              >
                {subscription.packageId?.toUpperCase() || "FREE"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="mt-2">
        <div className="px-4 py-2">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Main Menu</h3>
        </div>

        {sidebarLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          const isPremium = link.premium && subscription.packageId === "free"

          return (
            <Link
              key={link.href}
              href={isPremium ? "/farmer-packages" : link.href}
              className={`flex items-center justify-between px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group ${
                isActive ? "bg-green-50 dark:bg-green-900 text-green-600 border-r-4 border-green-600" : ""
              } ${isPremium ? "opacity-60" : ""}`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.title}</span>
                {isPremium && (
                  <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-600">
                    Pro
                  </Badge>
                )}
              </div>
              {link.badge && !isPremium && (
                <Badge className={`text-xs ${link.badgeColor || "bg-gray-500"} text-white`}>{link.badge}</Badge>
              )}
            </Link>
          )
        })}

        {/* Quick Links */}
        <div className="px-4 py-2 mt-6">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Quick Links
          </h3>
        </div>

        {quickLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              className={`flex items-center justify-between px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                isActive ? "bg-green-50 dark:bg-green-900 text-green-600 border-r-4 border-green-600" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.title}</span>
              </div>
              {link.badge && (
                <Badge className={`text-xs ${link.badgeColor || "bg-gray-500"} text-white`}>{link.badge}</Badge>
              )}
            </Link>
          )
        })}

        {/* Logout */}
        <div className="mt-8 px-6">
          <button className="flex items-center space-x-3 w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>

        {/* Package Upgrade CTA */}
        {subscription.packageId === "free" && (
          <div className="mx-4 mt-6 mb-4">
            <div className="bg-gradient-to-r from-green-500 to-lime-500 rounded-lg p-4 text-white">
              <h4 className="font-semibold text-sm mb-2">Upgrade Your Plan</h4>
              <p className="text-xs text-green-100 mb-3">Unlock advanced features and grow your business faster</p>
              <Link href="/farmer-packages">
                <button className="w-full bg-white text-green-600 text-sm font-semibold py-2 px-3 rounded-md hover:bg-green-50 transition-colors">
                  View Plans
                </button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}
