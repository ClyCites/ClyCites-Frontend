"use client"

import type React from "react"

import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth/auth-context"
import { AuthGuard } from "@/components/auth/auth-guard"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

// Routes that don't require authentication
const publicRoutes = ["/auth", "/forgot-password", "/reset-password", "/verify-email"]

function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPublicRoute = publicRoutes.some((route) => pathname?.startsWith(route))

  if (isPublicRoute) {
    return <div className="min-h-screen bg-background">{children}</div>
  }

  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <AppContent>{children}</AppContent>
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  )
}
