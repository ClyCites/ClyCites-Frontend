"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { DialogProps } from "@radix-ui/react-dialog"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

// Add className prop to accept custom styling
export function SearchCommand({ className, ...props }: DialogProps & { className?: string }) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className={cn("relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2", className)}
        onClick={() => setOpen(true)}
        {...props}
      >
        <Search className="h-4 w-4 xl:mr-2" aria-hidden="true" />
        <span className="hidden xl:inline-flex">Search...</span>
        <span className="sr-only">Search</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search across ClyCites..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem onSelect={() => runCommand(() => router.push("/"))}>Home</CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/about"))}>About</CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/disease"))}>Disease Control</CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/nutrition"))}>Nutrition Monitoring</CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/program"))}>Programs</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Products">
            <CommandItem onSelect={() => runCommand(() => router.push("https://price-monitoring-three.vercel.app"))}>
              Analytics Dashboard
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/products/mobile-app"))}>Mobile App</CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/products/e-market"))}>E-Market</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
