import type React from "react"
import type { Metadata } from "next"

import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/Footer"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "ClyCites - Digital Agriculture Platform",
  description: "Empowering farmers with digital solutions for marketing and selling farm produce",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Header />
          <main className="relative overflow-hidden pt-[104px]">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
