import Link from "next/link";
import { Leaf, Mail, ShoppingBasket } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-16 border-t border-border/70 bg-[linear-gradient(180deg,hsl(var(--card)/0.55)_0%,hsl(var(--card)/0.95)_100%)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="group inline-flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-transform duration-200 group-hover:-translate-y-0.5">
                <ShoppingBasket className="h-4 w-4" />
              </span>
              <div>
                <p className="font-display text-base font-bold">ClyCites Market</p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Connected Commerce
                </p>
              </div>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              A shared agricultural workspace where cooperatives, farmers, and buyers trade with confidence.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Marketplace
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/market" className="hover:text-foreground transition-colors">Browse listings</Link></li>
              <li><Link href="/offers" className="hover:text-foreground transition-colors">My offers</Link></li>
              <li><Link href="/orders" className="hover:text-foreground transition-colors">Order history</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Sellers
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/sell/listings" className="hover:text-foreground transition-colors">Manage listings</Link></li>
              <li><Link href="/sell/listings/new" className="hover:text-foreground transition-colors">Create listing</Link></li>
              <li><Link href="/analytics" className="hover:text-foreground transition-colors">Performance</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Support
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/help" className="inline-flex items-center gap-2 hover:text-foreground transition-colors">
                  <Leaf className="h-3.5 w-3.5" />
                  Help Center
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@clycites.com"
                  className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  support@clycites.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-border/70" />

        <div className="flex flex-col items-start justify-between gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>© {currentYear} ClyCites. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
