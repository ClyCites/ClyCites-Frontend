"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  ArrowLeft,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useApiTokens } from "@/hooks/useApiTokens"
import { TokenValidator } from "@/components/token-validator"
import { useOrganizations } from "@/hooks/useOrganizations"

export default function TokenDetailPage() {
  const params = useParams()
  const router = useRouter()
  const tokenId = params.id as string

  // Get current organization
  const { currentOrganization } = useOrganizations()
  const { tokens, isLoading, error, fetchTokens, deleteToken, regenerateToken } = useApiTokens(currentOrganization?.id)

  const [currentToken, setCurrentToken] = useState<any>(null)
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

  // Find the current token from the tokens array
  useEffect(() => {
    if (tokens && tokenId) {
      const token = tokens.find((t) => t.id === tokenId)
      setCurrentToken(token)
      if (token) {
        setEditForm({
          name: token.name,
          description: token.description || "",
          isActive: token.isActive,
        })
      }
    }
  }, [tokens, tokenId])

  // Fetch tokens when organization is available
  useEffect(() => {
    if (currentOrganization?.id) {
      fetchTokens(currentOrganization.id)
    }
  }, [currentOrganization?.id, fetchTokens])

  const handleRegenerateToken = async () => {
    if (!currentToken) return

    const result = await regenerateToken(currentToken.id)
    if (result.success && result.data) {
      setNewTokenValue(result.data.token)
      setCurrentToken(result.data)
      setIsRegenerateDialogOpen(false)
      setMessage({ type: "success", text: "Token regenerated successfully" })
    } else {
      setMessage({ type: "error", text: result.error || "Failed to regenerate token" })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleRevokeToken = async () => {
    if (!currentToken) return

    const result = await deleteToken(currentToken.id)
    if (result.success) {
      setIsRevokeDialogOpen(false)
      router.push("/tokens")
    } else {
      setMessage({ type: "error", text: result.error || "Failed to revoke token" })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setMessage({ type: "success", text: "Copied to clipboard" })
    setTimeout(() => setMessage(null), 2000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    )
  }

  if (!currentToken) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Token not found</AlertDescription>
          </Alert>
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
            <Button variant="ghost" size="sm" onClick={() => router.push("/tokens")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tokens
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Key className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{currentToken.name}</h1>
              <p className="text-muted-foreground">{currentToken.description || "No description"}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={currentToken.isActive ? "default" : "secondary"}>
              {currentToken.isActive ? "Active" : "Inactive"}
            </Badge>
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
                  <div className="text-2xl font-bold">{currentToken.usage?.requestCount || 0}</div>
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
                    {currentToken.lastUsed ? formatDate(currentToken.lastUsed) : "Never"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {currentToken.lastUsed ? formatDateTime(currentToken.lastUsed) : "Not used yet"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Permissions</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentToken.permissions?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">granted permissions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expires</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentToken.expiresAt ? formatDate(currentToken.expiresAt) : "Never"}
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
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                    <p className="text-sm">{formatDateTime(currentToken.createdAt)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                    <p className="text-sm">{formatDateTime(currentToken.updatedAt)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <Badge variant={currentToken.isActive ? "default" : "secondary"}>
                      {currentToken.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Token ID</Label>
                    <p className="text-sm font-mono">{currentToken.id}</p>
                  </div>
                </div>

                {currentToken.permissions && currentToken.permissions.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Permissions</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {currentToken.permissions.map((permission: string) => (
                        <Badge key={permission} variant="outline">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Token Value</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Input
                      type={showToken ? "text" : "password"}
                      value={currentToken.token}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button variant="outline" size="sm" onClick={() => setShowToken(!showToken)}>
                      {showToken ? "Hide" : "Show"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(currentToken.token)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
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
