import type React from "react"
import type { Metadata, Viewport } from "next"

import "./globals.css"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "ClyCites - Digital Agriculture Platform",
  description: "Empowering farmers with cutting-edge digital solutions for marketing, selling, and growing farm produce. Transform your agricultural business with modern technology.",
  keywords: ["agriculture", "farming", "digital platform", "farm produce", "agritech", "e-commerce"],
  authors: [{ name: "ClyCites Team" }],
  creator: "ClyCites",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://clycites.com",
    title: "ClyCites - Digital Agriculture Platform",
    description: "Empowering farmers with cutting-edge digital solutions",
    siteName: "ClyCites",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClyCites - Digital Agriculture Platform",
    description: "Empowering farmers with cutting-edge digital solutions",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          <main className="relative overflow-hidden">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
