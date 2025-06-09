"use client"
import { useState } from "react"
import { Bell, Settings, User, Calendar, TrendingUp, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DashboardHeader({ farmer, subscription }) {
  const [notifications] = useState([
    { id: 1, message: "New order received", type: "order", time: "2 min ago" },
    { id: 2, message: "Product stock running low", type: "inventory", time: "1 hour ago" },
    { id: 3, message: "Monthly report ready", type: "report", time: "3 hours ago" },
  ])

  const getPackageColor = (packageId) => {
    const colors = {
      free: "bg-gray-100 text-gray-800",
      growth: "bg-blue-100 text-blue-800",
      pro: "bg-purple-100 text-purple-800",
      enterprise: "bg-gold-100 text-gold-800",
    }
    return colors[packageId] || colors.free
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left Section - Welcome */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 ring-4 ring-green-100">
            <AvatarImage src="/placeholder.svg?height=64&width=64" alt={farmer.name} />
            <AvatarFallback className="bg-green-500 text-white text-xl font-bold">
              {farmer.name?.charAt(0) || "F"}
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {farmer.name}!</h1>
            <p className="text-gray-600 dark:text-gray-400 flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className={getPackageColor(subscription.packageId)}>
                {subscription.packageId?.charAt(0).toUpperCase() + subscription.packageId?.slice(1)} Plan
              </Badge>
              {subscription.status === "active" && (
                <Badge variant="success" className="bg-green-100 text-green-800">
                  Active
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-3">
          {/* Quick Stats */}
          <div className="hidden md:flex items-center space-x-4 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">+12% this month</span>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">24 products</span>
            </div>
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                    {notifications.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
                  <span className="font-medium">{notification.message}</span>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
