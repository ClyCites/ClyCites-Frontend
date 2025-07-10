"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useOrganizationSelector } from "@/hooks/use-organizations"
import { CreateOrganizationDialog } from "./create-organization-dialog"
import { Skeleton } from "@/components/ui/skeleton"

interface OrganizationSelectorProps {
  onOrganizationChange?: (organizationId: string | null) => void
  className?: string
}

export function OrganizationSelector({ onOrganizationChange, className }: OrganizationSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)

  const { organizations, selectedOrganization, loading, error, selectOrganization, refreshOrganizations } =
    useOrganizationSelector({
      autoSelectFirst: true,
      persistSelection: true,
    })

  // Notify parent component when organization changes
  React.useEffect(() => {
    onOrganizationChange?.(selectedOrganization?._id || null)
  }, [selectedOrganization, onOrganizationChange])

  const handleSelect = (organization: any) => {
    selectOrganization(organization)
    setOpen(false)
  }

  const handleCreateSuccess = () => {
    setShowCreateDialog(false)
    refreshOrganizations()
  }

  if (loading && organizations.length === 0) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <Skeleton className="h-8 w-[200px]" />
      </div>
    )
  }

  if (error && organizations.length === 0) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <Button variant="outline" size="sm" onClick={refreshOrganizations}>
          Retry Loading Organizations
        </Button>
      </div>
    )
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-[200px] justify-between", className)}
          >
            {selectedOrganization ? (
              <span className="truncate">{selectedOrganization.name}</span>
            ) : (
              "Select organization..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search organizations..." />
            <CommandList>
              <CommandEmpty>No organizations found.</CommandEmpty>
              <CommandGroup>
                {organizations.map((organization) => (
                  <CommandItem
                    key={organization._id}
                    value={organization.name}
                    onSelect={() => handleSelect(organization)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedOrganization?._id === organization._id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{organization.name}</span>
                      {organization.description && (
                        <span className="text-xs text-muted-foreground truncate">{organization.description}</span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem onSelect={() => setShowCreateDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Organization
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <CreateOrganizationDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleCreateSuccess}
      />
    </>
  )
}
