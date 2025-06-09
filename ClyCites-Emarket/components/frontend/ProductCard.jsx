import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star } from "lucide-react"

export default function ProductCard({ product }) {
  const discountPercentage = product.salePrice
    ? Math.round(((product.productPrice - product.salePrice) / product.productPrice) * 100)
    : 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="relative">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.imageUrl || "/placeholder.svg?height=200&width=200"}
            alt={product.title}
            width={200}
            height={200}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        {discountPercentage > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
            -{discountPercentage}%
          </span>
        )}
        <button className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Heart className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <div className="p-4">
        <div className="mb-2">
          <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded">
            {product.category || "Category"}
          </span>
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 hover:text-lime-600 transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">(4.5)</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              UGX {(product.salePrice || product.productPrice || 0).toLocaleString()}
            </span>
            {product.salePrice && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                UGX {product.productPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <button className="w-full bg-lime-600 text-white py-2 px-4 rounded-lg hover:bg-lime-700 transition-colors flex items-center justify-center space-x-2">
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  )
}
