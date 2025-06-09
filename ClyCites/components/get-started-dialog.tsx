"use client"

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Link2, FileText, Globe, BarChart3, Laptop } from "lucide-react"
import { useRouter } from "next/navigation"

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
    icon: <Link2 className="h-6 w-6 text-emerald-600" />,
    href: "/partner-signup",
  },
  {
    id: "policymaker",
    title: "I'm a Policymaker",
    description: "Interested in agricultural policy information",
    icon: <FileText className="h-6 w-6 text-emerald-600" />,
    href: "/policy-resources",
  },
  {
    id: "champion",
    title: "I'm a Community Champion",
    description: "Interested in raising awareness about sustainable agriculture",
    icon: <Globe className="h-6 w-6 text-emerald-600" />,
    href: "/community-resources",
  },
  {
    id: "researcher",
    title: "I'm a Researcher",
    description: "Interested in Agricultural data and analytics",
    icon: <BarChart3 className="h-6 w-6 text-emerald-600" />,
    href: "/research-tools",
  },
  {
    id: "developer",
    title: "I'm a Developer",
    description: "Interested in establishing an Agricultural Network, utilizing the ClyCites API, or both",
    icon: <Laptop className="h-6 w-6 text-emerald-600" />,
    href: "/developer-resources",
  },
]

interface GetStartedDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GetStartedDialog({ open, onOpenChange }: GetStartedDialogProps) {
  const router = useRouter()

  const handleOptionClick = (href: string) => {
    onOpenChange(false)
    router.push(href)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold text-emerald-800 dark:text-emerald-400">
            How would you like to engage with us?
          </DialogTitle>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Access real-time and historic agricultural information across Africa through our easy-to-use analytics
            dashboard.
          </p>
        </DialogHeader>
        <div className="p-6 pt-2">
          <div className="grid gap-3">
            {roleOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center p-3 gap-4 border rounded-lg cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                onClick={() => handleOptionClick(option.href)}
              >
                <div className="flex-shrink-0 p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-full">{option.icon}</div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-emerald-700 dark:text-emerald-400">{option.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
