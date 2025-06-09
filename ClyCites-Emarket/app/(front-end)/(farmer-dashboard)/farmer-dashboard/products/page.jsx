import { getData } from "@/lib/getData"
import FarmerProductsList from "@/components/farmer/FarmerProductsList"
import ProductFilters from "@/components/farmer/ProductFilters"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function FarmerProductsPage() {
  const products = (await getData("products")) || []
  const categories = (await getData("categories")) || []

  // In a real app, filter by current farmer's products
  const farmerProducts = products.slice(0, 20)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Products</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your product inventory</p>
        </div>
        <Link
          href="/farmer-dashboard/products/new"
          className="inline-flex items-center px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Link>
      </div>

      <ProductFilters categories={categories} />
      <FarmerProductsList products={farmerProducts} />
    </div>
  )
}
