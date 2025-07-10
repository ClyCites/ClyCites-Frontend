"use client"

import { useState } from "react"
import { Plus, Search, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OrganizationSelector } from "@/components/organization/organization-selector"
import { FarmCard } from "@/components/farm/farm-card"
import { CreateFarmDialog } from "@/components/farm/create-farm-dialog"
import { useFarms } from "@/hooks/use-farms"
import { useOrganizationSelector } from "@/hooks/use-organizations"
import type { Farm } from "@/lib/api/farm-api"
import type { Organization } from "@/lib/api/organization-api"

export default function FarmsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [farmTypeFilter, setFarmTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const { selectedOrganization, selectOrganization, ...orgSelector } = useOrganizationSelector({
    autoSelectFirst: true,
    persistSelection: true,
  })

  const { farms, loading, error, refreshFarms } = useFarms({
    organizationId: selectedOrganization?._id,
    autoLoad: true,
  })

  const handleOrganizationSelect = (organization: Organization | null) => {
    selectOrganization(organization)
  }

  const handleFarmCreated = (newFarm: Farm) => {
    setShowCreateDialog(false)
    refreshFarms()
  }

  const handleFarmUpdated = (updatedFarm: Farm) => {
    refreshFarms()
  }

  const handleFarmDeleted = (farmId: string) => {
    refreshFarms()
  }

  const handleViewDetails = (farm: Farm) => {
    // TODO: Navigate to farm details page
    console.log("View farm details:", farm)
  }

  // Filter farms based on search and filters
  const filteredFarms = farms.filter((farm) => {
    const matchesSearch =
      farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farm.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farm.location.address?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = farmTypeFilter === "all" || farm.farmType === farmTypeFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && farm.isActive) ||
      (statusFilter === "inactive" && !farm.isActive)

    return matchesSearch && matchesType && matchesStatus
  })

  const farmStats = {
    total: farms.length,
    active: farms.filter((f) => f.isActive).length,
    inactive: farms.filter((f) => !f.isActive).length,
    byType: farms.reduce(
      (acc, farm) => {
        acc[farm.farmType] = (acc[farm.farmType] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
  }

  if (!selectedOrganization) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Farm Management</h1>
          <p className="text-muted-foreground">Manage your farms and agricultural operations</p>
        </div>

        <OrganizationSelector
          selectedOrgId={selectedOrganization?._id}
          onOrganizationSelect={handleOrganizationSelect}
          className="max-w-2xl mx-auto"
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Farm Management</h1>
          <p className="text-muted-foreground">Managing farms for {selectedOrganization.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => selectOrganization(null)}>
            Change Organization
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Farm
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Farms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Farms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{farmStats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inactive Farms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{farmStats.inactive}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Farm Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(farmStats.byType).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search farms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={farmTypeFilter} onValueChange={setFarmTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Farm Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="crop">Crop Production</SelectItem>
                <SelectItem value="livestock">Livestock</SelectItem>
                <SelectItem value="mixed">Mixed Farming</SelectItem>
                <SelectItem value="aquaculture">Aquaculture</SelectItem>
                <SelectItem value="poultry">Poultry</SelectItem>
                <SelectItem value="dairy">Dairy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {loading && farms.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button variant="outline" size="sm" onClick={refreshFarms} className="ml-2 bg-transparent">
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      ) : filteredFarms.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              {farms.length === 0 ? (
                <>
                  <div className="text-lg font-medium mb-2">No farms found</div>
                  <p>Get started by creating your first farm</p>
                </>
              ) : (
                <>
                  <div className="text-lg font-medium mb-2">No farms match your filters</div>
                  <p>Try adjusting your search criteria</p>
                </>
              )}
            </div>
            {farms.length === 0 && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Farm
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredFarms.map((farm) => (
            <FarmCard
              key={farm._id}
              farm={farm}
              onFarmUpdated={handleFarmUpdated}
              onFarmDeleted={handleFarmDeleted}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Create Farm Dialog */}
      {selectedOrganization && (
        <CreateFarmDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          organizationId={selectedOrganization._id}
          onFarmCreated={handleFarmCreated}
        />
      )}
    </div>
  )
}
