"use client"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900", className)}>
      <div className="relative flex flex-col items-center">
        <div className="animate-pulse">
          <Image
            src="/images/logo.jpeg"
            alt="ClyCites Loading"
            width={200}
            height={200}
            priority
            className="animate-spin-slow"
          />
        </div>
        <p className="mt-4 text-lg font-medium text-emerald-700 dark:text-emerald-400 animate-pulse">Loading...</p>
      </div>
    </div>
  )
}
