import Link from "next/link"

interface Category {
  id: string
  title: string
  slug: string
}

interface ShopSidebarProps {
  categories: Category[]
  currentCategory?: string
  marketSlug: string
}

export default function ShopSidebar({ categories, currentCategory, marketSlug }: ShopSidebarProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>

      <div className="space-y-2">
        <Link
          href={`/shop/${marketSlug}`}
          className={`block px-3 py-2 rounded-md text-sm transition-colors ${
            !currentCategory
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          All Products
        </Link>

        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/shop/${marketSlug}?category=${category.id}`}
            className={`block px-3 py-2 rounded-md text-sm transition-colors ${
              currentCategory === category.id
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {category.title}
          </Link>
        ))}
      </div>

      {/* Price Filter */}
      <div className="mt-8">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Price Range</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="radio" name="price" className="mr-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Under UGX 50,000</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="price" className="mr-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300">UGX 50,000 - 100,000</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="price" className="mr-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Above UGX 100,000</span>
          </label>
        </div>
      </div>
    </div>
  )
}
