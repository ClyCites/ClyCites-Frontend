"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Key, Shield, Plus, Settings, Activity, TrendingUp } from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/hooks/useAuth"
import { useOrganizations } from "@/hooks/useOrganizations"
import { useApiTokens } from "@/hooks/useApiTokens"
import { useApplications } from "@/hooks/useApplications"

interface DashboardStats {
  totalOrganizations: number
  totalMembers: number
  totalTokens: number
  totalApplications: number
  recentActivity: Array<{
    id: string
    action: string
    timestamp: string
    details: string
    type: "info" | "warning" | "success"
  }>
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { organizations } = useOrganizations()
  const { tokens } = useApiTokens()
  const { applications } = useApplications()

  const [stats, setStats] = useState<DashboardStats>({
    totalOrganizations: 0,
    totalMembers: 0,
    totalTokens: 0,
    totalApplications: 0,
    recentActivity: [],
  })

  useEffect(() => {
    // Calculate stats from loaded data
    const totalMembers = Array.isArray(organizations) ? organizations.reduce((sum, org) => sum + org.memberCount, 0) : 0

    const recentActivity = [
      {
        id: "1",
        action: "API Token Created",
        timestamp: "2 hours ago",
        details: "Production API token for mobile app",
        type: "success" as const,
      },
      {
        id: "2",
        action: "User Invited",
        timestamp: "4 hours ago",
        details: "john@example.com invited to Development Team",
        type: "info" as const,
      },
      {
        id: "3",
        action: "Rate Limit Exceeded",
        timestamp: "6 hours ago",
        details: "API token 'mobile-app-prod' exceeded hourly limit",
        type: "warning" as const,
      },
      {
        id: "4",
        action: "Organization Created",
        timestamp: "1 day ago",
        details: "New organization 'Acme Corp' created",
        type: "success" as const,
      },
      {
        id: "5",
        action: "Application Registered",
        timestamp: "2 days ago",
        details: "OAuth application 'Dashboard App' registered",
        type: "info" as const,
      },
    ]

    setStats({
      totalOrganizations: Array.isArray(organizations) ? organizations.length : 0,
      totalMembers,
      totalTokens: Array.isArray(tokens) ? tokens.length : 0,
      totalApplications: Array.isArray(applications) ? applications.length : 0,
      recentActivity,
    })
  }, [organizations, tokens, applications])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return <div className="w-2 h-2 bg-green-600 rounded-full"></div>
      case "warning":
        return <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
      default:
        return <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
    }
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.firstName}!</h1>
            <p className="text-muted-foreground">Here's what's happening with your organizations and applications</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-sm">
              {user.globalRole}
            </Badge>
            {user.isEmailVerified && (
              <Badge variant="default" className="text-sm">
                Verified
              </Badge>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organizations</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrganizations}</div>
              <p className="text-xs text-muted-foreground">Active memberships</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
              <p className="text-xs text-muted-foreground">Across all organizations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Tokens</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTokens}</div>
              <p className="text-xs text-muted-foreground">Active tokens</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalApplications}</div>
              <p className="text-xs text-muted-foreground">Registered apps</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button asChild className="h-auto p-4 flex-col space-y-2">
                <Link href="/organizations/new">
                  <Building2 className="h-6 w-6" />
                  <span>Create Organization</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
                <Link href="/tokens">
                  <Key className="h-6 w-6" />
                  <span>Manage API Tokens</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
                <Link href="/applications">
                  <Shield className="h-6 w-6" />
                  <span>Register Application</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
                <Link href="/teams">
                  <Users className="h-6 w-6" />
                  <span>Create Team</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Organizations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Organizations</CardTitle>
                <CardDescription>Organizations you're a member of</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/organizations">
                  <Settings className="mr-2 h-4 w-4" />
                  Manage
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.isArray(organizations) &&
                  organizations.slice(0, 3).map((org) => (
                    <div key={org.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{org.name}</h4>
                          <p className="text-sm text-muted-foreground">{org.memberCount} members</p>
                        </div>
                      </div>
                      <Badge variant="outline">{org.role}</Badge>
                    </div>
                  ))}
                {(!Array.isArray(organizations) || organizations.length === 0) && (
                  <div className="text-center py-6">
                    <Building2 className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-2">No organizations yet</p>
                    <Button asChild size="sm" className="mt-2">
                      <Link href="/organizations/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Organization
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions across the platform</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin">
                  <Activity className="mr-2 h-4 w-4" />
                  View All
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.details}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>System Status</span>
            </CardTitle>
            <CardDescription>Current system health and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">API Status</h4>
                  <p className="text-sm text-muted-foreground">All systems operational</p>
                </div>
                <Badge variant="default">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Response Time</h4>
                  <p className="text-sm text-muted-foreground">Average API response</p>
                </div>
                <Badge variant="outline">125ms</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Uptime</h4>
                  <p className="text-sm text-muted-foreground">Last 30 days</p>
                </div>
                <Badge variant="default">99.9%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
