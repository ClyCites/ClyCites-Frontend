import Link from "next/link"

export default function SearchResults({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const q = (searchParams?.q || "").toString()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900">Search results</h1>
        <p className="mt-2 text-gray-600">
          {q ? (
            <>Showing results for <span className="font-semibold text-gray-900">“{q}”</span></>
          ) : (
            <>Type a query in the search bar on the homepage.</>
          )}
        </p>

        <div className="mt-8 space-y-4">
          {!q && (
            <div className="text-gray-500">No query provided.</div>
          )}
          {q && (
            <div className="rounded-lg border bg-card p-6">
              <div className="text-sm text-muted-foreground">Demo</div>
              <div className="mt-1 text-gray-900">You searched for: {q}</div>
              <div className="mt-4">
                <Link href="/" className="text-emerald-600 hover:underline">Back to home</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
