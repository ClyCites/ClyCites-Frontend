"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  Key,
  Copy,
  RefreshCw,
  Trash2,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Settings,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useApiTokens } from "@/hooks/useApiTokens"
import { TokenValidator } from "@/components/token-validator"

export default function TokenDetailPage() {
  const params = useParams()
  const router = useRouter()
  const tokenId = params.id as string

  const {
    currentToken,
    usageStats,
    fetchTokenDetails,
    fetchUsageStats,
    updateToken,
    revokeToken,
    regenerateToken,
    testToken,
  } = useApiTokens()

  const [isEditing, setIsEditing] = useState(false)
  const [showToken, setShowToken] = useState(false)
  const [isRegenerateDialogOpen, setIsRegenerateDialogOpen] = useState(false)
  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false)
  const [newTokenValue, setNewTokenValue] = useState("")
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    isActive: true,
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    const loadTokenData = async () => {
      try {
        await Promise.all([fetchTokenDetails(tokenId), fetchUsageStats(tokenId)])
      } catch (error) {
        console.error("Failed to load token data:", error)
      }
    }

    if (tokenId) {
      loadTokenData()
    }
  }, [tokenId, fetchTokenDetails, fetchUsageStats])

  useEffect(() => {
    if (currentToken) {
      setEditForm({
        name: currentToken.name,
        description: currentToken.description || "",
        isActive: currentToken.isActive,
      })
    }
  }, [currentToken])

  const handleSaveChanges = async () => {
    if (!currentToken) return

    const result = await updateToken(currentToken.id, editForm)
    if (result.success) {
      setIsEditing(false)
      setMessage({ type: "success", text: "Token updated successfully" })
    } else {
      setMessage({ type: "error", text: result.error || "Failed to update token" })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleRegenerateToken = async () => {
    if (!currentToken) return

    const result = await regenerateToken(currentToken.id)
    if (result.success) {
      setNewTokenValue(result.token!)
      setIsRegenerateDialogOpen(false)
      setMessage({ type: "success", text: "Token regenerated successfully" })
    } else {
      setMessage({ type: "error", text: result.error || "Failed to regenerate token" })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleRevokeToken = async () => {
    if (!currentToken) return

    const result = await revokeToken(currentToken.id)
    if (result.success) {
      setIsRevokeDialogOpen(false)
      router.push("/tokens")
    } else {
      setMessage({ type: "error", text: result.error || "Failed to revoke token" })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleTestToken = async () => {
    if (!currentToken) return

    const result = await testToken(currentToken.id)
    if (result.success) {
      setMessage({ type: "success", text: "Token test successful" })
    } else {
      setMessage({ type: "error", text: result.error || "Token test failed" })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setMessage({ type: "success", text: "Copied to clipboard" })
    setTimeout(() => setMessage(null), 2000)
  }

  if (!currentToken) {
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Key className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{currentToken.name}</h1>
              <p className="text-muted-foreground">{currentToken.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={currentToken.isActive ? "default" : "secondary"}>
              {currentToken.isActive ? "Active" : "Inactive"}
            </Badge>
            <Button variant="outline" onClick={handleTestToken}>
              Test Token
            </Button>
            <Button variant={isEditing ? "default" : "outline"} onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit"}
            </Button>
            {isEditing && (
              <Button onClick={handleSaveChanges}>
                <Settings className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            )}
          </div>
        </div>

        {message && (
          <Alert variant={message.type === "error" ? "destructive" : "default"}>
            {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* New Token Alert */}
        {newTokenValue && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Token regenerated successfully!</p>
                <p className="text-sm">Make sure to copy your new token now. You won't be able to see it again!</p>
                <div className="flex items-center space-x-2">
                  <Input value={newTokenValue} readOnly className="font-mono text-xs" />
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(newTokenValue)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="usage">Usage & Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="validator">Token Validator</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentToken.usage.totalRequests}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Last Used</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentToken.lastUsed ? new Date(currentToken.lastUsed).toLocaleDateString() : "Never"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {currentToken.lastUsed ? new Date(currentToken.lastUsed).toLocaleTimeString() : "Not used yet"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rate Limit</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentToken.rateLimits.requestsPerMinute}</div>
                  <p className="text-xs text-muted-foreground">requests/minute</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expires</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentToken.expiresAt ? new Date(currentToken.expiresAt).toLocaleDateString() : "Never"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {currentToken.expiresAt ? "Expiration date" : "No expiration"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Token Details</CardTitle>
                <CardDescription>Basic information about this API token</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Token Name</Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={editForm.description}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe what this token is used for..."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                      <p className="text-sm">{new Date(currentToken.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                      <Badge variant={currentToken.isActive ? "default" : "secondary"}>
                        {currentToken.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Scopes</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentToken.scopes.map((scope) => (
                      <Badge key={scope} variant="outline">
                        {scope}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Rate Limits</Label>
                  <div className="grid gap-2 md:grid-cols-3 mt-2">
                    <div className="text-sm">
                      <span className="font-medium">Per Minute:</span> {currentToken.rateLimits.requestsPerMinute}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Per Hour:</span> {currentToken.rateLimits.requestsPerHour}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Per Day:</span> {currentToken.rateLimits.requestsPerDay}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>Detailed analytics for this API token</CardDescription>
              </CardHeader>
              <CardContent>
                {usageStats ? (
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{usageStats.totalRequests}</div>
                        <p className="text-sm text-muted-foreground">Total Requests</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{usageStats.requestsToday}</div>
                        <p className="text-sm text-muted-foreground">Requests Today</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{usageStats.requestsThisHour}</div>
                        <p className="text-sm text-muted-foreground">This Hour</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{(usageStats.errorRate * 100).toFixed(1)}%</div>
                        <p className="text-sm text-muted-foreground">Error Rate</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Top Endpoints</h4>
                      <div className="space-y-2">
                        {usageStats.topEndpoints.map((endpoint, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <span className="font-mono text-sm">{endpoint.endpoint}</span>
                            <Badge variant="outline">{endpoint.count} requests</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No usage data</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Usage statistics will appear here once the token is used.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Token Management</CardTitle>
                <CardDescription>Manage your token settings and security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Regenerate Token</h4>
                      <p className="text-sm text-muted-foreground">
                        Generate a new token value. The old token will be invalidated.
                      </p>
                    </div>
                    <Dialog open={isRegenerateDialogOpen} onOpenChange={setIsRegenerateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Regenerate
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Regenerate Token</DialogTitle>
                          <DialogDescription>
                            This will generate a new token value and invalidate the current one. Any applications using
                            the current token will need to be updated.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsRegenerateDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleRegenerateToken}>Regenerate Token</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Revoke Token</h4>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete this token. This action cannot be undone.
                      </p>
                    </div>
                    <Dialog open={isRevokeDialogOpen} onOpenChange={setIsRevokeDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Revoke
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Revoke Token</DialogTitle>
                          <DialogDescription>
                            This will permanently delete the token "{currentToken.name}". Any applications using this
                            token will immediately lose access. This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsRevokeDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={handleRevokeToken}>
                            Revoke Token
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="validator" className="space-y-4">
            <TokenValidator />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
