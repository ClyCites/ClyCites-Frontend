"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { CheckCircle, AlertCircle, Mail } from "lucide-react"
import { authService } from "@/lib/auth/auth-service"

interface VerifyEmailPageProps {
  params: {
    token: string
  }
}

export default function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await authService.verifyEmail(params.token)
        if (response.success) {
          setIsSuccess(true)
        } else {
          setError(response.message || "Email verification failed")
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred during verification")
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Verifying Your Email</CardTitle>
              <CardDescription>Please wait while we verify your email address...</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Spinner size="lg" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Email Verified Successfully!</CardTitle>
              <CardDescription>
                Your email address has been verified. You can now sign in to your account and access all features.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col space-y-4">
              <Link href="/auth" className="w-full">
                <Button className="w-full">Continue to Login</Button>
              </Link>
              <p className="text-sm text-muted-foreground text-center">
                Welcome to AgriIntel Dashboard! Start managing your farm with AI-powered insights.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle>Email Verification Failed</CardTitle>
            <CardDescription>
              We couldn't verify your email address. The verification link may be invalid or expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Link href="/auth" className="w-full">
              <Button className="w-full">Back to Login</Button>
            </Link>
            <p className="text-sm text-muted-foreground text-center">
              Need help? Contact our support team for assistance.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
