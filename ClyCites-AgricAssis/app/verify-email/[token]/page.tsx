"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { authService } from "@/lib/auth/auth-service"

interface VerifyEmailPageProps {
  params: {
    token: string
  }
}

export default function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const result = await authService.verifyEmail(params.token)

        if (result.success) {
          setIsSuccess(true)
        } else {
          setError(result.message)
        }
      } catch (error) {
        setError("An unexpected error occurred during email verification")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.token) {
      verifyEmail()
    } else {
      setError("Invalid verification token")
      setIsLoading(false)
    }
  }, [params.token])

  const handleContinue = () => {
    router.push("/auth")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
          <CardDescription>
            {isLoading ? "Verifying your email address..." : "Email verification result"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLoading && (
            <div className="flex flex-col items-center space-y-4">
              <Spinner size="lg" />
              <p className="text-sm text-muted-foreground">Please wait while we verify your email...</p>
            </div>
          )}

          {!isLoading && isSuccess && (
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Your email has been successfully verified! You can now sign in to your account.
                </AlertDescription>
              </Alert>

              <Button onClick={handleContinue} className="w-full">
                Continue to Sign In
              </Button>
            </div>
          )}

          {!isLoading && error && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Button onClick={handleContinue} className="w-full">
                  Go to Sign In
                </Button>
                <Button variant="outline" onClick={() => router.push("/forgot-password")} className="w-full">
                  Request New Verification Email
                </Button>
              </div>
            </div>
          )}

          {!isLoading && !isSuccess && !error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Something went wrong during email verification. Please try again.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
