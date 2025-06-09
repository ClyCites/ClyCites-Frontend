"use client"
import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Zap } from "lucide-react"
import Link from "next/link"

export default function PackageLimitChecker({ userId, currentCount, limitType = "products" }) {
  const [packageInfo, setPackageInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPackageInfo()
  }, [userId])

  const fetchPackageInfo = async () => {
    try {
      const response = await fetch(`/api/subscriptions?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setPackageInfo(data)
      }
    } catch (error) {
      console.error("Failed to fetch package info:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !packageInfo) {
    return <div className="animate-pulse bg-gray-200 h-20 rounded-lg"></div>
  }

  const limits = packageInfo.packageLimits || { products: 10 }
  const limit = limits[limitType]
  const isUnlimited = limit === "unlimited"
  const percentage = isUnlimited ? 0 : (currentCount / limit) * 100
  const isNearLimit = percentage > 80
  const isAtLimit = percentage >= 100

  return (
    <div className="space-y-4">
      {/* Package Info */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-lime-50 rounded-lg border border-green-200">
        <div>
          <h3 className="font-semibold text-green-800">
            Current Package: {packageInfo.packageId?.charAt(0).toUpperCase() + packageInfo.packageId?.slice(1)}
          </h3>
          <p className="text-sm text-green-600">{limitType.charAt(0).toUpperCase() + limitType.slice(1)} Usage</p>
        </div>
        <Badge variant={isAtLimit ? "destructive" : isNearLimit ? "warning" : "success"}>
          {isUnlimited ? "Unlimited" : `${currentCount}/${limit}`}
        </Badge>
      </div>

      {/* Progress Bar */}
      {!isUnlimited && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Usage</span>
            <span>{Math.round(percentage)}%</span>
          </div>
          <Progress
            value={percentage}
            className={`h-2 ${isAtLimit ? "bg-red-200" : isNearLimit ? "bg-yellow-200" : "bg-green-200"}`}
          />
        </div>
      )}

      {/* Warnings */}
      {isAtLimit && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            You've reached your {limitType} limit.
            <Link href="/farmer-packages" className="ml-2 underline font-semibold">
              Upgrade your package
            </Link>{" "}
            to add more.
          </AlertDescription>
        </Alert>
      )}

      {isNearLimit && !isAtLimit && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Zap className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            You're approaching your {limitType} limit. Consider
            <Link href="/farmer-packages" className="ml-1 underline font-semibold">
              upgrading your package
            </Link>
            .
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
