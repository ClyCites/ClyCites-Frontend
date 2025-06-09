import { getData } from "@/lib/getData"
import ProductGrid from "@/components/frontend/ProductGrid"
import CategorySidebar from "@/components/frontend/CategorySidebar"
import ProductFilters from "@/components/frontend/ProductFilters"
import Breadcrumb from "@/components/frontend/Breadcrumb"

export default async function ProductsPage({ searchParams }) {
  const products = (await getData("products")) || []
  const categories = (await getData("categories")) || []

  const category = searchParams?.category
  const searchTerm = searchParams?.search

  // Filter products based on category and search term
  let filteredProducts = products

  if (category) {
    filteredProducts = filteredProducts.filter((product) => product.categoryId === category)
  }

  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase()
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.title?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.tags?.some((tag) => tag.toLowerCase().includes(searchLower)),
    )
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
  ]

  if (searchTerm) {
    breadcrumbItems.push({ label: `Search: ${searchTerm}`, href: `/products?search=${searchTerm}` })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex gap-6">
          <aside className="w-80 flex-shrink-0">
            <CategorySidebar categories={categories} />
          </aside>

          <main className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {searchTerm ? `Search Results for "${searchTerm}"` : category ? `${category} Products` : "All Products"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{filteredProducts.length} products found</p>
            </div>

            <ProductFilters />
            <ProductGrid products={filteredProducts} />
          </main>
        </div>
      </div>
    </div>
  )
}
