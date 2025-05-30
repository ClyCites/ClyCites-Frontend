"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Key, Plus, Copy, Trash2, Eye, EyeOff } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

interface ApiToken {
  id: string
  name: string
  description: string
  scopes: string[]
  lastUsed: string | null
  createdAt: string
  expiresAt: string | null
  isActive: boolean
}

export default function TokensPage() {
  const [tokens, setTokens] = useState<ApiToken[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newToken, setNewToken] = useState({
    name: "",
    description: "",
    scopes: [] as string[],
    expiresIn: "30d",
  })
  const [generatedToken, setGeneratedToken] = useState("")
  const [showToken, setShowToken] = useState(false)

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

  useEffect(() => {
    fetchTokens()
  }, [])

  const fetchTokens = async () => {
    try {
      const token = localStorage.getItem("token")
      // Note: This would need to be adapted based on your actual API structure
      // Since the API expects orgId, you'd need to get the current organization context
      const response = await fetch("/api/organizations/current/tokens", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setTokens(data)
      }
    } catch (error) {
      console.error("Failed to fetch tokens:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateToken = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/organizations/current/tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newToken),
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedToken(data.token)
        setTokens((prev) => [...prev, data.tokenInfo])
        setNewToken({ name: "", description: "", scopes: [], expiresIn: "30d" })
      }
    } catch (error) {
      console.error("Failed to create token:", error)
    }
  }

  const handleRevokeToken = async (tokenId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/tokens/${tokenId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setTokens((prev) => prev.filter((t) => t.id !== tokenId))
      }
    } catch (error) {
      console.error("Failed to revoke token:", error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">API Tokens</h1>
            <p className="text-muted-foreground">Manage your API tokens for programmatic access</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Token
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create API Token</DialogTitle>
                <DialogDescription>Create a new API token for programmatic access to your account.</DialogDescription>
              </DialogHeader>

              {generatedToken ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Token Created Successfully!</h4>
                    <p className="text-sm text-green-700 mb-3">
                      Make sure to copy your token now. You won't be able to see it again!
                    </p>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={generatedToken}
                        type={showToken ? "text" : "password"}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button variant="outline" size="sm" onClick={() => setShowToken(!showToken)}>
                        {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedToken)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => {
                        setIsCreateDialogOpen(false)
                        setGeneratedToken("")
                        setShowToken(false)
                      }}
                    >
                      Done
                    </Button>
                  </DialogFooter>
                </div>
              ) : (
                <div className="space-y-4">
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
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newToken.description}
                      onChange={(e) => setNewToken((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="What will this token be used for?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expires">Expires In</Label>
                    <Select
                      value={newToken.expiresIn}
                      onValueChange={(value) => setNewToken((prev) => ({ ...prev, expiresIn: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">7 days</SelectItem>
                        <SelectItem value="30d">30 days</SelectItem>
                        <SelectItem value="90d">90 days</SelectItem>
                        <SelectItem value="1y">1 year</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Scopes</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableScopes.map((scope) => (
                        <label key={scope} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newToken.scopes.includes(scope)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewToken((prev) => ({
                                  ...prev,
                                  scopes: [...prev.scopes, scope],
                                }))
                              } else {
                                setNewToken((prev) => ({
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

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateToken} disabled={!newToken.name || newToken.scopes.length === 0}>
                      Create Token
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {tokens.map((token) => (
              <Card key={token.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Key className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{token.name}</CardTitle>
                        <CardDescription>{token.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={token.isActive ? "default" : "secondary"}>
                        {token.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleRevokeToken(token.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {token.scopes.map((scope) => (
                        <Badge key={scope} variant="outline" className="text-xs">
                          {scope}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Last used: {token.lastUsed ? new Date(token.lastUsed).toLocaleDateString() : "Never"}</span>
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

        {!isLoading && tokens.length === 0 && (
          <div className="text-center py-12">
            <Key className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No API tokens</h3>
            <p className="mt-1 text-sm text-muted-foreground">Get started by creating your first API token.</p>
            <div className="mt-6">
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Token
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
