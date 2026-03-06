import React from "react";
import Link from "next/link";
import { Leaf, Mail, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const footerLinks = {
  Product: [
    { label: "Features", href: "/product" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "Security", href: "/security" },
  ],
  Solutions: [
    { label: "For Farmers", href: "/solutions/farmers" },
    { label: "For Organizations", href: "/solutions/organizations" },
    { label: "For Buyers", href: "/solutions/buyers" },
    { label: "For Partners", href: "/solutions/partners" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Blog & Insights", href: "/resources" },
    { label: "Contact", href: "/contact" },
    { label: "Request Demo", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Security", href: "/security" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/65 text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-[0_12px_20px_-14px_hsl(var(--primary)/0.95)]">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-xl font-semibold">
                Cly<span className="text-primary">Cites</span>
              </span>
            </Link>
            <p className="mb-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Unified digital infrastructure for farmers, cooperatives, and markets across the ClyCites ecosystem.
            </p>
            <Badge variant="outline" className="mb-4">Platform + Workspaces</Badge>
            <div className="flex flex-col gap-2 text-xs text-muted-foreground">
              <a href="mailto:hello@clycites.com" className="flex items-center gap-2 transition-colors hover:text-primary">
                <Mail className="w-3.5 h-3.5" /> hello@clycites.com
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Kampala, Uganda
              </span>
            </div>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ClyCites. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="/security" className="hover:text-primary transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
