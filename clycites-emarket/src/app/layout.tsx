import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const bodyFont = Manrope({ subsets: ["latin"], variable: "--font-body" });
const displayFont = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: {
    default: "ClyCites e-Market",
    template: "%s | ClyCites e-Market",
  },
  description: "Uganda's enterprise agricultural marketplace — connect farmers and buyers.",
  keywords: ["agriculture", "marketplace", "Uganda", "farmers", "buyers"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${displayFont.variable} font-body antialiased text-foreground`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
