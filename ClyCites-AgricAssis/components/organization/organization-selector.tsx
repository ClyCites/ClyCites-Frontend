"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Building2, Plus } from "lucide-react"
import { organizationApi, type Organization } from "@/lib/api/organization-api"
import { CreateOrganizationDialog } from "./create-organization-dialog"
import { toast } from "sonner"

interface OrganizationSelectorProps {
  selectedOrgId?: string
  onOrganizationSelect: (organization: Organization | null) => void
  showCreateButton?: boolean
}

export function OrganizationSelector({
  selectedOrgId,
  onOrganizationSelect,
  showCreateButton = true,
}: OrganizationSelectorProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadOrganizations()
  }, [])

  const loadOrganizations = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await organizationApi.getUserOrganizations()
      setOrganizations(response.data.organizations)

      // Auto-select first organization if none selected
      if (!selectedOrgId && response.data.organizations.length > 0) {
        onOrganizationSelect(response.data.organizations[0])
      }
    } catch (err: any) {
      console.error("Error loading organizations:", err)
      setError(err.message || "Failed to load organizations")
      toast.error("Failed to load organizations")
    } finally {
      setLoading(false)
    }
  }

  const handleOrganizationCreated = (newOrganization: Organization) => {
    setOrganizations((prev) => [newOrganization, ...prev])
    onOrganizationSelect(newOrganization)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading organizations...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={loadOrganizations} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (organizations.length === 0) {
    return (
      <Card>
        <CardHeader className="text-center">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <CardTitle>No Organizations Found</CardTitle>
          <CardDescription>
            You need to create or join an organization to access farm management features.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {showCreateButton && (
            <CreateOrganizationDialog
              onOrganizationCreated={handleOrganizationCreated}
              trigger={
                <Button size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Organization
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>
    )
  }

  const selectedOrg = organizations.find((org) => org._id === selectedOrgId)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Organization
        </CardTitle>
        <CardDescription>Select an organization to manage its farms and operations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Select
            value={selectedOrgId || ""}
            onValueChange={(orgId) => {
              const org = organizations.find((o) => o._id === orgId)
              onOrganizationSelect(org || null)
            }}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select an organization" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((org) => (
                <SelectItem key={org._id} value={org._id}>
                  <div className="flex items-center gap-2">
                    <span>{org.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {org.membership?.role.name}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {showCreateButton && (
            <CreateOrganizationDialog
              onOrganizationCreated={handleOrganizationCreated}
              trigger={
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              }
            />
          )}
        </div>

        {selectedOrg && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{selectedOrg.name}</h4>
              <Badge variant="secondary">{selectedOrg.membership?.role.name}</Badge>
            </div>
            {selectedOrg.description && <p className="text-sm text-muted-foreground mb-2">{selectedOrg.description}</p>}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {selectedOrg.industry && <span className="capitalize">{selectedOrg.industry}</span>}
              {selectedOrg.size && <span className="capitalize">{selectedOrg.size}</span>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
