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
import {
  Shield,
  Plus,
  Search,
  Settings,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Globe,
  Smartphone,
  Monitor,
  Server,
  Zap,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useApplications } from "@/hooks/useApplications"
import { useOrganizations } from "@/hooks/useOrganizations"

export default function ApplicationsPage() {
  const { organizations } = useOrganizations()
  const [selectedOrgId, setSelectedOrgId] = useState<string>("")
  const { applications, createApplication, regenerateClientSecret } = useApplications(selectedOrgId)

  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [newApp, setNewApp] = useState({
    name: "",
    description: "",
    type: "web" as const,
    platform: "",
    redirectUris: [""],
    scopes: [] as string[],
    grantTypes: ["authorization_code"],
  })

  const availableScopes = [
    "profile",
    "email",
    "organizations",
    "teams",
    "users",
    "roles",
    "permissions",
    "applications",
    "analytics",
    "billing",
    "admin",
  ]

  const applicationTypes = [
    { value: "web", label: "Web Application", icon: Globe },
    { value: "mobile", label: "Mobile App", icon: Smartphone },
    { value: "desktop", label: "Desktop App", icon: Monitor },
    { value: "api", label: "API Service", icon: Server },
    { value: "service", label: "Background Service", icon: Zap },
    { value: "integration", label: "Integration", icon: Settings },
  ]

  useEffect(() => {
    if (organizations.length > 0 && !selectedOrgId) {
      setSelectedOrgId(organizations[0].id)
    }
  }, [organizations, selectedOrgId])

  const filteredApplications = applications.filter(
    (app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateApplication = async () => {
    if (!selectedOrgId) return

    const result = await createApplication(selectedOrgId, newApp)
    if (result.success) {
      setIsCreateDialogOpen(false)
      setNewApp({
        name: "",
        description: "",
        type: "web",
        platform: "",
        redirectUris: [""],
        scopes: [],
        grantTypes: ["authorization_code"],
      })
    }
  }

  const handleRegenerateSecret = async (appId: string) => {
    const result = await regenerateClientSecret(appId)
    if (result.success) {
      setShowSecrets((prev) => ({ ...prev, [appId]: true }))
      setTimeout(() => {
        setShowSecrets((prev) => ({ ...prev, [appId]: false }))
      }, 30000)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const toggleSecretVisibility = (appId: string) => {
    setShowSecrets((prev) => ({ ...prev, [appId]: !prev[appId] }))
  }

  const addRedirectUri = () => {
    setNewApp((prev) => ({
      ...prev,
      redirectUris: [...prev.redirectUris, ""],
    }))
  }

  const updateRedirectUri = (index: number, value: string) => {
    setNewApp((prev) => ({
      ...prev,
      redirectUris: prev.redirectUris.map((uri, i) => (i === index ? value : uri)),
    }))
  }

  const removeRedirectUri = (index: number) => {
    setNewApp((prev) => ({
      ...prev,
      redirectUris: prev.redirectUris.filter((_, i) => i !== index),
    }))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Applications</h1>
            <p className="text-muted-foreground">Manage OAuth applications and integrations</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!selectedOrgId}>
                <Plus className="mr-2 h-4 w-4" />
                Create Application
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Application</DialogTitle>
                <DialogDescription>Register a new OAuth application for your organization</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Application Name</Label>
                    <Input
                      id="name"
                      value={newApp.name}
                      onChange={(e) => setNewApp((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="My Awesome App"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Application Type</Label>
                    <Select
                      value={newApp.type}
                      onValueChange={(value: any) => setNewApp((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {applicationTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center space-x-2">
                              <type.icon className="h-4 w-4" />
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newApp.description}
                    onChange={(e) => setNewApp((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what your application does..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Redirect URIs</Label>
                  {newApp.redirectUris.map((uri, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={uri}
                        onChange={(e) => updateRedirectUri(index, e.target.value)}
                        placeholder="https://yourapp.com/callback"
                      />
                      {newApp.redirectUris.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeRedirectUri(index)}>
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addRedirectUri}>
                    Add Redirect URI
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Scopes</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {availableScopes.map((scope) => (
                      <label key={scope} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newApp.scopes.includes(scope)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewApp((prev) => ({
                                ...prev,
                                scopes: [...prev.scopes, scope],
                              }))
                            } else {
                              setNewApp((prev) => ({
                                ...prev,
                                scopes: prev.scopes.filter((s) => s !== scope),
                              }))
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{scope}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateApplication} disabled={!newApp.name || newApp.scopes.length === 0}>
                  Create Application
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

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
            <Label htmlFor="search">Search Applications</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="search"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredApplications.map((app) => {
            const AppTypeIcon = applicationTypes.find((t) => t.value === app.type)?.icon || Shield
            return (
              <Card key={app.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <AppTypeIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{app.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {app.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge variant={app.isActive ? "default" : "secondary"}>
                        {app.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/applications/${app.id}`}>
                          <Settings className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription>{app.description || "No description provided"}</CardDescription>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">CLIENT ID</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input value={app.clientId} readOnly className="font-mono text-xs" />
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(app.clientId)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">CLIENT SECRET</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          value={showSecrets[app.id] ? app.clientSecret : "••••••••••••••••"}
                          readOnly
                          className="font-mono text-xs"
                        />
                        <Button variant="outline" size="sm" onClick={() => toggleSecretVisibility(app.id)}>
                          {showSecrets[app.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(app.clientSecret)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleRegenerateSecret(app.id)}>
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {app.scopes.slice(0, 3).map((scope) => (
                        <Badge key={scope} variant="outline" className="text-xs">
                          {scope}
                        </Badge>
                      ))}
                      {app.scopes.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{app.scopes.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Users: {app.usage.activeUsers}</span>
                      <span>Requests: {app.usage.totalRequests}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No applications</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm ? "No applications match your search." : "Get started by creating your first application."}
            </p>
            {!searchTerm && selectedOrgId && (
              <div className="mt-6">
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Application
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
