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
import { Key, Plus, Search, Settings, Copy, Eye, EyeOff, RefreshCw, Trash2 } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useApiTokens } from "@/hooks/useApiTokens"
import { useOrganizations } from "@/hooks/useOrganizations"

export default function TokensPage() {
  const { organizations } = useOrganizations()
  const [selectedOrgId, setSelectedOrgId] = useState<string>("")
  const { tokens, isLoading, error, createToken, deleteToken, regenerateToken } = useApiTokens(selectedOrgId)

  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({})
  const [generatedToken, setGeneratedToken] = useState("")
  const [newToken, setNewToken] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
    expiresAt: "",
  })

  const availablePermissions = [
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
    "read",
    "write",
    "delete",
    "manage",
  ]

  const expiryOptions = [
    { value: "7d", label: "7 days" },
    { value: "30d", label: "30 days" },
    { value: "90d", label: "90 days" },
    { value: "1y", label: "1 year" },
    { value: "never", label: "Never" },
  ]

  useEffect(() => {
    if (Array.isArray(organizations) && organizations.length > 0 && !selectedOrgId) {
      setSelectedOrgId(organizations[0].id)
    }
  }, [organizations, selectedOrgId])

  const filteredTokens = Array.isArray(tokens)
    ? tokens.filter(
        (token) =>
          token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (token.description && token.description.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    : []

  const calculateExpiryDate = (expiresIn: string): string | undefined => {
    if (expiresIn === "never") return undefined

    const now = new Date()
    switch (expiresIn) {
      case "7d":
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
      case "30d":
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
      case "90d":
        return new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString()
      case "1y":
        return new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString()
      default:
        return undefined
    }
  }

  const handleCreateToken = async () => {
    if (!selectedOrgId) return

    const tokenData = {
      ...newToken,
      expiresAt: calculateExpiryDate(newToken.expiresAt),
    }

    const result = await createToken(selectedOrgId, tokenData)
    if (result.success && result.data) {
      setGeneratedToken(result.data.token)
      setNewToken({
        name: "",
        description: "",
        permissions: [],
        expiresAt: "30d",
      })
    }
  }

  const handleDeleteToken = async (tokenId: string) => {
    const result = await deleteToken(tokenId)
    if (result.success) {
      // Token removed from state by hook
    }
  }

  const handleRegenerateToken = async (tokenId: string) => {
    const result = await regenerateToken(tokenId)
    if (result.success) {
      // Show the new token temporarily
      setShowTokens((prev) => ({ ...prev, [tokenId]: true }))
      setTimeout(() => {
        setShowTokens((prev) => ({ ...prev, [tokenId]: false }))
      }, 30000) // Hide after 30 seconds
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const toggleTokenVisibility = (tokenId: string) => {
    setShowTokens((prev) => ({ ...prev, [tokenId]: !prev[tokenId] }))
  }

  const closeCreateDialog = () => {
    setIsCreateDialogOpen(false)
    setGeneratedToken("")
    setNewToken({
      name: "",
      description: "",
      permissions: [],
      expiresAt: "30d",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">API Tokens</h1>
            <p className="text-muted-foreground">Manage API tokens for programmatic access</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!selectedOrgId}>
                <Plus className="mr-2 h-4 w-4" />
                Create Token
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create API Token</DialogTitle>
                <DialogDescription>Create a new API token for programmatic access</DialogDescription>
              </DialogHeader>

              {generatedToken ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Token Created Successfully!</h4>
                    <p className="text-sm text-green-700 mb-3">
                      Make sure to copy your token now. You won't be able to see it again!
                    </p>
                    <div className="flex items-center space-x-2">
                      <Input value={generatedToken} readOnly className="font-mono text-xs" />
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedToken)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={closeCreateDialog}>Done</Button>
                  </DialogFooter>
                </div>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Token Name</Label>
                      <Input
                        id="name"
                        value={newToken.name}
                        onChange={(e) => setNewToken((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="My API Token"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expires">Expires In</Label>
                      <Select
                        value={newToken.expiresAt}
                        onValueChange={(value) => setNewToken((prev) => ({ ...prev, expiresAt: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {expiryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
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
                      value={newToken.description}
                      onChange={(e) => setNewToken((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="What will this token be used for?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {availablePermissions.map((permission) => (
                        <label key={permission} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newToken.permissions.includes(permission)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewToken((prev) => ({
                                  ...prev,
                                  permissions: [...prev.permissions, permission],
                                }))
                              } else {
                                setNewToken((prev) => ({
                                  ...prev,
                                  permissions: prev.permissions.filter((p) => p !== permission),
                                }))
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{permission}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!generatedToken && (
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateToken} disabled={!newToken.name || newToken.permissions.length === 0}>
                    Create Token
                  </Button>
                </DialogFooter>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Organization Selector */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-sm">
            <Label htmlFor="organization">Organization</Label>
            <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
              <SelectTrigger>
                <SelectValue placeholder="Select organization" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(organizations) &&
                  organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 max-w-sm">
            <Label htmlFor="search">Search Tokens</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="search"
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 mb-2">Error loading tokens</div>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {/* Tokens Grid */}
        {!isLoading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTokens.map((token) => (
              <Card key={token.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Key className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{token.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          API Token
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge variant={token.isActive ? "default" : "secondary"}>
                        {token.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/tokens/${token.id}`}>
                          <Settings className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription>{token.description || "No description provided"}</CardDescription>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">TOKEN</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          value={showTokens[token.id] ? token.token : "••••••••••••••••"}
                          readOnly
                          className="font-mono text-xs"
                        />
                        <Button variant="outline" size="sm" onClick={() => toggleTokenVisibility(token.id)}>
                          {showTokens[token.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(token.token)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleRegenerateToken(token.id)}>
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteToken(token.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {token.permissions.slice(0, 3).map((permission, index) => (
                        <Badge key={`${token.id}-permission-${index}`} variant="outline" className="text-xs">
                          {typeof permission === "string" ? permission : permission.resource || "Unknown"}
                        </Badge>
                      ))}
                      {token.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{token.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Requests: {token.usage.requestCount}</span>
                      <span>
                        {token.expiresAt
                          ? `Expires: ${new Date(token.expiresAt).toLocaleDateString()}`
                          : "Never expires"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && !error && filteredTokens.length === 0 && (
          <div className="text-center py-12">
            <Key className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No API tokens</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm ? "No tokens match your search." : "Get started by creating your first API token."}
            </p>
            {!searchTerm && selectedOrgId && (
              <div className="mt-6">
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Token
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
