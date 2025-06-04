"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Users, Plus, Search, Settings, Building2, Eye, EyeOff, Lock } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useTeams } from "@/hooks/useTeams"
import { useOrganizations } from "@/hooks/useOrganizations"

export default function TeamsPage() {
  const { organizations, currentOrganization, isLoading } = useOrganizations()
  const [selectedOrgId, setSelectedOrgId] = useState<string>("")
  const { teams, createTeam } = useTeams(selectedOrgId)
  console.log("Teams data:", teams, "Type:", typeof teams, "Is Array:", Array.isArray(teams))

  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    type: "project" as const,
    visibility: "public" as const,
    parentId: "",
  })

  const teamTypes = [
    { value: "department", label: "Department", description: "Organizational department" },
    { value: "project", label: "Project", description: "Project-based team" },
    { value: "functional", label: "Functional", description: "Function-specific team" },
    { value: "cross-functional", label: "Cross-functional", description: "Multi-discipline team" },
  ]

  const visibilityOptions = [
    { value: "public", label: "Public", icon: Eye, description: "Visible to all organization members" },
    { value: "private", label: "Private", icon: EyeOff, description: "Visible to team members only" },
    { value: "secret", label: "Secret", icon: Lock, description: "Invitation only" },
  ]

  useEffect(() => {
    if (organizations.length > 0 && !selectedOrgId) {
      setSelectedOrgId(organizations[0].id)
    }
  }, [organizations, selectedOrgId])

  const filteredTeams = Array.isArray(teams)
    ? teams.filter(
        (team) =>
          team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          team.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  const handleCreateTeam = async () => {
    if (!selectedOrgId) return

    const result = await createTeam(selectedOrgId, newTeam)
    if (result.success) {
      setIsCreateDialogOpen(false)
      setNewTeam({
        name: "",
        description: "",
        type: "project",
        visibility: "public",
        parentId: "",
      })
    }
  }

  const getVisibilityIcon = (visibility: string) => {
    const option = visibilityOptions.find((opt) => opt.value === visibility)
    return option ? option.icon : Eye
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Teams</h1>
            <p className="text-muted-foreground">Organize your organization into teams and departments</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!selectedOrgId}>
                <Plus className="mr-2 h-4 w-4" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
                <DialogDescription>Create a new team within your organization</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Team Name</Label>
                  <Input
                    id="name"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Engineering Team"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTeam.description}
                    onChange={(e) => setNewTeam((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the team's purpose and responsibilities..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Team Type</Label>
                    <Select
                      value={newTeam.type}
                      onValueChange={(value: any) => setNewTeam((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {teamTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-muted-foreground">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select
                      value={newTeam.visibility}
                      onValueChange={(value: any) => setNewTeam((prev) => ({ ...prev, visibility: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {visibilityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center space-x-2">
                              <option.icon className="h-4 w-4" />
                              <div>
                                <div className="font-medium">{option.label}</div>
                                <div className="text-xs text-muted-foreground">{option.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parent">Parent Team (Optional)</Label>
                  <Select
                    value={newTeam.parentId}
                    onValueChange={(value) => setNewTeam((prev) => ({ ...prev, parentId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent team" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No parent team</SelectItem>
                      {Array.isArray(teams) &&
                        teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTeam} disabled={!newTeam.name}>
                  Create Team
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Organization Selector and Search */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-sm">
            <Label htmlFor="organization">Organization</Label>
            <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
              <SelectTrigger>
                <SelectValue placeholder="Select organization" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 max-w-sm">
            <Label htmlFor="search">Search Teams</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="search"
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        {!currentOrganization || isLoading || !Array.isArray(teams) ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTeams.map((team) => {
              const VisibilityIcon = getVisibilityIcon(team.visibility)
              return (
                <Card key={team.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{team.name}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {team.type}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <VisibilityIcon className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground capitalize">{team.visibility}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/teams/${team.id}`}>
                          <Settings className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription>{team.description || "No description provided"}</CardDescription>

                    {team.parent && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>Part of {team.parent.name}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{team.memberCount} members</span>
                      <span className="text-muted-foreground">
                        Created {new Date(team.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {team.children && team.children.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Sub-teams:</p>
                        <div className="flex flex-wrap gap-1">
                          {team.children.slice(0, 3).map((child) => (
                            <Badge key={child.id} variant="secondary" className="text-xs">
                              {child.name}
                            </Badge>
                          ))}
                          {team.children.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{team.children.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {filteredTeams.length === 0 && !isLoading && Array.isArray(teams) && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No teams</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm ? "No teams match your search." : "Get started by creating your first team."}
            </p>
            {!searchTerm && selectedOrgId && (
              <div className="mt-6">
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Team
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
