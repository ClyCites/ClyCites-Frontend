"use client"

import { useState } from "react"
import Image from "next/image"
import { Minus, Plus, ShoppingCart, Heart } from "lucide-react"

export default function ProductDetails({ product, category }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedType, setSelectedType] = useState("retail")

  const discountPercentage =
    product.productPrice > product.salePrice
      ? Math.round(((product.productPrice - product.salePrice) / product.productPrice) * 100)
      : 0

  const currentPrice = selectedType === "wholesale" && product.isWholesale ? product.wholesalePrice : product.salePrice

  const minQuantity = selectedType === "wholesale" && product.isWholesale ? product.wholesaleQty : 1

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
        {/* Product Image */}
        <div className="relative">
          <Image
            src={product.imageUrl || "/placeholder.svg?height=400&width=400"}
            alt={product.title}
            width={400}
            height={400}
            className="w-full h-96 object-cover rounded-lg"
          />
          {discountPercentage > 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-sm rounded">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mb-2">
              {category?.title || "Category"}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Product Code: {product.productCode}</p>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              UGX {currentPrice?.toLocaleString()}
            </span>
            {discountPercentage > 0 && (
              <span className="text-lg text-gray-500 line-through">UGX {product.productPrice.toLocaleString()}</span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-orange-500 text-white px-2 py-1 text-sm rounded">-{discountPercentage}%</span>
            )}
          </div>

          {/* Purchase Type Toggle */}
          {product.isWholesale && (
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedType("retail")}
                className={`px-4 py-2 rounded-lg ${
                  selectedType === "retail"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                Retail
              </button>
              <button
                onClick={() => setSelectedType("wholesale")}
                className={`px-4 py-2 rounded-lg ${
                  selectedType === "wholesale"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                Wholesale
              </button>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 dark:text-gray-300">Qty:</span>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(minQuantity, quantity - 1))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-gray-500 dark:text-gray-400">{product.unit}</span>
          </div>

          {selectedType === "wholesale" && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Minimum wholesale quantity: {product.wholesaleQty} {product.unit}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 flex items-center justify-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
            <button className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Product Description */}
          {product.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-gray-600 dark:text-gray-400">{product.description}</p>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
