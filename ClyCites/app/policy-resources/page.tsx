import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Policy Resources - ClyCites",
  description: "Agricultural policy resources for policymakers",
}

export default function PolicyResourcesPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-400 mb-6">Policy Resources</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Access agricultural policy information and resources.</p>

      {/* Placeholder content */}
      <div className="p-8 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <p className="text-center text-gray-500 dark:text-gray-400">Policy resources coming soon</p>
      </div>
    </div>
  )
}
