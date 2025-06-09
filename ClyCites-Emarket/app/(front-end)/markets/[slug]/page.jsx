import { getData } from "@/lib/getData"
import MarketHeader from "@/components/frontend/MarketHeader"
import ProductGrid from "@/components/frontend/ProductGrid"
import CategorySidebar from "@/components/frontend/CategorySidebar"
import Breadcrumb from "@/components/frontend/Breadcrumb"

export default async function MarketPage({ params }) {
  const markets = (await getData("markets")) || []
  const products = (await getData("products")) || []
  const categories = (await getData("categories")) || []

  const market = markets.find((m) => m.slug === params.slug)

  if (!market) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Market Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">The market you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  // Filter products by market - assuming products have a marketId field
  // If not, you might need to filter by farmerId and then check if farmer belongs to market
  const marketProducts = products.filter(
    (product) => product.marketId === market.id || market.categoryIds?.includes(product.categoryId),
  )

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Markets", href: "/markets" },
    { label: market.title, href: `/markets/${market.slug}` },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb items={breadcrumbItems} />
        <MarketHeader market={market} />

        <div className="flex gap-6 mt-8">
          <aside className="w-80 flex-shrink-0">
            <CategorySidebar categories={categories} />
          </aside>

          <main className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Products from {market.title}</h2>
              <p className="text-gray-600 dark:text-gray-400">{marketProducts.length} products available</p>
            </div>

            {marketProducts.length > 0 ? (
              <ProductGrid products={marketProducts} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">No products available in this market yet.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
