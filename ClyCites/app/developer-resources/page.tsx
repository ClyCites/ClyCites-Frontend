import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Developer Resources - ClyCites",
  description: "Resources for developers to integrate with ClyCites API",
}

export default function DeveloperResourcesPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-400 mb-6">Developer Resources</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Resources for establishing an Agricultural Network, utilizing the ClyCites API, or both.
      </p>

      {/* Placeholder content */}
      <div className="p-8 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <p className="text-center text-gray-500 dark:text-gray-400">Developer resources coming soon</p>
      </div>
    </div>
  )
}
