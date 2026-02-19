import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://clycites.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ClyCites — Digital Agriculture Infrastructure for Farmers & Markets",
    template: "%s | ClyCites",
  },
  description:
    "ClyCites is Africa's leading agritech platform — AI pest & disease detection, weather intelligence, e-market access, expert advisory, and farm analytics. Empowering farmers and cooperatives across Africa.",
  keywords: [
    "agritech Africa",
    "farm management software",
    "AI pest detection",
    "e-market farmers",
    "digital agriculture Uganda",
    "cooperative management",
    "farmer platform",
    "precision agriculture",
    "ClyCites",
  ],
  authors: [{ name: "ClyCites", url: siteUrl }],
  creator: "ClyCites",
  openGraph: {
    type: "website",
    locale: "en_UG",
    url: siteUrl,
    siteName: "ClyCites",
    title: "ClyCites — Digital Agriculture Infrastructure",
    description:
      "Empowering Africa's farmers with AI, analytics, e-markets, and expert advisory. The modern platform for farming communities.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ClyCites — Digital Agriculture Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClyCites — Digital Agriculture Infrastructure",
    description:
      "AI-powered agritech platform for African farmers, cooperatives, and buyers.",
    images: ["/og-image.png"],
    creator: "@ClyCites",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
