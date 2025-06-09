import Link from "next/link"
import Image from "next/image"

export default function CategoriesShowcase({ categories = [] }) {
  // Default categories if none from database
  const defaultCategories = [
    {
      id: 1,
      title: "Fresh Vegetables",
      slug: "vegetables",
      imageUrl: "/placeholder.svg?height=200&width=200",
      description: "Farm-fresh vegetables",
    },
    {
      id: 2,
      title: "Organic Fruits",
      slug: "fruits",
      imageUrl: "/placeholder.svg?height=200&width=200",
      description: "Sweet and nutritious fruits",
    },
    {
      id: 3,
      title: "Grains & Cereals",
      slug: "grains",
      imageUrl: "/placeholder.svg?height=200&width=200",
      description: "Quality grains and cereals",
    },
    {
      id: 4,
      title: "Dairy Products",
      slug: "dairy",
      imageUrl: "/placeholder.svg?height=200&width=200",
      description: "Fresh dairy products",
    },
    {
      id: 5,
      title: "Herbs & Spices",
      slug: "herbs",
      imageUrl: "/placeholder.svg?height=200&width=200",
      description: "Aromatic herbs and spices",
    },
    {
      id: 6,
      title: "Livestock",
      slug: "livestock",
      imageUrl: "/placeholder.svg?height=200&width=200",
      description: "Quality livestock products",
    },
  ]

  const displayCategories = categories.length > 0 ? categories.slice(0, 6) : defaultCategories

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Shop by Category</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our wide range of agricultural products organized by categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {displayCategories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.id}`} className="group">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
                <div className="mb-4">
                  <Image
                    src={category.imageUrl || "/placeholder.svg?height=80&width=80"}
                    alt={category.title}
                    width={80}
                    height={80}
                    className="mx-auto rounded-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-lime-600 transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{category.description || "Quality products"}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
