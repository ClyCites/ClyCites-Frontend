"use client"

import type * as React from "react"
import {
  AudioWaveform,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Home,
  TrendingUp,
  Cloud,
  Bell,
  Calendar,
  BarChart3,
  Sprout,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

// This is sample data for the sidebar
const data = {
  user: {
    name: "John Farmer",
    email: "john@clycites.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "ClyCites Agric",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "My Farm Co.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "AgriTech Solutions",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Farm Management",
      url: "#",
      icon: Sprout,
      items: [
        {
          title: "My Farms",
          url: "/farms",
        },
        {
          title: "Crop Management",
          url: "/crops",
        },
        {
          title: "Livestock",
          url: "/livestock",
        },
        {
          title: "Tasks & Activities",
          url: "/tasks",
        },
      ],
    },
    {
      title: "Market Intelligence",
      url: "#",
      icon: TrendingUp,
      items: [
        {
          title: "Market Prices",
          url: "/markets",
        },
        {
          title: "Price Trends",
          url: "/markets/trends",
        },
        {
          title: "Market Analysis",
          url: "/markets/analysis",
        },
        {
          title: "Trading Opportunities",
          url: "/markets/opportunities",
        },
      ],
    },
    {
      title: "Weather & Climate",
      url: "#",
      icon: Cloud,
      items: [
        {
          title: "Current Weather",
          url: "/weather",
        },
        {
          title: "Forecasts",
          url: "/weather/forecast",
        },
        {
          title: "Weather Alerts",
          url: "/weather/alerts",
        },
        {
          title: "Climate Data",
          url: "/weather/climate",
        },
      ],
    },
    {
      title: "AI Advisory",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Recommendations",
          url: "/advisory",
        },
        {
          title: "Crop Advisor",
          url: "/advisory/crops",
        },
        {
          title: "Market Advisor",
          url: "/advisory/market",
        },
        {
          title: "Risk Assessment",
          url: "/advisory/risk",
        },
      ],
    },
    {
      title: "Analytics & Reports",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "Performance Dashboard",
          url: "/analytics",
        },
        {
          title: "Financial Reports",
          url: "/analytics/financial",
        },
        {
          title: "Yield Analysis",
          url: "/analytics/yield",
        },
        {
          title: "Custom Reports",
          url: "/analytics/custom",
        },
      ],
    },
    {
      title: "Alerts & Notifications",
      url: "/alerts",
      icon: Bell,
    },
    {
      title: "Calendar & Planning",
      url: "/calendar",
      icon: Calendar,
    },
  ],
  projects: [
    {
      name: "Spring Planting 2024",
      url: "/projects/spring-2024",
      icon: Frame,
    },
    {
      name: "Harvest Optimization",
      url: "/projects/harvest-opt",
      icon: PieChart,
    },
    {
      name: "Market Expansion",
      url: "/projects/market-expansion",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
