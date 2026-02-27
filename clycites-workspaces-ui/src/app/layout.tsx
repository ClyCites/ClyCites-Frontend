import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { createDesignSystemCss } from "@/styles/design-system";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "ClyCites Workspaces",
    template: "%s | ClyCites Workspaces",
  },
  description: "Enterprise-grade multi-workspace UI for the ClyCites agriculture value chain.",
};

const designSystemCss = createDesignSystemCss();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <style id="clycites-design-system">{designSystemCss}</style>
      </head>
      <body className={`${bodyFont.variable} ${displayFont.variable} font-body antialiased text-foreground`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
