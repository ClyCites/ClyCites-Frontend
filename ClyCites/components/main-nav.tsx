"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const productItems = [
  {
    title: "Analytics Dashboard",
    href: "/products/analytics",
    description: "Track market trends and make data-driven decisions",
  },
  {
    title: "Mobile App",
    href: "/products/mobile-app",
    description: "Access ClyCites on the go with our mobile application",
  },
  {
    title: "Weather Detection",
    href: "/products/weather",
    description: "Get accurate weather forecasts for your farming activities",
  },
  {
    title: "Pest And Diseases Detection",
    href: "/products/pest-detection",
    description: "Identify and manage crop diseases and pests early",
  },
  {
    title: "Soil PH Detection",
    href: "/products/soil-detection",
    description: "Monitor soil health and optimize crop growth",
  },
  {
    title: "Agriculture E-Market",
    href: "/products/e-market",
    description: "Buy and sell agricultural products online",
  },
]

const solutionItems = [
  {
    title: "Disease Control",
    href: "/disease",
    description: "Protect your crops from diseases with early detection",
  },
  {
    title: "Nutrition Monitoring",
    href: "/nutrition",
    description: "Ensure your crops get the right nutrients",
  },
  {
    title: "Price Monitoring",
    href: "https://price-monitoring-three.vercel.app",
    description: "Track market prices to sell at the right time",
  },
  {
    title: "Market Intelligence",
    href: "/market-intelligence",
    description: "Make informed decisions with market insights",
  },
]

const aboutItems = [
  {
    title: "About Us",
    href: "/about",
    description: "Learn about our mission and vision",
  },
  {
    title: "Programs",
    href: "/program",
    description: "Explore our research and community programs",
  },
  {
    title: "Resources",
    href: "/resources",
    description: "Access guides, articles, and educational content",
  },
  {
    title: "Contact Us",
    href: "/contact",
    description: "Get in touch with our team",
  },
]

// Update the MainNav component to be centered
export function MainNav() {
  const pathname = usePathname()

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/"
            className={cn(navigationMenuTriggerStyle(), pathname === "/" ? "font-medium" : "")}
          >
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-background/90 backdrop-blur-md">
              {productItems.map((item) => (
                <ListItem key={item.title} title={item.title} href={item.href}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-background/90 backdrop-blur-md">
              {solutionItems.map((item) => (
                <ListItem key={item.title} title={item.title} href={item.href}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>About</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-background/90 backdrop-blur-md">
              {aboutItems.map((item) => (
                <ListItem key={item.title} title={item.title} href={item.href}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"
