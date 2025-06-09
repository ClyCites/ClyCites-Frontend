import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Community Resources - ClyCites",
  description: "Resources for community champions to raise awareness about sustainable agriculture",
}

export default function CommunityResourcesPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-400 mb-6">Community Resources</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Resources to help you raise awareness about sustainable agriculture.
      </p>

      {/* Placeholder content */}
      <div className="p-8 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <p className="text-center text-gray-500 dark:text-gray-400">Community resources coming soon</p>
      </div>
    </div>
  )
}
