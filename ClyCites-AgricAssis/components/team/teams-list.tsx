"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Users, Calendar, Eye, EyeOff, Lock } from "lucide-react"
import type { Team } from "@/lib/api/team-api"

interface TeamsListProps {
  teams: Team[]
  organizationId: string
  currentUserRole?: { name: string; level: number }
  onUpdate: () => void
}

export function TeamsList({ teams, organizationId, currentUserRole, onUpdate }: TeamsListProps) {
  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return <Eye className="h-3 w-3 text-green-500" />
      case "private":
        return <EyeOff className="h-3 w-3 text-orange-500" />
      case "secret":
        return <Lock className="h-3 w-3 text-red-500" />
      default:
        return <Eye className="h-3 w-3 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "department":
        return "default"
      case "project":
        return "secondary"
      case "functional":
        return "outline"
      case "cross-functional":
        return "destructive"
      default:
        return "outline"
    }
  }

  const canManageTeam = currentUserRole?.level >= 70

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teams</CardTitle>
        <CardDescription>
          {teams.length} team{teams.length !== 1 ? "s" : ""} in this organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teams.map((team) => (
            <div key={team._id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{team.name}</p>
                    {getVisibilityIcon(team.visibility || "public")}
                  </div>

                  {team.description && <p className="text-sm text-muted-foreground">{team.description}</p>}

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs">
                          {team.lead.firstName[0]}
                          {team.lead.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        Led by {team.lead.firstName} {team.lead.lastName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Created {new Date(team.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {team.parent && <div className="text-xs text-muted-foreground">Part of {team.parent.name}</div>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {team.type && <Badge variant={getTypeColor(team.type)}>{team.type}</Badge>}

                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  View Members
                </Button>

                {canManageTeam && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Team</DropdownMenuItem>
                      <DropdownMenuItem>Manage Members</DropdownMenuItem>
                      <DropdownMenuItem>Team Settings</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete Team</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          ))}

          {teams.length === 0 && <div className="text-center py-8 text-muted-foreground">No teams found</div>}
        </div>
      </CardContent>
    </Card>
  )
}
