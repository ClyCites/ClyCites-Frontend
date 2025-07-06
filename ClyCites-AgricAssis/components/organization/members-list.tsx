"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Mail, Calendar, Crown, Shield, User } from "lucide-react"
import type { OrganizationMember } from "@/lib/api/organization-api"

interface MembersListProps {
  members: OrganizationMember[]
  organizationId: string
  currentUserRole?: { name: string; level: number }
  onUpdate: () => void
}

export function MembersList({ members, organizationId, currentUserRole, onUpdate }: MembersListProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const getRoleIcon = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case "owner":
        return <Crown className="h-3 w-3 text-yellow-500" />
      case "admin":
        return <Shield className="h-3 w-3 text-red-500" />
      case "manager":
        return <Shield className="h-3 w-3 text-blue-500" />
      default:
        return <User className="h-3 w-3 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "pending":
        return "secondary"
      case "inactive":
        return "destructive"
      default:
        return "outline"
    }
  }

  const canManageMember = (member: OrganizationMember) => {
    if (!currentUserRole) return false
    return currentUserRole.level > member.role.level && currentUserRole.level >= 70
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Members</CardTitle>
        <CardDescription>
          {members.length} member{members.length !== 1 ? "s" : ""} in this organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member._id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={member.user.profilePicture || "/placeholder.svg"} />
                  <AvatarFallback>
                    {member.user.firstName[0]}
                    {member.user.lastName[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {member.user.firstName} {member.user.lastName}
                    </p>
                    {getRoleIcon(member.role.name)}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {member.user.email}
                  </div>

                  {member.joinedAt && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </div>
                  )}

                  {member.invitedBy && member.status === "pending" && (
                    <div className="text-xs text-muted-foreground">
                      Invited by {member.invitedBy.firstName} {member.invitedBy.lastName}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(member.status)}>{member.status}</Badge>

                <Badge variant="outline">{member.role.name}</Badge>

                {member.user.lastLogin && (
                  <div className="text-xs text-muted-foreground">
                    Last seen {new Date(member.user.lastLogin).toLocaleDateString()}
                  </div>
                )}

                {canManageMember(member) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Change Role</DropdownMenuItem>
                      <DropdownMenuItem>Send Message</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Remove Member</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          ))}

          {members.length === 0 && <div className="text-center py-8 text-muted-foreground">No members found</div>}
        </div>
      </CardContent>
    </Card>
  )
}
