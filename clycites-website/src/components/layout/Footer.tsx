import React from "react";
import Link from "next/link";
import { Leaf, Twitter, Linkedin, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
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

const socials = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-16 pb-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl text-background">
                Cly<span className="text-primary">Cites</span>
              </span>
            </Link>
            <p className="text-sm text-background/60 leading-relaxed mb-5 max-w-xs">
              Digital agriculture infrastructure for farmers and markets. Empowering Africa's farming communities with AI, analytics, and e-commerce.
            </p>
            <Badge variant="success" className="mb-4">🌍 Africa-First Platform</Badge>
            <div className="flex flex-col gap-2 text-xs text-background/50">
              <a href="mailto:hello@clycites.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="w-3.5 h-3.5" /> hello@clycites.com
              </a>
              <a href="tel:+256000000000" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="w-3.5 h-3.5" /> +256 000 000 000
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Kampala, Uganda
              </span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-background/40 mb-4">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-background/60 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40">
            © {new Date().getFullYear()} ClyCites. All rights reserved. Built for African farmers.
          </p>
          <div className="flex items-center gap-3">
            {socials.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 text-background/70" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
