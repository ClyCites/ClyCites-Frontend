"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Update the MobileNav component to be non-transparent and on the left
export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 bg-white dark:bg-gray-900 border-r">
        <MobileNavLogo />
        <ScrollArea className="p-0 sm:pl-6 sm:pb-10 sm:my-4 sm:h-[calc(100vh-8rem)] [&>div>div]:min-w-[80%!important]  md:[&>div>div]:min-w-[100%!important]" >
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className={cn(
                "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                pathname === "/" ? "text-foreground" : "text-foreground/60",
              )}
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="products" className="border-b-0">
                <AccordionTrigger className="py-2 text-lg font-medium hover:no-underline sm:text-sm">
                  Products
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-2">
                    <Link
                      href="/products/analytics"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      Analytics Dashboard
                    </Link>
                    <Link
                      href="/products/mobile-app"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      Mobile App
                    </Link>
                    <Link
                      href="/products/weather"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      Weather Detection
                    </Link>
                    <Link
                      href="/products/pest-detection"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      Pest And Diseases Detection
                    </Link>
                    <Link
                      href="/products/soil-detection"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      Soil PH Detection
                    </Link>
                    <Link
                      href="/products/e-market"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      Agriculture E-Market
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="solutions" className="border-b-0">
                <AccordionTrigger className="py-2 text-lg font-medium hover:no-underline sm:text-sm">
                  Solutions
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-2">
                    <Link
                      href="/disease"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      Disease Control
                    </Link>
                    <Link
                      href="/nutrition"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      Nutrition Monitoring
                    </Link>
                    <Link
                      href="/price-monitoring"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      Price Monitoring
                    </Link>
                    <Link
                      href="/market-intelligence"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      Market Intelligence
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="about" className="border-b-0">
                <AccordionTrigger className="py-2 text-lg font-medium hover:no-underline sm:text-sm">
                  About
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-2">
                    <Link
                      href="/about"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      About Us
                    </Link>
                    <Link
                      href="/program"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      Programs
                    </Link>
                    <Link
                      href="/resources"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      Resources
                    </Link>
                    <Link
                      href="/contact"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      Contact Us
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="flex flex-col space-y-2 mt-4">
              <Button asChild variant="default" className="w-full">
                <Link href="/get-started" onClick={() => setOpen(false)}>
                  Get Started
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/login" onClick={() => setOpen(false)}>
                  Login
                </Link>
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

// Add this component for the mobile nav logo
function MobileNavLogo() {
  return (
    <div className="flex items-center gap-2 py-4 border-b mb-4">
      <Image
        src="/images/logo.jpeg"
        alt="ClyCites"
        width={32}
        height={32}
        className="rounded-full border-2 border-emerald-500"
      />
      <div className="flex flex-col">
        <span className="font-bold text-base text-emerald-800 dark:text-emerald-300">ClyCites</span>
        <span className="text-[8px] -mt-1 text-emerald-600 dark:text-emerald-400">Digital Agriculture Platform</span>
      </div>
    </div>
  )
}
