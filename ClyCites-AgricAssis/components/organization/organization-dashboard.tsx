"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, UserPlus, Settings, Building2, Shield, TrendingUp } from "lucide-react"
import { teamApi, type Team } from "@/lib/api/team-api"
import {
  organizationApi,
  type Organization,
  type OrganizationMember,
} from "@/lib/api/organization-api"
import { InviteUserDialog } from "./invite-user-dialog"
import { CreateTeamDialog } from "../team/create-team-dialog"
import { MembersList } from "./members-list"
import { TeamsList } from "../team/teams-list"
import { useToast } from "@/hooks/use-toast"

interface OrganizationDashboardProps {
  organization: Organization
}

export function OrganizationDashboard({ organization }: OrganizationDashboardProps) {
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [stats, setStats] = useState({
    memberCount: 0,
    teamCount: 0,
    activeProjects: 0,
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadDashboardData()
  }, [organization._id])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      const [membersResponse, teamsResponse] = await Promise.all([
        organizationApi.getOrganizationMembers(organization._id, { limit: 50 }),
        teamApi.getOrganizationTeams(organization._id, { limit: 50 }),
      ])

      setMembers(membersResponse.data.members)
      setTeams(teamsResponse.data.teams)

      setStats({
        memberCount: membersResponse.data.pagination.total,
        teamCount: teamsResponse.data.pagination.total,
        activeProjects: teamsResponse.data.teams.filter((t: Team) => t.type === "project").length,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load organization data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const canManageOrganization = organization.membership?.role.level >= 90
  const canInviteUsers = organization.membership?.role.level >= 70

  return (
    <div className="space-y-6">
      {/* Organization Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">{organization.name}</h1>
              <p className="text-muted-foreground">{organization.description}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canInviteUsers && <InviteUserDialog organizationId={organization._id} onSuccess={loadDashboardData} />}
          {canManageOrganization && (
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.memberCount}</div>
            <p className="text-xs text-muted-foreground">Active organization members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teams</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teamCount}</div>
            <p className="text-xs text-muted-foreground">Active teams and departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">Ongoing project teams</p>
          </CardContent>
        </Card>
      </div>

      {/* Organization Details */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Organization Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Owner</label>
              <p className="text-sm">
                {organization.owner.firstName} {organization.owner.lastName}
              </p>
            </div>

            {organization.industry && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Industry</label>
                <p className="text-sm capitalize">{organization.industry}</p>
              </div>
            )}

            {organization.size && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Size</label>
                <p className="text-sm capitalize">{organization.size}</p>
              </div>
            )}

            {organization.website && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Website</label>
                <a
                  href={organization.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {organization.website}
                </a>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-muted-foreground">Your Role</label>
              <Badge variant="outline" className="text-xs">
                {organization.membership?.role.name}
              </Badge>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Member Since</label>
              <p className="text-sm">{new Date(organization.membership?.joinedAt || "").toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="members" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="teams">Teams</TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                {canInviteUsers && (
                  <InviteUserDialog
                    organizationId={organization._id}
                    onSuccess={loadDashboardData}
                    trigger={
                      <Button variant="outline" size="sm">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite Member
                      </Button>
                    }
                  />
                )}

                <CreateTeamDialog
                  organizationId={organization._id}
                  onSuccess={loadDashboardData}
                  trigger={
                    <Button variant="outline" size="sm">
                      <Shield className="h-4 w-4 mr-2" />
                      Create Team
                    </Button>
                  }
                />
              </div>
            </div>

            <TabsContent value="members">
              <MembersList
                members={members}
                organizationId={organization._id}
                currentUserRole={organization.membership?.role}
                onUpdate={loadDashboardData}
              />
            </TabsContent>

            <TabsContent value="teams">
              <TeamsList
                teams={teams}
                organizationId={organization._id}
                currentUserRole={organization.membership?.role}
                onUpdate={loadDashboardData}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
