import Link from "next/link"
import Image from "next/image"

export default function CategorySidebar({ categories = [] }) {
  const defaultCategories = [
    { id: 1, title: "Ready Meals", imageUrl: "/placeholder.svg?height=40&width=40", slug: "ready-meals" },
    { id: 2, title: "Food Supplements", imageUrl: "/placeholder.svg?height=40&width=40", slug: "food-supplements" },
    { id: 3, title: "Animal Feeds", imageUrl: "/placeholder.svg?height=40&width=40", slug: "animal-feeds" },
    { id: 4, title: "Poultry", imageUrl: "/placeholder.svg?height=40&width=40", slug: "poultry" },
    { id: 5, title: "Meat", imageUrl: "/placeholder.svg?height=40&width=40", slug: "meat" },
    { id: 6, title: "Fresh Fruits", imageUrl: "/placeholder.svg?height=40&width=40", slug: "fresh-fruits" },
  ]

  const displayCategories = categories.length > 0 ? categories : defaultCategories

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Shop By Category ({displayCategories.length})
      </h3>

      <div className="space-y-3">
        {displayCategories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
          >
            <Image
              src={category.imageUrl || "/placeholder.svg?height=40&width=40"}
              alt={category.title}
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-gray-700 dark:text-gray-300 group-hover:text-lime-600 transition-colors">
              {category.title}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Price Range</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input type="radio" name="price" className="text-lime-600 focus:ring-lime-500" />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Under UGX 50,000</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="price" className="text-lime-600 focus:ring-lime-500" />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">UGX 50,000 - 100,000</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="price" className="text-lime-600 focus:ring-lime-500" />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">UGX 100,000 - 200,000</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="price" className="text-lime-600 focus:ring-lime-500" />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Above UGX 200,000</span>
          </label>
        </div>

        <div className="mt-4 flex space-x-2">
          <input
            type="number"
            placeholder="Min"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-lime-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <input
            type="number"
            placeholder="Max"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-lime-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <button className="w-full mt-3 bg-lime-600 text-white py-2 px-4 rounded-lg hover:bg-lime-700 transition-colors text-sm">
          Apply Filter
        </button>
      </div>
    </div>
  )
}
