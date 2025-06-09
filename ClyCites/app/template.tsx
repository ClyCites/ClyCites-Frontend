"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Show loading spinner
    setIsLoading(true)

    // Hide loading spinner after a delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000) // Adjust timing as needed

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && children}
    </>
  )
}
