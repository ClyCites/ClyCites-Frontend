"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Key, Clock, User, Building2, Copy } from "lucide-react"
import { useApiTokens } from "@/hooks/useApiTokens"

interface TokenValidationResult {
  valid: boolean
  user?: {
    id: string
    username: string
    email: string
    firstName: string
    lastName: string
  }
  organization?: {
    id: string
    name: string
    slug: string
  }
  token?: {
    name: string
    scopes: string[]
    expiresAt: string | null
    rateLimits: any
  }
  error?: string
}

export function TokenValidator() {
  const { validateToken } = useApiTokens()
  const [token, setToken] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [result, setResult] = useState<TokenValidationResult | null>(null)

  const handleValidate = async () => {
    if (!token.trim()) return

    setIsValidating(true)
    try {
      const response = await validateToken(token)
      setResult(response.data || { valid: false, error: "Invalid token" })
    } catch (error: any) {
      setResult({ valid: false, error: error.message })
    } finally {
      setIsValidating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="h-5 w-5" />
          <span>Token Validator</span>
        </CardTitle>
        <CardDescription>
          Validate JWT tokens and API keys to check their authenticity and extract information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="token">Token</Label>
          <Textarea
            id="token"
            placeholder="Paste your JWT token or API key here..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="min-h-[100px] font-mono text-sm"
          />
        </div>

        <Button onClick={handleValidate} disabled={!token.trim() || isValidating} className="w-full">
          {isValidating ? "Validating..." : "Validate Token"}
        </Button>

        {result && (
          <div className="space-y-4">
            <Alert variant={result.valid ? "default" : "destructive"}>
              {result.valid ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertDescription>
                {result.valid ? "Token is valid and active" : result.error || "Token validation failed"}
              </AlertDescription>
            </Alert>

            {result.valid && (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="user">User Info</TabsTrigger>
                  <TabsTrigger value="organization">Organization</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Token Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {result.token && (
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Token Name</Label>
                            <p className="font-medium">{result.token.name}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Expires</Label>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm">
                                {result.token.expiresAt
                                  ? new Date(result.token.expiresAt).toLocaleString()
                                  : "Never expires"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Scopes</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {result.token?.scopes.map((scope) => (
                            <Badge key={scope} variant="outline">
                              {scope}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {result.token?.rateLimits && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Rate Limits</Label>
                          <div className="grid gap-2 md:grid-cols-3 mt-2">
                            <div className="text-sm">
                              <span className="font-medium">Per Minute:</span>{" "}
                              {result.token.rateLimits.requestsPerMinute}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Per Hour:</span> {result.token.rateLimits.requestsPerHour}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Per Day:</span> {result.token.rateLimits.requestsPerDay}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="user" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span>User Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {result.user && (
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                            <p className="font-medium">
                              {result.user.firstName} {result.user.lastName}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Username</Label>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">@{result.user.username}</p>
                              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.user!.username)}>
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{result.user.email}</p>
                              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.user!.email)}>
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">User ID</Label>
                            <div className="flex items-center space-x-2">
                              <p className="font-mono text-sm">{result.user.id}</p>
                              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.user!.id)}>
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="organization" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5" />
                        <span>Organization Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {result.organization && (
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Organization Name</Label>
                            <p className="font-medium">{result.organization.name}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Slug</Label>
                            <div className="flex items-center space-x-2">
                              <p className="font-mono text-sm">{result.organization.slug}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(result.organization!.slug)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <Label className="text-sm font-medium text-muted-foreground">Organization ID</Label>
                            <div className="flex items-center space-x-2">
                              <p className="font-mono text-sm">{result.organization.id}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(result.organization!.id)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="permissions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Token Permissions & Scopes</CardTitle>
                      <CardDescription>This token has access to the following scopes and permissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Granted Scopes</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {result.token?.scopes.map((scope) => (
                              <Badge key={scope} variant="default">
                                {scope}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Scope Descriptions</Label>
                          <div className="space-y-2 mt-2">
                            {result.token?.scopes.map((scope) => (
                              <div key={scope} className="flex items-start space-x-3 p-2 border rounded">
                                <Badge variant="outline" className="mt-0.5">
                                  {scope}
                                </Badge>
                                <div className="text-sm text-muted-foreground">{getScopeDescription(scope)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function getScopeDescription(scope: string): string {
  const descriptions: Record<string, string> = {
    profile: "Access to user profile information including name and basic details",
    email: "Access to user email address and email verification status",
    organizations: "Read and manage organization information and settings",
    teams: "Create, read, update, and manage teams within organizations",
    users: "Access to user management functions and user data",
    roles: "Manage roles and permissions within organizations",
    permissions: "Access to permission management and role assignments",
    applications: "Manage OAuth applications and client credentials",
    analytics: "Access to analytics data and usage statistics",
    billing: "Access to billing information and subscription management",
    admin: "Full administrative access to all system functions",
    read: "Read-only access to resources",
    write: "Create and update resources",
    delete: "Delete resources and data",
    manage: "Full management access including create, read, update, delete",
    invite: "Send invitations to users and manage invitations",
    export: "Export data and generate reports",
    import: "Import data and bulk operations",
  }

  return descriptions[scope] || "Access to specific functionality within the system"
}
