"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import { authService } from "@/lib/auth/auth-service"

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must include uppercase, lowercase, number and special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

interface ResetPasswordPageProps {
  params: {
    token: string
  }
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null)
  const router = useRouter()

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        // You might want to add a token validation endpoint
        // For now, we'll assume the token is valid if it exists
        if (params.token && params.token.length > 10) {
          setIsValidToken(true)
        } else {
          setIsValidToken(false)
        }
      } catch (error) {
        setIsValidToken(false)
      }
    }

    validateToken()
  }, [params.token])

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await authService.resetPassword(params.token, data.password)
      if (response.success) {
        setIsSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/auth?message=password_reset_success")
        }, 3000)
      } else {
        setError(response.message || "Failed to reset password")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    return strength
  }

  const passwordStrength = calculatePasswordStrength(form.watch("password"))

  if (isValidToken === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isValidToken === false) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Invalid Reset Link</CardTitle>
              <CardDescription>
                This password reset link is invalid or has expired. Please request a new password reset.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col space-y-4">
              <Link href="/forgot-password" className="w-full">
                <Button className="w-full">Request New Reset Link</Button>
              </Link>
              <Link href="/auth" className="w-full">
                <Button variant="outline" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </CardFooter>
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
              <CardTitle>Password Reset Successful</CardTitle>
              <CardDescription>
                Your password has been successfully reset. You will be redirected to the login page shortly.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Link href="/auth">
                <Button>Continue to Login</Button>
              </Link>
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
            <CardTitle>Reset Your Password</CardTitle>
            <CardDescription>Enter your new password below.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your new password"
                            {...field}
                            disabled={isSubmitting}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                          </Button>
                        </div>
                      </FormControl>
                      {field.value && (
                        <div className="mt-2">
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                className={`h-2 flex-1 rounded-full ${
                                  passwordStrength >= level
                                    ? level <= 2
                                      ? "bg-red-500"
                                      : level <= 3
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                    : "bg-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {passwordStrength <= 2
                              ? "Weak password"
                              : passwordStrength <= 3
                                ? "Moderate password"
                                : "Strong password"}
                          </p>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm your new password"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
                  Reset Password
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/auth" className="text-sm text-muted-foreground hover:text-primary">
              Back to Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
