import { UserRoleSelector } from "@/components/user-role-selector"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Get Started - ClyCites",
  description: "Choose how you'd like to engage with ClyCites",
}

export default function GetStartedPage() {
  return (
    <div className="container max-w-5xl py-12 md:py-20">
      <UserRoleSelector />
    </div>
  )
}
