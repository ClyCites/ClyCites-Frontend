import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Research Tools - ClyCites",
  description: "Agricultural data and analytics tools for researchers",
}

export default function ResearchToolsPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-400 mb-6">Research Tools</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Access agricultural data and analytics tools for your research.
      </p>

      {/* Placeholder content */}
      <div className="p-8 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <p className="text-center text-gray-500 dark:text-gray-400">Research tools coming soon</p>
      </div>
    </div>
  )
}
