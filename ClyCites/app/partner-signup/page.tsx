import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Partner Signup - ClyCites",
  description: "Partner with ClyCites to support our vision",
}

export default function PartnerSignupPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-400 mb-6">Partner with ClyCites</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Join us in our mission to transform agriculture across Africa.
      </p>

      {/* Placeholder content */}
      <div className="p-8 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <p className="text-center text-gray-500 dark:text-gray-400">Partner signup form coming soon</p>
      </div>
    </div>
  )
}
