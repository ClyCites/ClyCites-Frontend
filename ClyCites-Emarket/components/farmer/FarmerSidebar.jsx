"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingBag, BarChart3, User, ExternalLink, LogOut, Settings } from "lucide-react"

export default function FarmerSidebar() {
  const pathname = usePathname()

  const sidebarLinks = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/farmer-dashboard/dashboard",
    },
    {
      title: "My Products",
      icon: Package,
      href: "/farmer-dashboard/products",
    },
    {
      title: "Orders",
      icon: ShoppingBag,
      href: "/farmer-dashboard/orders",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/farmer-dashboard/analytics",
    },
    {
      title: "Profile",
      icon: User,
      href: "/farmer-dashboard/profile",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/farmer-dashboard/settings",
    },
    {
      title: "Online Store",
      icon: ExternalLink,
      href: "/",
    },
  ]

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 shadow-lg z-40 border-r border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <span className="text-green-600 font-semibold">JD</span>
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">John Farmer</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Farmer</p>
          </div>
        </div>
      </div>

      <nav className="mt-2">
        {sidebarLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                isActive ? "bg-lime-50 dark:bg-lime-900 text-lime-600 border-r-4 border-lime-600" : ""
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.title}</span>
            </Link>
          )
        })}

        <div className="mt-8 px-6">
          <button className="flex items-center space-x-3 w-full px-4 py-3 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
