import { getData } from "@/lib/getData"
import ShopHeader from "@/components/frontend/ShopHeader"
import ProductGrid from "@/components/frontend/ProductGrid"
import ShopSidebar from "@/components/frontend/ShopSidebar"
import { notFound } from "next/navigation"

interface ShopPageProps {
  params: {
    slug: string
  }
  searchParams: {
    category?: string
    sort?: string
    page?: string
  }
}

export default async function ShopPage({ params, searchParams }: ShopPageProps) {
  const { slug } = params

  // Get market data
  const markets = await getData("markets")
  const market = markets?.find((m: any) => m.slug === slug)

  if (!market) {
    notFound()
  }

  // Get products for this market
  const products = await getData("products")
  const categories = await getData("categories")

  // Filter products by market categories
  const marketProducts = products?.filter((product: any) => market.categoryIds.includes(product.categoryId)) || []

  // Filter by category if specified
  const filteredProducts = searchParams.category
    ? marketProducts.filter((product: any) => product.categoryId === searchParams.category)
    : marketProducts

  // Get categories for this market
  const marketCategories = categories?.filter((category: any) => market.categoryIds.includes(category.id)) || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ShopHeader market={market} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ShopSidebar categories={marketCategories} currentCategory={searchParams.category} marketSlug={slug} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {searchParams.category
                  ? marketCategories.find((c: any) => c.id === searchParams.category)?.title
                  : `All Products from ${market.title}`}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredProducts.length} products found
                </span>
              </div>
            </div>

            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </div>
  )
}
