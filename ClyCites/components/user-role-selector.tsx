"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Link2, FileText, Globe, BarChart3, Laptop } from "lucide-react"
import Link from "next/link"

interface RoleOption {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  href: string
}

const roleOptions: RoleOption[] = [
  {
    id: "partner",
    title: "I'm a Partner",
    description: "Interested in supporting ClyCites's vision",
    icon: <Link2 className="h-8 w-8 text-emerald-600" />,
    href: "/partner-signup",
  },
  {
    id: "policymaker",
    title: "I'm a Policymaker",
    description: "Interested in agricultural policy information",
    icon: <FileText className="h-8 w-8 text-emerald-600" />,
    href: "/policy-resources",
  },
  {
    id: "champion",
    title: "I'm a Community Champion",
    description: "Interested in raising awareness about sustainable agriculture",
    icon: <Globe className="h-8 w-8 text-emerald-600" />,
    href: "/community-resources",
  },
  {
    id: "researcher",
    title: "I'm a Researcher",
    description: "Interested in Agricultural data and analytics",
    icon: <BarChart3 className="h-8 w-8 text-emerald-600" />,
    href: "/research-tools",
  },
  {
    id: "developer",
    title: "I'm a Developer",
    description: "Interested in establishing an Agricultural Network, utilizing the ClyCites API, or both",
    icon: <Laptop className="h-8 w-8 text-emerald-600" />,
    href: "/developer-resources",
  },
]

export function UserRoleSelector() {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-400 mb-4">
          How would you like to engage with us?
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Access real-time and historic agricultural information across Africa through our easy-to-use analytics
          dashboard.
        </p>
      </div>

      <div className="grid gap-4 w-full max-w-3xl">
        {roleOptions.map((option) => (
          <RoleCard key={option.id} option={option} />
        ))}
      </div>
    </div>
  )
}

function RoleCard({ option }: { option: RoleOption }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md hover:border-emerald-500 cursor-pointer">
      <Link href={option.href} className="flex items-center p-4 gap-4">
        <div className="flex-shrink-0 p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-full">{option.icon}</div>
        <div className="flex-grow">
          <h3 className="font-semibold text-lg text-emerald-700 dark:text-emerald-400">{option.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{option.description}</p>
        </div>
      </Link>
    </Card>
  )
}
