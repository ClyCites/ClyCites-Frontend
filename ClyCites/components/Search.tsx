"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

type Suggestion = {
  label: string
  value: string
}

const defaultSuggestions: Suggestion[] = [
  { label: "Maize prices in Kampala", value: "maize prices kampala" },
  { label: "Nearest produce markets", value: "markets near me" },
  { label: "Farming news", value: "news" },
]

export function SearchBar({
  placeholder = "Search products, markets, or news...",
  onSearch,
}: {
  placeholder?: string
  onSearch?: (q: string) => void
}) {
  const [query, setQuery] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const q = query.trim()
    if (!q) return
    onSearch ? onSearch(q) : console.log("search:", q)
    // Navigate to results page for testing
    router.push(`/search?q=${encodeURIComponent(q)}`)
    setOpen(false)
  }

  const clear = () => setQuery("")

  const filtered = defaultSuggestions.filter((s) =>
    s.label.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            aria-label="Search"
            className="h-12 bg-white text-gray-900 placeholder:text-gray-400 pr-10"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={clear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit" size="lg" className="h-12 px-5 rounded-full">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </form>

      {/* Suggestions (optional) */}
      {open && (
        <div className="mt-2">
          <Command className="rounded-lg border bg-white">
            <CommandInput placeholder="Type to filter suggestions..." value={query} onValueChange={setQuery} />
            <CommandList>
              <CommandEmpty>No suggestions found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                {filtered.map((s) => (
                  <CommandItem
                    key={s.value}
                    onSelect={() => {
                      setQuery(s.value)
                      handleSubmit()
                    }}
                  >
                    {s.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}
