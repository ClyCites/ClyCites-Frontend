import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-primary">
              <ShoppingBasket className="h-5 w-5" />
              <span>ClyCites Market</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecting farmers and buyers across Uganda&apos;s agricultural marketplace.
            </p>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Marketplace</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/market" className="hover:text-foreground transition-colors">Browse Listings</Link></li>
              <li><Link href="/offers" className="hover:text-foreground transition-colors">My Offers</Link></li>
              <li><Link href="/orders" className="hover:text-foreground transition-colors">My Orders</Link></li>
            </ul>
          </div>

          {/* Sellers */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Sellers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/sell/listings" className="hover:text-foreground transition-colors">Manage Listings</Link></li>
              <li><Link href="/sell/listings/new" className="hover:text-foreground transition-colors">Create Listing</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
              <li><a href="mailto:support@clycites.com" className="hover:text-foreground transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {currentYear} ClyCites. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
