"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useTranslation } from "react-i18next"

type Suggestion = {
  label: string
  value: string
}

// Suggestions will be loaded from the API based on user input
const defaultSuggestions: Suggestion[] = []

export function SearchBar({
  placeholder,
  onSearch,
}: {
  placeholder?: string
  onSearch?: (q: string) => void
}) {
  const { t } = useTranslation()
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

  // TODO: Replace with API call to fetch suggestions based on query
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([])
  
  React.useEffect(() => {
    // This is where you would fetch suggestions from your API
    // Example:
    // fetch(`/api/suggestions?q=${encodeURIComponent(query)}`)
    //   .then(res => res.json())
    //   .then(data => setSuggestions(data))
    
    // For now, we'll use an empty array
    setSuggestions([])
  }, [query])
  
  const filtered = query.trim() ? suggestions : []

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder ?? t("search.placeholder")}
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
              <CommandEmpty>
                {query.trim() ? "No results found. Try a different search term." : "Type to search..."}
              </CommandEmpty>
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
