"use client"
import { useState } from "react"
import { Filter, SlidersHorizontal } from "lucide-react"

export default function ProductFilters() {
  const [sortBy, setSortBy] = useState("newest")
  const [priceRange, setPriceRange] = useState("all")

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700 dark:text-gray-300">Filters:</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Price Range:</label>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Prices</option>
            <option value="0-10000">UGX 0 - 10,000</option>
            <option value="10000-50000">UGX 10,000 - 50,000</option>
            <option value="50000-100000">UGX 50,000 - 100,000</option>
            <option value="100000+">UGX 100,000+</option>
          </select>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-lime-600 text-white rounded-md hover:bg-lime-700 transition-colors text-sm">
          <Filter className="w-4 h-4" />
          Apply Filters
        </button>
      </div>
    </div>
  )
}
