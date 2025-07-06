"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"
import { AuthForm } from "@/components/auth/auth-form"
import { Spinner } from "@/components/ui/spinner"

function AuthPageContent() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirect)
    }
  }, [isAuthenticated, isLoading, router, redirect])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">AgriIntel Dashboard</h1>
          <p className="text-muted-foreground">Sign in to access your farm analytics</p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <AuthPageContent />
    </Suspense>
  )
}
