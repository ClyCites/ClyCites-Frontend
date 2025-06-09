import Link from "next/link"
import ProductCard from "./ProductCard"

export default function PopularProducts({ products = [] }) {
  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Popular Products</h2>
            <p className="text-gray-600 dark:text-gray-400">Most loved products by our customers</p>
          </div>
          <Link href="/products" className="text-lime-600 hover:text-lime-700 font-semibold flex items-center">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
